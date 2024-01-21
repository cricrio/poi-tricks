import type { Creator } from "@prisma/client";
import { Link } from "@remix-run/react";

import { Avatar } from "~/modules/creator/components/avatar";
import { AvatarGroup } from "~/modules/creator/components/avatar-group";
import { Badge } from "~/modules/ui/badge";
import { Card, CardHeader, CardTitle } from "~/modules/ui/card";

import { PreviewImage } from "./preview-image";


type CreatorProps = Pick<Creator, "id" | "name" | "picture">;

interface Props {
	id: string;
	name: string;
	preview: string | null;
	types: string[];
	creators?: Array<CreatorProps>;
	children?: React.ReactNode;
}

export const TrickCard: React.FC<Props> = (props: Props) => {
	const { name, id, preview, types, creators, children } = props;

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
					<div className="flex items-center gap-4">
						<AvatarGroup>
							{creators?.map((creator) => (
								<Avatar
									key={creator.id}
									src={creator.picture}
									name={creator.name}
									width="w-8"
								/>
							))}
						</AvatarGroup>
						<div>
							{creators?.map((creator, index) => (
								<div key={creator.id}>
									<Link
										to={`/creators/${creator.id}`}
										className="capitalize"
									>
										{creator.name}
									</Link>
									{index < creators.length - 1 && (
										<span className="mr-1">,</span>
									)}
								</div>
							))}
						</div>
					</div>
					{children}
				</div>
				<Link to={`/tricks/${id}`}>
					<CardTitle className="py-3">{name}</CardTitle>
				</Link>

				<div className="flex flex-wrap gap-2">
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
