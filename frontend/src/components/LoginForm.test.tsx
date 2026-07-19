import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";
import type { AuthResult } from "../data/authApi";

describe("LoginForm", () => {
  it("ログインに失敗すると、エラーメッセージを表示する", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn(
      async (): Promise<AuthResult<string>> => ({ ok: false, error: "invalid_credentials" }),
    );
    render(<LoginForm onLogin={onLogin} onRegister={vi.fn()} />);

    await user.type(screen.getByLabelText("メールアドレス"), "a@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(
      await screen.findByText("メールアドレスまたはパスワードが正しくありません。"),
    ).toBeInTheDocument();
    expect(onLogin).toHaveBeenCalledWith("a@example.com", "password123");
  });

  it("登録に切り替えて送信すると、onRegisterが呼ばれる", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn(async (): Promise<AuthResult<string>> => ({ ok: true, data: "token" }));
    render(<LoginForm onLogin={vi.fn()} onRegister={onRegister} />);

    await user.click(screen.getByRole("button", { name: "アカウントを作成する" }));
    await user.type(screen.getByLabelText("メールアドレス"), "new@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(onRegister).toHaveBeenCalledWith("new@example.com", "password123");
  });

  it("メール重複エラーの場合、登録済みであることを表示する", async () => {
    const user = userEvent.setup();
    const onRegister = vi.fn(
      async (): Promise<AuthResult<string>> => ({ ok: false, error: "email_taken" }),
    );
    render(<LoginForm onLogin={vi.fn()} onRegister={onRegister} />);

    await user.click(screen.getByRole("button", { name: "アカウントを作成する" }));
    await user.type(screen.getByLabelText("メールアドレス"), "dup@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(
      await screen.findByText("このメールアドレスは既に登録されています。"),
    ).toBeInTheDocument();
  });

  it("送信中は送信ボタンを無効化する", async () => {
    const user = userEvent.setup();
    let resolveLogin: (result: AuthResult<string>) => void = () => {};
    const onLogin = vi.fn(
      () =>
        new Promise<AuthResult<string>>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    render(<LoginForm onLogin={onLogin} onRegister={vi.fn()} />);

    await user.type(screen.getByLabelText("メールアドレス"), "a@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(screen.getByRole("button", { name: "ログイン" })).toBeDisabled();
    resolveLogin({ ok: true, data: "token" });
  });
});
