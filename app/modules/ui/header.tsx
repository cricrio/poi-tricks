interface Props {
	href?: string;
	children: React.ReactNode;
}

export const Header: React.FC<Props> = (props: Props) => {
	const { href, children } = props;
	const h2 = (
		<h2 className="pb-1 text-2xl font-bold capitalize">{children}</h2>
	);
	return (
		<header className="mb-4 flex items-center justify-between">
			{href ? (
				<>
					<a
						className="border-b border-transparent hover:border-primary-content"
						href={href}
					>
						{h2}
					</a>
					<a
						className="border-b border-transparent pb-1 uppercase hover:border-primary-content"
						href={href}
					>
						See all
					</a>
				</>
			) : (
				h2
			)}
		</header>
	);
};
