import { db } from "~/database";

export async function getCreators() {
	const creators = await db.creator.findMany();
	return creators;
}
