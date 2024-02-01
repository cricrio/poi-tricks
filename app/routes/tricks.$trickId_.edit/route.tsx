import React from "react";

import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { all, inputFromForm, mdf, mergeObjects, map } from "domain-functions";
import { aC } from "vitest/dist/reporters-trlZlObr";
import { z } from "zod";

import { requireAuthSession } from "~/modules/auth";
import {
	createUserContibution,
	diffContribution,
} from "~/modules/contribution/service.server";
import { difference, parseTrick } from "~/modules/contribution/utils.server";
import { getAllTags } from "~/modules/tag";
import { TagProvider } from "~/modules/tag/context";
import {
	getTrickById,
	PreviewInput,
	TrickGeneralInformationForm,
	validate,
} from "~/modules/trick";
import { Header, Main } from "~/modules/ui";
import { assertIsPost, getRequiredParam } from "~/utils";

import { getTrickByIdForContribution } from "./service.server";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "trickId", "uuid");
	const trick = await getTrickById(id);

	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	const tags = await getAllTags();
	return json({ trick, tags });
}

export async function action({ params, request }: ActionFunctionArgs) {
	assertIsPost(request);
	const authSession = await requireAuthSession(request);
	const id = getRequiredParam(params, "trickId", "uuid");

	const trick = await getTrickByIdForContribution(id);
	const form = validate(await request.formData());

	if (!form.success) {
		throw new Response(JSON.stringify(form.error), { status: 400 });
	}
	const contributions = difference(trick, form.data);
	console.log(JSON.stringify(contributions, null, 2));
	// console.log(JSON.stringify(res, null, 2));
	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	// const result = await createUserContibution(
	// 	id,
	// 	authSession.userId,
	// 	contribution,
	// );

	// return json({ contribution: result });
}

export default function EditTrick() {
	const { trick, tags } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	console.log(actionData);
	return (
		<Main className="md:max-w-3xl">
			<TagProvider tags={tags}>
				<h1 className="mb-4 text-3xl">Edit Trick</h1>
				<section>
					<Header>General informations</Header>
					<TrickGeneralInformationForm trick={trick} />
				</section>
				<section>
					<Header>Preview</Header>
					<PreviewInput trick={trick} />
				</section>
			</TagProvider>
		</Main>
	);
}
