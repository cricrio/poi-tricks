type Props = {
  value: string;
  name: string;
};
function HiddenInput({ value, name }: Props) {
  return <input name={name} value={value} type="hidden" />;
}

export { HiddenInput };
