import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_URL = `${API_BASE}/income`;

export interface IncomeRequest {
  amount: number;
  reason: string;
  date: string;
}

export interface Income {
  _id: string;
  amount: number;
  reason: string;
  date: string;
}

export const getIncomes = async (): Promise<Income[]> => {
  const res = await axios.get<Income[]>(API_URL);
  return Array.isArray(res.data) ? res.data : [];
};

export const addIncome = async (data: IncomeRequest) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const editIncome = async (id: string, data: IncomeRequest) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteIncome = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
