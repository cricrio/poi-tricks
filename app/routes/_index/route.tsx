import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Grid } from "~/modules/trick/components/grid";
import { TrickCard } from "~/modules/trick/components/trick-card";
import { Header } from "~/modules/ui/header";
import { Main } from "~/modules/ui/main";

import { getTricksByDifficulties } from "./queries";

export const loader = async () => {
	const tricksByDifficulties = await getTricksByDifficulties();
	return json({ tricksByDifficulties });
};
export default function Index() {
	const { tricksByDifficulties } = useLoaderData<typeof loader>();
	return (
		<Main>
			{/* <section>
				<Header href="/creators">Featuring ({creatorCount})</Header>
				<Grid>
					{creatorList?.map((creator) => (
						<div className="flex justify-space-between flex-col items-center gap-2">
							<Avatar
								name={creator.name ?? ""}
								src={creator.picture}
								width="w-36"
							/>
							<a
								className="text-xl justify-self-end capitalize text-center max-w-44"
								href={`/creators/${creator.id}`}
							>
								{creator.name}
							</a>
						</div>
					))}
				</Grid>
			</section> */}
			{tricksByDifficulties.map(({ difficulty, tricks, count }) => (
				<section className="my-16" key={difficulty}>
					<Header href={`/tricks/difficulty/${difficulty}`}>
						{difficulty} ({count})
					</Header>
					<Grid>
						{tricks?.map((trick) => (
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
				</section>
			))}
		</Main>
	);
}
