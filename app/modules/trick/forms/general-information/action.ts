import type { ActionFunction } from "@remix-run/node";

import { formAction } from "~/modules/form";

import { schema } from "./form";
import { mutation } from "./mutation";

export const action: ActionFunction = async ({ request }) =>
	formAction({
		request,
		schema,
		mutation,
	});
