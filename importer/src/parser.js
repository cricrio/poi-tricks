const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

const getId = (s) => s.slice(-32);

const formatPreriquisites = (node) => ({
  ...node,
  prerequisites: node.prerequisites.map(getId),
});

const parseVideo = (url) => {
  const longUrl = "https://www.youtube.com/watch";
  if (url.includes(longUrl)) {
    const urlParams = new URLSearchParams(url.replace(longUrl, ""));

    return { source: "youtube", externalId: urlParams.get("v") };
  }
  if (url.includes("youtu.be/")) {
    return {
      source: "youtube",
      externalId: url.replace("https://youtu.be/", "").split("?")[0],
    };
  }
  return { source: "other", externalId: url };
};

const ignoreYoutubePlaylists = (url) => !url.includes("youtube.com/playlist");
const parseVideos = (node) => ({
  ...node,
  videos: node.videos.filter(ignoreYoutubePlaylists).map(parseVideo),
});

const parseNode = (node) => pipe(parseVideos, formatPreriquisites)(node);

export const getName = ({ children }) => {
  const title = children
    .find((child) => child.type === "heading" && child.depth === 1)
    ?.children?.find((child) => child.type === "text")
    ?.value?.trim();

  return title;
};

const isSectionTitle = (child) => child.type === "heading" && child.depth === 2;

export const getSectionByTitles = (titles) => (children) => {
  let inSection = false,
    done = false,
    index = 0;
  const content = [];
  while (!done && index < children.length) {
    const child = children[index];

    if (
      isSectionTitle(child) &&
      child.children.some((c) => c.type === "text" && titles.includes(c.value))
    ) {
      inSection = true;
    } else if (inSection) {
      if (isSectionTitle(child)) {
        done = true;
      } else {
        content.push(child);
      }
    }
    index++;
  }

  return content;
};

const concactChildren = (children) =>
  children.map((child) => child.children).flat();

const getImage = (children) => {
  const node = children.find((child) => child.type === "image");
  return node
    ? {
        url: node.url,
        alt: node.alt,
      }
    : null;
};

export const getPreview = ({ children }) =>
  pipe(
    getSectionByTitles(["Preview", "Quick Look"]),
    concactChildren,
    getImage,
  )(children);

const getList = (children) => children.filter((child) => child.type === "list");

const parseLink = (children) =>
  children
    .filter((child) => child.type === "link")
    .map((child) => ({ url: child.url, title: child.title }))
    .map((child) => child.url);

const removeExtension = (urls) => urls.map((url) => url.replace(".md", ""));
export const getPrerequisites = ({ children }) =>
  pipe(
    getSectionByTitles(["Prerequisites"]),
    getList,
    concactChildren,
    concactChildren,
    concactChildren,
    parseLink,
    removeExtension,
  )(children);

const getVideoUrls = (children) =>
  children.filter((child) => child.type === "link").map((child) => child.url);

export const getVideos = ({ children }) =>
  pipe(
    getSectionByTitles(["Tutorial Video"]),
    concactChildren,
    getVideoUrls,
  )(children);

export const parseTrick = (page) => {
  const name = getName(page);
  const videos = getVideos(page);
  const preview = getPreview(page);
  const prerequisites = getPrerequisites(page);

  return parseNode({
    name,
    videos,
    preview,
    prerequisites,
  });
};
