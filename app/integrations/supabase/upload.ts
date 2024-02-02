import type { UploadHandler } from "@remix-run/node";

import { getSupabaseAdmin } from "./client";

export const supabaseUploadHandler =
    (path: string): UploadHandler =>
    async ({ data, filename }) => {
        const supabase = getSupabaseAdmin();
        const chunks = [];
        for await (const chunk of data) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        // If there's no filename, it's a text field and we can return the value directly
        if (!filename) {
            const textDecoder = new TextDecoder();
            return textDecoder.decode(buffer);
        }
        // Otherwise, it's an image and we'll save it to Supabase
        const { data: image, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET!)
            .upload(path, buffer, { upsert: true });
        if (error || !image) {
            // TODO Add error handling
            console.log(error);
            return null;
        }
        return image.path;
    };

// Used to retrieve the image public url from Supabase
export const getImageUrl = (path: string) =>
    getSupabaseAdmin().storage.from("preview").getPublicUrl(path).data
        .publicUrl;
