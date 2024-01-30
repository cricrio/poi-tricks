import { useFetcher } from "@remix-run/react";

import { trickDifficulties, type Tag, type Trick } from "~/database";
import { TagsInput } from "~/modules/tag/components/tags-input";
import { Button, Input, Label } from "~/modules/ui";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/modules/ui/select";

type Props = {
	trick: Pick<Trick, "id" | "name" | "difficulty"> & {
		tags: Array<Pick<Tag, "id" | "name">>;
	};
};

export function TrickGeneralInformationForm({ trick }: Props) {
	const trickFetcher = useFetcher();

	return (
		<trickFetcher.Form method="post" className="mb-4 space-y-3">
			<div>
				<Label htmlFor="name">Name</Label>
				<Input
					type="text"
					name="name"
					id="name"
					defaultValue={trick.name}
				/>
			</div>
			<div>
				<Label htmlFor="difficulty">Difficulty</Label>
				<Select defaultValue={trick.difficulty} name="difficulty">
					<SelectTrigger>
						<SelectValue placeholder="Select a difficulty" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{trickDifficulties.map((difficulty) => (
								<SelectItem value={difficulty} key={difficulty}>
									<span className=" normal-case">
										{difficulty}
									</span>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<div>
					<Label htmlFor="tags">Tags</Label>
					<TagsInput value={trick.tags} name="tags[]" />
				</div>
			</div>
			<Button variant="outline" type="submit" className="shrink-0 grow-0">
				Submit
			</Button>
		</trickFetcher.Form>
	);
}
