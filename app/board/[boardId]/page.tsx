"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Loading } from "./_components/Loading";
import { Room } from "@/components/Room";
import Canvas from "./_components/Canvas/Canvas";

type BoardIdPageProps = {
  params: { boardId: string };
};

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  const data = useQuery(api.board.getBoardById, {
    id: params.boardId as Id<"boards">,
  });

  useEffect(() => {
    document.title = data?.title || "New board";
  }, [data?.title]);

  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
