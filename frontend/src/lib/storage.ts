import type { User } from "../types";

const TOKEN_KEY = "pratech_token";
const USER_KEY = "pratech_user";

export function getStoredSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const userValue = localStorage.getItem(USER_KEY);

  if (!token || !userValue) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(userValue) as User,
    };
  } catch {
    clearStoredSession();
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
