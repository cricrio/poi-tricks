class CreatorList {
  trickId;
  creators = [];

  constructor(creators) {
    if (creators) {
      this.creators = creators;
    }
  }

  add = (trickId) => (video) => {
    if (video.source !== "youtube") return;
    const creator = video.creator;
    const existing = this.creators.find((c) => c.name === creator.name);
    if (!existing) {
      this.creators.push({
        ...creator,
        videos: [video.externalId],
        tricks: new Set([trickId]),
      });
    } else {
      existing.tricks.add(trickId);
      existing.videos.push(video.externalId);
    }
  };

  getAll = () => this.creators.map((c) => ({ ...c, tricks: [...c.tricks] }));
}

export default CreatorList;
