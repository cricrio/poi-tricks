import { db, type Prisma } from "~/database";

import { fetchBioAndPicture } from "./get-creator-information";
import { getMetadataFromNoembed } from "./get-metadata-from-noembed";

async function getCreatorPlateformId(externalId: string) {
  const platform = await db.creatorPlatform.findFirst({
    where: {
      externalId,
    },
    select: {
      id: true,
    },
  });
  return platform?.id;
}

async function getCreatorAction(
  externalId: string,
): Promise<Prisma.CreatorPlatformCreateNestedOneWithoutVideosInput> {
  const metadata = await getMetadataFromNoembed(externalId);
  const platformId = await getCreatorPlateformId(metadata.platform.externalId);

  if (platformId) {
    return { connect: { id: platformId } };
  }

  const creatorMetadata = await fetchBioAndPicture(metadata.platform.url);

  return {
    create: {
      ...metadata.platform,
      creator: {
        create: {
          ...metadata.creator,
          ...creatorMetadata,
        },
      },
    },
  };
}

export { getCreatorAction };
