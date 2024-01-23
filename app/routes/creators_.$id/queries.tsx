import { db } from "~/database";

export async function getCreator(id: string) {
	const creator = await db.creator.findUnique({
		where: { id },
		include: { tricks: { include: { creators: true } } },
	});
	return creator;
}
