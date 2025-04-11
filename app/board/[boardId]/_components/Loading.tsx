import { Loader } from "lucide-react";

import Info from "./Canvas/Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";

export const Loading = () => {
  return (
    <main
      className="h-full w-full relative bg-neutral-100 touch-none
    flex items-center justify-center"
    >
      <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
      <Info.Skeleton />
      <Participants.Skeleton />
      <Toolbar.Skeleton />
    </main>
  );
};
