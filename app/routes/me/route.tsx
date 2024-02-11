import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { requireAuthSession } from "~/modules/auth";
import { TrickCard, TrickGrid, SaveTrickButton } from "~/modules/trick";
import { Header, Main } from "~/modules/ui";

import { getSavedTricks, getUserDraftedTricks } from "./queries";

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await requireAuthSession(request);
    const [savedTricks, draftedTricks] = await Promise.all([
        getSavedTricks(session.userId),
        getUserDraftedTricks(session.userId),
    ]);
    return json({ savedTricks, draftedTricks });
}

export default function MePage() {
    const { savedTricks, draftedTricks } = useLoaderData<typeof loader>();
    return (
        <Main>
            {draftedTricks.length > 0 && (
                <section>
                    <Header>Drafts</Header>
                    <TrickGrid>
                        {draftedTricks.map((trick) => (
                            <TrickCard key={trick.id} {...trick}></TrickCard>
                        ))}
                    </TrickGrid>
                </section>
            )}
            <section>
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
            </section>
        </Main>
    );
}
