export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationConfig {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
}

export interface DerivedConfig {
  parents: string[]; // field ids
  formula: string; // JS expression using 'values' object, e.g. values['f1'] + ' - ' + values['f2']
}

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  options?: string[]; // for select/radio/checkbox
  defaultValue?: any;
  validation?: ValidationConfig;
  derived?: DerivedConfig | null;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldConfig[];
}
