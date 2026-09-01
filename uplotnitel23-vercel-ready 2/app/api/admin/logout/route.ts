import { clearAdminSessionCookie, isSameOrigin } from "../../../admin-auth";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  return Response.json({ ok: true }, { headers: { "set-cookie": clearAdminSessionCookie(), "cache-control": "no-store" } });
}
