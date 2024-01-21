import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

import type { TrickDifficulty } from "~/database/";
import { Grid } from "~/modules/trick/components/grid";
import { SaveTrickButton } from "~/modules/trick/components/save-trick-button";
import { TrickCard } from "~/modules/trick/components/trick-card";
import { getUserSavedTricksLoader } from "~/modules/trick/save-trick.server";
import { Header } from "~/modules/ui/header";
import { Main } from "~/modules/ui/main";
import { getRequiredParam } from "~/utils";

import { getTricksAndCountByDifficulty } from "./queries";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const difficulty = getRequiredParam(
		params,
		"difficulty",
	) as TrickDifficulty;
	const { tricks, count } = await getTricksAndCountByDifficulty(difficulty);
	const savedTricks = await getUserSavedTricksLoader(request);
	return json({ tricks, count, savedTricks });
}

export default function DifficultyPage() {
	const { tricks, count, savedTricks } = useLoaderData<typeof loader>();
	const { difficulty } = useParams();
	return (
		<Main>
			<Header>
				{difficulty} ({count})
			</Header>
			<Grid>
				{tricks.map((trick) => (
					<TrickCard
						preview={trick.preview}
						id={trick.id}
						name={trick.name}
						types={trick.types ?? []}
						creators={trick?.creators ?? []}
						key={trick.id}
					>
						<SaveTrickButton
							trickId={trick.id}
							category={savedTricks[trick.id] ?? undefined}
						/>
					</TrickCard>
				))}
			</Grid>
		</Main>
	);
}
