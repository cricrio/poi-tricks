import type { Entries } from "type-fest";

import { contributionActionEnum } from "~/database";
import type { Contribution, ContributionAction } from "~/database";

import type { TrickForContribution } from "./service.server";
import type { UserContribution } from "../trick";

function differenceInArray(
    before: string[],
    after: string[],
): Array<Pick<Contribution, "value" | "action">> {
    const removed = before
        .filter((x: string) => !after.includes(x))
        .map((value) => ({
            action: contributionActionEnum.remove,
            value,
        }));
    const added = after
        .filter((x: string) => !before.includes(x) && Boolean(x))
        .map((value) => ({
            action: contributionActionEnum.add,
            value,
        }));
    return [...removed, ...added];
}

export function addKey(
    array: Array<Pick<Contribution, "value" | "action">>,
    key: Contribution["key"],
): Array<Pick<Contribution, "value" | "action" | "key">> {
    return array.map((value) => ({ key, ...value }));
}

function difference(
    userInput: UserContribution,
    trick: TrickForContribution,
): Array<Pick<Contribution, "value" | "action" | "key">> {
    const entries = Object.entries(userInput) as Entries<UserContribution>;
    return entries.reduce(
        (
            acc: { key: string; action: ContributionAction; value: string }[],
            [key, value],
        ) => {
            const initial = trick[key];

            if (Array.isArray(value) && Array.isArray(initial)) {
                const diff = differenceInArray(initial, value);

                return diff.length ? [...acc, ...addKey(diff, key)] : acc;
            }

            if (typeof value === "string" && initial !== value) {
                return [
                    ...acc,
                    {
                        key,
                        action: contributionActionEnum.update,
                        value,
                    },
                ];
            }

            return acc;
        },
        [],
    );
}

export { difference, differenceInArray };
