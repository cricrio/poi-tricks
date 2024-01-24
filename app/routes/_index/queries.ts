import type { Prisma } from "~/database";
import { db } from "~/database";
import { difficulties } from "~/modules/trick";

function getTricks(where: Prisma.TrickWhereInput) {
	return db.trick.findMany({
		where,
		include: { creators: true },
		take: 6,
	});
}

function countTricks(where: Prisma.TrickWhereInput) {
	return db.trick.count({
		where,
	});
}

export async function getTricksByDifficulties() {
	const result = await Promise.all(
		difficulties.map((difficulty) => {
			const where = { difficulty: { equals: difficulty } };
			return Promise.all([getTricks(where), countTricks(where)]);
		}),
	);

	return difficulties
		.map((difficulty, index) => {
			const [tricks, count] = result[index];
			return {
				difficulty,
				tricks,
				count,
			};
		})
		.filter((item) => item.tricks.length > 0);
}

export async function getFirstCreators() {
	const [data, count] = await Promise.all([
		db.creator.findMany({ take: 8 }),
		db.creator.count(),
	]);
	return { data, count };
}
