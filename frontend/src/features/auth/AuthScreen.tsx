import { FormEvent, useState } from "react";

import { BrandLogo } from "../../components/BrandLogo";
import { FieldError } from "../../components/FieldError";
import { getErrorMessage, getFieldErrors } from "../../lib/forms";
import { login, register } from "../../services/authService";
import type { User } from "../../types";

type AuthMode = "login" | "register";

export function AuthScreen({ onAuthenticated }: { onAuthenticated: (token: string, user: User) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    passwordRepeat: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setFieldErrors({});

    if (mode === "register" && form.password !== form.passwordRepeat) {
      setFieldErrors({ passwordRepeat: "Şifreler eşleşmiyor." });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const response = await login({ email: form.email, password: form.password });
        onAuthenticated(response.data.token, response.data.user);
        return;
      }

      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      setMode("login");
      setMessage("Kaydınız alındı. Yönetici onayından sonra giriş yapabilirsiniz.");
    } catch (error) {
      setMessage(getErrorMessage(error));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <form className={`auth-card ${mode === "register" ? "register" : ""}`} onSubmit={handleSubmit}>
        <BrandLogo />
        {mode === "register" && (
          <label>
            <span>Ad Soyad</span>
            <input
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              placeholder="Ad ve soyadınızı giriniz"
            />
            <FieldError message={fieldErrors.fullName} />
          </label>
        )}
        <label>
          <span>E-posta</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="E-posta"
            type="email"
          />
          <FieldError message={fieldErrors.email} />
        </label>
        {mode === "register" && (
          <label>
            <span>Telefon Numarası</span>
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="+90 5xx xxx xx xx"
            />
            <FieldError message={fieldErrors.phone} />
          </label>
        )}
        <label>
          <span>Şifre</span>
          <input
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Şifre"
            type="password"
          />
          <FieldError message={fieldErrors.password} />
        </label>
        {mode === "register" && (
          <label>
            <span>Şifre Tekrar</span>
            <input
              value={form.passwordRepeat}
              onChange={(event) => setForm({ ...form, passwordRepeat: event.target.value })}
              placeholder="Şifre Tekrar"
              type="password"
            />
            <FieldError message={fieldErrors.passwordRepeat} />
          </label>
        )}
        {message && <p className="form-message">{message}</p>}
        <button className="primary-button" disabled={isSubmitting} type="submit">
          {mode === "login" ? "Giriş Yap" : "Kaydol"}
        </button>
        <p className="auth-switch">
          {mode === "login" ? "Hesabınız yok mu?" : "Zaten hesabın var mı?"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMessage("");
              setFieldErrors({});
            }}
          >
            {mode === "login" ? "hemen kaydol." : "Giriş yap."}
          </button>
        </p>
      </form>
    </main>
  );
}
