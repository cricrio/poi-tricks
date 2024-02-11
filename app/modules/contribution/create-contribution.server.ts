import {
    contributionActionEnum,
    type Contribution,
    type Prisma,
    type Tag,
    type Trick,
    type User,
} from "~/database";
import { validate, type UserContribution } from "~/modules/trick";

import { type TrickForContribution } from "./service.server";
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

function createContributions(
    trick: TrickForContribution,
    userInput: UserContribution,
    authorId: User["id"],
): Prisma.ContributionCreateManyInput[] {
    return addTrickData(difference(userInput, trick), trick.id, authorId);
}

function generateTagsFromContributions(
    contributions: Prisma.ContributionCreateManyInput[],
) {
    return contributions.reduce<{
        connect: Array<Pick<Tag, "id">>;
        disconnect: Array<Pick<Tag, "id">>;
    }>(
        (acc, c) => {
            if (c.key !== "tags") {
                return acc;
            }
            if (c.action === contributionActionEnum.remove) {
                return {
                    ...acc,
                    disconnect: [...acc.disconnect, { id: c.value }],
                };
            }
            if (c.action === contributionActionEnum.add) {
                return {
                    ...acc,
                    connect: [...acc.connect, { id: c.value }],
                };
            }
            return acc;
        },
        { connect: [], disconnect: [] },
    );
}
export {
    createContributions,
    validateUserInput,
    generateTagsFromContributions,
};
