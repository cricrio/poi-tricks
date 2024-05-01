const getYoutubeUrl = (id) => `https://www.youtube.com/watch?v=${id}`;
const getNoembedMetaDataUrl = (url) => `https://noembed.com/embed?url=${url}`;

const extractResponse = (response) => {
  try {
    return response.json();
  } catch (e) {
    return JSON.parse(response.text());
  }
};

const get = async (url) => {
  const response = await fetch(url);
  return extractResponse(response);
};

const extractMeta = (data) => {
  if (data.author_name) {
    return {
      name: data.author_name,
      url: data.author_url,
      title: data.title,
      externalId: data.author_url.replace("https://www.youtube.com/", ""),
    };
  } else {
    throw new Error("no author_url");
  }
};

export const addCreatorTricks = async (trick) => {
  const creators = await Promise.all(
    trick.videos.map((video) =>
      video.source === "youtube"
        ? getCreator(video.externalId)
        : Promise.resolve(null),
    ),
  );
  return {
    ...trick,
    videos: trick.videos.map((video, i) => {
      const c = creators[i];
      if (!c) return video;
      return {
        ...video,
        title: c.title,
        creator: { name: c.name, url: c.url, externalId: c.externalId },
      };
    }),
  };
};

export const getCreator = async (id) =>
  get(getNoembedMetaDataUrl(getYoutubeUrl(id))).then(extractMeta);

const getData = ({ data, error }) => console.error(error) || data;

const addCreatorIntoVideo = async ({ externalId }) => {
  const meta = await getMetaData(externalId);

  let creator = await findCreator(meta.url);
  if (!creator) {
    creator = await createCreator({ name: meta.name });
    await createCreatorPlatform({
      creator,
      url: meta.url,
    });
  } else {
    console.log("creator already exists");
  }

  return updateVideo(externalId, { creator, title: meta.title });
};

const getAllVideosFromYoutube = async () =>
  supabase.from("videos").select("*").eq("source", "youtube").then(getData);

const main = async () => {
  const videos = await getAllVideosFromYoutube();
  let errors = [];
  for (const video of videos) {
    try {
      await addCreatorIntoVideo(video);
    } catch (e) {
      console.error(e);
      errors.push(video);
    }
  }
};
