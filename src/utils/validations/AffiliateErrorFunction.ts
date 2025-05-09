export function isSequelizeValidationError(
  error: unknown
): error is { name: string; errors: { message: string }[] } {
  return (
    (error as any)?.name === "SequelizeValidationError" &&
    Array.isArray((error as any)?.errors)
  );
}
