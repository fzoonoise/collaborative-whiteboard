"use client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

import { LiveObject } from "@liveblocks/client";
import {
  useHistory,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStorage,
  useOthersMapped,
} from "@/liveblocks.config";
import {
  connectionIdToColor,
  devLog,
  pointerEventToCanvasPoint,
} from "@/lib/utils";
import { canvasMode } from "@/constants/canvasConstants";
import {
  type Camera,
  CanvasState,
  Color,
  LayerType,
  Point,
  Rect,
  Side,
} from "@/types/canvas.types";

import Info from "./Info";
import Participants from "../Participants/Participants";
import Toolbar from "../Toolbar/Toolbar";
import CursorsPresence from "../CursorsPresence/CursorsPresence";
import LayerPreview from "../LayerPreview/LayerPreview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "../SelectionTools/SelectionTools";

type CanvasProps = {
  boardId: string;
};

const MAX_LAYERS = 300;

function calcResizeBounds(bounds: Rect, corner: Side, point: Point): Rect {
  const result = { ...bounds };

  // Bitwise AND is used to check if a specific side flag (e.g. Left, Top) is set in the corner value.
  // Each side is a bit flag (1, 2, 4, 8), so we can combine them (e.g. Left | Top = 5), and use & to test inclusion.
  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(bounds.x + bounds.width, point.x);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(bounds.x, point.x);
    result.width = Math.abs(bounds.x - point.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(bounds.y + bounds.height, point.y);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(bounds.y, point.y);
    result.height = Math.abs(bounds.y - point.y);
  }

  return result;
}

const Canvas = ({ boardId }: CanvasProps) => {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: canvasMode.None,
  });
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  });

  const layerIds = useStorage((root) => root.layerIds);

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
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

  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    // selected something
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  // ===========================  End: Layer Mutation Functions  ===========================

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

      // if (canvasState.mode === canvasMode.Translating) {
      //   translateSelectedLayers(current);
      // } else if (canvasState.mode === canvasMode.Resizing) {
      //   resizeSelectedLayer(current);
      // }
      switch (canvasState.mode) {
        case canvasMode.Resizing:
          resizeSelectedLayer(current);
          break;
        case canvasMode.Translating:
          translateSelectedLayers(current);
          break;
      }

      setMyPresence({ cursor: current });
    },
    [camera, canvasState, resizeSelectedLayer, translateSelectedLayers]
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
        return;
      }

      setCanvasState({ mode: canvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode, setCanvasState]
  );

  // Similar to onMouseUp
  const handlePointerUp = useMutation(
    ({}, event) => {
      const point = pointerEventToCanvasPoint(event, camera);

      switch (canvasState.mode) {
        case canvasMode.None:
        case canvasMode.Pressing:
          unSelectLayers();
          setCanvasState({ mode: canvasMode.None });
          break;
        case canvasMode.Inserting:
          insertLayer(canvasState.layerType, point);
          break;
        default:
          setCanvasState({ mode: canvasMode.None });
          break;
      }

      // if (
      //   canvasState.mode === canvasMode.None ||
      //   canvasState.mode === canvasMode.Pressing
      // ) {
      //   devLog("unselect", "unselect");
      //   setCanvasState({ mode: canvasMode.None });
      // } else if (canvasState.mode === canvasMode.Inserting) {
      //   insertLayer(canvasState.layerType, point);
      // } else {
      //   setCanvasState({ mode: canvasMode.None });
      // }

      history.resume();
    },
    [camera, canvasState, history, insertLayer, unSelectLayers]
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

  // const info = useSelf((me) => me.info);
  // devLog("Current logged-in user info", info);

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
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
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

          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
