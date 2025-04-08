"use client";

import { Room } from "@/components/Room";
import { Canvas } from "./_components/Canvas";
import { Loading } from "./_components/Loading";
import { useEffect } from "react";
type BoardIdPageProps = {
  params: { boardId: string };
};

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  useEffect(() => {
    document.title = `Whiteboard`;
  }, []);

  return (
    
    <Room roomId={params.boardId} fallback={<Loading />}>
      <Canvas />
    </Room>
  );
};

export default BoardIdPage;
