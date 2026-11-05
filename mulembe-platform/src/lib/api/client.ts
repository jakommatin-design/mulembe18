import { z } from "zod";

export class ApiClientError extends Error {
  code: string;
  status: number;
  details?: Array<{ field?: string; message: string }>;

  constructor(
    code: string,
    message: string,
    status = 400,
    details?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions<T = unknown> extends RequestInit {
  schema?: z.ZodType<T>;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseUrl = "/api/v1";

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, options: RequestOptions<T> = {}): Promise<ApiResponse<T>> {
    const { schema, params, headers, ...customConfig } = options;

    const url = this.buildUrl(endpoint, params);

    const config: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...customConfig,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        throw err;
      }
      throw new ApiClientError(
        "NETWORK_ERROR",
        err instanceof Error ? err.message : "Network connection failed",
        0
      );
    }

    let payload: { success?: boolean; data?: unknown; error?: { code: string; message: string; details?: Array<{ field?: string; message: string }> }; meta?: ApiResponse<T>["meta"] };
    try {
      payload = await response.json();
    } catch {
      throw new ApiClientError("PARSE_ERROR", "Failed to parse JSON response", response.status);
    }

    if (!response.ok || payload.success === false) {
      const err = payload.error;
      throw new ApiClientError(
        err?.code || "REQUEST_FAILED",
        err?.message || `Request failed with status ${response.status}`,
        response.status,
        err?.details
      );
    }

    if (schema && payload.data !== undefined) {
      const parsed = schema.safeParse(payload.data);
      if (!parsed.success) {
        throw new ApiClientError(
          "VALIDATION_FAILED",
          "Response payload did not match expected schema",
          response.status,
          parsed.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }))
        );
      }
      return { success: true, data: parsed.data, meta: payload.meta };
    }

    return { success: true, data: payload.data as T, meta: payload.meta };
  }

  // Convenience methods
  get<T>(endpoint: string, options?: Omit<RequestOptions<T>, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions<T>, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions<T>, "method" | "body">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions<T>, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient();
export const apiClient = api;

