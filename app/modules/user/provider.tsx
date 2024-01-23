import { createContext, useContext } from "react";

import type { UserWithSavedTrick } from "./types";

const userContext = createContext<UserWithSavedTrick | null>(null);

type UserProviderProps = {
	user: UserWithSavedTrick;
	children: React.ReactNode;
};
export function UserProvider({ children, user }: UserProviderProps) {
	return <userContext.Provider value={user}>{children}</userContext.Provider>;
}

export function useUser(): UserWithSavedTrick | null {
	return useContext(userContext);
}
