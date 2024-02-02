import React from "react";

import { TrashIcon } from "lucide-react";

import type { Tag } from "~/database";
import { Badge, Button } from "~/modules/ui";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/modules/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/modules/ui/popover";

type Props = {
    value: Array<Tag>;
    name: string;
    tags: AddNewTagButtonProps["tags"];
};

type AddNewTagButtonProps = {
    tags: Array<Tag>;
    onSelect: (value: Tag) => void;
};

function AddNewTagButton({ tags, onSelect }: AddNewTagButtonProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-start">
                    Add a new tag
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" side="right" align="start">
                <Command>
                    <CommandInput placeholder="Change status..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {tags.map((status) => (
                                <CommandItem
                                    key={status.id}
                                    value={status.id}
                                    onSelect={(value) => {
                                        const selectedTag = tags.find(
                                            (t) => t.id === value,
                                        );
                                        if (selectedTag) {
                                            onSelect(selectedTag);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    {status.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function TagsInput({ value, name, tags: allTags }: Props) {
    const [selectedTags, setSelectedTags] = React.useState<Array<Tag>>([]);

    const tags = allTags.filter(
        (tag) => !selectedTags.some((p) => p.id === tag.id),
    );
    return (
        <div className="flex flex-wrap items-center gap-2">
            {[...value, ...selectedTags].map((tag, index) => (
                <div key={tag.id}>
                    <input
                        type="hidden"
                        name={`${name}[${index}]`}
                        value={tag.id}
                    />
                    <Badge className="space-x-2 normal-case">
                        <span>{tag.name}</span>
                        <TrashIcon className="size-4" />
                    </Badge>
                </div>
            ))}
            <AddNewTagButton
                tags={tags}
                onSelect={(value) =>
                    value && setSelectedTags((t) => [...t, value])
                }
            />
        </div>
    );
}
