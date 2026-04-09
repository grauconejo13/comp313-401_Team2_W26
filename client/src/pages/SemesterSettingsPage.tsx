import { useState } from "react";
import { saveSemester } from "../api/semesterApi";
import { useAuth } from "../context/AuthContext";

export default function SemesterSettingsPage() {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = async () => {
    if (!token) {
      alert("Please log in");
      return;
    }

    if (startDate > endDate) {
      alert("Start date must be before end date");
      return;
    }

    try {
      await saveSemester(startDate, endDate, token);
      alert("Semester saved");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
  };

  return (
    <div>

      <h2>Semester Settings</h2>

      <input type="date" onChange={(e)=>setStartDate(e.target.value)} />
      <input type="date" onChange={(e)=>setEndDate(e.target.value)} />

      <button onClick={handleSave}>
        Save
      </button>

    </div>
  );
}