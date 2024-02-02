import { db } from "~/database";

function toRecord(data: { category: string; trickId: string }[]) {
    const map = new Map<string, string>(
        data.map((item) => [item.trickId, item.category]),
    );
    return Object.fromEntries(map.entries());
}

export async function tryGetUserByIdWithSavedTricks(id?: string) {
    if (!id) return null;
    const user = await db.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            picture: true,
            savedTricks: {
                select: {
                    category: true,
                    trickId: true,
                },
            },
        },
    });
    return user
        ? {
              ...user,
              savedTricks: toRecord(user.savedTricks ?? []),
          }
        : null;
}
