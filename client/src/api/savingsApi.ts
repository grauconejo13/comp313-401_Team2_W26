import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL = `${API_BASE}/api/savings`;

export const getSavings = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addSavings = async (amount: number) => {
  const res = await axios.post(`${API_URL}/add`, { amount });
  return res.data;
};

export const withdrawSavings = async (amount: number) => {
  const res = await axios.post(`${API_URL}/withdraw`, { amount });
  return res.data;
};
