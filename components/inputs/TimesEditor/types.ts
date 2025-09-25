export interface TimesEditorProps {
  values: string[]; // 'HH:MM'
  onChange: (values: string[]) => void;
  min?: number;
  max?: number;
  allowDuplicates?: boolean;
  label?: string;
}
