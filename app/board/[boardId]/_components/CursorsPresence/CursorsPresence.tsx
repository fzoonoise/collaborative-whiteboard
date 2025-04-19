"use client";

import { memo } from "react";

import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { shallow } from "@liveblocks/client";
import { colorToCss } from "@/lib/utils";

import { Cursor } from "./Cursor";
import { Path } from "../LayerPreview/Path";

const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => {
        return <Cursor key={connectionId} connectionId={connectionId} />;
      })}
    </>
  );
};

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      pencilColor: other.presence.penColor,
    }),
    shallow
  );

  return (
    <>
      {others.map(([key, other]) => {
        if (!other.pencilDraft) return null;
        return (
          <Path
            key={key}
            x={0}
            y={0}
            points={other.pencilDraft}
            fill={other.pencilColor ? colorToCss(other.pencilColor) : "#000"}
          />
        );
      })}
    </>
  );
};

const CursorsPresence = memo(() => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
});

CursorsPresence.displayName = "CursorsPresence";

export default CursorsPresence;
