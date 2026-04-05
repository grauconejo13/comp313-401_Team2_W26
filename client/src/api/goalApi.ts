import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const API_URL = `${API_BASE}/api/goals`;

export interface GoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  deadline: string;
}

export interface GoalResponse {
  message: string;
  goal: Goal;
}

// Create goal
export const createGoal = async (data: GoalRequest): Promise<GoalResponse> => {
  try {
    const res = await axios.post(API_URL, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to create goal";
  }
};

// Get all goals
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to fetch goals";
  }
};

// Update goal
export const updateGoal = async (
  id: string,
  data: GoalRequest
): Promise<GoalResponse> => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to update goal";
  }
};

// Delete goal
export const deleteGoal = async (id: string): Promise<GoalResponse> => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to delete goal";
  }
};
