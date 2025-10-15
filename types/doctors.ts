export interface DoctorFromApi {
  id: number;
  userId: number;
  specialisation: string;
  placeOfWork: string;
  photoUrl: string | null;
  user: {
    id: number;
    fullName: string;
    email: string;
    isGuest: boolean;
  };
}

export interface DoctorsApiResponse {
  doctors: DoctorFromApi[];
  total: number;
}

export interface DoctorSearchParams {
  name?: string;
}
