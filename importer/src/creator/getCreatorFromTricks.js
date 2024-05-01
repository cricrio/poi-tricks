import CreatorList from "./creatorList.js";

export const getCreatorFromTricks = (tricks) => {
  const creatorList = new CreatorList();
  tricks.forEach((trick) => {
    trick.videos.forEach(creatorList.add(trick.id));
  });
  return creatorList.getAll();
};
