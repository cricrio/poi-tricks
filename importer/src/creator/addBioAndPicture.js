import { JSDOM } from 'jsdom';

const parseMeta = (page, name) => {
  const node = page.window.document.querySelector(`meta[property="${name}"]`);

  if (node) {
    return node.getAttribute('content');
  }
};

const fetchBioAndPicture = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const page = new JSDOM(text);

  const [picture, bio] = [
    parseMeta(page, 'og:image'),
    parseMeta(page, 'og:description'),
  ];

  return {
    picture,
    bio,
  };
};

const getBioAndPicture = async (creator) => ({
  ...creator,
  ...(await fetchBioAndPicture(creator.url)),
});

export const addBioAndPicture = (creators) =>
  Promise.all(creators.map(getBioAndPicture));
