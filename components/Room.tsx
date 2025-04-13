"use client";

import { type ReactNode } from "react";

import { LiveList, LiveMap, LiveObject } from "@liveblocks/client";
import { type Layer } from "@/types/canvas.types";

import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "@/liveblocks.config";

type RoomProps = {
  children: ReactNode;
  roomId: string;
  fallback: NonNullable<ReactNode> | null;
};
export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        selection: [],
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(),
        layerIds: new LiveList<string>(),
      }}
    >
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
