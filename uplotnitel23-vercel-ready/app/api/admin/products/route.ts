export async function POST() {
  return Response.json({ error: "Изменение каталога недоступно в демонстрационной версии" }, { status: 503 });
}
