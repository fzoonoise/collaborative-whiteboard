import { Hint } from "@/components/Hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserAvatarProps = {
  src?: string;
  name?: string;
  fallback?: string;
  borderColor?: string;
};

export const UserAvatar = ({
  src,
  name,
  fallback,
  borderColor,
}: UserAvatarProps) => {
  return (
    <Hint label={name || "Anonymous"} side="bottom" sideOffset={18}>
      <Avatar className="h-8 w-8 border-2" style={{ borderColor }}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="text-xs font-semibold">
          {fallback}
        </AvatarFallback>
      </Avatar>
    </Hint>
  );
};
