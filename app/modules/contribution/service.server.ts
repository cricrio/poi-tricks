import { db, type Trick, type Prisma, type User } from "~/database";

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
  const trick = await get(id);
  return {
    ...trick,
    tags: trick.tags.map(({ id }) => id),
  };
}

async function logPublishingTrick(trickId: Trick["id"], userId: User["id"]) {
  const res = await db.contribution.create({
    data: {
      entity: "trick",
      entityId: trickId,
      authorId: userId,
      action: "update",
      key: "publish",
      value: "true",
    },
  });
  return res;
}

async function logAddVideoToTrick(
  trickId: Trick["id"],
  userId: User["id"],
  externalId: string,
) {
  const res = await db.contribution.create({
    data: {
      entity: "trick",
      entityId: trickId,
      authorId: userId,
      action: "connect",
      key: "video",
      value: externalId,
    },
  });
  return res;
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
export {
  getTrickByIdForContribution,
  saveContributions,
  logPublishingTrick,
  logAddVideoToTrick,
};
