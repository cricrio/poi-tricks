import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

import type { TrickDifficulty } from "~/database/";
import { Grid } from "~/modules/trick/components/grid";
import { TrickCard } from "~/modules/trick/components/trick-card";
import { Header } from "~/modules/ui/header";
import { Main } from "~/modules/ui/main";
import { getRequiredParam } from "~/utils";

import { getTricksAndCountByDifficulty } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
	const difficulty = getRequiredParam(
		params,
		"difficulty",
	) as TrickDifficulty;
	const { tricks, count } = await getTricksAndCountByDifficulty(difficulty);
	return json({ tricks, count });
}

export default function DifficultyPage() {
	const { tricks, count } = useLoaderData<typeof loader>();
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
					/>
				))}
			</Grid>
		</Main>
	);
}
