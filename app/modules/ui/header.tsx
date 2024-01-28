interface Props {
	to?: string;
	children: React.ReactNode;
}

export const Header: React.FC<Props> = (props: Props) => {
	const { to: href, children } = props;
	const h2 = <h2 className="pb-1 text-2xl capitalize">{children}</h2>;
	return (
		<header className="mb-4 flex items-center justify-between">
			{href ? (
				<>
					<a
						className="hover:border-primary-content border-b border-transparent"
						href={href}
					>
						{h2}
					</a>
					<a
						className="hover:border-primary-content border-b border-transparent pb-1 uppercase"
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
