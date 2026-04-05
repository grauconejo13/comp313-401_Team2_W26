import { useEffect, useState } from "react";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  Goal
} from "../api/goalApi";

const GoalPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  //Fetch goals
  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name || !amount || !deadline) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingId) {
       
        await updateGoal(editingId, {
          name,
          targetAmount: Number(amount),
          deadline
        });

        setMessage("Goal updated successfully!");
        setEditingId(null);
      } else {
        
        await createGoal({
          name,
          targetAmount: Number(amount),
          deadline
        });

        setMessage("Goal created successfully!");
      }

      // Reset form
      setName("");
      setAmount("");
      setDeadline("");

      fetchGoals();
    } catch (err: any) {
      setError(err);
    }
  };

  //Handle edit 
  const handleEdit = (goal: Goal) => {
    setEditingId(goal._id);
    setName(goal.name);
    setAmount(String(goal.targetAmount));
    setDeadline(goal.deadline?.split("T")[0]); // fix date format
  };

  //Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      setMessage("Goal deleted successfully!");
      fetchGoals();
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Goals</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* 🔹 CREATE / UPDATE FORM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Goal Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Target Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button className="btn btn-primary">
          {editingId ? "Update Goal" : "Add Goal"}
        </button>
      </form>

      <hr />

      {/* 🔹 GOALS LIST */}
      <h4>My Goals</h4>

      {goals.length === 0 && <p>No goals yet.</p>}

      {goals.map((goal) => (
        <div key={goal._id} className="card p-3 mb-2">
          <h5>{goal.name}</h5>
          <p>Amount: ${goal.targetAmount}</p>
          <p>Deadline: {goal.deadline?.split("T")[0]}</p>

          <button
            className="btn btn-warning me-2"
            onClick={() => handleEdit(goal)}
          >
            Edit
          </button>

          <button
            className="btn btn-danger"
            onClick={() => handleDelete(goal._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default GoalPage;
