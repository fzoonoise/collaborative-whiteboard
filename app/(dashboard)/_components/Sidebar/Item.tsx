"use client";

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/Hint";

type ItemProps = {
  id: string;
  name: string;
  imageUrl: string;
};

export const Item = ({ id, name, imageUrl }: ItemProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();

  const isActive = organization?.id === id;

  const handleActiveClick = () => {
    if (!setActive) return;

    setActive({ organization: id });
  };

  return (
    <div className="relative aspect-square">
      <Hint label={name} side="right" align="start" sideOffset={20}>
        <Image
          className={cn(
            "rounded-sm cursor-pointer opacity-75 hover:opacity-100 transition",
            isActive && "opacity-100"
          )}
          src={imageUrl}
          alt={name}
          onClick={handleActiveClick}
          fill
        />
      </Hint>
    </div>
  );
};
