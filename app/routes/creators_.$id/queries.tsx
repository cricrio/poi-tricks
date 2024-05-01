import { db, creatorFragment, trickFragment, tagFragment } from "~/database";
import { transformTricks } from "~/modules/trick";

export async function getCreator(id: string) {
    const creator = await db.creator.findUnique({
        where: { id },
        select: creatorFragment,
    });
    const tricks = await db.trick.findMany({
        where: {
            videos: {
                some: {
                    creatorPlatform: {
                        creatorId: { equals: id },
                    },
                },
            },
        },
        select: {
            ...trickFragment,
            tags: { select: tagFragment },
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
    });
    return { ...creator, tricks: transformTricks(tricks) };
}
