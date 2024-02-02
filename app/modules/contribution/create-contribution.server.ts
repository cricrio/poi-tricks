import type { Trick } from "~/database";
import { validate } from "~/modules/trick";

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

async function createContribution(trickId: Trick["id"], formData: FormData) {
	const trick = await getTrick(trickId);
	const userInput = validateUserInput(formData);
	return difference(trick, userInput);
}

export { createContribution };
