import { useFetcher } from "@remix-run/react";

import type { Trick } from "~/database";
import { Button, Input, Label } from "~/modules/ui";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/modules/ui/select";

import { difficulties } from "../service.shared";

type Props = {
	trick: Pick<Trick, "id" | "name" | "difficulty" | "types">;
};
export function TrickGeneralInformationForm({ trick }: Props) {
	const trickFetcher = useFetcher();

	return (
		<trickFetcher.Form method="POST" className="mb-4 space-y-3">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input type="text" name="name" defaultValue={trick.name} />
			</div>
			<div>
				<Label htmlFor="difficulty">Difficulty</Label>
				<Select defaultValue={trick.difficulty}>
					<SelectTrigger>
						<SelectValue placeholder="Select a difficulty" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{difficulties.map((difficulty) => (
								<SelectItem value={difficulty} key={difficulty}>
									<span className="capitalize">
										{difficulty}
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<div>
					<Label htmlFor="types">Types</Label>
					<Input
						type="text"
						name="types"
						defaultValue={trick.types?.join(", ")}
					/>
				</div>
			</div>
			<Button variant="outline" type="submit" className="shrink-0 grow-0">
				Submit
			</Button>
		</trickFetcher.Form>
	);
}
