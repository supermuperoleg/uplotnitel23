export async function POST() {
  return Response.json({ error: "Регистрация владельца недоступна в демонстрационной версии" }, { status: 503 });
}
