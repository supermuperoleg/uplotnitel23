export async function DELETE() {
  return Response.json({ error: "Изменение каталога недоступно в демонстрационной версии" }, { status: 503 });
}
