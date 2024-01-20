import { getAuthSession } from "../auth";
import { getUserSavedTricks } from "./service.server";

export async function getUserSavedTricksLoader(
	request: Request,
): Promise<Record<string, string>> {
	const authSession = await getAuthSession(request);
	if (authSession) {
		return getUserSavedTricks(authSession.userId);
	} else {
		return {};
	}
}
