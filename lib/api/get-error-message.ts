export function getErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Something went wrong";
  }

  const message = (data as { message?: unknown }).message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === "string").join(", ");
  }

  return "Something went wrong";
}
