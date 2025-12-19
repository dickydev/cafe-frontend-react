import { apiFetch } from "./client";

export const loginApi = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const logoutApi = () => apiFetch("/auth/logout", { method: "POST" });

export const getMeApi = () => apiFetch("/auth/me");
