import { useFetcher } from "@remix-run/react";
import { parseFormAny } from "react-zorm";
import { z } from "zod";

import type { Tag, Trick } from "~/database";
import { trickDifficulties, trickDifficultyEnum } from "~/database";
import { TagsInput } from "~/modules/tag/components/tags-input";
import { useTags } from "~/modules/tag/context";
import { Button, Input, Label } from "~/modules/ui";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/modules/ui/select";

type Props = {
    trick?: Pick<Trick, "id" | "name" | "difficulty"> & {
        tags: Array<Tag>;
    };
};

const schema = z.object({
    name: z.string(),
    difficulty: z.nativeEnum(trickDifficultyEnum).nullable(),
    tags: z.array(z.string()).nullable(),
    preview: z.string().nullable(),
});

export function validate(formData: FormData) {
    return schema.safeParse(parseFormAny(formData));
}

export function TrickGeneralInformationForm({ trick }: Props) {
    const trickFetcher = useFetcher();
    const tags = useTags();
    return (
        <trickFetcher.Form method="post" className="mb-4 space-y-3">
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={trick?.name ?? ""}
                />
            </div>
            <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                    defaultValue={trick?.difficulty ?? ""}
                    name="difficulty"
                >
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
                    <TagsInput
                        value={trick?.tags ?? []}
                        name="tags"
                        tags={tags}
                    />
                </div>
            </div>
            <Button type="submit" className="shrink-0 grow-0">
                Submit
            </Button>
        </trickFetcher.Form>
    );
}
