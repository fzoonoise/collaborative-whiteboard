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
} from "@/types/canvas.types";

import Info from "./Info";
import Participants from "./Participants/Participants";
import Toolbar from "./Toolbar/Toolbar";
import CursorsPresence from "./CursorsPresence/CursorsPresence";
import LayerPreview from "./LayerPreview/LayerPreview";

// import { useSelf } from "@/liveblocks.config";

type CanvasProps = {
  boardId: string;
};

const MAX_LAYERS = 300;

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
  //init end

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

  const onWheel = useCallback((event: React.WheelEvent) => {
    setCamera((camera) => {
      return {
        x: camera.x - event.deltaX,
        y: camera.y - event.deltaY,
      };
    });
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, event: React.PointerEvent) => {
      event.preventDefault();
      const current = pointerEventToCanvasPoint(event, camera);

      setMyPresence({ cursor: current });
    },
    []
  );

  // Remove cursor when leaving other's canvas
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // Similar to onMouseUp
  const onPointerUp = useMutation(
    ({}, event) => {
      const point = pointerEventToCanvasPoint(event, camera);

      if (canvasState.mode === canvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({ mode: canvasMode.None });
      }
      history.resume();
    },
    [camera, canvasState, history, insertLayer]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const onLayerPointerDown = useMutation(
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
      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
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
                onLayerPointerDown={onLayerPointerDown}
                selectionColor={layerIdsToColorSelection[layerId]} // Displays the indicator element used by another user
              />
            );
          })}
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};

export default Canvas;
