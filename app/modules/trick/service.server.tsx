import type { Except } from "type-fest";

import {
    db,
    trickFragment,
    creatorFragment,
    tagFragment,
    videoFragment,
    whereUserDraft,
} from "~/database";
import type { Tag, User, Trick, Prisma } from "~/database";

export async function getTrickById(id: string, userId?: User["id"]) {
    const trick = await db.trick.findFirst({
        where: {
            id,
            ...whereUserDraft(userId),
        },
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
    data: Except<Prisma.TrickCreateInput, "creator">,
) {
    return db.trick.update({
        where: {
            id: trickId,
        },
        data,
    });
}

export async function createTrick(
    trickInput: Except<Prisma.TrickCreateInput, "tags" | "creator">,
    creatorId: User["id"],
    tags?: Array<Tag["id"]>,
) {
    const trick = await db.trick.create({
        data: {
            ...trickInput,
            creator: { connect: { id: creatorId } },
            ...(tags && tags.length > 0
                ? {
                      tags: {
                          connect: tags.map((id) => ({
                              id,
                          })),
                      },
                  }
                : {}),
        },
    });
    return trick;
}
