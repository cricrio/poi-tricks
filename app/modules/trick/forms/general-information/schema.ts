import { z } from "zod";

import { trickDifficultyEnum } from "~/database";

const schema = z.object({
    name: z.string(),
    difficulty: z.nativeEnum(trickDifficultyEnum),
    tags: z.array(z.string()),
});

export { schema };
