import axios from "axios";
import { getApiOrigin } from "../config/apiOrigin";

const API_URL = `${getApiOrigin()}/api/admin/categories`;

export type Category = {
  _id: string;
  name: string;
  type: "income" | "expense";
};

const authHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export async function getCategories(
  token: string,
  type?: "income" | "expense"
): Promise<Category[]> {
  const params = type ? { type } : undefined;
  const res = await axios.get<Category[]>(API_URL, {
    ...authHeaders(token),
    params,
  });
  return res.data;
}

export async function createCategory(
  token: string,
  payload: { name: string; type: "income" | "expense" }
): Promise<Category> {
  const res = await axios.post<Category>(API_URL, payload, authHeaders(token));
  return res.data;
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, authHeaders(token));
}
