import { Link } from "@remix-run/react";

import type { Trick } from "~/database";
import { Badge } from "~/modules/ui";
import { ROUTES } from "~/routes";

type Props = Pick<Trick, "id" | "name" | "difficulty">;

export function TrickPreview({ id, name, difficulty }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Link to={ROUTES.trick({ id })} className="block">
        {name}
      </Link>
      <Badge asChild className="bg-sky-400  normal-case text-white">
        <Link to={ROUTES.tricksByDifficulty({ difficulty })}>{difficulty}</Link>
      </Badge>
    </div>
  );
}
