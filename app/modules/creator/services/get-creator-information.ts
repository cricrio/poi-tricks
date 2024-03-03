import { JSDOM } from "jsdom";

const parseMeta = (page: JSDOM, name: string) => {
    const node = page.window.document.querySelector(`meta[property="${name}"]`);

    if (node) {
        return node.getAttribute("content");
    }
};

const fetchBioAndPicture = async (youtubeChannelUrl: string) => {
    const response = await fetch(youtubeChannelUrl);
    const text = await response.text();
    const page = new JSDOM(text);

    const [picture, bio] = [
        parseMeta(page, "og:image"),
        parseMeta(page, "og:description"),
    ];

    return {
        ...(picture ? { picture } : {}),
        ...(bio ? { bio } : {}),
    };
};

export { fetchBioAndPicture };
