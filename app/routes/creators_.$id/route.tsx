import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { CreatorCard } from "~/modules/creator";
import {
	NotConnectedDialog,
	TrickCard,
	TrickGrid,
	SaveTrickButton,
} from "~/modules/trick";
import { Main } from "~/modules/ui";
import type { UserWithSavedTrick } from "~/modules/user";
import { UserShield } from "~/modules/user/components/user-shield";
import { getRequiredParam } from "~/utils";

import { getCreator } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "id");

	const creator = await getCreator(id);

	if (!creator) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ creator });
}

export default function CreatorPage() {
	const { creator } = useLoaderData<typeof loader>();
	return (
		<Main>
			<div className="mb-8 flex flex-col items-center">
				<CreatorCard {...creator} />
			</div>
			<TrickGrid>
				{creator.tricks.map((trick) => (
					<TrickCard key={trick.id} {...trick}>
						<UserShield notConnected={<NotConnectedDialog />}>
							{(user: UserWithSavedTrick) => (
								<SaveTrickButton
									category={user.savedTricks[trick.id]}
									trickId={trick.id}
								/>
							)}
						</UserShield>
					</TrickCard>
				))}
			</TrickGrid>
		</Main>
	);
}