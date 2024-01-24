import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { CreatorCard, CreatorGrid } from "~/modules/creator/";
import {
	TrickGrid,
	NotConnectedDialog,
	TrickCard,
	SaveTrickButton,
} from "~/modules/trick/";
import { Header, Main } from "~/modules/ui/";
import type { UserWithSavedTrick } from "~/modules/user";
import { UserShield } from "~/modules/user";

import { getFirstCreators, getTricksByDifficulties } from "./queries";

export const loader = async () => {
	const [tricksByDifficulties, creators] = await Promise.all([
		getTricksByDifficulties(),
		getFirstCreators(),
	]);

	return json({
		tricksByDifficulties,
		creators,
	});
};
export default function Index() {
	const { tricksByDifficulties, creators } = useLoaderData<typeof loader>();
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
							<TrickCard {...trick} key={trick.id}>
								<UserShield
									notConnected={<NotConnectedDialog />}
								>
									{(user: UserWithSavedTrick) => (
										<SaveTrickButton
											category={
												user.savedTricks[trick.id]
											}
											trickId={trick.id}
										/>
									)}
								</UserShield>
							</TrickCard>
						))}
					</TrickGrid>
				</section>
			))}
		</Main>
	);
}
