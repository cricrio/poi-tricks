import { db } from "~/database";

export async function createTag(name: string) {
	const tag = await db.tag.create({
		data: {
			name,
		},
	});
	return tag;
}

export async function updateTag(tagId: string, name: string) {
	const tag = await db.tag.update({
		where: { id: tagId },
		data: { name },
	});
	return tag;
}

export async function getAllTags() {
	const tags = await db.tag.findMany({
		orderBy: {
			name: "asc",
		},
	});
	return tags;
}
