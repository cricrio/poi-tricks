import { exec } from "node:child_process";
import fs from "node:fs/promises";

import imagemin from "imagemin";
import webp from "imagemin-webp";

const previewDirectory = "/Users/christopher/DEV/learn-poi/importer/previews/";
const archivePath =
  "/Users/christopher/DEV/learn-poi/importer/archive/database/";

const parsePreview = async (trick) => {
  if (trick.preview) {
    return new Promise((resolve) =>
      exec(
        `gif2webp "${archivePath}${decodeURI(
          trick.preview.url,
        )}" -o "${previewDirectory}${trick.id}.webp"`,
        resolve,
      ),
    );
  }
};

export const moveAndRenamePreviews = (tricks) =>
  Promise.all(tricks.map(parsePreview));
