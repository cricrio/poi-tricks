import {
  db,
  trickFragment,
  creatorFragment,
  tagFragment,
  type TrickDifficulty,
} from "~/database";
import { transformTricks } from "~/modules/trick";

export async function getTricksAndCountByDifficulty(
  difficulty: TrickDifficulty,
) {
  const where = { difficulty, draft: false };
  const [tricks, count] = await Promise.all([
    db.trick.findMany({
      where,
      select: {
        ...trickFragment,
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
        tags: {
          select: {
            ...tagFragment,
          },
        },
      },
    }),
    db.trick.count({ where }),
  ]);

  return { tricks: transformTricks(tricks), count };
}
