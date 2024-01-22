interface Props {
	children?: React.ReactElement[];
}

export const TrickGrid: React.FC<Props> = ({ children }) => (
	<div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
		{children}
	</div>
);
