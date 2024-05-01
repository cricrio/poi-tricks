import { useFetcher } from "@remix-run/react";
import { z } from "zod";

import type { Trick } from "~/database/types";
import { Button } from "~/modules/ui";
import { RESSOURCES } from "~/routes";
import type { action } from "~/routes/publish-trick";

const schema = z.object({
  trickId: z.string(),
});

type Props = {
  trickId: Trick["id"];
};
function PublishTrickButton({ trickId }: Props) {
  const fetcher = useFetcher<typeof action>();
  return (
    <fetcher.Form method="post" action={RESSOURCES.publishTrick}>
      <input name="trickId" value={trickId} type="hidden" />
      <Button type="submit">Publish</Button>
    </fetcher.Form>
  );
}

export { PublishTrickButton, schema };
