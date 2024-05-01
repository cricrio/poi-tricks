import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import { validateUserInput } from "~/modules/contribution";
import { TagProvider, getAllTags } from "~/modules/tag";
import { TrickGeneralInformationForm, createTrick } from "~/modules/trick";
import { Header, Main } from "~/modules/ui";
import { ROUTES } from "~/routes";
import { assertIsPost } from "~/utils";

export async function loader(args: LoaderFunctionArgs) {
  await requireAuthSession(args.request);
  const tags = await getAllTags();
  return json({ tags });
}

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const authSession = await requireAuthSession(request);
  const formData = await request.formData();

  const userData = validateUserInput(formData);
  const trick = await createTrick(userData, authSession.userId, userData.tags);

  return redirect(ROUTES.trick(trick));
}

export default function AddPage() {
  const { tags } = useLoaderData<typeof loader>();
  return (
    <Main>
      <Header>Create a new trick</Header>
      <TagProvider tags={tags}>
        <TrickGeneralInformationForm />
      </TagProvider>
    </Main>
  );
}
