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
import type {
  HealthTrackerData,
  HealthTrackerFromApi,
} from "@/types/healthTrackers";
import type {
  HealthTrackingLogDataForInsert,
  HealthTrackingLogFromApi,
} from "@/types/healthTrackingLogs";
import type {
  DoctorFromApi,
  DoctorsApiResponse,
  DoctorSearchParams,
  MyDoctorsApiResponse,
} from "@/types/doctors";
import type { UserDataForEditing, UserFromApi } from "@/types/users";
import { camelCaseToSnakeCaseObject } from "@/utils/objects/camelCaseToSnakeCaseObject";
import { snakeCaseToCamelCaseObject } from "@/utils/objects/snakeCaseToCamelCaseObject";
import { yyyymmddFromDate } from "@/utils/date/yyyymmddFromDate";
import { ScheduleService } from "@/services/schedules/ScheduleService";
import { NotificationSchedulingService } from "@/services/notifications/NotificationSchedulingService";
import { prepareMedicineDataForEditing } from "@/utils/entities/medicine/prepareMedicineDataForEditing";
import type { RequiredField } from "@/utils/types/RequiredField";
import { prepareHealthTrackerDataForEditing } from "@/utils/entities/healthTrackers/prepareHealthTrackerDataForEditing";
import Constants from "expo-constants";

const { manifest } = Constants;

// const uri = `http://${manifest.debuggerHost.split(":").shift()}:4000`;
const serverUri = Constants.expoConfig?.hostUri
  ? "http://" +
    // Constants.expoConfig
    //   .hostUri!.split(":")
    //   .shift()
    "localhost".concat(`:${process.env.EXPO_PUBLIC_SERVER_PORT}`).concat("/api")
  : process.env.EXPO_PUBLIC_SERVER_BASE_URL;

// const api =
//   typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
//     ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
//     : `api.example.com`;

console.log("api", serverUri);

enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class APIService {
  private static instance: APIService | null = null;
  public BASE_URL = serverUri;

  private constructor() {}

  public static getInstance() {
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
    responseType?: "json" | "blob";
  }): Promise<T> {
    const {
      method,
      url,
      params,
      body,
      requiresAuth,
      responseType = "json",
    } = options;

    console.log(`[${method}] ${url}`, new Date());
    params && console.log(`params - ${JSON.stringify(params)}`);
    body && console.log(`body - ${JSON.stringify(body)}`);

    try {
      const token = AuthService.token;
      if (requiresAuth && !token) {
        throw new Error("Token is not set for authenticated route");
      }

      let requestURL = `${this.BASE_URL}${url}`;

      if (params) {
        requestURL =
          `${requestURL}?` +
          new URLSearchParams(params as Record<string, string>).toString();
      }

      const response = await fetch(requestURL, {
        method,
        headers: {
          Accept:
            responseType === "blob" ? "application/pdf" : "application/json",
          "Content-Type": "application/json",
          Authorization: requiresAuth ? `Bearer ${token}` : "",
        },
        body: body ? JSON.stringify(camelCaseToSnakeCaseObject(body)) : null,
      });

      if (isSuccessfulStatus(response)) {
        if (responseType === "blob") {
          const blob = await response.blob();
          const base64 = await this.blobToBase64(blob);
          return base64 as T;
        } else {
          const json = await response.json();
          console.log(`response - ${JSON.stringify(json)}`);
          return snakeCaseToCamelCaseObject(json);
        }
      }

      const error = await getErrorMessage(response);
      throw new Error(error);
    } catch (error) {
      console.log(`error - ${error}`);

      showError(getApiErrorText(error));

      throw error;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public static signIn = {
    path: "/sign-in",

    async default(data: { email: string; password: string }) {
      const result = await APIService.getInstance().makeRequest<{
        id: number;
        token: string;
        full_name: string;
        is_doctor: boolean;
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
        is_doctor: boolean;
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
        is_doctor: boolean;
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
        is_doctor: boolean;
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
      data.schedule.nextTakeDate = ScheduleService.getNextTakeDateForSchedule(
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

      medicineDataForUpdate.schedule.nextTakeDate =
        ScheduleService.getNextTakeDateForSchedule(
          medicineDataForUpdate.schedule,
          data.date,
        );

      // decrease medicine count
      if (medicineDataForUpdate.count) {
        const updatedCount = Math.max(
          0,
          medicineDataForUpdate.count - medicineDataForUpdate.schedule.dose,
        );
        medicineDataForUpdate.count = updatedCount;
      }

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

      medicineDataForUpdate.schedule.nextTakeDate =
        ScheduleService.getNextTakeDateForSchedule(
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
  };

  public static healthTrackers = {
    path: "/health-trackers",

    async create(data: HealthTrackerData) {
      data.schedule.nextTakeDate = ScheduleService.getNextTakeDateForSchedule(
        data.schedule,
      );

      const result =
        await APIService.getInstance().makeRequest<HealthTrackerFromApi>({
          method: Methods.POST,
          url: `${this.path}/add`,
          requiresAuth: true,
          body: data,
        });

      await NotificationSchedulingService.scheduleHealthTrackerNotifications(
        result,
      );

      return result;
    },

    async list() {
      const result = await APIService.getInstance().makeRequest<
        HealthTrackerFromApi[]
      >({
        method: Methods.GET,
        url: `${this.path}/list`,
        requiresAuth: true,
      });

      return result;
    },

    async getById(id: string) {
      const result =
        await APIService.getInstance().makeRequest<HealthTrackerFromApi>({
          method: Methods.GET,
          url: `${this.path}/${id}`,
          requiresAuth: true,
        });

      return result;
    },

    async update(id: number, data: HealthTrackerData) {
      const result =
        await APIService.getInstance().makeRequest<HealthTrackerFromApi>({
          method: Methods.PUT,
          url: `${this.path}/${id}`,
          requiresAuth: true,
          body: data,
        });

      await NotificationSchedulingService.scheduleHealthTrackerNotifications(
        result,
      );

      return result;
    },

    async delete(id: string) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.DELETE,
        url: `${this.path}/${id}`,
        requiresAuth: true,
      });

      return result;
    },

    async listByDate(date: Date) {
      const formattedDate = yyyymmddFromDate(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return await APIService.getInstance().makeRequest<HealthTrackerFromApi[]>(
        {
          method: Methods.GET,
          url: `${this.path}/list/by-date/${formattedDate}?timezone=${timeZone}`,
          requiresAuth: true,
        },
      );
    },
  };

  public static healthTrackingLogs = {
    path: "/health-tracker-logs",

    async record(
      healthTracker: HealthTrackerFromApi,
      data: HealthTrackingLogDataForInsert,
    ) {
      const result =
        await APIService.getInstance().makeRequest<HealthTrackingLogFromApi>({
          method: Methods.POST,
          url: `${this.path}/${healthTracker.id}/add`,
          requiresAuth: true,
          body: data,
        });

      // reschedule
      const healthTrackerDataForUpdate =
        prepareHealthTrackerDataForEditing(healthTracker);

      healthTrackerDataForUpdate.schedule.nextTakeDate =
        ScheduleService.getNextTakeDateForSchedule(
          healthTrackerDataForUpdate.schedule,
          data.date,
        );

      await APIService.healthTrackers.update(
        healthTracker.id,
        healthTrackerDataForUpdate,
      );

      return result;
    },

    async listByDate(date: Date) {
      const formattedDate = yyyymmddFromDate(date);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      return await APIService.getInstance().makeRequest<
        HealthTrackingLogFromApi[]
      >({
        method: Methods.GET,
        url: `${this.path}/list/by-date/${formattedDate}?timezone=${timeZone}`,
        requiresAuth: true,
      });
    },
  };

  public static doctors = {
    path: "/doctors",

    async list(params?: DoctorSearchParams) {
      const queryParams = params ? { name: params.name } : {};

      const result =
        await APIService.getInstance().makeRequest<DoctorsApiResponse>({
          method: Methods.GET,
          url: this.path,
          requiresAuth: true,
          params: queryParams,
        });

      return result;
    },

    async getById(id: number) {
      const result = await APIService.getInstance().makeRequest<{
        doctor: DoctorFromApi;
      }>({
        method: Methods.GET,
        url: `${this.path}/${id}`,
        requiresAuth: true,
      });

      return result.doctor;
    },
  };

  public static patients = {
    path: "/patients",

    async getMyDoctors() {
      const result =
        await APIService.getInstance().makeRequest<MyDoctorsApiResponse>({
          method: Methods.GET,
          url: `${this.path}/my-doctors`,
          requiresAuth: true,
        });

      return result;
    },

    async becomePatient(doctorId: number) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.POST,
        url: `${this.path}/become-patient`,
        requiresAuth: true,
        body: { doctorId },
      });

      return result;
    },

    async removeDoctor(doctorId: number) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.POST,
        url: `${this.path}/remove-doctor`,
        requiresAuth: true,
        body: { doctorId },
      });

      return result;
    },

    async getPatients() {
      const result = await APIService.getInstance().makeRequest<{
        patients: UserFromApi[];
      }>({
        method: Methods.GET,
        url: this.path,
        requiresAuth: true,
      });

      return result.patients;
    },
  };

  public static users = {
    path: "/users",

    async getProfile() {
      const result = await APIService.getInstance().makeRequest<UserFromApi>({
        method: Methods.GET,
        url: `${this.path}/profile`,
        requiresAuth: true,
      });

      console.log("PROFILE!!!", result);

      return result;
    },

    async updateProfile(data: UserDataForEditing) {
      const formattedData: UserDataForEditing<string> = {
        ...data,
        dateOfBirth: data.dateOfBirth
          ? yyyymmddFromDate(data.dateOfBirth)
          : null,
      };

      if (formattedData.password) {
        formattedData.isGuest = false;
      }

      const result = await APIService.getInstance().makeRequest<UserFromApi>({
        method: Methods.PUT,
        url: `${this.path}/profile`,
        requiresAuth: true,
        body: formattedData,
      });

      return result;
    },
  };

  public static patientReports = {
    path: "/patient-reports",

    async generate(params: {
      startDate: string;
      endDate: string;
      language: string;
    }) {
      const result = await APIService.getInstance().makeRequest<string>({
        method: Methods.GET,
        url: `${this.path}/generate`,
        requiresAuth: true,
        responseType: "blob",
        params: {
          start_date: params.startDate,
          end_date: params.endDate,
          language: params.language,
        },
      });

      return result;
    },

    async sendToDoctor(params: {
      startDate: string;
      endDate: string;
      language: string;
      doctorId: number;
    }) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.POST,
        url: `${this.path}/send-email`,
        requiresAuth: true,
        body: {
          start_date: params.startDate,
          end_date: params.endDate,
          language: params.language,
          doctor_id: params.doctorId,
        },
      });

      return result;
    },

    async sendToDoctorForPatient(params: {
      startDate: string;
      endDate: string;
      language: string;
      userId: number;
    }) {
      const result = await APIService.getInstance().makeRequest<{}>({
        method: Methods.POST,
        url: `${this.path}/send-to-doctor`,
        requiresAuth: true,
        body: {
          start_date: params.startDate,
          end_date: params.endDate,
          language: params.language,
          user_id: params.userId,
        },
      });

      return result;
    },
  };
}
