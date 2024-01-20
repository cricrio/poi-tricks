import { Avatar as A, AvatarFallback, AvatarImage } from "~/modules/ui/";

interface Props {
	src: string;
	name: string;
}

export const Avatar: React.FC<Props> = (props: Props) => {
	const { src, name } = props;

	return (
		<A>
			<AvatarImage src={src} />
			<AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
		</A>
	);
};
