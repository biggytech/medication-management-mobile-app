enum Methods {
  GET = "GET",
  POST = "POST",
}

export class APIService {
  private static instance: APIService | null = null;
  private token: string | null = null;

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
    const { requiresAuth = true } = options;

    if (requiresAuth && !this.token) {
      // TODO: handle error
    }

    // TODO:
  }

  public static async login(data: { username: string; password: string }) {
    const result = APIService.getInstance().makeRequest({
      method: Methods.POST,
      url: "TODO:",
      requiresAuth: false,
    });

    // TODO: set token

    return {
      token: "token",
    };
  }
}
