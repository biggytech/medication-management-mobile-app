import { isSuccessfulStatus } from "@/utils/api/isSuccessfulStatus";
import { showError } from "@/utils/ui/showError";
import { getApiErrorText } from "@/utils/api/getApiErrorText";
import { getErrorMessage } from "@/utils/api/getErrorMessage";
import { AuthService } from "@/services/auth/AuthService";
import type { MedicineData, MedicineFromApi } from "@/types/medicines";
import type {
  MedicationLogDataForInsert,
  MedicationLogFromApi,
} from "@/types/medicationLogs";
import { camelCaseToSnakeCaseObject } from "@/utils/objects/camelCaseToSnakeCaseObject";
import { snakeCaseToCamelCaseObject } from "@/utils/objects/snakeCaseToCamelCaseObject";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import { ScheduleService } from "@/services/schedules/ScheduleService";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { prepareMedicineDataForEditing } from "@/utils/entities/medicine/prepareMedicineDataForEditing";
import type { RequiredField } from "@/utils/types/RequiredField";

enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class APIService {
  private static instance: APIService | null = null;
  private BASE_URL = process.env.EXPO_PUBLIC_SERVER_BASE_URL!;

  private constructor() {}

  private static getInstance() {
    if (APIService.instance === null) {
      APIService.instance = new APIService();
    }

    return APIService.instance;
  }

  private async makeRequest<T>(options: {
    method: Methods;
    url: string;
    params?: object;
    body?: object;
    requiresAuth: boolean;
  }): Promise<T> {
    const { method, url, params, body, requiresAuth } = options;

    console.log(`[${method}] ${url}`, new Date());
    params && console.log(`params - ${JSON.stringify(params)}`);
    body && console.log(`body - ${JSON.stringify(body)}`);

    try {
      const token = AuthService.token;
      if (requiresAuth && !token) {
        throw new Error("Token is not set for authenticated route");
      }

      const response = await fetch(`${this.BASE_URL}${url}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: requiresAuth ? `Bearer ${token}` : "",
        },
        body: body ? JSON.stringify(camelCaseToSnakeCaseObject(body)) : null,
      });

      if (isSuccessfulStatus(response)) {
        const json = await response.json();
        console.log(`response - ${JSON.stringify(json)}`);
        return snakeCaseToCamelCaseObject(json);
      }

      const error = await getErrorMessage(response);
      throw new Error(error);
    } catch (error) {
      console.log(`error - ${error}`);

      showError(getApiErrorText(error));

      throw error;
    }
  }

  public static signIn = {
    path: "/sign-in",

    async default(data: { email: string; password: string }) {
      const result = await APIService.getInstance().makeRequest<{
        id: number;
        token: string;
        full_name: string;
      }>({
        method: Methods.POST,
        url: `${this.path}/default`,
        requiresAuth: false,
        body: data,
      });

      return result;
    },
  };

  public static signUp = {
    path: "/sign-up",

    async anonymous() {
      const result = await APIService.getInstance().makeRequest<{
        id: number;
        token: string;
        full_name: string;
      }>({
        method: Methods.POST,
        url: `${this.path}/anonymous`,
        requiresAuth: false,
      });

      return result;
    },

    async anonymousFinish(data: {
      full_name: string;
      email: string;
      password: string;
    }) {
      const result = await APIService.getInstance().makeRequest<{
        id: number;
        token: string;
        full_name: string;
      }>({
        method: Methods.POST,
        url: `${this.path}/anonymous/finish`,
        requiresAuth: true,
        body: data,
      });

      return result;
    },

    async default(data: {
      full_name: string;
      email: string;
      password: string;
    }) {
      const result = await APIService.getInstance().makeRequest<{
        id: number;
        token: string;
        full_name: string;
      }>({
        method: Methods.POST,
        url: `${this.path}/default`,
        requiresAuth: false,
        body: data,
      });

      return result;
    },
  };

  public static signOut = {
    path: "/sign-out",

    async anonymous() {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.POST,
        url: `${this.path}/anonymous`,
        requiresAuth: true,
      });

      return result;
    },
  };

  public static medicines = {
    path: "/medicines",

    async add(data: MedicineData) {
      data.schedule.nextDoseDate = ScheduleService.getNextDoseDateForSchedule(
        data.schedule,
      );

      const result =
        await APIService.getInstance().makeRequest<MedicineFromApi>({
          method: Methods.POST,
          url: `${this.path}/add`,
          requiresAuth: true,
          body: data,
        });

      await NotificationSchedulingService.scheduleMedicineNotifications(result);

      return result;
    },

    async list() {
      const result = await APIService.getInstance().makeRequest<
        MedicineFromApi[]
      >({
        method: Methods.GET,
        url: `${this.path}/list`,
        requiresAuth: true,
      });

      return result;
    },

    async listByDate(date: Date) {
      const formattedDate = yyyymmddFromDate(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return await APIService.getInstance().makeRequest<MedicineFromApi[]>({
        method: Methods.GET,
        url: `${this.path}/list/by-date/${formattedDate}?timezone=${timeZone}`,
        requiresAuth: true,
      });
    },

    async get(id: number) {
      const result =
        await APIService.getInstance().makeRequest<MedicineFromApi>({
          method: Methods.GET,
          url: `${this.path}/${id}`,
          requiresAuth: true,
        });

      return result;
    },

    async update(id: number, data: MedicineData) {
      const result =
        await APIService.getInstance().makeRequest<MedicineFromApi>({
          method: Methods.PUT,
          url: `${this.path}/${id}`,
          requiresAuth: true,
          body: data,
        });

      await NotificationSchedulingService.scheduleMedicineNotifications(result);

      return result;
    },

    async delete(id: number) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.DELETE,
        url: `${this.path}/${id}`,
        requiresAuth: true,
      });

      return result;
    },
  };

  public static medicationLogs = {
    path: "/medication-logs",

    async take(medicine: MedicineFromApi, data: MedicationLogDataForInsert) {
      const result =
        await APIService.getInstance().makeRequest<MedicationLogFromApi>({
          method: Methods.POST,
          url: `${this.path}/${medicine.id}/take`,
          requiresAuth: true,
          body: data,
        });

      // reschedule medicine
      const medicineDataForUpdate = prepareMedicineDataForEditing(medicine);

      medicineDataForUpdate.schedule.nextDoseDate =
        ScheduleService.getNextDoseDateForSchedule(
          medicineDataForUpdate.schedule,
          data.date,
        );

      await APIService.medicines.update(medicine.id, medicineDataForUpdate);

      return result;
    },

    async skip(
      medicine: MedicineFromApi,
      data: RequiredField<MedicationLogDataForInsert, "skipReason">,
    ) {
      const result =
        await APIService.getInstance().makeRequest<MedicationLogFromApi>({
          method: Methods.POST,
          url: `${this.path}/${medicine.id}/skip`,
          requiresAuth: true,
          body: data,
        });

      // reschedule medicine
      const medicineDataForUpdate = prepareMedicineDataForEditing(medicine);

      medicineDataForUpdate.schedule.nextDoseDate =
        ScheduleService.getNextDoseDateForSchedule(
          medicineDataForUpdate.schedule,
          data.date,
        );

      await APIService.medicines.update(medicine.id, medicineDataForUpdate);

      return result;
    },

    async listByDate(date: Date) {
      const formattedDate = yyyymmddFromDate(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return await APIService.getInstance().makeRequest<MedicationLogFromApi[]>(
        {
          method: Methods.GET,
          url: `${this.path}/list/by-date/${formattedDate}?timezone=${timeZone}`,
          requiresAuth: true,
        },
      );
    },
    //
    // async rescheduleDose(data: RescheduleDoseRequest) {
    //   const result = await APIService.getInstance().makeRequest<DoseRecord>({
    //     method: Methods.POST,
    //     url: `${this.path}/reschedule`,
    //     requiresAuth: true,
    //     body: data,
    //   });
    //
    //   return result;
    // },
    //
    // async cancelDose(data: CancelDoseRequest) {
    //   const result = await APIService.getInstance().makeRequest<{}>({
    //     method: Methods.DELETE,
    //     url: `${this.path}/${data.doseId}`,
    //     requiresAuth: true,
    //   });
    //
    //   return result;
    // },
  };
}
