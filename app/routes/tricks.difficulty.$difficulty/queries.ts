import type { TrickDifficulty } from "~/database";
import { countTricks, getTricks } from "~/modules/trick";

export async function getTricksAndCountByDifficulty(
	difficulty: TrickDifficulty,
) {
	const [tricks, count] = await Promise.all([
		getTricks({
			where: { difficulty: { equals: difficulty } },
			include: { creators: true },
		}),
		countTricks({
			where: { difficulty: { equals: difficulty } },
		}),
	]);
	return { tricks, count };
}
