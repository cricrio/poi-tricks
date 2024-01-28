import type { Trick } from "~/database";

export type ContributionData = Partial<
	Pick<Trick, "difficulty" | "name" | "preview" | "types"> & {
		videoUrls: string[];
		prerequisiteIds: string[];
	}
>;
