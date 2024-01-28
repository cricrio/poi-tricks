import { Label } from "@radix-ui/react-label";
import { useFetcher } from "@remix-run/react";

import { Button, Input } from "~/modules/ui";

export function CreateTagForm() {
	const fetcher = useFetcher();
	return (
		<fetcher.Form method="POST" className="flex items-end gap-2">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input
					id="name"
					type="text"
					name="name"
					placeholder="Enter tag name"
				/>
			</div>
			<Button type="submit">Create</Button>
		</fetcher.Form>
	);
}
