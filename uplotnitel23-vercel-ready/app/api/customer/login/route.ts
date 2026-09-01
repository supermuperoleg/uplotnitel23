import { isValidCustomerEmail, loginCustomer, normalizeCustomerEmail, requestIsSameOrigin } from "../../../customer-auth";

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  const email = normalizeCustomerEmail(body.email ?? "");
  const password = body.password ?? "";
  if (!isValidCustomerEmail(email) || !password) return Response.json({ error: "Введите почту и пароль" }, { status: 400 });
  try {
    const session = await loginCustomer(email, password);
    return Response.json({ ok: true }, { headers: { "set-cookie": session.cookie, "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "TOO_MANY_ATTEMPTS") return Response.json({ error: "Слишком много попыток. Повторите вход через 15 минут." }, { status: 429 });
    if (error instanceof Error && error.message === "DATABASE_URL_NOT_CONFIGURED") return Response.json({ error: "База аккаунтов ещё не подключена" }, { status: 503 });
    return Response.json({ error: "Неверная почта или пароль" }, { status: 401 });
  }
}
