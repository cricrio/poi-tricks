import { db } from "~/database";

export async function getTrick(id: string) {
	const trick = await db.trick.findFirst({
		where: { id },
		include: {
			videos: true,
			creators: true,
			prerequisites: { include: { creators: true } },
		},
	});
	return trick;
}
