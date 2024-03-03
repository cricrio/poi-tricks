import type { Trick } from "@prisma/client";

import { db } from "~/database";

export async function getTrick(trickId: Trick["id"]) {
    const trick = await db.trick.findFirstOrThrow({
        select: {
            id: true,
            videos: {
                select: {
                    externalId: true,
                },
            },
        },
        where: {
            id: trickId,
        },
    });

    return { ...trick, videos: trick.videos.map((v) => v.externalId) };
}
