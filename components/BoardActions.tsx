"use client";

import { Link2, Pencil, Trash2 } from "lucide-react";
import type { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useRenameModalStore } from "@/store/useRenameModalStore";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "./modals/ConfirmModal";

type BoardActionsProps = {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  alignOffset?: DropdownMenuContentProps["alignOffset"];
  id: string;
  title: string;
};

export const BoardActions = ({
  children,
  side,
  sideOffset,
  alignOffset,
  id,
  title,
}: BoardActionsProps) => {
  const onOpen = useRenameModalStore((state) => state.onOpen);
  const { mutate, pending } = useApiMutation(api.board.remove);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success("Link copied."))
      .catch(() => toast.error("Failed to copy link."));
  };

  const handleDelete = () => {
    mutate({ id })
      .then(() => toast.success("Board deleted."))
      .catch(() => toast.error("Failed to delete board."));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="start"
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        onClick={
          (e) => e.stopPropagation() // prevent page redirect
        }
      >
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="p-3 cursor-pointer"
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onOpen(id, title)}
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>

        <ConfirmModal
          header="Delete board?"
          description="This will delete the board and all its contents."
          disabled={pending}
          onConfirm={handleDelete}
        >
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
