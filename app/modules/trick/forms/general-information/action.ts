import type { ActionFunction } from "@remix-run/node";

import { formAction } from "~/modules/form";

import { mutation } from "./mutation";
import { schema } from "./schema";

export const action: ActionFunction = async ({ request }) =>
	formAction({
		request,
		schema,
		mutation,
	});
