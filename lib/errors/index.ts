export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "NO_VIABLE_MATCH"
  | "INVALID_TRANSITION"
  | "INTERNAL";

export interface AppError {
  code: AppErrorCode;
  message: string;
  details?: string[];
}

export function validationError(message: string, details: string[] = []): AppError {
  return { code: "VALIDATION_ERROR", message, details };
}

export function isAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "code" in e && "message" in e;
}
