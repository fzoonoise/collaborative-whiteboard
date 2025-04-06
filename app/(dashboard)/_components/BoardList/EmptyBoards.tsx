"use client";

import Image from "next/image";
 import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/useApiMutation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

export const EmptyBoards = () => {
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.board.create);


  const handleCreateBoard = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Board created.");
        // TODO: Redirect
      })
      .catch(() => toast.error("Failed to create board."));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/empty-boards.svg"
        alt="Empty boards"
        height={110}
        width={110}
      />
      <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>

      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization.
      </p>

      <div className="mt-6">
        <Button
          disabled={pending}
          aria-disabled={pending}
          onClick={handleCreateBoard}
          size="lg"
        >
          Create board
        </Button>
      </div>
    </div>
  );
};
