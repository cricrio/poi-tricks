import { readdir, writeFile } from "node:fs/promises";

import { nanoid } from "nanoid";

import { addBioAndPicture } from "./creator/addBioAndPicture.js";
import { getCreatorFromTricks } from "./creator/getCreatorFromTricks.js";
import extractMetaDataFromCSV from "./extract-meta.js";
import { addCreatorTricks } from "./getCreator.js";
import { parseTrick } from "./parser.js";
import markdowReader from "./reader.js";

const notionArchivePath =
    "/Users/christopher/DEV/learn-poi/importer/archive/database";
const csvPath =
    "/Users/christopher/DEV/learn-poi/importer/archive/Poi Trick Tutorials Database ee20b1713b3f446a9322e0e68c4c75d5_all.csv";

const ignoreFiles = [
    "Trick Name Here 1ec31ff3364b4ff7824f23704abe8388.md",
    "Antibrids f0d4b2644b1b48cbbf2ade108677e3ef.md",
];

const readDirectory = async (path) => {
    const files = await readdir(path, { withFileTypes: true });
    return files.filter(
        (file) =>
            file.isFile() &&
            file.name.includes(".md") &&
            !ignoreFiles.includes(file.name),
    );
};

const getName = ({ name, path }) => {
    const id = name.slice(-35, -3);
    const trickName = name.split(" ").slice(0, -1).join(" ");
    return {
        path: `${path}/${name}`,
        name: trickName,
        id,
    };
};

const main = async () => {
    const files = await readDirectory(notionArchivePath);
    const errors = [];
    const tricks = [];
    const tricksMetadata = await extractMetaDataFromCSV(csvPath);

    for (const file of files) {
        try {
            const node = getName(file);
            const reading = await markdowReader(node.path);
            const trick = parseTrick(reading);
            const tempTrick = await addCreatorTricks(trick);
            const meta = tricksMetadata.find(
                (m) =>
                    m.name.trim() == node.name.trim() ||
                    m.name === trick.name.trim(),
            );

            tricks.push({
                ...tempTrick,
                id: `${node.name
                    .replace("'", "")
                    .replace("—", " ")
                    .replace("’", "")
                    .replace("”", "")
                    .replace("“", "")
                    .trim()
                    .split(" ")
                    .join("_")}-${nanoid(5)}`,
                notionID: node.id,
                types: meta.types,
                difficulty: meta.difficulty,
            });
        } catch (e) {
            console.log(e);
            errors.push({ file, e });
        }
    }

    const creators = await addBioAndPicture(getCreatorFromTricks(tricks));

    await writeFile("../.data/tricks.json", JSON.stringify(tricks, null, 2));
    await writeFile(
        "../.data/creators.json",
        JSON.stringify(creators, null, 2),
    );
};

main();
