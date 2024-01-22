import type { LoaderFunctionArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAuthSession } from "~/modules/auth/session.server";
import { CreatorCard, CreatorGrid } from "~/modules/creator/";
import {
	TrickGrid,
	NotConnectedDialog,
	TrickCard,
	SaveTrickButton,
} from "~/modules/trick/";
import { getUserSavedTricksLoader } from "~/modules/trick/save-trick.server";
import { Header, Main } from "~/modules/ui/";

import { getFirstCreators, getTricksByDifficulties } from "./queries";

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
				<CreatorGrid>
					{creators.data?.map((creator) => (
						<CreatorCard key={creator.id} {...creator} />
					))}
				</CreatorGrid>
			</section>
			{tricksByDifficulties.map(({ difficulty, tricks, count }) => (
				<section className="my-16" key={difficulty}>
					<Header href={`/tricks/difficulty/${difficulty}`}>
						{difficulty} ({count})
					</Header>
					<TrickGrid>
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
					</TrickGrid>
				</section>
			))}
		</Main>
	);
}
