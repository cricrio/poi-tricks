import type { Creator, Trick } from "@prisma/client";
import { Link } from "@remix-run/react";

import { CreatorGroup } from "~/modules/creator";
import { Badge } from "~/modules/ui/badge";
import { Card, CardHeader, CardTitle } from "~/modules/ui/card";

import { PreviewImage } from "./preview-image";

type Props = Pick<Trick, "id" | "name" | "types" | "preview" | "difficulty"> & {
	creators: Array<Pick<Creator, "id" | "name" | "picture">>;
	children: React.ReactNode;
};

export const TrickCard: React.FC<Props> = (props: Props) => {
	const { name, id, preview, difficulty, types, creators, children } = props;

	return (
		<Card>
			<figure className="overflow-hidden rounded-t-xl">
				<Link to={`/tricks/${id}`} className="flex-1">
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
				<Link to={`/tricks/${id}`}>
					<CardTitle className="py-3">{name}</CardTitle>
				</Link>
				<div className="flex flex-wrap gap-2">
					<Badge className="bg-sky-400 capitalize text-white">
						{difficulty}
					</Badge>
					{types &&
						types.length > 0 &&
						types.map((type) => (
							<Badge
								className="bg-fuchsia-500 text-white"
								key={type}
							>
								{type}
							</Badge>
						))}
				</div>
			</CardHeader>
		</Card>
	);
};
