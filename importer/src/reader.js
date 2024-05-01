import remarkParse from "remark-parse";
import { read } from "to-vfile";
import { unified } from "unified";

const markdownReader = async (path) =>
    unified()
        .use(remarkParse)
        .parse(await read(path));

export default markdownReader;
