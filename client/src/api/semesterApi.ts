import { getApiOrigin } from "../config/apiOrigin";

const API_BASE = getApiOrigin();

export async function saveSemester(
  startDate: string,
  endDate: string,
  token: string
): Promise<{ message?: string; startDate?: string; endDate?: string }> {
  const response = await fetch(`${API_BASE}/api/semester/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      startDate,
      endDate,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!response.ok) {
    throw new Error(data.message || "Failed to save semester");
  }

  return data;
}

/** Load semester for the logged-in user (JWT). */
export async function getSemester(
  token: string | null | undefined
): Promise<{ startDate?: string | null; endDate?: string | null } | null> {
  if (!token) return null;

  const response = await fetch(`${API_BASE}/api/semester`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Semester request failed: ${response.status}`);
  }

  return response.json() as Promise<{ startDate?: string | null; endDate?: string | null }>;
}
