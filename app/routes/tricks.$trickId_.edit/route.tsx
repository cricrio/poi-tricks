import React from "react";

import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { parseFormAny } from "react-zorm";
import { z } from "zod";

import { commitAuthSession, requireAuthSession } from "~/modules/auth";
import {
    createUserContibution,
    diffContribution,
} from "~/modules/contribution/service.server";
import { getAllTags } from "~/modules/tag";
import { TagProvider } from "~/modules/tag/context";
import {
    getTrickById,
    PreviewInput,
    TrickGeneralInformationForm,
} from "~/modules/trick";
import { Header, Main } from "~/modules/ui";
import { assertIsPost, getRequiredParam } from "~/utils";

const NewContributionShema = z.object({
    name: z.string(),
    difficulty: z.string(),
    types: z.string(),
});

export async function loader({ params }: LoaderFunctionArgs) {
    const id = getRequiredParam(params, "trickId", "uuid");
    const trick = await getTrickById(id);

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
    const trick = await getTrickById(id);
    if (!trick) {
        throw new Response("Not Found", { status: 404 });
    }
    const form = await request.formData();

    const formData = await NewContributionShema.safeParseAsync(
        parseFormAny(form),
    );
    if (!formData.success) {
        return json(
            {
                errors: formData.error,
            },
            {
                status: 400,
                headers: {
                    "Set-Cookie": await commitAuthSession(request, {
                        authSession,
                    }),
                },
            },
        );
    }
    const contribution = diffContribution(trick, formData.data);

    const result = await createUserContibution(
        id,
        authSession.userId,
        contribution,
    );

    return json({ contribution: result });
}

export default function EditTrick() {
    const { trick, tags } = useLoaderData<typeof loader>();
    return (
        <Main className="md:max-w-3xl">
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
            </TagProvider>
        </Main>
    );
}
