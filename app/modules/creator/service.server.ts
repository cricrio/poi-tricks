import type { Prisma } from "~/database";
import { db } from "~/database";

export async function getCreators({
	where,
	take,
	include,
}: {
	where?: Prisma.CreatorWhereInput;
	take?: number;
	include: Prisma.CreatorInclude;
}) {
	const creators = await db.creator.findMany({
		...(take ? { take } : {}),
		include,
		where,
	});
	return creators;
}
