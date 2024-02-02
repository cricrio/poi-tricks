interface Props {
    children?: React.ReactElement[] | React.ReactElement;
}

export const AvatarGroup: React.FC<Props> = ({ children }: Props) => (
    <div className="flex -space-x-1 overflow-hidden">{children}</div>
);
