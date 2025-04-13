"use client";

import { useEffect } from "react";

import { Room } from "@/components/Room";
import Canvas from "./_components/Canvas";
import { Loading } from "./_components/Loading";

type BoardIdPageProps = {
  params: { boardId: string };
};

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  useEffect(() => {
    document.title = `Whiteboard`;
  }, []);

  return (
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas boardId={params.boardId} />
    </Room>
  );
};

export default BoardIdPage;
