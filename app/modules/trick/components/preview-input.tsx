import React from "react";

import type { Trick } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { Button, Label } from "~/modules/ui";

import { PreviewImage } from "./preview-image";

type PreviewInputProps = {
	trick: Pick<Trick, "name" | "preview">;
};
export function PreviewInput({ trick }: PreviewInputProps) {
	const [preview, setPreview] = React.useState<string | null>(null);
	const fetcher = useFetcher();

	const onImageChange = (event: React.FormEvent<HTMLInputElement>) => {
		const element = event.currentTarget as HTMLInputElement;
		if (element.files && element.files[0]) {
			setPreview(URL.createObjectURL(element.files[0]));
		}
	};

	return (
		<fetcher.Form method="POST" className="space-y-3">
			<div className="relative">
				{preview ? (
					<img
						src={preview}
						alt="trick preview"
						className="size-full rounded-lg object-fill"
					/>
				) : (
					<PreviewImage
						src={trick.preview}
						name={trick.name}
						className="size-full rounded-lg object-fill"
					/>
				)}
				<div className="absolute bottom-5 right-5">
					<Button asChild>
						<Label htmlFor="file">Change Preview</Label>
					</Button>
					<input
						id="file"
						type="file"
						name="file"
						className="hidden"
						onChange={onImageChange}
					/>
				</div>
			</div>
			<div className="flex gap-4">
				<Button
					variant="outline"
					onClick={() => setPreview(null)}
					disabled={!preview}
				>
					Reset
				</Button>
				<Button variant="outline" type="submit" disabled={!preview}>
					Submit {!preview ? "Disabled" : "Change"}
				</Button>
			</div>
		</fetcher.Form>
	);
}
