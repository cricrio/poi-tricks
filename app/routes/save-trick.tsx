import { json, type ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getAuthSession } from "~/modules/auth";
import { updateSavedTrick } from "~/modules/trick";
import { assertIsPost } from "~/utils";

export async function action({
    request,
}: ActionFunctionArgs): Promise<Response> {
    assertIsPost(request);

    const authSession = await getAuthSession(request);
    const userId = authSession?.userId;

    const body = await request.formData();
    const trickId = body.get("trickId") as string;

    invariant(userId, "userId is required");
    invariant(trickId, "trickId is required");

    const category = body.get("category") as string;

    await updateSavedTrick({ userId, trickId, category });
    return json({ error: null });
}
