import {
	TrickDifficulty as Difficulty,
	ContributionAction,
} from "@prisma/client";
import type { TrickDifficulty, Tag as DBTag } from "@prisma/client";
export type {
    User,
    Creator,
    Prisma,
    Trick,
    TrickDifficulty,
    Contribution,
} from "@prisma/client";

export type Tag = Pick<DBTag, "id" | "name">;
const trickDifficulties = Object.keys(Difficulty) as TrickDifficulty[];

const trickDifficultyEnum = Difficulty;
const contributionActionEnum = ContributionAction;

export { trickDifficulties, trickDifficultyEnum, contributionActionEnum };
