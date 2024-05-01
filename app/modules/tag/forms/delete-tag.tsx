import type { Tag } from "@prisma/client";
import { useFetcher } from "react-router-dom";

import { Button } from "~/modules/ui";

type Props = {
  tagId: Tag["id"];
};
export function DeleteTagForm({ tagId }: Props) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form method="post">
      <input name="intent" value="delete" type="hidden" />
      <input name="id" value={tagId} type="hidden" />
      <Button type="submit" variant="outline">
        Delete
      </Button>
    </fetcher.Form>
  );
}
