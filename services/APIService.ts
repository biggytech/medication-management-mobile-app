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

  private async makeRequest(options: {
    method: Methods;
    url: string;
    params?: Record<string, unknown>;
    body?: Record<string, unknown>;
    requiresAuth?: boolean;
  }) {
    try {
      const { method, url, params, body, requiresAuth = true } = options;

      if (requiresAuth && !this.token) {
        // TODO: handle error
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

      return await response.json();
    } catch (err) {
      if (process.env.EXPO_PUBLIC_IS_DEBUG_MODE === "true") {
        alert(err);
      }
      console.error(err);
      throw err;
    }
  }

  public static async login(data: { username: string; password: string }) {
    const result = await APIService.getInstance().makeRequest({
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
    const result = await APIService.getInstance().makeRequest({
      method: Methods.POST,
      url: "/sign-up/offline",
      requiresAuth: false,
    });

    console.log("result!!!", result);

    // TODO: set token

    return {
      token: "token",
    };
  }
}
