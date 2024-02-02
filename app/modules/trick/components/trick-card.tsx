import type { Creator, Trick } from "@prisma/client";
import { Link } from "@remix-run/react";

import type { Tag } from "~/database";
import { CreatorGroup } from "~/modules/creator";
import { Badge } from "~/modules/ui/badge";
import { Card, CardHeader, CardTitle } from "~/modules/ui/card";
import { ROUTES } from "~/routes";

import { PreviewImage } from "./preview-image";

type Props = Pick<Trick, "id" | "name" | "preview" | "difficulty"> & {
    tags: Array<Tag>;
    prerequisites: Array<Trick>;
    creators: Array<Pick<Creator, "id" | "name" | "picture">>;
    children: React.ReactNode;
};

export const TrickCard: React.FC<Props> = (props: Props) => {
    const { name, id, preview, difficulty, tags, creators, children } = props;

    return (
        <Card>
            <figure className="overflow-hidden rounded-t-xl">
                <Link to={ROUTES.trick({ id })} className="flex-1">
                    {
                        //quick fix add a default image if no image
                        preview && (
                            <PreviewImage
                                src={preview}
                                name={name}
                                className="aspect-video w-full max-w-2xl"
                            />
                        )
                    }
                </Link>
            </figure>
            <CardHeader>
                <div className="flex justify-between">
                    <CreatorGroup creators={creators} />
                    {children}
                </div>
                <Link to={ROUTES.trick({ id })}>
                    <CardTitle className="py-3">{name}</CardTitle>
                </Link>
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-sky-400  normal-case text-white">
                        {difficulty}
                    </Badge>
                    {tags &&
                        tags.length > 0 &&
                        tags.map((tag) => (
                            <Badge
                                className="bg-fuchsia-500 text-white"
                                key={tag.id}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                </div>
            </CardHeader>
        </Card>
    );
};
