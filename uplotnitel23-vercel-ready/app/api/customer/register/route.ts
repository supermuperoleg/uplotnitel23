import { isValidCustomerEmail, isValidCustomerPassword, normalizeCustomerEmail, registerCustomer, requestIsSameOrigin } from "../../../customer-auth";

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  const email = normalizeCustomerEmail(body.email ?? "");
  const password = body.password ?? "";
  if (!isValidCustomerEmail(email)) return Response.json({ error: "Введите корректный адрес электронной почты" }, { status: 400 });
  if (!isValidCustomerPassword(password)) return Response.json({ error: "Пароль: от 6 до 72 латинских букв или цифр" }, { status: 400 });
  try {
    const session = await registerCustomer(email, password);
    return Response.json({ ok: true }, { status: 201, headers: { "set-cookie": session.cookie, "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") return Response.json({ error: "Эта почта уже зарегистрирована" }, { status: 409 });
    if (error instanceof Error && error.message === "DATABASE_URL_NOT_CONFIGURED") return Response.json({ error: "База аккаунтов ещё не подключена" }, { status: 503 });
    return Response.json({ error: "Не удалось зарегистрироваться. Попробуйте ещё раз." }, { status: 500 });
  }
}
