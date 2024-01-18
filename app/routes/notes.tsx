import { json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";

import { getTricks } from "~/modules/trick";
import { Grid } from "~/modules/trick/components/grid";
import { TrickCard } from "~/modules/trick/components/trick-card";

export async function loader() {
	const tricks = await getTricks();
	return json({ tricks });
}

export default function NotesPage() {
	const data = useLoaderData<typeof loader>();
	return (
		<div className="flex h-full min-h-screen flex-col">
			<Grid>
				{data?.tricks.map((trick) => (
					<TrickCard
						key={trick.id}
						id={trick.id}
						name={trick.name}
						preview={trick.preview}
						types={trick.types}
						creators={trick.creators ?? []}
					/>
				))}
			</Grid>

			<main className="flex h-full bg-white">
				<div className="flex-1 p-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
