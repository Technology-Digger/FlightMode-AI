import { API_BASE_URL } from "@/constants/app";

/**
 * HTTP client for the FastAPI AI gateway.
 *
 * All frontend service calls go through apiRequest, which handles
 * Content-Type headers and error normalization.
 */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  baseUrl: string = API_BASE_URL,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

