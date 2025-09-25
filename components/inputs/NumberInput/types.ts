export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  error: string | null;
  onBlur?: () => void;
  label?: string;
  keyboardType?: "numeric" | "number-pad";
  inputMode?: "numeric";
}
