import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const iterations = 210_000;
const keyLength = 64;
const digest = "sha512";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
  return `pbkdf2:${iterations}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterationValue, salt, hash] = storedHash.split(":");
  if (scheme !== "pbkdf2" || !iterationValue || !salt || !hash) return false;

  const candidate = pbkdf2Sync(
    password,
    salt,
    Number(iterationValue),
    keyLength,
    digest,
  );
  const original = Buffer.from(hash, "hex");
  return original.length === candidate.length && timingSafeEqual(original, candidate);
}
