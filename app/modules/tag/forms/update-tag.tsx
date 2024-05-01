import type { Tag } from "@prisma/client";
import { useFetcher } from "react-router-dom";

import { Button, Input } from "~/modules/ui";

type Props = {
  tag: Pick<Tag, "name" | "id">;
  onSubmit: () => void;
  children?: React.ReactNode;
};
export function UpdateTagForm({ tag, children }: Props) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post" className="flex gap-2">
      <input name="intent" value="update" type="hidden" />
      <input name="id" value={tag.id} type="hidden" />
      <Input name="name" defaultValue={tag.name} />
      {children}
      <Button type="submit">Update</Button>
    </fetcher.Form>
  );
}
