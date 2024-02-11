import type { Prisma } from "~/database";
import {
    db,
    trickFragment,
    creatorFragment,
    tagFragment,
    trickDifficulties,
} from "~/database";

function getTricks(where: Prisma.TrickWhereInput) {
    return db.trick.findMany({
        where: { ...where, draft: false },
        select: {
            ...trickFragment,
            creators: { select: creatorFragment },
            tags: { select: tagFragment },
        },
        take: 6,
    });
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
