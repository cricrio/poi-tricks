import type { Entries } from "type-fest";

import type { Contribution } from "~/database";
import { contributionActionEnum } from "~/database";

import type { TrickForContribution } from "./service.server";
import type { UserContribution } from "../trick";

function differenceInArray(
    before: string[],
    after: string[],
): Array<Pick<Contribution, "value" | "action">> {
    const removed = before
        .filter((x: string) => !after.includes(x))
        .map((value) => ({ action: contributionActionEnum.remove, value }));
    const added = after
        .filter((x: string) => !before.includes(x))
        .map((value) => ({ action: contributionActionEnum.add, value }));
    return [...removed, ...added];
}

export function addKey(
    array: Array<Pick<Contribution, "value" | "action">>,
    key: Contribution["key"],
): Array<Pick<Contribution, "value" | "action" | "key">> {
    return array.map((value) => ({ key, ...value }));
}

function difference(trick: TrickForContribution, userInput: UserContribution) {
    const entries = Object.entries(userInput) as Entries<UserContribution>;
    return entries.reduce(
        (
            acc: { key: string; action: string; value: string | string[] }[],
            [key, value],
        ) => {
            if (trick[key] === value) {
                return acc;
            }

            if (typeof trick[key] === "string") {
                return [...acc, { key, action: "update", value }];
            }
            const diff = differenceInArray(
                trick[key] as string[],
                value as string[],
            );
            return [...acc, ...addKey(diff, key)];
        },
        [],
    );
}

export { difference, differenceInArray };
