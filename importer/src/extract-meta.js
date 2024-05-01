import { readFile } from "node:fs/promises";

import { parse } from "csv-parse";

const parseData = (file) =>
    new Promise((resolve, reject) => {
        parse(
            file,
            {
                columns: true,
                trim: true,
            },
            (errors, rows) => (errors ? reject(errors) : resolve(rows)),
        );
    });

const difficulties = [
    "basics",
    "beginner",
    "intermediate",
    "advanced",
    "others",
];
const getDifficulty = (difficulty) => {
    if (!difficulty) {
        return "others";
    }
    if (difficulties.includes(difficulty.toLowerCase())) {
        return difficulty.toLowerCase();
    } else {
        throw new Error(`Difficulty ${difficulty} is not supported`);
    }
};

const extractMetaDataFromCSV = async (path) => {
    const file = await readFile(path, "utf-8");

    const rows = await parseData(file);

    return Promise.all(
        rows.map(async (row) => ({
            name: row["﻿Name"],
            difficulty: getDifficulty(row["Difficulty"]),
            types: row["Type(s)"]
                .split(",")
                .filter(Boolean)
                .map((t) => t.trim().toLowerCase()),
            description: row.description,
            // tags: row.tags.map((t) => t.trim().toLowerCase()),
        })),
    );
};

export default extractMetaDataFromCSV;
