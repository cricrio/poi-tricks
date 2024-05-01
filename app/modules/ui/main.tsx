import { cn } from "~/utils/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Main({ children, className }: Props) {
  return (
    <main
      className={cn(
        "mx-auto min-h-full w-full max-w-7xl p-4 md:p-8 lg:p-10",
        className,
      )}
    >
      {children}
    </main>
  );
}
