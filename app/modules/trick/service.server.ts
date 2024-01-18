import type { PrismaPromise } from "@prisma/client";

import type { Prisma } from "~/database";
import { db } from "~/database";

export async function getTricks({
	where,
	take,
	include,
}: {
	where?: Prisma.TrickWhereInput;
	include?: Prisma.TrickInclude;
	take?: number;
} = {}) {
	const tricks = await db.trick.findMany({
		...(take ? { take } : {}),
		include: { creators: true },
		where,
	});
	return tricks;
}

export async function countTricks({
	where,
}: { where?: Prisma.TrickWhereInput } = {}) {
	const count = await db.trick.count({
		where,
	});
	return count;
}
