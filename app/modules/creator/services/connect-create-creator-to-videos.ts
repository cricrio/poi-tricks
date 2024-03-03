import { db, type Prisma } from "~/database";

import { fetchBioAndPicture } from "./get-creator-information";
import { getMetadataFromNoembed } from "./get-metadata-from-noembed";

async function getCreatorIdFromDB(externalId: string) {
    const platform = await db.creatorPlatform.findFirst({
        where: {
            externalId,
        },
        select: {
            creator: { select: { id: true } },
        },
    });
    return platform?.creator?.id;
}

async function getCreatorAction(
    externalId: string,
): Promise<Prisma.CreatorCreateNestedOneWithoutVideosInput> {
    const metadata = await getMetadataFromNoembed(externalId);
    const creatorId = await getCreatorIdFromDB(metadata.platform.externalId);

    if (creatorId) {
        return { connect: { id: creatorId } };
    }

    const creatorMetadata = await fetchBioAndPicture(metadata.platform.url);

    return {
        create: {
            ...metadata.creator,
            platforms: {
                create: {
                    ...metadata.platform,
                },
            },
            ...creatorMetadata,
        },
    };
}

export { getCreatorAction };
