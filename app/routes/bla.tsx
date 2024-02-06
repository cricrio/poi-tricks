import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireUserLoader } from "~/modules/user/loader.server";

export const loader = requireUserLoader(() => json({ message: "Hello world" }));

export default function MyPage() {
    const data = useLoaderData<typeof loader>();
    return (
        <div>
            nenenne
            {JSON.stringify(data)}
        </div>
    );
}
