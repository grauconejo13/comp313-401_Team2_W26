import axios from "axios";

export const saveCurrency = async (currency: string, token: string) => {

  const res = await axios.post(
    "http://localhost:4000/api/user/currency",
    { currency },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};