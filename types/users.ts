import { IdableEntity } from "@/types/common/ids";
import { SexTypes } from "@/constants/users";

export interface UserData<DateType = Date> {
  full_name: string;
  is_guest: boolean;
  email: string;
  sex: SexTypes | null;
  date_of_birth: DateType | null;
}

export interface UserDataWithPassword<DateType = Date>
  extends UserData<DateType> {
  password: string;
}

export interface UserDataWithId<DateType = Date>
  extends UserData<DateType>,
    IdableEntity {
  uuid: string;
}

export type UserFromApi = UserDataWithId<string>;
