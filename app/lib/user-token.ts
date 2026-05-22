import { randomBytes } from "node:crypto";

const USER_TOKEN_BYTES = 18;

export function generateUserToken() {
  return randomBytes(USER_TOKEN_BYTES).toString("base64url");
}

export function isLegacySeedToken(token: string) {
  return /^test-user-\d{2}$/.test(token);
}
