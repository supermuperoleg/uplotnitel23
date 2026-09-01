export async function POST() {
  return Response.json({ error: "Вход владельца недоступен в демонстрационной версии" }, { status: 503 });
}
