import { db } from "~/database";

type TrickForContribution = Awaited<
    ReturnType<typeof getTrickByIdForContribution>
>;

async function get(id: string) {
    const trick = await db.trick.findUniqueOrThrow({
        where: { id },
        select: {
            name: true,
            difficulty: true,
            tags: { select: { id: true } },
        },
    });
    return trick;
}

async function getTrickByIdForContribution(id: string) {
    const trick = await get(id);
    return {
        ...trick,
        tags: trick.tags.map(({ id }) => id),
    };
}

export type { TrickForContribution };
export { getTrickByIdForContribution };
