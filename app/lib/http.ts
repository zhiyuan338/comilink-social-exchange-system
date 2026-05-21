export async function readJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return null;
  }
}

export function getStringField(
  value: unknown,
  fieldName: string,
  options: { trim?: boolean } = {},
) {
  if (!value || typeof value !== "object" || !(fieldName in value)) {
    return null;
  }

  const fieldValue = (value as Record<string, unknown>)[fieldName];

  if (typeof fieldValue !== "string") {
    return null;
  }

  return options.trim === false ? fieldValue : fieldValue.trim();
}

export function getAppUrl(request: Request) {
  return (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
}
