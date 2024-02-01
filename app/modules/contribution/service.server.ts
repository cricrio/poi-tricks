import type { Tag } from "@prisma/client";

import { db } from "~/database";

type BaseTrick = Awaited<ReturnType<typeof get>>;
type TrickForContribution = Awaited<
	ReturnType<typeof getTrickByIdForContribution>
>;

async function get(id: string) {
	const trick = await db.trick.findUniqueOrThrow({
		where: { id },
		select: {
			name: true,
			difficulty: true,
			tags: { select: { id: true } },
		},
	});
	return trick;
}

async function getTrickByIdForContribution(
	id: string,
): Promise<Omit<BaseTrick, "tags"> & { tags: Array<Tag["id"]> }> {
	const trick = await get(id);
	return {
		...trick,
		tags: trick.tags.map(({ id }) => id),
	};
}

export type { TrickForContribution };
export { getTrickByIdForContribution };
