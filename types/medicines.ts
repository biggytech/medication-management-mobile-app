import type { MedicineForms } from "@/constants/medicines";

export interface NewMedicine {
  title: string;
  form: MedicineForms;
  setting: {
    dose: number;
    endDate?: Date | null;
  };
}

export interface Medicine extends NewMedicine {
  id: number;
}
