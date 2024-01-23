import { useUser } from "../provider";
import type { UserWithSavedTrick } from "../types";

type Props = {
	notConnected: React.ReactNode;
	children: (user: UserWithSavedTrick) => React.ReactNode;
};

export function UserShield({ notConnected, children }: Props) {
	const user = useUser();
	return user ? children(user) : notConnected;
}
