/* eslint-disable no-console */
import { PrismaClient, type TrickDifficulty } from "@prisma/client";

import creators from "../../.data/creators.json";
import tricks from "../../.data/tricks.json";

const prisma = new PrismaClient();

async function createCreators() {
  const savedCreators = [];
  for (const creator of creators) {
    const c = await prisma.creator.create({
      data: {
        name: creator.name,
        picture: creator.picture,
        bio: creator.bio,
        platforms: {
          create: {
            platform: "youtube",
            url: creator.url,
            externalId: creator.externalId,
          },
        },
      },
      select: {
        id: true,
        platforms: true,
      },
    });
    savedCreators.push(c);
  }
  return savedCreators;
}

function getPlateformId(creatorExternalId: string, creators: SavedCreators) {
  const creator = creators.find((creator) =>
    creator.platforms.some((p) => p.externalId === creatorExternalId),
  );

  return creator?.platforms[0].id;
}

async function createTricks(creators: SavedCreators) {
  let errorCount = 0;
  for (const trick of tricks) {
    try {
      await prisma.trick.create({
        data: {
          ...("preview" in trick ? { preview: `${trick.id}.webp` } : {}),
          id: trick.id,
          name: trick.name,
          difficulty: trick.difficulty as TrickDifficulty,
          draft: false,
          tags: {
            connectOrCreate: trick.types.map((type) => ({
              where: {
                name: type,
              },
              create: {
                name: type,
              },
            })),
          },
          videos: {
            connectOrCreate: trick.videos.map((video) => ({
              where: {
                externalId: video.externalId,
              },
              create: {
                ...("title" in video ? { title: video.title } : {}),
                ...("creator" in video
                  ? {
                      creatorPlatformId: getPlateformId(
                        video.creator.externalId,
                        creators,
                      ),
                    }
                  : {}),
                externalId: video.externalId,
                source: video.source,
              },
            })),
          },
        },
      });
    } catch (err) {
      console.log(err);
      errorCount++;
      console.log(errorCount);
    }
  }
}

async function linkPrerequisites() {
  for (let trick of tricks) {
    const connect = trick.prerequisites.reduce(
      (acc: { id: string }[], notionID: string) => {
        const t = tricks.find((t) => t.notionID === notionID);
        return t ? [...acc, { id: t.id }] : acc;
      },
      [],
    );

    if (connect.length > 0) {
      console.log("connecting", connect, trick.id);
      await prisma.trick.update({
        where: {
          id: trick.id,
        },
        data: {
          id: trick.id,
          prerequisites: {
            connect,
          },
        },
      });
    }
  }
}

type SavedCreators = Awaited<ReturnType<typeof createCreators>>;
async function seed() {
  try {
    const savedCreators = await createCreators();
    await createTricks(savedCreators);

    linkPrerequisites();

    console.log(`Database has been seeded. 🌱\n`);
  } catch (cause) {
    console.error(cause);
    throw new Error("Seed failed 🥲");
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
