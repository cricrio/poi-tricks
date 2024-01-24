import {
	db,
	trickFragment,
	creatorFragment,
	type TrickDifficulty,
} from "~/database";

export async function getTricksAndCountByDifficulty(
	difficulty: TrickDifficulty,
) {
	const where = { difficulty: { equals: difficulty } };
	const [tricks, count] = await Promise.all([
		db.trick.findMany({
			where,
			select: {
				...trickFragment,
				creators: {
					select: creatorFragment,
				},
			},
		}),
		db.trick.count({ where }),
	]);
	return { tricks, count };
}
