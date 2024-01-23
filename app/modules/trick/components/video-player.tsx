type Props = {
	src: string;
};
export function VideoPlayer({ src }: Props) {
	return (
		<video controls className="aspect-video w-full max-w-2xl">
			<source src={src} />
		</video>
	);
}
