export interface ICheckboxProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  style?: React.CSSProperties;
}
