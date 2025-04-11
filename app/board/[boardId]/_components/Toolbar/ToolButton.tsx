"use client";

import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolButtonProps {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isDisabled?: boolean;
}

export const ToolButton = ({
    label,
    icon: Icon,
    onClick,
    isDisabled,
}: ToolButtonProps) => {
    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button
                disabled={isDisabled}
                onClick={onClick}
                size="icon"
            >
                <Icon />
            </Button>
        </Hint>
    );
};
