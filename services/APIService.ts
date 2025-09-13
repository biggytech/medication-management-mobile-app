import { isSuccessfulStatus } from "@/utils/api/isSuccessfulStatus";
import { showError } from "@/utils/ui/showError";
import { getApiErrorText } from "@/utils/api/getApiErrorText";
import { getErrorMessage } from "@/utils/api/getErrorMessage";
import { AuthService } from "@/services/auth/AuthService";

enum Methods {
  GET = "GET",
  POST = "POST",
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
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    requiresAuth?: boolean;
  }): Promise<T> {
    const { method, url, params, body, requiresAuth = true } = options;

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
        body: body ? JSON.stringify(body) : null,
      });

      if (isSuccessfulStatus(response)) {
        const json = await response.json();
        console.log(`response - ${JSON.stringify(json)}`);
        return json;
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
}
