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
	array: Omit<Contribution, "key">[],
	key: Contribution["key"],
): Array<Pick<Contribution, "value" | "action" | "key">> {
	return array.map((value) => ({ key, ...value }));
}

function difference(
	initial: TrickForContribution,
	updated: UserContribution,
): Array<Pick<Contribution, "value" | "action" | "key">> {
	return Object.entries(updated).reduce(
		(
			acc: Array<Pick<Contribution, "value" | "action" | "key">>,
			[key, value],
		) => {
			if (initial[key] === value) {
				return acc;
			}

			if (Array.isArray(initial[key])) {
				const diff = differenceInArray(
					initial[key] as string[],
					value as string[],
				);
				const aaa = addKey(diff, key);
				return [...acc, ...addKey(diff, key)];
			}

			return [...acc, { key, action: "update", value }];
		},
		[],
	);
}

export { difference, differenceInArray };
