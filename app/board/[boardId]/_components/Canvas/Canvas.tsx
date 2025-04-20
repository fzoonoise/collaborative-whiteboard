"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { LiveObject } from "@liveblocks/client";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
} from "@/liveblocks.config";
import {
  colorToCss,
  connectionIdToColor,
  devLog,
  pointerEventToCanvasPoint,
} from "@/lib/utils";
import { canvasMode } from "@/constants/canvasConstants";
import {
  Camera,
  CanvasState,
  Color,
  LayerType,
  Point,
  Rect,
  Side,
} from "@/types/canvas.types";
import {
  calcResizeBounds,
  findIntersectingLayersWithRectangle,
  penPointsToPathLayer,
} from "./canvasUtils";
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";

import Info from "./Info";
import Participants from "../Participants/Participants";
import Toolbar from "../Toolbar/Toolbar";
import CursorsPresence from "../CursorsPresence/CursorsPresence";
import LayerPreview from "../LayerPreview/LayerPreview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "../SelectionTools/SelectionTools";
import { SelectionNetOverlay } from "./SelectionNetOverlay";
import { Path } from "../LayerPreview/Path";
import { useDrawingSettingsStore } from "@/store/useDrawingSettingsStore";

type CanvasProps = {
  boardId: string;
};

const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;

const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: canvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 68,
    g: 202,
    b: 99,
  });

  const strokeWith = useDrawingSettingsStore((state) => state.strokeWith);
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useDisableScrollBounce();
  // =====================================  End: init  =====================================

  // ==========================  Start: Layer Mutation Functions  ==========================
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: Exclude<LayerType, "Path">,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100, // default size
        width: 100, // default size
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: canvasMode.None });
    },
    [lastUsedColor]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== canvasMode.Resizing) {
        return;
      }

      const newBounds = calcResizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(newBounds);
      }
    },
    [canvasState]
  );

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== canvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({ mode: canvasMode.Translating, current: point });
    },
    [canvasState]
  );

  const duplicateSelectedLayers = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const newLayerIds: string[] = [];
      const layersIdsToCopy = self.presence.selection;

      if (liveLayerIds.length + layersIdsToCopy.length > MAX_LAYERS) {
        return;
      }

      if (layersIdsToCopy.length === 0) {
        return;
      }

      layersIdsToCopy.forEach((layerId) => {
        const newLayerId = nanoid();
        const layer = liveLayers.get(layerId);

        if (layer) {
          const newLayer = layer.clone();
          newLayer.set("x", newLayer.get("x") + 20);
          newLayer.set("y", newLayer.get("y"));

          liveLayerIds.push(newLayerId);
          liveLayers.set(newLayerId, newLayer);

          newLayerIds.push(newLayerId);
        }
      });

      setMyPresence({ selection: [...newLayerIds] }, { addToHistory: true });
      setCanvasState({ mode: canvasMode.None });
    },
    []
  );

  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    // selected something
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({ mode: canvasMode.SelectionNet, origin, current });

      const ids = findIntersectingLayersWithRectangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
        strokeWith,
      });
    },
    [lastUsedColor, strokeWith]
  );

  const continueDrawing = useMutation(
    ({ setMyPresence, self }, point: Point, event: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== canvasMode.Pencil ||
        event.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, event.pressure]],
      });
    },
    [canvasState.mode]
  );

  const insertDrawingPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      devLog("liveLayers - insertDrawingPath", liveLayers);

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        if (liveLayers.size >= MAX_LAYERS) {
          toast.error("Layer count exceeded max limit!");
        }

        // clear current draft
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();

      // transform point array to PathLayer object with bounding box & relative points
      liveLayers.set(
        id,
        new LiveObject(
          penPointsToPathLayer(pencilDraft, lastUsedColor, strokeWith)
        )
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id); // register the new layer's id

      setMyPresence({ pencilDraft: null });
      setCanvasState({
        mode: canvasMode.Pencil,
      });
    },
    [lastUsedColor, strokeWith]
  );

  // ===========================  End: Layer Mutation Functions  ===========================

  const startSelectionNet = useCallback((current: Point, origin: Point) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
      SELECTION_NET_THRESHOLD
    ) {
      setCanvasState({ mode: canvasMode.SelectionNet, origin, current });
    }
  }, []);

  const handleResizePointerDown = useCallback(
    (corner: Side, initialBounds: Rect) => {
      history.pause();
      setCanvasState({
        mode: canvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  // ==========================  Start: SVG Interaction Handling  ==========================

  const handleCameraPanOnWheel = useCallback((event: React.WheelEvent) => {
    setCamera((camera) => {
      return {
        x: camera.x - event.deltaX,
        y: camera.y - event.deltaY,
      };
    });
  }, []);

  const handlePointerMove = useMutation(
    ({ setMyPresence }, event: React.PointerEvent) => {
      event.preventDefault();
      const current = pointerEventToCanvasPoint(event, camera);

      switch (canvasState.mode) {
        case canvasMode.Pressing:
          startSelectionNet(current, canvasState.origin);
          break;
        case canvasMode.SelectionNet:
          updateSelectionNet(current, canvasState.origin);
          break;
        case canvasMode.Translating:
          translateSelectedLayers(current);
          break;
        case canvasMode.Resizing:
          resizeSelectedLayer(current);
          break;
        case canvasMode.Pencil:
          continueDrawing(current, event);
          break;
        default:
          // no action needed for others mode
          break;
      }

      setMyPresence({ cursor: current });
    },
    [
      camera,
      canvasState,
      startSelectionNet,
      updateSelectionNet,
      translateSelectedLayers,
      resizeSelectedLayer,
      continueDrawing,
    ]
  );

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    // Remove cursor when leaving other's canvas
    setMyPresence({ cursor: null });
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (canvasState.mode === canvasMode.Inserting) {
        return;
      }

      const point = pointerEventToCanvasPoint(event, camera);

      if (canvasState.mode === canvasMode.Pencil) {
        startDrawing(point, event.pressure);
        return;
      }

      setCanvasState({ mode: canvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode, setCanvasState, startDrawing]
  );

  const handlePointerUp = useMutation(
    ({}, event) => {
      const point = pointerEventToCanvasPoint(event, camera);

      switch (canvasState.mode) {
        case canvasMode.None:
        case canvasMode.Pressing:
          unSelectLayers();
          setCanvasState({ mode: canvasMode.None });
          break;
        case canvasMode.Pencil:
          insertDrawingPath();
          break;
        case canvasMode.Inserting:
          insertLayer(canvasState.layerType, point);
          break;
        default:
          setCanvasState({ mode: canvasMode.None });
          break;
      }

      history.resume();
    },
    [
      camera,
      canvasState,
      unSelectLayers,
      setCanvasState,
      insertDrawingPath,
      insertLayer,
      history,
    ]
  );

  // ========================== End: SVG Interaction Handling ==========================

  const selections = useOthersMapped((other) => other.presence.selection);

  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, event: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === canvasMode.Pencil ||
        canvasState.mode === canvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      event.stopPropagation();

      const point = pointerEventToCanvasPoint(event, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }

      setCanvasState({ mode: canvasMode.Translating, current: point });
    },
    [setCanvasState, history, camera, canvasState.mode]
  );

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }
    return layerIdsToColorSelection;
  }, [selections]);

  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;

      // Skip key handling if focused on input, textarea, or editable content
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case "Delete":
        case "Backspace":
          devLog("delete", "delete");
          deleteLayers();
          break;
        case "d": {
          if (e.ctrlKey && canvasState.mode === canvasMode.None) {
            duplicateSelectedLayers();
          }
          break;
        }
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
        default:
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [history, deleteLayers, canvasState.mode, duplicateSelectedLayers]);

  return (
    <main className="h-full w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
      <SelectionTools
        camera={camera}
        setLastUsedColor={setLastUsedColor}
        handleDuplicateLayers={duplicateSelectedLayers}
      />
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={handleCameraPanOnWheel}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => {
            return (
              <LayerPreview
                key={layerId}
                id={layerId}
                handleLayerPointerDown={handleLayerPointerDown}
                selectionColor={layerIdsToColorSelection[layerId]} // Displays the indicator element used by another user
              />
            );
          })}
          <SelectionBox handleResizePointerDown={handleResizePointerDown} />
          <SelectionNetOverlay canvasState={canvasState} />
          <CursorsPresence />
          {pencilDraft && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              strokeWith={strokeWith}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
