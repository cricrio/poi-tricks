import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import {
    createContributions,
    getConnections,
    getTrickByIdForContribution,
    saveContributions,
    validateUserInput,
} from "~/modules/contribution";
import { getAllTags, TagProvider } from "~/modules/tag";
import {
    getTrickById,
    PreviewInput,
    TrickGeneralInformationForm,
    updateTrick,
} from "~/modules/trick";
import { VideosForm } from "~/modules/trick/forms/add-video/form";
import { Header, Main } from "~/modules/ui";
import { assertIsPost, getRequiredParam } from "~/utils";

export async function loader({ params, request }: LoaderFunctionArgs) {
    const session = await requireAuthSession(request);
    const id = getRequiredParam(params, "trickId", "uuid");
    const trick = await getTrickById(id, session.userId);

    if (!trick) {
        throw new Response("Not Found", { status: 404 });
    }

    const tags = await getAllTags();
    return json({ trick, tags });
}

export async function action({ params, request }: ActionFunctionArgs) {
    assertIsPost(request);
    const authSession = await requireAuthSession(request);
    const id = getRequiredParam(params, "trickId", "uuid");

    const userData = validateUserInput(await request.formData());
    const trick = await getTrickByIdForContribution(id);

    const contributions = createContributions(
        trick,
        { ...userData, id },
        authSession.userId,
    );
    await saveContributions(contributions);
    const { connect, disconnect } = getConnections(
        contributions.filter((c) => c.key === "tags"),
    );

    const updatedTrick = await updateTrick(id, {
        ...userData,
        tags: {
            connect: connect.map((id) => ({
                id,
            })),
            disconnect: disconnect.map((id) => ({ id })),
        },
    });

    return json({ trick: updatedTrick });
}

export default function EditTrick() {
    const { trick, tags } = useLoaderData<typeof loader>();
    return (
        <Main className="space-y-4 md:max-w-3xl">
            <TagProvider tags={tags}>
                <h1 className="mb-4 text-3xl">Edit Trick</h1>
                <section>
                    <Header>General informations</Header>
                    <TrickGeneralInformationForm trick={trick} />
                </section>
                <section>
                    <Header>Preview</Header>
                    <PreviewInput trick={trick} />
                </section>
                <section className="space-y-2">
                    <Header>Videos</Header>
                    <VideosForm videos={trick.videos} />
                </section>
            </TagProvider>
        </Main>
    );
}
