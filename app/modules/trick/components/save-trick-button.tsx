import { useState } from "react";

import { useFetcher } from "@remix-run/react";
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react";

import { Button } from "~/modules/ui";
import { Divider } from "~/modules/ui/divider";
import { Label } from "~/modules/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/modules/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/modules/ui/radio-group";
import type { action } from "~/routes/save-trick";
import type { WithChildrenProps } from "~/types";

function getOptions(saved: boolean) {
	return [
		{ label: "Want to learn", value: "want-to-learn" },
		{ label: "Learning", value: "learning" },
		{ label: "Learned", value: "learned" },
		...(saved
			? [{ label: "Remove from collections", value: "", id: "remove" }]
			: []),
	];
}

function RadioGroupBox({ children }: WithChildrenProps) {
	return <div className="my-1 flex items-center space-x-2">{children}</div>;
}

interface Props {
	trickId: string;
	category?: string;
}

export function SaveTrickButton({ trickId, category }: Props) {
	const savedTrick = useFetcher<typeof action>();
	const [isOpen, setIsOpen] = useState(false);
	const Icon = category ? BookmarkCheckIcon : BookmarkIcon;
	const buttonContent =
		savedTrick.state === "loading" ? (
			"loading"
		) : (
			<>
				<Icon className="mr-2 size-5" />
				{category || "Save"}
			</>
		);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button type="submit" className="min-w-20 ">
					{buttonContent}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="font-medium">Collections</div>
				<Divider />
				<savedTrick.Form
					method="post"
					action="/save-trick"
					onChange={(event) => {
						savedTrick.submit(event.currentTarget, {
							method: "POST",
						});
						setIsOpen(false);
					}}
				>
					<input type="hidden" name="trickId" value={trickId} />
					<RadioGroup defaultValue={category} name="category">
						{getOptions(Boolean(category)).map((option) => (
							<RadioGroupBox key={option.value || option.id}>
								<RadioGroupItem
									value={option.value}
									id={option.value || option.id}
								/>
								<Label htmlFor={option.value || option.id}>
									{option.label}
								</Label>
							</RadioGroupBox>
						))}
					</RadioGroup>
				</savedTrick.Form>
			</PopoverContent>
		</Popover>
	);
}
