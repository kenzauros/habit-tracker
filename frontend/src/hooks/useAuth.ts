import { useCallback, useEffect, useState } from "react";
import type { User } from "../data/types";
import type { AuthResult } from "../data/authApi";
import { fetchMe, login as loginApi, register as registerApi } from "../data/authApi";
import { clearToken, getToken, setToken } from "../data/tokenStorage";

export type AuthStatus = "loading" | "anonymous" | "authenticated";

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setStatus("anonymous");
      return;
    }
    fetchMe().then((result) => {
      if (result.ok) {
        setUser(result.data);
        setStatus("authenticated");
      } else {
        clearToken();
        setStatus("anonymous");
      }
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResult<string>> => {
    const result = await loginApi(email, password);
    if (result.ok) await hydrateAfterAuth(result.data, setUser, setStatus);
    return result;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<AuthResult<string>> => {
    const result = await registerApi(email, password);
    if (result.ok) await hydrateAfterAuth(result.data, setUser, setStatus);
    return result;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("anonymous");
  }, []);

  return { status, user, login, register, logout };
}

async function hydrateAfterAuth(
  token: string,
  setUser: (user: User) => void,
  setStatus: (status: AuthStatus) => void,
): Promise<void> {
  setToken(token);
  const me = await fetchMe();
  if (me.ok) {
    setUser(me.data);
    setStatus("authenticated");
  }
}
