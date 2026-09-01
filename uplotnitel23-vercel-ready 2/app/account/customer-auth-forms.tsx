"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/customer/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    const result = await response.json().catch(() => ({})) as { error?: string };
    setBusy(false);
    if (!response.ok) return setMessage(result.error ?? "Не удалось выполнить запрос");
    router.refresh();
  }

  return <article id={mode}><span>{isRegister ? "Новый покупатель" : "Уже есть аккаунт"}</span><h2>{isRegister ? "Регистрация" : "Вход"}</h2><p>{isRegister ? "Укажите электронную почту и придумайте простой пароль." : "Введите почту и пароль, указанные при регистрации."}</p><form className="customer-auth-form" onSubmit={submit}><label>Электронная почта<input name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@example.ru" required/></label><label>Пароль<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={6} maxLength={72} pattern="[A-Za-z0-9]{6,72}" title="От 6 до 72 латинских букв или цифр" placeholder="Минимум 6 символов" required/></label><button type="submit" disabled={busy}>{busy ? "Подождите…" : isRegister ? "Создать аккаунт" : "Войти"}</button>{message && <p className="customer-auth-message" role="alert">{message}</p>}</form></article>;
}

export default function CustomerAuthForms() {
  return <div className="auth-grid"><AuthForm mode="login"/><AuthForm mode="register"/></div>;
}
