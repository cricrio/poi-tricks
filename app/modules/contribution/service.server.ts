import { db, type Contribution } from "~/database";

type TrickForContribution = Awaited<
	ReturnType<typeof getTrickByIdForContribution>
>;

async function get(id: string) {
	const trick = await db.trick.findUniqueOrThrow({
		where: { id },
		select: {
			name: true,
			difficulty: true,
			preview: true,
			tags: { select: { id: true } },
		},
	});
	return trick;
}

async function getTrickByIdForContribution(id: string) {
	const trick = await get(id);
	return {
		...trick,
		tags: trick.tags.map(({ id }) => id),
	};
}

async function saveContributions(
	contributions: Array<Omit<Contribution, "id" | "createdAt">>,
) {
	const newContributions = await db.contribution.createMany({
		data: contributions,
	});
	return newContributions;
}

export type { TrickForContribution };
export { getTrickByIdForContribution, saveContributions };
