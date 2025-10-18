import { IdableEntity } from "@/types/common/ids";
import { SexTypes } from "@/constants/users";

export interface UserData<DateType = Date> {
  fullName: string;
  isGuest: boolean;
  email: string;
  sex: SexTypes | null;
  dateOfBirth: DateType | null;
}

export interface UserDataWithPassword<DateType = Date>
  extends UserData<DateType> {
  password: string;
}

export interface UserDataForEditing<DateType = Date>
  extends Pick<
    UserDataWithPassword<DateType>,
    "fullName" | "email" | "sex" | "dateOfBirth"
  > {
  password: string | null;
  isGuest?: false;
}

export interface UserDataWithId<DateType = Date>
  extends UserData<DateType>,
    IdableEntity {
  uuid: string;
}

export type UserFromApi = UserDataWithId<string>;
