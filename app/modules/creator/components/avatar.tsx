interface Props {
  src: string;
  name: string;
  width?: string;
}

export const Avatar: React.FC<Props> = (props: Props) => {
  const { src, name, width = 'w-12' } = props;

  return (
    <div className={width}>
      <img className='rounded-full' src={src} alt={name} />
    </div>
  );
};
