import { env } from "@/config/env";
import { rfetch } from "./fetch-api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown | FormData;
};

function errorMessage(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (Array.isArray(value)) {
    const messages = value.map(errorMessage).filter((message): message is string => Boolean(message));
    return messages.length ? messages.join(". ") : null;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return errorMessage(record.message) ?? errorMessage(record.msg) ?? errorMessage(record.detail);
  }
  return null;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;
  const requestBody: BodyInit | undefined = options.body === undefined
    ? undefined
    : options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body);
  if (options.body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const response = await rfetch(`${env.apiUrl}${path}`, {
    ...options,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(
      errorMessage(payload) ??
        `La solicitud falló con estado ${response.status}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
