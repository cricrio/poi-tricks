import { db, trickFragment, creatorFragment } from "~/database";

export async function getSavedTricks(userId: string) {
	const savedTricks = await db.savedTrick.findMany({
		where: { userId },
		select: {
			category: true,
			trick: {
				select: {
					...trickFragment,
					creators: {
						select: creatorFragment,
					},
				},
			},
		},
	});
	return savedTricks;
}
