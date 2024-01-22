import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAuthSession } from "~/modules/auth";
import { CreatorCard } from "~/modules/creator";
import {
	getUserSavedTricksLoader,
	NotConnectedDialog,
	TrickCard,
	TrickGrid,
} from "~/modules/trick";
import { SaveTrickButton } from "~/modules/trick/components/save-trick-button";
import { Main } from "~/modules/ui";
import { getRequiredParam } from "~/utils";

import { getCreator } from "./queries";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "id");
	const session = await getAuthSession(request);
	const savedTricks = await getUserSavedTricksLoader(request);

	const creator = await getCreator(id);

	if (!creator) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ creator, savedTricks, connected: !!session });
}

export default function CreatorPage() {
	const { creator, savedTricks, connected } = useLoaderData<typeof loader>();
	return (
		<Main>
			<div className="mb-8 flex flex-col items-center">
				<CreatorCard {...creator} />
			</div>
			<TrickGrid>
				{creator.tricks.map((trick) => (
					<TrickCard key={trick.id} {...trick}>
						{connected ? (
							<SaveTrickButton
								trickId={trick.id}
								category={savedTricks[trick.id]}
							/>
						) : (
							<NotConnectedDialog />
						)}
					</TrickCard>
				))}
			</TrickGrid>
		</Main>
	);
}
