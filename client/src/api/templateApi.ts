import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL = `${API_BASE}/api/template`;

export interface Field {
  key: string;
  label: string;
  type: string;
}

export interface Section {
  title: string;
  key: string;
  fields: Field[];
}

export interface Template {
  _id: string;
  name: string;
  type: string;
  sections: Section[];
}

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch templates";
  }
};
