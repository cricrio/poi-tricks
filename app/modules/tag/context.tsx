import { createContext, useContext } from "react";

import type { Tag } from "~/database";
import type { WithChildrenProps } from "~/types";

const context = createContext<{ tags: Array<Tag> }>({ tags: [] });

export function TagProvider({
    tags,
    children,
}: { tags: Array<Tag> } & WithChildrenProps) {
    return <context.Provider value={{ tags }}>{children}</context.Provider>;
}

export function useTags() {
    const contextValue = useContext(context);
    return contextValue.tags;
}
