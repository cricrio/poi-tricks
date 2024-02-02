import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import { TrickCard, TrickGrid, SaveTrickButton } from "~/modules/trick";
import { Header, Main } from "~/modules/ui";

import { getSavedTricks } from "./queries";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuthSession(request);
    const savedTricks = await getSavedTricks(session.userId);
    return json({ savedTricks });
}

export default function MePage() {
    const { savedTricks } = useLoaderData<typeof loader>();
    return (
        <Main>
            <Header>Saved tricks</Header>
            <TrickGrid>
                {savedTricks.map(({ category, trick }) => (
                    <TrickCard key={trick.id} {...trick}>
                        <SaveTrickButton
                            trickId={trick.id}
                            category={category}
                        />
                    </TrickCard>
                ))}
            </TrickGrid>
        </Main>
    );
}
