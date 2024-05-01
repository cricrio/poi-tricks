import { db, trickFragment, creatorFragment, type User } from "~/database";
import { transformTricks } from "~/modules/trick";

export async function getSavedTricks(userId: string) {
  const savedTricks = await db.savedTrick.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      category: true,
      trick: {
        select: {
          ...trickFragment,
          videos: {
            select: {
              creatorPlatform: {
                select: {
                  creator: { select: creatorFragment },
                },
              },
            },
          },
        },
      },
    },
  });

  return transformTricks(savedTricks);
}

export async function getUserDraftedTricks(userId: User["id"]) {
  const tricks = await db.trick.findMany({
    where: { draft: true, creator: { id: userId } },
    orderBy: { createdAt: "desc" },
    select: {
      ...trickFragment,
      creators: {
        select: creatorFragment,
      },
    },
  });
  return tricks;
}
