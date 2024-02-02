import React, { useEffect } from "react";

import { Label } from "@radix-ui/react-label";
import { useFetcher } from "@remix-run/react";

import { Button, Input } from "~/modules/ui";

export function CreateTagForm() {
    const fetcher = useFetcher();

    //clear input after submitting (this will also clear the input if there is an error)
    useEffect(() => {
        if (fetcher.state === "submitting" && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [fetcher.state]);

    const inputRef = React.useRef<HTMLInputElement>(null);
    return (
        <fetcher.Form
            method="post"
            className="flex items-end gap-2"
            onSubmit={() => {}}
        >
            <div>
                <Label htmlFor="name">Name</Label>
                <input name="intent" value="create" type="hidden" />
                <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter tag name"
                    ref={inputRef}
                />
            </div>
            <Button type="submit">Create</Button>
        </fetcher.Form>
    );
}
