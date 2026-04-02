import axios from "axios";
import type { DashboardSummary } from "../types/dashboard.types";

const API_URL = `${import.meta.env.VITE_API_URL}/dashboard/summary`;

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || localStorage.getItem("clearpath_token")}`,
  },
});

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await axios.get<DashboardSummary>(API_URL, getAuthHeaders());
  return response.data;
};
