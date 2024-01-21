import { getUserSavedTricks } from "./service.server";
import { getAuthSession } from "../auth";

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
