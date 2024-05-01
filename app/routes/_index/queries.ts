import type { ArrayValues } from "type-fest";

import type { Prisma } from "~/database";
import {
    db,
    trickFragment,
    creatorFragment,
    tagFragment,
    trickDifficulties,
} from "~/database";

type Trick = ArrayValues<Awaited<ReturnType<typeof getFirstTricks>>>;

async function getFirstTricks(where: Prisma.TrickWhereInput) {
    const tricks = await db.trick.findMany({
        where: { ...where, draft: false },
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
        take: 6,
    });

    return tricks;
}

async function getTricks(where: Prisma.TrickWhereInput) {
    const tricks = await getFirstTricks(where);
    return transformTricks(tricks);
}
function transformTricks(tricks: Trick[]) {
    return tricks.map(extractCreators);
}
function extractCreators(trick: Trick) {
    const creators = trick.videos
        .map((v) => v?.creatorPlatform?.creator)
        .reduce((acc, c) => {
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

function countTricks(where: Prisma.TrickWhereInput) {
    return db.trick.count({
        where: { ...where, draft: false },
    });
}

export async function getTricksByDifficulties() {
    const result = await Promise.all(
        trickDifficulties.map((difficulty) => {
            const where = { difficulty: { equals: difficulty } };
            return Promise.all([getTricks(where), countTricks(where)]);
        }),
    );
    return trickDifficulties
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
