import { db } from "~/database";

export async function getUserSavedTricks(
	userId: string,
): Promise<Record<string, string>> {
	const collections = await db.savedTrick.findMany({
		include: {
			trick: true,
		},
		where: { userId: { equals: userId } },
	});

	return collections.reduce(
		(acc, collection) => ({
			...acc,
			[collection.trick.id]: collection.category,
		}),
		{},
	);
}

export const updateSavedTrick = async ({
	userId,
	trickId,
	category,
}: {
	userId: string;
	trickId: string;
	category?: string;
}) => {
	const saved = await db.savedTrick.findFirst({
		where: {
			trickId: { equals: trickId },
		},
	});

	if (!saved && category) {
		return db.savedTrick.create({
			data: { trickId, category, userId },
		});
	}

	if (saved && !category) {
		return db.savedTrick.delete({
			where: { id: saved.id },
		});
	}

	if (category && saved) {
		return db.savedTrick.update({
			where: {
				id: saved.id,
			},
			data: { category },
		});
	}
};
