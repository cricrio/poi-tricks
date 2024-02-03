import {
	db,
	trickFragment,
	creatorFragment,
	tagFragment,
	videoFragment,
	type Trick,
} from "~/database";

export async function getTrickById(id: string) {
    const trick = await db.trick.findFirst({
        where: { id },
        select: {
            ...trickFragment,
            videos: {
                select: {
                    ...videoFragment,
                },
            },
            tags: {
                select: {
                    ...tagFragment,
                },
            },
            creators: {
                select: {
                    ...creatorFragment,
                },
            },
            prerequisites: {
                select: {
                    ...trickFragment,
                    creators: { select: creatorFragment },
                },
            },
        },
    });
    return trick;
}

export const updateSavedTrick = async ({
    userId,
    trickId,
    category,
}: {
    userId: string;
    trickId: string;
    category: string | null;
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

export function updateTrick(
	trickId: Trick["id"],
	data: Pick<Trick, "difficulty" | "name" | "preview">,
) {
	return db.trick.update({
		where: {
			id: trickId,
		},
		data,
	});
}