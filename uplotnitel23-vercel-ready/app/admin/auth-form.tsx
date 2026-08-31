"use client";

import { useState, type FormEvent } from "react";

export default function AdminAuthForm({ mode }: { mode: "login" | "register" }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (mode === "register" && password !== String(form.get("passwordConfirm") ?? "")) { setLoading(false); setMessage("Пароли не совпадают"); return; }
    const body = { username: String(form.get("username") ?? ""), password, ...(mode === "register" ? { setupToken: String(form.get("setupToken") ?? "") } : {}) };
    const response = await fetch(`/api/admin/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json() as { error?: string };
    setLoading(false);
    if (!response.ok) { setMessage(result.error ?? "Не удалось выполнить вход"); return; }
    window.location.assign("/admin");
  }
  return <form className="owner-auth-form" onSubmit={submit}>
    {mode === "register" && <label>Одноразовый ключ владельца<input name="setupToken" type="password" required autoComplete="one-time-code" placeholder="Ключ активации"/></label>}
    <label>Логин<input name="username" required minLength={4} maxLength={40} autoComplete="username" placeholder="Придумайте логин"/></label>
    <label>Пароль<input name="password" type="password" required minLength={12} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Не менее 12 символов"/></label>
    {mode === "register" && <label>Повторите пароль<input name="passwordConfirm" type="password" required minLength={12} maxLength={128} autoComplete="new-password"/></label>}
    <button className="admin-submit" type="submit" disabled={loading}>{loading ? "Проверяем…" : mode === "login" ? "Войти в управление →" : "Создать аккаунт владельца →"}</button>
    {message && <p className="admin-message" role="alert">{message}</p>}
  </form>;
}
