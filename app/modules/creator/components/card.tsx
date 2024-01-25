import { Link } from "@remix-run/react";

import type { Creator } from "~/database";
import { Avatar } from "~/modules/user/";

type Props = Pick<Creator, "name" | "picture" | "id">;
export function CreatorCard(creator: Props) {
	return (
		<Link
			to={`/creators/${creator.id}`}
			className="flex flex-col items-center gap-2"
		>
			<Avatar {...creator} size="lg" />
			<div className="max-w-44 justify-self-end text-center text-xl capitalize">
				{creator.name}
			</div>
		</Link>
	);
}
