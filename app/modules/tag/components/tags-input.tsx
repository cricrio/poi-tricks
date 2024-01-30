import { TrashIcon } from "lucide-react";

import type { Tag } from "~/database";
import { Badge } from "~/modules/ui";

type Props = {
	value: Array<Pick<Tag, "id" | "name">>;
	name: string;
};
export function TagsInput({ value, name }: Props) {
	return (
		<div>
			{value.map((tag) => (
				<div key={tag.id}>
					<input type="checkbox" name={name} value={tag.id} />
					<Badge>
						{tag.name} <TrashIcon />
					</Badge>
				</div>
			))}
		</div>
	);
}
