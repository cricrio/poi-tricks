import { db, trickFragment, creatorFragment, videoFragment } from "~/database";

export async function getTrick(id: string) {
	const trick = await db.trick.findFirst({
		where: { id },
		select: {
			...trickFragment,
			videos: {
				select: {
					...videoFragment,
				},
			},
			creators: {
				select: {
					...creatorFragment,
				},
			},
			prerequisites: {
				select: {
					...trickFragment,
					creators: { select: creatorFragment },
				},
			},
		},
	});
	return trick;
}
