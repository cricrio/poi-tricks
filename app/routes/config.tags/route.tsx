import React from "react";

import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { requireAuthSession } from "~/modules/auth";
import { DeleteTagForm } from "~/modules/tag";
import { CreateTagForm } from "~/modules/tag/forms/create-tag";
import { UpdateTagForm } from "~/modules/tag/forms/update-tag";
import {
    createTag,
    deleteTag,
    getAllTags,
    updateTag,
} from "~/modules/tag/service.server";
import { Button, Header, Main } from "~/modules/ui";
import { assertIsPost } from "~/utils";
import { cn } from "~/utils/utils";

export async function loader() {
    const tags = await getAllTags();

    return json({ tags });
}

enum Intents {
    create = "create",
    update = "update",
    delete = "delete",
}

function getIntent(formData: FormData): Intents {
    const intent = formData.get("intent") as string;
    invariant(intent in Intents, `"${intent}" is not a supported intent.`);
    return intent as Intents;
}

const resolvers = {
    [Intents.create]: (formData: FormData) => {
        const name = formData.get("name") as string;
        return createTag(name);
    },
    [Intents.update]: (formData: FormData) => {
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        return updateTag(id, name);
    },
    [Intents.delete]: (formData: FormData) => {
        const id = formData.get("id") as string;
        return deleteTag(id);
    },
};

export async function action({ request }: ActionFunctionArgs) {
    assertIsPost(request);
    await requireAuthSession(request);
    const formData = await request.formData();
    const intent = getIntent(formData);
    return resolvers[intent](formData);
}

export default function ConfigTagsPage() {
    const { tags } = useLoaderData<typeof loader>();
    const [editable, setEditable] = React.useState<Record<string, boolean>>({});

    const toggleEditable = (tagId: string, state: boolean) => () =>
        setEditable((e) => ({
            ...e,
            [tagId]: state,
        }));

    return (
        <Main className="space-y-4">
            <section>
                <Header>Create new tag</Header>
                <CreateTagForm />
            </section>
            <section>
                <Header>Edit tags</Header>
                {tags.map((tag, index) => (
                    <div
                        className={cn(
                            "user-select-none cursor-pointer rounded-lg overflow-hidden",
                            {
                                "bg-gray-900": index % 2 === 0,
                            },
                        )}
                        key={tag.id}
                    >
                        {editable[tag.id] ? (
                            <UpdateTagForm
                                tag={tag}
                                onSubmit={toggleEditable(tag.id, false)}
                            >
                                <Button
                                    variant="outline"
                                    onClick={toggleEditable(tag.id, false)}
                                >
                                    Reset
                                </Button>
                            </UpdateTagForm>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div
                                    className="flex-1 px-2 py-1"
                                    {...{
                                        ...(editable[tag.id]
                                            ? {}
                                            : {
                                                  onClick: toggleEditable(
                                                      tag.id,
                                                      true,
                                                  ),
                                              }),
                                    }}
                                >
                                    {tag.name}
                                </div>
                                <DeleteTagForm tagId={tag.id} />
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </Main>
    );
}
