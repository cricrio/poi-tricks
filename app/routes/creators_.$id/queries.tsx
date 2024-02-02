import { db, creatorFragment, trickFragment } from "~/database";

export async function getCreator(id: string) {
    const creator = await db.creator.findUnique({
        where: { id },
        select: {
            ...creatorFragment,
            tricks: {
                select: {
                    ...trickFragment,
                    creators: { select: creatorFragment },
                },
            },
        },
    });
    return creator;
}
