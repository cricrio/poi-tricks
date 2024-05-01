import type { User } from "@prisma/client";

export const trickFragment = {
    id: true,
    name: true,
    preview: true,
    difficulty: true,
    draft: true,
};

export const videoFragment = {
    id: true,
    externalId: true,
    source: true,
    id: true,
    externalId: true,
    source: true,
};

export const creatorFragment = {
    id: true,
    name: true,
    picture: true,
    id: true,
    name: true,
    picture: true,
};

export const tagFragment = {
    id: true,
    name: true,
};

// where condition to filter the tricks
export function whereUserDraft(userId?: User["id"]) {
    return userId
        ? {
              OR: [
                  {
                      draft: true,
                      //   creator: {
                      //       id: userId,
                      //   },
                  },
                  {
                      draft: false,
                  },
              ],
          }
        : {
              draft: false,
          };
}
