import { Link } from "@remix-run/react";

import type { Trick } from "~/database";
import { Badge } from "~/modules/ui";

type Props = Pick<Trick, "id" | "name" | "difficulty">;

export function TrickPreview({ id, name, difficulty }: Props) {
	return (
		<div className="flex items-center gap-4">
			<Link to={`/tricks/${id}`} className="block">
				{name}
			</Link>
			<Badge asChild className="bg-sky-400 capitalize text-white">
				<a href={`/tricks/difficulty/${difficulty}`}>{difficulty}</a>
			</Badge>
		</div>
	);
}
