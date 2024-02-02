import type { Creator, Trick } from "~/database";

export const ROUTES = {
    home: () => "/",
    creators: () => "/creators",
    creator: ({ id }: Required<Pick<Creator, "id">>) => `/creators/${id}`,
    tricksByDifficulty: ({ difficulty }: Required<Pick<Trick, "difficulty">>) =>
        `/tricks/difficulty/${difficulty}`,
    trick: ({ id }: Required<Pick<Trick, "id">>) => `/tricks/${id}`,
    editTrick: ({ id }: Required<Pick<Trick, "id">>) => `/tricks/${id}/edit`,
    me: () => "/me",
};
