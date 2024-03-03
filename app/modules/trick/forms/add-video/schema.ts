import { z } from "zod";

//parse youtube url to get video id
const parseYoutubeUrl = z
    .string()
    .url()
    .transform((url: string, ctx: z.RefinementCtx) => {
        const longUrl = "https://www.youtube.com/watch";
        if (url.includes(longUrl)) {
            const urlParams = new URLSearchParams(url.replace(longUrl, ""));
            return urlParams.get("v") as string;
        }

        if (url.includes("youtu.be/")) {
            return url.replace("https://youtu.be/", "").split("?")[0] as string;
        }

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "We only support videos from youtube",
        });

        return z.NEVER;
    });

const schema = z.object({
    externalId: parseYoutubeUrl,
});

export { schema };
