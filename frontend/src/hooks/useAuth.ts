import { useState } from "react";
import { setToken, removeToken, loginApi, registerApi, isAuthenticated } from "../data/auth";

export type AuthError = string | null;

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated);
  const [error, setError] = useState<AuthError>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    const result = await loginApi(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    setToken(result.token);
    setAuthenticated(true);
    return true;
  }

  async function register(email: string, password: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    const result = await registerApi(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return false;
    }
    setToken(result.token);
    setAuthenticated(true);
    return true;
  }

  function logout() {
    removeToken();
    setAuthenticated(false);
  }

  return { authenticated, error, loading, login, register, logout };
}
