import { Link } from "@remix-run/react";

import type { Creator } from "~/database";
import { Avatar } from "~/modules/user/";

type Props = Pick<Creator, "name" | "picture" | "id">;
export function CreatorCard({ name, picture, id }: Props) {
	return (
		<Link
			to={`/creators/${id}`}
			className="flex flex-col items-center gap-2"
		>
			<Avatar src={picture} name={name} size="lg" />
			<div className="max-w-44 justify-self-end text-center text-xl capitalize">
				{name}
			</div>
		</Link>
	);
}
