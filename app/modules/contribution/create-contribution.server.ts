import type { Contribution, Trick, User } from "~/database";
import { validate, type UserContribution } from "~/modules/trick";

import { getTrickByIdForContribution } from "./service.server";
import { difference } from "./utils.server";

function validateUserInput(formData: FormData) {
	const form = validate(formData);
	if (!form.success) {
		throw new Response(JSON.stringify(form.error), { status: 400 });
	}
	return form.data;
}

async function getTrick(trickId: string) {
	const trick = await getTrickByIdForContribution(trickId);
	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}
	return trick;
}

function addTrickData(
	contributions: Array<Pick<Contribution, "value" | "action" | "key">>,
	trickId: Trick["id"],
	userId: User["id"],
) {
	return contributions.map((c) => ({
		...c,
		entity: "trick",
		entityId: trickId,
		userId,
	}));
}

async function createContributions(
	trickId: Trick["id"],
	userInput: UserContribution,
	userId: User["id"],
) {
	const trick = await getTrick(trickId);
	return addTrickData(difference(trick, userInput), trickId, userId);
}

export { createContributions, validateUserInput };
