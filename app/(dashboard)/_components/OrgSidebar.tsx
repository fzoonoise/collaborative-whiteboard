"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Star } from "lucide-react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const appearanceStyle = {
  elements: {
    rootBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
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

// only on desktop
export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  console.log(favorites, "favorites");

  return (
    <div className="flex-col hidden space-y-6 lg:flex w-[206px] pl-5 pt-5">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" alt="Miro Clone Logo" height={60} width={60} />
          <span className={cn("font-semibold text-2xl", font.className)}>
            Board
          </span>
        </div>
      </Link>

      <OrganizationSwitcher
        hidePersonal // Hides personal account; shows organizations only
        appearance={appearanceStyle}
      />

      <div className="w-full space-y-1">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          size="lg"
          className="justify-start w-full px-2 font-normal rounded-sm"
          asChild
        >
          <Link href="/">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Team boards
          </Link>
        </Button>

        <Button
          variant={favorites ? "secondary" : "ghost"}
          size="lg"
          className="justify-start w-full px-2 font-normal rounded-sm"
          asChild
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
