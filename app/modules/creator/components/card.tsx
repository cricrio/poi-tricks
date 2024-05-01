import { Link } from "@remix-run/react";

import type { Creator } from "~/database";
import { Avatar } from "~/modules/user/";
import { ROUTES } from "~/routes";

type Props = Pick<Creator, "name" | "picture" | "id">;
export function CreatorCard(creator: Props) {
  return (
    <Link
      to={ROUTES.creator(creator)}
      className="flex flex-col items-center gap-2"
    >
      <Avatar {...creator} size="lg" />
      <div className="max-w-44 justify-self-end text-center text-xl normal-case">
        {creator.name}
      </div>
    </Link>
  );
}
