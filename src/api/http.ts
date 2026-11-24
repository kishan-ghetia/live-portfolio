export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiErrorKind = "network" | "timeout" | "http" | "parse";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly responseBody: string | null;

  constructor(
    kind: ApiErrorKind,
    message: string,
    status: number | null = null,
    responseBody: string | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.responseBody = responseBody;
  }
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

type MethodOptions = Omit<RequestOptions, "method" | "body">;

const DEFAULT_TIMEOUT_MS = 10_000;

function parseJson(text: string): unknown {
  if (text === "") return null;
  try {
    const data: unknown = JSON.parse(text);
    return data;
  } catch {
    throw new ApiError("parse", "Response was not valid JSON");
  }
}

export async function request(url: string, options: RequestOptions = {}): Promise<unknown> {
  const { method = "GET", body, headers, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const baseHeaders: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) baseHeaders["Content-Type"] = "application/json";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: { ...baseHeaders, ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new ApiError(
        "http",
        `Request failed with status ${response.status}`,
        response.status,
        text === "" ? null : text,
      );
    }
    return parseJson(text);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) {
      throw new ApiError("timeout", `Request timed out after ${timeoutMs}ms`);
    }
    throw new ApiError("network", "Network request failed");
  } finally {
    clearTimeout(timer);
  }
}

export const http = {
  get: (url: string, options?: MethodOptions) =>
    request(url, { ...options, method: "GET" }),
  post: (url: string, body?: unknown, options?: MethodOptions) =>
    request(url, { ...options, method: "POST", body }),
  put: (url: string, body?: unknown, options?: MethodOptions) =>
    request(url, { ...options, method: "PUT", body }),
  patch: (url: string, body?: unknown, options?: MethodOptions) =>
    request(url, { ...options, method: "PATCH", body }),
  delete: (url: string, options?: MethodOptions) =>
    request(url, { ...options, method: "DELETE" }),
};
