import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { AvatarGroup, Avatar } from "~/modules/creator";
import {
	NotConnectedDialog,
	PreviewImage,
	TrickCard,
	TrickPreview,
} from "~/modules/trick";
import { SaveTrickButton } from "~/modules/trick/components/save-trick-button";
import { VideoPlayer } from "~/modules/trick/components/video-player";
import { YoutubeEmbed } from "~/modules/trick/components/youtube-embed";
import { Main, Badge, Header } from "~/modules/ui";
import type { UserWithSavedTrick } from "~/modules/user";
import { UserShield } from "~/modules/user/components/user-shield";
import { getRequiredParam } from "~/utils";

import { getTrick } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "trickId");
	const trick = await getTrick(id);

	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ trick });
}

export default function TrickPage() {
	const { trick } = useLoaderData<typeof loader>();

	return (
		<Main className="grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
			<div className="@md:ml-52 flex flex-col space-y-6">
				<section className="flex flex-col space-y-4">
					<h1 className="text-3xl">{trick.name}</h1>
					<div className="flex items-center gap-4">
						<AvatarGroup>
							{trick.creators?.map((creator) => (
								<Avatar
									key={creator.id}
									src={creator.picture}
									name={creator.name}
								/>
							))}
						</AvatarGroup>
						<div>
							{trick.creators
								?.map((creator) => creator.name)
								.join(", ")}
						</div>
						<UserShield notConnected={<NotConnectedDialog />}>
							{(user: UserWithSavedTrick) => (
								<SaveTrickButton
									category={user.savedTricks[trick.id]}
									trickId={trick.id}
								/>
							)}
						</UserShield>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							asChild
							className="bg-sky-400 capitalize text-white"
						>
							<Link to={`/tricks/difficulty/${trick.difficulty}`}>
								{trick.difficulty}
							</Link>
						</Badge>
						{trick.types &&
							trick.types.length > 0 &&
							trick.types.map((type: string) => (
								<Badge
									className="bg-fuchsia-500 text-white"
									key={type}
								>
									{type}
								</Badge>
							))}
					</div>
				</section>
				{trick?.prerequisites?.length > 0 && (
					<section className="mb-10 lg:hidden">
						<Header>Prerequisites</Header>
						<div className="flex flex-col gap-2">
							{trick.prerequisites.map((trick) => (
								<TrickPreview key={trick.id} {...trick} />
							))}
						</div>
					</section>
				)}
				{trick?.preview && (
					<section>
						<Header>Preview</Header>
						<PreviewImage
							src={trick.preview}
							name={trick.name}
							className="aspect-video w-full max-w-2xl"
						/>
					</section>
				)}
				<section>
					<Header>Videos</Header>
					<div className="flex flex-col gap-2">
						{trick.videos?.map((v) =>
							v.source === "youtube" ? (
								<YoutubeEmbed
									key={v.id}
									externalId={v.externalId}
								/>
							) : (
								<VideoPlayer key={v.id} src={v.externalId} />
							),
						)}
					</div>
				</section>
			</div>
			{trick.prerequisites?.length > 0 && (
				<div className="hidden lg:block">
					<h2 className="mb-6 text-2xl">Prerequisites</h2>
					<div className="flex flex-col gap-4">
						{trick.prerequisites?.map((trick) => (
							<TrickCard
								key={trick.id}
								preview={trick.preview}
								id={trick.id}
								name={trick.name}
								types={trick.types ?? []}
								creators={trick.creators ?? []}
							>
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
					</div>
				</div>
			)}
		</Main>
	);
}
