import { apiFetch } from "./client";

export const getProductsApi = () => apiFetch("/products");
