import React from "react";

import type { Video } from "@prisma/client";
import { useFetcher, useParams } from "@remix-run/react";

import { HiddenInput } from "~/modules/form/hidden-input";
import { YoutubeEmbed } from "~/modules/trick/components/youtube-embed";
import { Button, Input } from "~/modules/ui";
import { RESSOURCES } from "~/routes";

interface Props {
    videos: Array<Video>;
}

function VideosForm({ videos = [] }: Props) {
    const { trickId } = useParams();
    const fetcher = useFetcher();
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (fetcher.state === "submitting") {
            if (ref.current) {
                ref.current.value = "";
            }
        }
    }, [fetcher.state]);

    if (!trickId) {
        return null;
    }

    return (
        <div className="space-y-2">
            <fetcher.Form
                className="flex space-x-2"
                method="post"
                action={RESSOURCES.trick({ id: trickId }).addVideo}
                onSubmit={() => {}}
            >
                <HiddenInput name="intent" value="connect" />
                <Input
                    placeholder="https://youtube.com/"
                    name="externalId"
                    ref={ref}
                />
                <Button type="submit">Add video</Button>
            </fetcher.Form>
            {videos.map((v) => (
                <YoutubeEmbed externalId={v.externalId} key={v.externalId} />
            ))}
        </div>
    );
}

export { VideosForm };
