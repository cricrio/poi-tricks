import type { Trick } from "~/database";
import { db } from "~/database";

import type { ContributionData } from "./types";

function diff(initial: string, contribution: string) {
    return initial === contribution ? null : contribution;
}

function picker(
    trick: Pick<Trick, "difficulty" | "name" | "types">,
    contribution: ContributionData,
) {
    return (key: keyof ContributionData) => {
        const value = diff(trick[key] as string, contribution[key] as string);
        return value ? { [key]: value } : {};
    };
}

export function diffContribution(
    trick: Pick<Trick, "difficulty" | "name" | "types">,
    contribution: ContributionData,
): ContributionData {
    const pick = picker(trick, contribution);

    return {
        ...pick("difficulty"),
        ...pick("name"),
        ...pick("preview"),
    };
}

export async function getUserWaitingContributionOnTrick(
    trickId: string,
    userId: string,
) {
    const contribution = await db.contribution.findFirst({
        where: {
            trickId,
            userId,
            status: "waiting",
        },
    });

    if (!contribution) {
        return null;
    }
    return { ...contribution, data: contribution.data as ContributionData };
}

export async function createUserContibution(
    trickId: string,
    userId: string,
    data: ContributionData,
) {
    const contribution = await db.contribution.create({
        data: {
            trickId,
            userId,
            data,
        },
    });
    return contribution;
}
