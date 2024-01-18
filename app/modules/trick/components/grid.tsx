interface Props {
	children?: React.ReactElement[];
}

export const Grid: React.FC<Props> = ({ children }) => (
	<div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
		{children}
	</div>
);
