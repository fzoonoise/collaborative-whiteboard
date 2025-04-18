"use client";

import { Poppins } from "next/font/google";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModalStore } from "@/store/useRenameModalStore";

import { BoardActions } from "@/components/BoardActions";
import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type InfoProps = {
  boardId: string;
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return <hr className="h-4 mx-1.5 border border-neutral-300" />;
};

const Info = ({ boardId }: InfoProps) => {
  const { onOpen: onOpenRenameModal } = useRenameModalStore();
  const data = useQuery(api.board.getBoardById, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <Info.Skeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button className="px-2" variant="board" asChild>
          <Link href="/">
            <Image src="/logo.svg" alt="Board Logo" height={40} width={40} />
            <span
              className={cn(
                "font-semibold text-xl ml-2 text-black",
                font.className
              )}
            >
              Board
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={() => onOpenRenameModal(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <BoardActions
        id={data._id}
        title={data.title}
        side="bottom"
        sideOffset={10}
        alignOffset={-7}
      >
        <div>
          <Hint label="Main Menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu />
            </Button>
          </Hint>
        </div>
      </BoardActions>
    </div>
  );
};

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] w-[280px]">
      <Skeleton />
    </div>
  );
};

export default Info;
