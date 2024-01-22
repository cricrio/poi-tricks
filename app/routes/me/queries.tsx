import { db } from "~/database";

export async function getSavedTricks(userId: string) {
	const savedTricks = await db.savedTrick.findMany({
		where: { userId },
		select: {
			category: true,
			trick: {
				select: {
					id: true,
					preview: true,
					types: true,
					name: true,
					creators: {
						select: { id: true, name: true, picture: true },
					},
				},
			},
		},
	});
	return savedTricks;
}
