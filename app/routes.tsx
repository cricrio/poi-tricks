import type { Creator, Trick } from "~/database";

export const ROUTES = {
  home: () => "/",
  login: () => "/login",
  register: () => "/register",
  creators: () => "/creators",
  creator: ({ id }: Required<Pick<Creator, "id">>) => `/creators/${id}`,
  tricksByDifficulty: ({ difficulty }: Required<Pick<Trick, "difficulty">>) =>
    `/tricks/difficulty/${difficulty}`,
  trick: ({ id }: Required<Pick<Trick, "id">>) => `/tricks/${id}`,
  editTrick: ({ id }: Required<Pick<Trick, "id">>) => `/tricks/${id}/edit`,
  me: () => "/me",
};

export const RESSOURCES = {
  saveTrick: "/save-trick",
  publishTrick: "/publish-trick",
  trick: ({ id }: Required<Pick<Trick, "id">>) => ({
    addVideo: `/tricks/${id}/add-video`,
  }),
};
