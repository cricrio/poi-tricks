import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { Avatar } from "~/modules/creator/";
import { Grid, NotConnectedDialog, TrickCard } from "~/modules/trick/";
import { Header, Main } from "~/modules/ui/";

import { getFirstCreators, getTricksByDifficulties } from "./queries";
import { getAuthSession } from "~/modules/auth/session.server";
import { SaveTrickButton } from "~/modules/trick/components/save-trick-button";
import { getUserSavedTricksLoader } from "~/modules/trick/save-trick.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const authSession = await getAuthSession(request);

	const savedTricks = await getUserSavedTricksLoader(request);

	const [tricksByDifficulties, creators] = await Promise.all([
		getTricksByDifficulties(),
		getFirstCreators(),
	]);

	return json({
		connected: !!authSession,
		tricksByDifficulties,
		creators,
		savedTricks,
	});
};
export default function Index() {
	const { tricksByDifficulties, creators, savedTricks, connected } =
		useLoaderData<typeof loader>();
	return (
		<Main>
			<section>
				<Header href="/creators">Featuring ({creators.count})</Header>
				<Grid>
					{creators.data?.map((creator) => (
						<div
							className="flex flex-col items-center gap-2"
							key={creator.id}
						>
							<Avatar
								name={creator.name}
								src={creator.picture}
								size="lg"
							/>
							<Link
								className="max-w-44 justify-self-end text-center text-xl capitalize"
								to={`/creators/${creator.id}`}
							>
								{creator.name}
							</Link>
						</div>
					))}
				</Grid>
			</section>
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
							>
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
					</Grid>
				</section>
			))}
		</Main>
	);
}
