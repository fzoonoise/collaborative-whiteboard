"use client";

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";

import { SearchInput } from "./SearchInput";
import { InviteButton } from "./InviteButton";

const appearanceStyle = {
  elements: {
    rootBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      maxWidth: "376px",
    },
    organizationSwitcherTrigger: {
      padding: "6px",
      width: "100%",
      borderRadius: "4px",
      border: "1px solid #E5E7EB",
      justifyContent: "space-between",
      backgroundColor: "white",
    },
  },
};

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <nav className="flex items-center p-5 gap-x-4">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="flex-1 block lg:hidden">
        <OrganizationSwitcher hidePersonal appearance={appearanceStyle} />
      </div>
      {
        // InviteButton is displayed only when in organization mode
        organization && <InviteButton />
      }
      <UserButton />
    </nav>
  );
};
