const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
} as const;
