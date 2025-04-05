"use client";

import { CreateOrganization } from "@clerk/nextjs";
import { Plus } from "lucide-react";

import { Hint } from "@/components/Hint";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const NewButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="aspect-square">
          <Hint
            label="Create Organization"
            side="right"
            align="start"
            sideOffset={20}
          >
          <button className="flex items-center justify-center w-full h-full transition rounded-sm bg-white/25 opacity-60 hover:opacity-100">
            <Plus className="text-white" />
          </button>
          </Hint>
        </div>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
        <CreateOrganization />
      </DialogContent>
    </Dialog>
  );
};
