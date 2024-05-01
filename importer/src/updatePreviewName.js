import Fs from "node:fs/promises";
import Path from "node:path";

import tricks from "../../.data/tricks.json" assert { type: "json" };

const previewPath = `../.data/previews/`;

tricks.forEach(async (trick) => {
    if (!trick.preview) return;
    const oldPath = Path.join(previewPath, `${trick.notionID}.webp`);
    const newPath = Path.join(previewPath, `${trick.id}.webp`);
    await Fs.rename(oldPath, newPath);
});
