import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const saveCurrency = async (currency: string, token: string) => {
  const res = await axios.post(
    `${API_BASE}/api/user/currency`,
    { currency },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
