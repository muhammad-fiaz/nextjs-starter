import type { ApiClientContract, RequestConfig } from "@/types/services";

import { ApiError } from "./api-error";

export class ApiClient implements ApiClientContract {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  constructor(baseUrl = "", defaultHeaders: HeadersInit = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.defaultHeaders = defaultHeaders;
  }

  private buildUrl(path: string, params?: RequestConfig["params"]): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = this.baseUrl ? `${this.baseUrl}${cleanPath}` : cleanPath;

    if (!params) return fullUrl;

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeoutMs = 15000, headers, ...init } = config;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...this.defaultHeaders,
          ...headers,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        throw new ApiError(
          `Request failed with status ${response.status}`,
          response.status,
          response.statusText || "HTTP_ERROR",
          errorData,
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new ApiError("Request timeout exceeded", 408, "TIMEOUT");
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Unknown network error",
        500,
        "NETWORK_ERROR",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  public post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
