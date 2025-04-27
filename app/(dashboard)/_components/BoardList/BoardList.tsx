"use client";

import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";

import { api } from "@/convex/_generated/api";

import { EmptyBoards } from "./EmptyBoards";
import { EmptyFavorites } from "./EmptyFavorites";
import { EmptySearch } from "./EmptySearch";
import BoardCard from "../BoardCard/BoardCard";
import { NewBoardButton } from "../BoardCard/NewBoardButton";

type BoardListProps = {
  orgId: string;
};

const BoardList = ({ orgId }: BoardListProps) => {
  const params = useSearchParams();

  const favorites = params.get("favorites") ?? "";
  const search = params.get("search") ?? "";

  const data = useQuery(api.boards.get, { orgId, favorites, search });

  const BoardTitle = (
    <h2 className="text-3xl">
      {favorites ? "Favorite boards" : "Team boards"}
    </h2>
  );

  // loading phase; else if data is empty, convex will return null
  if (data === undefined) {
    return (
      <div>
        {BoardTitle}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data.length && search) {
    return <EmptySearch />;
  }

  if (!data.length && favorites) {
    return <EmptyFavorites />;
  }

  if (!data.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      {BoardTitle}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            orgId={board.orgId}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardList;
