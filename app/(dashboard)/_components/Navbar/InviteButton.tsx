import { Plus } from "lucide-react";

import { OrganizationProfile } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite members
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <DialogTitle className="sr-only">Organization Settings</DialogTitle>
        {/* Use hash to avoid navigation errors & Put "members" first to show it by default. */}
        <OrganizationProfile routing="hash">
          <OrganizationProfile.Page label="members" />
          <OrganizationProfile.Page label="general" />
        </OrganizationProfile>
      </DialogContent>
    </Dialog>
  );
};
