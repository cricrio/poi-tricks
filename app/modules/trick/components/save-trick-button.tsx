import { useFetcher } from "@remix-run/react";

import { Button } from "~/modules/ui";
import type { action } from "~/routes/save-trick";

interface Props {
	trickId: string;
	category?: string;
}

export function SaveTrickButton({ trickId, category }: Props) {
	const savedTrick = useFetcher<typeof action>();
	return (
		<savedTrick.Form method="post" action="/save-trick">
			<input type="hidden" name="trickId" value={trickId} />
			<input
				type="hidden"
				name="category"
				value={category ? "" : "Saved"}
			/>
			<Button type="submit">{category || "Save"}</Button>
		</savedTrick.Form>
	);
}
