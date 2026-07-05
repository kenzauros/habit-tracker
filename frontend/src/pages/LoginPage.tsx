import { useState } from "react";
import styles from "./LoginPage.module.css";

interface Props {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
}

export function LoginPage({ onLogin, onRegister, error, loading }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") {
      await onLogin(email, password);
    } else {
      await onRegister(email, password);
    }
  }

  const isLogin = mode === "login";
  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Habit Tracker</h1>
        <p className={styles.subtitle}>{isLogin ? "アカウントにログイン" : "新規アカウント登録"}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              autoComplete={isLogin ? "email" : "username"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            {loading ? "処理中…" : isLogin ? "ログイン" : "登録"}
          </button>
        </form>

        <div className={styles.toggle}>
          {isLogin ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
          <button
            type="button"
            onClick={() => setMode(isLogin ? "register" : "login")}
            disabled={loading}
          >
            {isLogin ? "新規登録" : "ログイン"}
          </button>
        </div>
      </div>
    </div>
  );
}
