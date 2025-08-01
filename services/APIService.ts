import { isSuccessfulStatus } from "@/utils/api/isSuccessfulStatus";
import { showError } from "@/utils/ui/showError";
import { getApiErrorText } from "@/utils/api/getApiErrorText";
import { getErrorMessage } from "@/utils/api/getErrorMessage";

enum Methods {
  GET = "GET",
  POST = "POST",
}

export class APIService {
  private static instance: APIService | null = null;
  private token: string | null = null;
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
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    requiresAuth?: boolean;
  }): Promise<T> {
    try {
      const { method, url, params, body, requiresAuth = true } = options;

      if (requiresAuth && !this.token) {
        throw new Error("Token is not set for authenticated route");
      }

      const response = await fetch(`${this.BASE_URL}${url}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: requiresAuth ? `Bearer ${this.token}` : "",
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (isSuccessfulStatus(response)) {
        return await response.json();
      }

      const error = await getErrorMessage(response);
      throw new Error(error);
    } catch (error) {
      console.error(error);
      showError(getApiErrorText(error));

      throw error;
    }
  }

  public static async login(data: { username: string; password: string }) {
    const result = await APIService.getInstance().makeRequest<{
      token: string;
      userName: string;
    }>({
      method: Methods.POST,
      url: "TODO:",
      requiresAuth: false,
    });

    // TODO: set token

    return {
      token: "token",
    };
  }

  public static async signUpOffline() {
    const result = await APIService.getInstance().makeRequest<{
      token: string;
      userName: string;
    }>({
      method: Methods.POST,
      url: "/sign-up/offline",
      requiresAuth: false,
    });

    APIService.getInstance().token = result.token;

    return result;
  }
}
