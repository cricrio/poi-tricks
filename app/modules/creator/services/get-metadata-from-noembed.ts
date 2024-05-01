const getYoutubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const getNoembedMetaDataUrl = (url: string) =>
  `https://noembed.com/embed?url=${url}`;

const get = async (url: string) => {
  const response = await fetch(url);
  try {
    return response.json();
  } catch (e) {
    return JSON.parse(await response.text());
  }
};

const extractMeta = (data: {
  author_name: string;
  author_url: string;
  title: string;
}): {
  creator: {
    name: string;
  };
  platform: {
    externalId: string;
    url: string;
    platform: "youtube";
  };
  title: string;
} => {
  if (data.author_name) {
    return {
      creator: {
        name: data.author_name,
      },
      platform: {
        url: data.author_url,
        platform: "youtube",
        externalId: data.author_url.replace("https://www.youtube.com/", ""),
      },
      title: data.title,
    };
  } else {
    throw new Error("no author_url");
  }
};

export const getMetadataFromNoembed = async (videoId: string) => {
  const url = getNoembedMetaDataUrl(getYoutubeUrl(videoId));
  const response = await get(url);
  return extractMeta(response);
};
