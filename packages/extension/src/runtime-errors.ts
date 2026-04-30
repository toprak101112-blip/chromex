export type RuntimeMessageErrorKind = "transient-disconnect" | "host-access" | "auth-expired" | "unknown";

const TRANSIENT_DISCONNECT_PATTERNS = [
  /message channel closed before a response was received/i,
  /receiving end does not exist/i,
  /message port closed before a response was received/i,
  /extension context invalidated/i,
  /frame with id \d+ was removed/i,
  /temporarily lost (?:its )?connection to this tab/i,
];

const HOST_ACCESS_PATTERNS = [
  /cannot access contents of url/i,
  /missing host permission/i,
  /either the '<all_urls>' or 'activetab' permission is required/i,
];

const AUTH_EXPIRED_PATTERNS = [
  /access token could not be refreshed/i,
  /signed in to another account/i,
  /please sign in again/i,
];

export function classifyRuntimeMessageError(error: unknown): RuntimeMessageErrorKind {
  const message = toErrorMessage(error);
  if (TRANSIENT_DISCONNECT_PATTERNS.some((pattern) => pattern.test(message))) {
    return "transient-disconnect";
  }
  if (HOST_ACCESS_PATTERNS.some((pattern) => pattern.test(message))) {
    return "host-access";
  }
  if (AUTH_EXPIRED_PATTERNS.some((pattern) => pattern.test(message))) {
    return "auth-expired";
  }
  return "unknown";
}

export function isRetryableRuntimeMessageError(error: unknown): boolean {
  return classifyRuntimeMessageError(error) === "transient-disconnect";
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error ?? "");
}
