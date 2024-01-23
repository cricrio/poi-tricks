import type { SavedTrick } from "@prisma/client";

import type { Trick, User } from "~/database";

export type UserWithSavedTrick = User & {
	savedTricks: Record<Trick["id"], SavedTrick["category"]>;
};
