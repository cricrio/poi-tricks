interface Props {
	children: React.ReactNode;
}

export function Main({ children }: Props) {
	return (
		<main className="mx-auto min-h-full w-full max-w-7xl p-4 md:p-8 lg:p-10">
			{children}
		</main>
	);
}
