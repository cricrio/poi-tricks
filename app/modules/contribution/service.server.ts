import { db, type Trick, type Prisma } from "~/database";

type TrickForContribution = Prisma.PromiseReturnType<
    typeof getTrickByIdForContribution
>;

async function get(id: string) {
    const trick = await db.trick.findUniqueOrThrow({
        where: { id },
        select: {
            id: true,
            name: true,
            difficulty: true,
            preview: true,
            tags: { select: { id: true } },
        },
    });
    return trick;
}

async function getTrickByIdForContribution(id: Trick["id"]) {
    console.log("getTrickByIdForContribution", id);
    const trick = await get(id);
    return {
        ...trick,
        tags: trick.tags.map(({ id }) => id),
    };
}

async function saveContributions(
    contributions: Array<Prisma.ContributionCreateManyInput>,
) {
    const newContributions = await db.contribution.createMany({
        data: contributions,
    });
    return newContributions;
}

export type { TrickForContribution };
export { getTrickByIdForContribution, saveContributions };
