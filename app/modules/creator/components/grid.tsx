import type { WithChildrenProps } from "~/types";

export function CreatorGrid({ children }: WithChildrenProps) {
  return (
    <div className="grid grid-cols-2 gap-20 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}
