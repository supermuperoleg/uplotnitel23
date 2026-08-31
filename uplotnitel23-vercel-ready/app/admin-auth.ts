import { cookies } from "next/headers";

type RuntimeEnv = { ADMIN_SESSION_SECRET?: string; ADMIN_SETUP_TOKEN?: string };
type AdminSession = { username: string; expiresAt: number };

const COOKIE_NAME = "u23_admin_session";
const SESSION_SECONDS = 12 * 60 * 60;
const encoder = new TextEncoder();

function runtimeEnv(): RuntimeEnv {
  return {
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    ADMIN_SETUP_TOKEN: process.env.ADMIN_SETUP_TOKEN,
  };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySession(store.get(COOKIE_NAME)?.value ?? "");
}

export async function createAdminSessionCookie(username: string) {
  const secret = runtimeEnv().ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const expiresAt = Date.now() + SESSION_SECONDS * 1000;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ username, expiresAt })));
  const signature = await sign(payload, secret);
  return `${COOKIE_NAME}=${payload}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function hashPassword(password: string, salt = crypto.getRandomValues(new Uint8Array(24))) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 210_000 }, key, 256);
  return { hash: toBase64Url(new Uint8Array(derived)), salt: toBase64Url(salt) };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string) {
  const result = await hashPassword(password, fromBase64Url(salt));
  return secureEqual(result.hash, expectedHash);
}

export function validUsername(username: string) { return /^[a-zA-Z0-9._-]{4,40}$/.test(username); }
export function normalizeUsername(username: string) { return username.trim().toLowerCase(); }

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}

export function verifySetupToken(value: string) {
  const expected = runtimeEnv().ADMIN_SETUP_TOKEN ?? "";
  return expected.length >= 24 && secureEqual(value.trim(), expected);
}

export async function hashAttemptKey(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return toBase64Url(new Uint8Array(digest));
}

async function verifySession(token: string): Promise<AdminSession | null> {
  const secret = runtimeEnv().ADMIN_SESSION_SECRET;
  const [payload, signature, ...rest] = token.split(".");
  if (!secret || !payload || !signature || rest.length) return null;
  const expected = await sign(payload, secret);
  if (!secureEqual(signature, expected)) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as Partial<AdminSession>;
    if (typeof parsed.username !== "string" || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) return null;
    return { username: parsed.username, expiresAt: parsed.expiresAt };
  } catch { return null; }
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

function secureEqual(left: string, right: string) {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  return difference === 0;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
