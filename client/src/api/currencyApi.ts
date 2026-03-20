import axios from "axios";

export const saveCurrency = async (currency: string, token: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/user/currency`,
    { currency },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
