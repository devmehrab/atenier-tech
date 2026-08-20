import { PropertyStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: PropertyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "PUBLISHED":
      return <Badge variant="default">Published</Badge>;
    case "DRAFT":
      return <Badge variant="secondary">Draft</Badge>;
    case "UNPUBLISHED":
      return <Badge variant="outline">Unpublished</Badge>;
    case "SOLD":
      return <Badge variant="destructive">Sold</Badge>;
    case "RENTED":
      return <Badge variant="warning">Rented</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
