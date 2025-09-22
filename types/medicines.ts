import type { MedicineForms } from "@/constants/medicines";

export interface NewMedicine {
  title: string;
  form: MedicineForms;
  settings: {
    dose: number;
  };
}

export interface Medicine extends NewMedicine {
  id: number;
}
