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
    const [preview, setPreview] = React.useState<string | null>(null);
    const fetcher = useFetcher();

    const onImageChange = (event: React.FormEvent<HTMLInputElement>) => {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files[0]) {
            setPreview(URL.createObjectURL(element.files[0]));
        }
    };
    const onImageChange = (event: React.FormEvent<HTMLInputElement>) => {
        const element = event.currentTarget as HTMLInputElement;
        if (element.files && element.files[0]) {
            setPreview(URL.createObjectURL(element.files[0]));
        }
    };

    function getImage() {
        if (preview) {
            return (
                <img
                    src={preview}
                    alt="trick preview"
                    className="size-full rounded-lg object-fill"
                />
            );
        }
        if (trick.preview) {
            <PreviewImage
                src={trick.preview}
                name={trick.name}
                className="size-full rounded-lg object-fill"
            />;
        }
        return <div className="padding-auto"></div>;
    }

    return (
        <fetcher.Form method="POST" className="space-y-3">
            <div className="relative aspect-video rounded-lg border border-white">
                {getImage()}
                <div className="absolute bottom-5 right-5 space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setPreview(null)}
                        disabled={!preview}
                    >
                        Reset
                    </Button>
                    <Button asChild>
                        <Label htmlFor="file">
                            {trick.preview || preview
                                ? "Change preview"
                                : "Add a preview"}
                        </Label>
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
                <Button type="submit" disabled={!preview}>
                    Submit
                </Button>
            </div>
        </fetcher.Form>
    );
}
