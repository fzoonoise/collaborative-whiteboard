import { Loader } from "lucide-react";

import Info from "./Canvas/Info";
import Participants from "./Participants/Participants";
import Toolbar from "./Toolbar/Toolbar";

export const Loading = () => {
  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none
    flex items-center justify-center"
    >
      <Loader className="h-8 w-8 text-muted-foreground animate-spin" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};
