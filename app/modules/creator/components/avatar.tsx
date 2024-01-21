import { Avatar as A, AvatarFallback, AvatarImage } from "~/modules/ui/";

type Props = {
	src: string;
	name: string;
	size?: "sm" | "lg" | "default";
};

export const Avatar: React.FC<Props> = (props: Props) => {
	const { src, size, name } = props;

	return (
		<A size={size}>
			<AvatarImage src={src} />
			<AvatarFallback className="bg-slate-200 text-slate-800">
				{name.slice(0, 1)}
			</AvatarFallback>
		</A>
	);
};
