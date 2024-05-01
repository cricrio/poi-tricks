import { SUPABASE_URL } from "~/utils";

interface Props {
  src: string;
  name: string;
  className?: string;
}

const bucket = `${SUPABASE_URL}/storage/v1/object/public/preview/`;

export const PreviewImage: React.FC<Props> = (props: Props) => {
  const { src, name, className } = props;
  const previewAlt = `Preview of ${name}`;
  return (
    <img
      src={bucket + src}
      alt={previewAlt}
      className={className}
      width={453}
      height={270}
    />
  );
};
