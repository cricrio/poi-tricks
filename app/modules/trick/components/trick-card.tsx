import type { Creator } from "@prisma/client";
import { Link } from "@remix-run/react";

import { Avatar } from "~/modules/creator/components/avatar";
import { AvatarGroup } from "~/modules/creator/components/avatar-group";

import { PreviewImage } from "./preview-image";

type CreatorProps = Pick<Creator, "id" | "name" | "picture">;

interface Props {
	id: string;
	name: string;
	preview: string | null;
	types: string[];
	creators?: Array<CreatorProps>;
}

export const TrickCard: React.FC<Props> = (props: Props) => {
	const { name, id, preview, types, creators } = props;

	return (
		<div className="card card-compact border border-base-content shadow-xl">
			<figure>
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
			<div className="card-body">
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
								<>
									<Link
										to={`/creators/${creator.id}`}
										className="capitalize"
									>
										{creator.name}
									</Link>
									{index < creators.length - 1 && (
										<span className="mr-1">,</span>
									)}
								</>
							))}
						</div>
					</div>
					{/* <SelectCategory trickId={id} /> */}
				</div>
				<Link to={`/tricks/${id}`}>
					<h2 className="card-title">{name}</h2>
				</Link>

				<div className="flex flex-wrap gap-2">
					{types &&
						types.length > 0 &&
						types.map((type) => (
							<div
								className="badge badge-secondary p-3"
								key={type}
							>
								{type}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};
