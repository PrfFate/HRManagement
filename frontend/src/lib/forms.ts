import { ApiError } from "./api";

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Beklenmeyen bir hata oluştu.";
}

export function getFieldErrors(error: unknown) {
  if (error instanceof ApiError) {
    return error.errors ?? {};
  }

  return {};
}
