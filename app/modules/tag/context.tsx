import { createContext, useContext } from "react";

import type { Tag } from "~/database";
import type { WithChildrenProps } from "~/types";

type PartialTag = Pick<Tag, "id" | "name">;

const context = createContext<{ tags: Array<PartialTag> } | null>(null);

export function TagProvider({
	tags,
	children,
}: { tags: Array<PartialTag> } & WithChildrenProps) {
	return <context.Provider value={{ tags }}>{children}</context.Provider>;
}

export function useTags() {
	const contextValue = useContext(context);
	return contextValue?.tags;
}
