import { cn } from "~/utils/utils";

interface Props {
  className?: string;
}
export function Divider({ className }: Props) {
  return <hr className={cn("mb-3 mt-2 h-px border-0 bg-primary", className)} />;
}
