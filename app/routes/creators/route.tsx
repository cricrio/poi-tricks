import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { CreatorGrid, CreatorCard } from "~/modules/creator";
import { Header, Main } from "~/modules/ui";

import { getCreators } from "./queries";

export async function loader() {
    const creators = await getCreators();
    return json({ creators });
}

export default function CreatorsPage() {
    const { creators } = useLoaderData<typeof loader>();
    return (
        <Main>
            <Header>Creators ({creators.length})</Header>
            <CreatorGrid>
                {creators.map((creator) => (
                    <CreatorCard key={creator.id} {...creator} />
                ))}
            </CreatorGrid>
        </Main>
    );
}
