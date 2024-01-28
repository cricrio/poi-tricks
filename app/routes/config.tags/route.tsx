import React from "react";

import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { CreateTagForm } from "~/modules/tags/components/create-tag-form";
import { UpdateTagForm } from "~/modules/tags/components/update-tag-form";
import { getAllTags } from "~/modules/tags/service.server";
import { Button, Header, Main } from "~/modules/ui";
import { cn } from "~/utils/utils";

export async function loader() {
	const tags = await getAllTags();

	return json({ tags });
}

export default function ConfigTagsPage() {
	const { tags } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();
	const [editable, setEditable] = React.useState<Record<string, boolean>>({});
	return (
		<Main className="space-y-4">
			<section>
				<Header>Create new tag</Header>
				<CreateTagForm />
			</section>
			<section>
				<Header>Edit tags</Header>
				{tags.map((tag, index) => (
					<div
						className={cn(
							"user-select-none p-1 cursor-pointer rounded-lg",
							{
								"bg-gray-900": index % 2 === 0,
							},
						)}
						key={tag.id}
						{...{
							...(editable[tag.id]
								? {}
								: {
										onClick: () =>
											setEditable((e) => ({
												...e,
												[tag.id]: true,
											})),
									}),
						}}
					>
						{editable[tag.id] ? (
							<UpdateTagForm tag={tag}>
								<Button
									variant="outline"
									onClick={() =>
										setEditable((e) => ({
											...e,
											[tag.id]: false,
										}))
									}
								>
									Reset
								</Button>
							</UpdateTagForm>
						) : (
							<div className="flex items-center justify-between">
								{tag.name}
								<fetcher.Form method="POST">
									<input
										name="intent"
										value="delete"
										type="hidden"
									/>
									<Button type="submit" variant="outline">
										Delete
									</Button>
								</fetcher.Form>
							</div>
						)}
					</div>
				))}
			</section>
		</Main>
	);
}
