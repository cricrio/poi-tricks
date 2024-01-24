import { creatorFragment, db } from "~/database";

export async function getCreators() {
	const creators = await db.creator.findMany({ select: creatorFragment });
	return creators;
}
