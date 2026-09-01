import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "u23_customer_session";
const SESSION_SECONDS = 14 * 24 * 60 * 60;
let schemaReady: Promise<void> | null = null;

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL_NOT_CONFIGURED");
  return neon(connectionString);
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`CREATE TABLE IF NOT EXISTS customer_users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS customer_sessions (
        token_hash TEXT PRIMARY KEY,
        user_id BIGINT NOT NULL REFERENCES customer_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS customer_sessions_expires_idx ON customer_sessions(expires_at)`;
      await sql`CREATE TABLE IF NOT EXISTS customer_login_attempts (
        attempt_key TEXT PRIMARY KEY,
        attempts INTEGER NOT NULL,
        window_started_at TIMESTAMPTZ NOT NULL
      )`;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

export function normalizeCustomerEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidCustomerEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

export function isValidCustomerPassword(value: string) {
  return /^[A-Za-z0-9]{6,72}$/.test(value);
}

function hashPassword(password: string, salt = randomBytes(24).toString("base64url")) {
  return { salt, hash: pbkdf2Sync(password, salt, 210_000, 32, "sha256").toString("base64url") };
}

function verifyPassword(password: string, salt: string, expected: string) {
  const actual = hashPassword(password, salt).hash;
  const left = Buffer.from(actual);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

export async function registerCustomer(email: string, password: string) {
  await ensureSchema();
  const sql = getSql();
  const passwordData = hashPassword(password);
  try {
    const rows = await sql`INSERT INTO customer_users (email, password_hash, password_salt)
      VALUES (${email}, ${passwordData.hash}, ${passwordData.salt})
      RETURNING id, email` as Array<{ id: number; email: string }>;
    return createCustomerSession(rows[0].id, rows[0].email);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "23505") throw new Error("EMAIL_EXISTS");
    throw error;
  }
}

export async function loginCustomer(email: string, password: string) {
  await ensureSchema();
  const sql = getSql();
  const attemptKey = hashToken(email);
  const attempts = await sql`SELECT attempts, window_started_at FROM customer_login_attempts WHERE attempt_key = ${attemptKey}` as Array<{ attempts: number; window_started_at: string }>;
  if (attempts[0] && attempts[0].attempts >= 8 && Date.now() - new Date(attempts[0].window_started_at).getTime() < 15 * 60 * 1000) throw new Error("TOO_MANY_ATTEMPTS");
  const rows = await sql`SELECT id, email, password_hash, password_salt FROM customer_users WHERE email = ${email} LIMIT 1` as Array<{ id: number; email: string; password_hash: string; password_salt: string }>;
  const user = rows[0];
  if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
    await sql`INSERT INTO customer_login_attempts (attempt_key, attempts, window_started_at)
      VALUES (${attemptKey}, 1, NOW())
      ON CONFLICT (attempt_key) DO UPDATE SET
        attempts = CASE WHEN customer_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1 ELSE customer_login_attempts.attempts + 1 END,
        window_started_at = CASE WHEN customer_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE customer_login_attempts.window_started_at END`;
    throw new Error("INVALID_CREDENTIALS");
  }
  await sql`DELETE FROM customer_login_attempts WHERE attempt_key = ${attemptKey}`;
  return createCustomerSession(user.id, user.email);
}

async function createCustomerSession(userId: number, email: string) {
  const sql = getSql();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  await sql`DELETE FROM customer_sessions WHERE expires_at < NOW()`;
  await sql`INSERT INTO customer_sessions (token_hash, user_id, expires_at) VALUES (${hashToken(token)}, ${userId}, ${expiresAt.toISOString()})`;
  return { email, cookie: `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}` };
}

export async function getCustomerSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !process.env.DATABASE_URL) return null;
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`SELECT u.email FROM customer_sessions s JOIN customer_users u ON u.id = s.user_id WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > NOW() LIMIT 1` as Array<{ email: string }>;
  return rows[0] ?? null;
}

export async function destroyCustomerSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (token && process.env.DATABASE_URL) {
    await ensureSchema();
    await getSql()`DELETE FROM customer_sessions WHERE token_hash = ${hashToken(token)}`;
  }
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function requestIsSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
