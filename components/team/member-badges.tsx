import { Badge } from "@/components/ui/badge";

export function MemberBadges({ role, isOwner, isMe }: { role: string; isOwner: boolean; isMe?: boolean }) {
  return (
    <span className="flex flex-wrap gap-1">
      {isOwner ? (
        <Badge>Fondatore</Badge>
      ) : (
        role === "ADMIN" && <Badge variant="secondary">Amministratore</Badge>
      )}
      {isMe && <Badge variant="outline">Tu</Badge>}
    </span>
  );
}
