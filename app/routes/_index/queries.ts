import type { TrickDifficulty } from "~/database";
import { countTricks, getTricks } from "~/modules/trick";

const difficulties: TrickDifficulty[] = [
	"beginner",
	"intermediate",
	"advanced",
	"others",
];

export async function getTricksByDifficulties() {
	const result = await Promise.all(
		difficulties.map((difficulty) => {
			const where = { difficulty: { equals: difficulty } };
			return Promise.all([
				getTricks({ where, include: { creators: true }, take: 6 }),
				countTricks({ where }),
			]);
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
