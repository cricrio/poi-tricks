import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import {
	createContributions,
	saveContributions,
	validateUserInput,
} from "~/modules/contribution";
import { getAllTags, TagProvider } from "~/modules/tag";
import {
	getTrickById,
	PreviewInput,
	TrickGeneralInformationForm,
	updateTrick,
} from "~/modules/trick";
import { Header, Main } from "~/modules/ui";
import { assertIsPost, getRequiredParam } from "~/utils";

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

	const userData = validateUserInput(await request.formData());
	const contributions = await createContributions(
		id,
		userData,
		authSession.userId,
	);

	await saveContributions(contributions);
	const updatedTrick = await updateTrick(id, userData);

	return json({ trick: updatedTrick });
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
