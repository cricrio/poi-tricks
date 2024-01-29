import { Link } from "@remix-run/react";

import type { Creator } from "~/database";
import { Avatar, AvatarGroup } from "~/modules/user";
import { ROUTES } from "~/routes";

type Props = {
	creators: Array<Pick<Creator, "id" | "name" | "picture">>;
};

export function CreatorGroup({ creators }: Props) {
	return (
		<div className="flex items-center gap-4">
			<AvatarGroup>
				{creators?.map((creator) => (
					<Avatar key={creator.id} {...creator} />
				))}
			</AvatarGroup>
			<div>
				{creators?.map((creator, index) => (
					<div key={creator.id}>
						<Link
							to={ROUTES.creator(creator)}
							className=" normal-case"
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
	);
}
