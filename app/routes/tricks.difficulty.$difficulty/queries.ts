import {
    db,
    trickFragment,
    creatorFragment,
    tagFragment,
    type TrickDifficulty,
} from "~/database";

export async function getTricksAndCountByDifficulty(difficulty: TrickDifficulty) {
    const where = { difficulty, draft: false };
    const [tricks, count] = await Promise.all([
        db.trick.findMany({
            where,
            select: {
                ...trickFragment,
                creators: {
                    select: creatorFragment,
                },
                tags: {
                    select: {
                        ...tagFragment,
                    },
                },
            },
        }),
        db.trick.count({ where }),
    ]);
    return { tricks, count };
}
