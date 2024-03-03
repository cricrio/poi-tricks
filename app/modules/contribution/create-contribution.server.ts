import type { Merge } from "type-fest";

import {
    contributionActionEnum,
    type Contribution,
    type Prisma,
    type Tag,
    type Trick,
    type User,
} from "~/database";
import { validate } from "~/modules/trick";

import { difference } from "./utils.server";

function validateUserInput(formData: FormData) {
    const form = validate(formData);
    if (!form.success) {
        throw new Response(JSON.stringify(form.error), { status: 400 });
    }
    return form.data;
}

function addTrickData(
    contributions: Array<Pick<Contribution, "value" | "action" | "key">>,
    trickId: Trick["id"],
    authorId: User["id"],
) {
    return contributions.map((c) => ({
        ...c,
        entity: "trick",
        entityId: trickId,
        authorId,
    }));
}

function createContributions<T extends { id: string }>(
    trick: Merge<Partial<T>, { id: string }>,
    userInput: T,
    authorId: User["id"],
): Prisma.ContributionCreateManyInput[] {
    return addTrickData(difference(userInput, trick), trick.id, authorId);
}

function getConnections(contributions: Prisma.ContributionCreateManyInput[]) {
    return contributions.reduce<{
        connect: string[];
        disconnect: string[];
    }>(
        (acc, c) => {
            if (c.action === contributionActionEnum.remove) {
                return {
                    ...acc,
                    disconnect: [...acc.disconnect, c.value],
                };
            }
            if (c.action === contributionActionEnum.add) {
                return {
                    ...acc,
                    connect: [...acc.connect, c.value],
                };
            }
            return acc;
        },
        { connect: [], disconnect: [] },
    );
}

export { createContributions, validateUserInput, getConnections };
