"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

import { BoardActions } from "@/components/BoardActions";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "./Footer";

type BoardCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isFavorite: boolean;
};

export const BoardCard = ({
  id,
  title,
  imageUrl,
  authorId,
  authorName,
  createdAt,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth();

  const authorLabel = userId === authorId ? "You" : authorName;
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  });

  const { mutate: mutateFavorite, pending: pendingFavorite } = useApiMutation(
    api.board.favorite
  );
  const { mutate: mutateUnfavorite, pending: pendingUnfavorite } =
    useApiMutation(api.board.unfavorite);

  const handleToggleFavorite = () => {
    if (isFavorite)
      mutateUnfavorite({ id }).catch(() =>
        toast.error("Failed to unfavorite.")
      );
    else
      mutateFavorite({ id, orgId }).catch(() =>
        toast.error("Failed to favorite.")
      );
  };

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} className="object-fit" fill />
          <Overlay />
          <BoardActions id={id} title={title} side="right">
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
              <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </BoardActions>
        </div>

        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={handleToggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg flex overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};

const Overlay = () => {
  return (
    <div
      className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black"
      aria-hidden
    />
  );
};
