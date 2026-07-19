import { useState } from "react";
import type { FormEvent } from "react";
import type { AuthResult } from "../data/authApi";
import { AUTH_ERROR_MESSAGES } from "../data/authApi";

interface Props {
  onLogin: (email: string, password: string) => Promise<AuthResult<string>>;
  onRegister: (email: string, password: string) => Promise<AuthResult<string>>;
}

export function LoginForm({ onLogin, onRegister }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const action = mode === "login" ? onLogin : onRegister;
    const result = await action(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(AUTH_ERROR_MESSAGES[result.error]);
      return;
    }
    setError(null);
  }

  function toggleMode() {
    setMode((current) => (current === "login" ? "register" : "login"));
    setError(null);
  }

  return (
    <main className="app login-page">
      <h1>Habit Tracker</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="メールアドレス"
          aria-label="メールアドレス"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="パスワード"
          aria-label="パスワード"
          minLength={8}
          required
        />
        <button type="submit" disabled={submitting}>
          {mode === "login" ? "ログイン" : "登録"}
        </button>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <button type="button" className="mode-toggle-button" onClick={toggleMode}>
        {mode === "login" ? "アカウントを作成する" : "ログイン画面に戻る"}
      </button>
    </main>
  );
}
