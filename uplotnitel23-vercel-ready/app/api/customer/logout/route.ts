import { destroyCustomerSession, requestIsSameOrigin } from "../../../customer-auth";

export async function POST(request: Request) {
  if (!requestIsSameOrigin(request)) return Response.json({ error: "Недопустимый источник запроса" }, { status: 403 });
  const cookie = await destroyCustomerSession();
  return new Response(null, { status: 303, headers: { location: "/account", "set-cookie": cookie, "cache-control": "no-store" } });
}
