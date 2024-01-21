import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getAuthSession } from "~/modules/auth";
import { AvatarGroup, Avatar } from "~/modules/creator";
import { NotConnectedDialog, TrickCard } from "~/modules/trick";
import { SaveTrickButton } from "~/modules/trick/components/save-trick-button";
import { YoutubeEmbed } from "~/modules/trick/components/youtube-embed";
import { getUserSavedTricksLoader } from "~/modules/trick/save-trick.server";
import { Main, Badge } from "~/modules/ui";
import { getRequiredParam } from "~/utils";

import { getTrick } from "./queries";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const id = getRequiredParam(params, "trickId");
	const trick = await getTrick(id);
	const savedTricks = await getUserSavedTricksLoader(request);
	const session = await getAuthSession(request);
	if (!trick) {
		throw new Response("Not Found", { status: 404 });
	}

	return json({ trick, savedTricks, connected: !!session });
}

export default function TrickPage() {
	const { trick, connected, savedTricks } = useLoaderData<typeof loader>();

	return (
		<Main className="grid grid-cols-1 lg:grid-cols-[3fr_1fr]">
			<div className="@md:ml-52">
				<h1 className="mb-4 text-3xl">{trick.name}</h1>
				<div className="mb-4 flex items-center gap-4">
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
					{connected ? (
						<SaveTrickButton
							trickId={trick.id}
							category={savedTricks[trick.id]}
						/>
					) : (
						<NotConnectedDialog />
					)}
				</div>
				<div className="mb-6 flex flex-wrap items-center gap-2 lg:mb-10">
					<Badge asChild className="bg-sky-400 capitalize text-white">
						<a href={`/tricks/difficulty/${trick.difficulty}`}>
							{trick.difficulty}
						</a>
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
				<div className="mb-10 lg:hidden">
					<h2 className="mb-4 text-2xl">Prerequisites</h2>
					<div className="flex flex-col gap-2">
						{trick.prerequisites?.map((trick) => (
							<a
								href={`/tricks/${trick.id}`}
								className="block"
								key={trick.id}
							>
								{trick.name}
								<div className="badge badge-secondary ml-2 capitalize">
									{trick.difficulty}
								</div>
							</a>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{trick.videos?.map((v) =>
						v.source === "youtube" ? (
							<YoutubeEmbed
								key={v.id}
								externalId={v.externalId}
							/>
						) : (
							<video
								key={v.id}
								controls
								className="aspect-video w-full max-w-2xl"
							>
								<source src={v.externalId} />
							</video>
						),
					)}
				</div>
			</div>
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
				</div>
			</div>
		</Main>
	);
}
