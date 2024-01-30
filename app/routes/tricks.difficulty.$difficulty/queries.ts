import {
	db,
	trickFragment,
	creatorFragment,
	tagFragment,
	type TrickDifficultyEnum,
} from "~/database";

export async function getTricksAndCountByDifficulty(difficulty: TrickDifficultyEnum) {
	const where = { difficulty: { equals: difficulty } };
	const [tricks, count] = await Promise.all([
		db.trick.findMany({
			where,
			select: {
				...trickFragment,
				creators: {
					select: creatorFragment,
				},
				tags: {
					select: {
						...tagFragment,
					},
				},
			},
		}),
		db.trick.count({ where }),
	]);
	return { tricks, count };
}
