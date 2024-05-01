import type { Creator } from "@prisma/client";

import type { VariantProps } from "~/modules/ui/";
import { Avatar as A, AvatarFallback, AvatarImage } from "~/modules/ui/";

type Props = Pick<Creator, "name" | "picture"> & VariantProps;

export const Avatar: React.FC<Props> = (props: Props) => {
  const { picture, size, name } = props;

  return (
    <A size={size}>
      <AvatarImage src={picture} />
      <AvatarFallback className="bg-slate-200 text-slate-800">
        {name?.slice(0, 1)}
      </AvatarFallback>
    </A>
  );
};
