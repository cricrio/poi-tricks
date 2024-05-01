import type { Except } from "type-fest";

import {
    db,
    trickFragment,
    creatorFragment,
    tagFragment,
    videoFragment,
    whereUserDraft,
} from "~/database";
import type { Tag, User, Trick, Prisma, Video, Creator } from "~/database";

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
                    creatorPlatform: {
                        select: {
                            creator: {
                                select: creatorFragment,
                            },
                        },
                    },
                },
            },
            tags: {
                select: {
                    ...tagFragment,
                },
            },
            prerequisites: {
                select: {
                    ...trickFragment,
                    videos: {
                        select: {
                            creatorPlatform: {
                                select: {
                                    creator: {
                                        select: creatorFragment,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (trick) {
        return {
            ...extractCreators(trick),
            prerequisites: transformTricks(trick.prerequisites),
        };
    }
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
    data: Except<Prisma.TrickUpdateInput, "creator">,
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

export async function addVideo(video: Prisma.VideoCreateInput) {
    return db.video.create({
        data: video,
    });
}

export function transformTricks(tricks: Trick[]) {
    return tricks.map(extractCreators);
}
export function extractCreators(trick: {
    videos: Video[];
    creators: Creator[];
}) {
    const creators = trick.videos
        .map((v) => v?.creatorPlatform?.creator)
        .reduce((acc: Creator[], c) => {
            if (!c) return acc;
            if (acc.some((a) => a.id === c.id)) {
                return acc;
            }
            return [...acc, c];
        }, []);
    return {
        ...trick,
        creators,
    };
}