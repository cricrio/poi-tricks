/* eslint-disable no-console */
import { PrismaClient, type TrickDifficulty } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { error } from "domain-functions/types/composable/composable";

import creators from "../../.data/creators.json";
import tricks from "../../.data/tricks.json";
import { SUPABASE_SERVICE_ROLE, SUPABASE_URL } from "../utils/env";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const prisma = new PrismaClient();

const email = "hello@supabase.com";

const getUserId = async (): Promise<string> => {
    const userList = await supabaseAdmin.auth.admin.listUsers();

    if (userList.error) {
        throw userList.error;
    }

    const existingUserId = userList.data.users.find(
        (user) => user.email === email,
    )?.id;

    if (existingUserId) {
        return existingUserId;
    }

    const newUser = await supabaseAdmin.auth.admin.createUser({
        email,
        password: "supabase",
        email_confirm: true,
    });

    if (newUser.error) {
        throw newUser.error;
    }

    return newUser.data.user.id;
};

async function createCreators() {
    const creatorsPromises = creators.map(async (creator) =>
        prisma.creator.create({
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
        }),
    );
    return await Promise.all(creatorsPromises);
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
                    ...("preview" in trick
                        ? { preview: `${trick.id}.webp` }
                        : {}),
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
                                ...("title" in video
                                    ? { title: video.title }
                                    : {}),
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
        const trickPromises = await createTricks(savedCreators);

        linkPrerequisites();

        // const successCount = trickPromises.filter(
        //     (t) => t.status === "fulfilled",
        // ).length;

        // console.log(trickPromises.filter((p) => p.status === "rejected"));
        // console.log(
        //     `tricks success count: ${successCount} - error count: ${
        //         trickPromises.length - successCount
        //     }`,
        // );
        console.log(`Database has been seeded. 🌱\n`);
        // console.log(
        //     `User added to your database 👇 \n🆔: ${user.id}\n📧: ${user.email}\n🔑: supabase`,
        // );
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
