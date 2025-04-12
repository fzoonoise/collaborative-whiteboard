"use client";

import { type FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useRenameModalStore } from "@/store/useRenameModalStore";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export const RenameModal = () => {
  const { mutate, pending } = useApiMutation(api.board.update);

  const isOpen = useRenameModalStore((state) => state.isOpen);
  const onClose = useRenameModalStore((state) => state.onClose);
  const initialValues = useRenameModalStore((state) => state.initialValues);
  const [title, setTitle] = useState(initialValues.title);

  useEffect(() => {
    setTitle(initialValues.title);
  }, [initialValues.title]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    mutate({
      id: initialValues.id,
      title,
    })
      .then(() => {
        toast.success("Board renamed.");
        onClose();
      })
      .catch(() => toast.error("Failed to rename board."));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit board title</DialogTitle>
        </DialogHeader>

        <DialogDescription>Enter a new title for this board.</DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={pending}
            aria-disabled={pending}
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
            required
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button" // Avoid triggering submit
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={pending} aria-disabled={pending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
