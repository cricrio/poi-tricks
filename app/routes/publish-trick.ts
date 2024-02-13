import { json, type ActionFunctionArgs } from "@remix-run/node";
import { parseFormAny } from "react-zorm";
import invariant from "tiny-invariant";

import { getAuthSession } from "~/modules/auth";
import { logPublishingTrick } from "~/modules/contribution";
import { updateTrick } from "~/modules/trick";
import { schema } from "~/modules/trick/forms/publish-trick-button";
import { assertIsPost } from "~/utils";

export async function action({ request }: ActionFunctionArgs) {
    assertIsPost(request);

    const authSession = await getAuthSession(request);
    const userId = authSession?.userId;
    invariant(userId, "userId is required");

    const body = await request.formData();
    const validatedData = schema.safeParse(parseFormAny(body));
    if (validatedData.success === false) {
        return json(
            {
                errors: validatedData.error,
            },
            { status: 400 },
        );
    }
    const { trickId } = validatedData.data;
    invariant(trickId, "trickId is required");

    const updatedTrick = await updateTrick(trickId, { draft: false });

    await logPublishingTrick(trickId, userId);

    return json({ error: null, data: updatedTrick });
}
