import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";

import { trickDifficulties, type TrickDifficulty } from "~/database/";
import {
    NotConnectedDialog,
    TrickGrid,
    SaveTrickButton,
    TrickCard,
} from "~/modules/trick";
import { Header } from "~/modules/ui/header";
import { Main } from "~/modules/ui/main";
import type { UserWithSavedTrick } from "~/modules/user";
import { UserShield } from "~/modules/user";
import { badRequest, getRequiredParam } from "~/utils";

import { getTricksAndCountByDifficulty } from "./queries";

export async function loader({ params }: LoaderFunctionArgs) {
    const difficulty = getRequiredParam(
        params,
        "difficulty",
    ) as TrickDifficulty;

    if (!trickDifficulties.includes(difficulty)) {
        throw badRequest("Invalid difficulty");
    }
    const { tricks, count } = await getTricksAndCountByDifficulty(difficulty);

    return json({ tricks, count });
}

export default function DifficultyPage() {
    const { tricks, count } = useLoaderData<typeof loader>();
    const { difficulty } = useParams();
    return (
        <Main>
            <Header>
                {difficulty} ({count})
            </Header>
            <TrickGrid>
                {tricks.map((trick) => (
                    <TrickCard {...trick} key={trick.id}>
                        <UserShield notConnected={<NotConnectedDialog />}>
                            {(user: UserWithSavedTrick) => (
                                <SaveTrickButton
                                    category={user.savedTricks[trick.id]}
                                    trickId={trick.id}
                                />
                            )}
                        </UserShield>
                    </TrickCard>
                ))}
            </TrickGrid>
        </Main>
    );
}
