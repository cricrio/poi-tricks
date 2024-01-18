interface Props {
	children?: React.ReactElement[] | React.ReactElement;
}

export const AvatarGroup: React.FC<Props> = ({ children }: Props) => (
	<div className="avatar-group -space-x-6 rtl:space-x-reverse">
		{children}
	</div>
);
