import { json, type ActionFunctionArgs } from "@remix-run/node";
import { safeParseForm } from "react-zorm";

import { db } from "~/database";
import { requireAuthSession } from "~/modules/auth";
import {
    createContributions,
    getConnections,
    logAddVideoToTrick,
    saveContributions,
} from "~/modules/contribution";
import { getCreatorAction } from "~/modules/creator/services/connect-create-creator-to-videos";
import { assertIsPost, getRequiredParam } from "~/utils";

import { schema } from "./schema";
import { addVideo } from "../../service.server";

async function validateUserInput(request: Request) {
    const formData = await request.formData();
    const validationResult = safeParseForm(schema, formData);
    if (!validationResult.success) {
        throw json(validationResult.error, 400);
    }
    return validationResult.data;
}

async function action({ request, params }: ActionFunctionArgs) {
    assertIsPost(request);
    const session = await requireAuthSession(request);
    const trickId = getRequiredParam(params, "trickId", "uuid");
    const { externalId } = await validateUserInput(request);

    const creator = await getCreatorAction(externalId);

    await addVideo({
        trick: { connect: { id: trickId } },
        externalId,
        creator,
        source: "youtube",
    });

    await logAddVideoToTrick(trickId, session.userId, externalId);

    return json({ status: "ok" });
}

export { action };
