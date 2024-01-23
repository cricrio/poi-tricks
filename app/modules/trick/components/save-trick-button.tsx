import { useRef, useState } from "react";

import { useFetcher } from "@remix-run/react";
import { BookmarkCheckIcon, BookmarkIcon, TrashIcon } from "lucide-react";

import { Button } from "~/modules/ui";
import { Label } from "~/modules/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/modules/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/modules/ui/radio-group";
import type { action } from "~/routes/save-trick";

interface Props {
	trickId: string;
	category?: string;
}

export function SaveTrickButton({ trickId, category }: Props) {
	const savedTrick = useFetcher<typeof action>();
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLInputElement>(null);
	const Icon = category ? BookmarkCheckIcon : BookmarkIcon;

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button type="submit" className="min-w-20 ">
					<Icon className="mr-2 size-5" />
					{category || "Save"}
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="font-medium">Collections</div>
				<savedTrick.Form method="post" action="/save-trick">
					<input type="hidden" name="trickId" value={trickId} />
					<input type="submit" className="hidden" ref={ref} />
					<RadioGroup
						defaultValue={category}
						name="category"
						onValueChange={() => {
							setIsOpen(false);
							ref.current?.click();
						}}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="wanted" id="wanted" />
							<Label htmlFor="wanted">Want to learn</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="learning" id="learning" />
							<Label htmlFor="learning">Learning</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="learned" id="learned" />
							<Label htmlFor="learned">Learned</Label>
						</div>
						{category && (
							<div className="flex items-center space-x-2">
								<TrashIcon className="size-4" />
								<Label>Remove from collections</Label>
							</div>
						)}
					</RadioGroup>
				</savedTrick.Form>
			</PopoverContent>
		</Popover>
	);
}
