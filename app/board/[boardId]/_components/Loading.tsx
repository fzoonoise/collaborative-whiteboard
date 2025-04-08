import { Loader } from "lucide-react";

// import { Skeleton } from "@/components/ui/skeleton";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";
// import { ParticipantsSkeleton } from "./Participants";
// import { InfoSkeleton } from "./Info";
// import { ToolbarSkeleton } from "./Toolbar";
// import { ResetCameraSkeleton } from "./reset-camera";

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
      {/* <InfoSkeleton />
      <ParticipantsSkeleton />
      <ToolbarSkeleton />
      <ResetCameraSkeleton /> */}
    </main>
  );
};
