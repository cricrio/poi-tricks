import React from "react";

import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getTrickById } from "~/modules/trick";
import { TrickGeneralInformationForm } from "~/modules/trick/components/general-information-form";
import { PreviewInput } from "~/modules/trick/components/preview-input";
import { Header, Main } from "~/modules/ui";
import { assertIsPost, getRequiredParam } from "~/utils";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "trickId", "uuid");
	const trick = await getTrickById(id);

	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ trick });
}

export async function action({ params, request }: ActionFunctionArgs) {
	assertIsPost(request);

	const id = getRequiredParam(params, "trickId", "uuid");
	const trick = await getTrickById(id);

	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ trick });
}

export default function EditTrick() {
	const { trick } = useLoaderData<typeof loader>();
	return (
		<Main className="md:max-w-3xl">
			<h1 className="mb-4 text-3xl">Edit Trick</h1>
			<section>
				<Header>General informations</Header>
				<TrickGeneralInformationForm trick={trick} />
			</section>
			<section>
				<Header>Preview</Header>
				<PreviewInput trick={trick} />
			</section>
		</Main>
	);
}
