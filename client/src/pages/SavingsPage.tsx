import { useEffect, useState } from "react";
import {
  getSavings,
  addSavings,
  withdrawSavings
} from "../api/savingsApi";

import { getTemplates, Template } from "../api/templateApi";

import {
  createGoal,
  getGoals,
  deleteGoal,
  updateGoal,
  Goal
} from "../api/goalApi";

const SavingsPage = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const [goals, setGoals] = useState<Goal[]>([]);

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load all data
  const loadData = async () => {
    try {
      const savings = await getSavings();
      setBalance(savings.balance);

      const goalsData = await getGoals();
      setGoals(goalsData);

      const templateData = await getTemplates();
      setTemplates(templateData);
    } catch (err: any) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Add funds
  const handleAdd = async () => {
    if (!amount) return;
    await addSavings(Number(amount));
    setAmount("");
    loadData();
  };

  // Withdraw funds
  const handleWithdraw = async () => {
    if (!amount) return;
    await withdrawSavings(Number(amount));
    setAmount("");
    loadData();
  };

  // Create or update goal
  const handleCreateGoal = async () => {
    setMessage("");
    setError("");

    if (!goalName || !goalAmount || !goalDeadline) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        await updateGoal(editingId, {
          name: goalName,
          targetAmount: Number(goalAmount),
          deadline: goalDeadline
        });

        setMessage("Goal updated successfully!");
        setEditingId(null);
      } else {
        // CREATE
        await createGoal({
          name: goalName,
          targetAmount: Number(goalAmount),
          deadline: goalDeadline
        });

        setMessage("Goal created successfully!");
      }

      // Reset form
      setGoalName("");
      setGoalAmount("");
      setGoalDeadline("");
      setSelectedTemplate("");

      loadData();
    } catch (err: any) {
      setError(err);
    }
  };

  // Template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);

    const template = templates.find((t) => t._id === value);

    if (template) {
      setGoalName(template.name);
      setGoalAmount(String(template.suggestedAmount));
    }
  };

  // Edit goal
  const handleEdit = (goal: Goal) => {
    setEditingId(goal._id);
    setGoalName(goal.name);
    setGoalAmount(String(goal.targetAmount));
    setGoalDeadline(goal.deadline?.split("T")[0]);
    setSelectedTemplate(""); // clear template
  };

  // Delete goal
  const handleDelete = async (id: string) => {
    await deleteGoal(id);
    setMessage("Goal deleted");
    loadData();
  };

  return (
    <div className="container mt-4">
      <h2>Savings Dashboard</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* BALANCE */}
      <div className="card p-3 mb-4">
        <h4>Balance: ${balance}</h4>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="btn btn-success me-2" onClick={handleAdd}>
          Add Funds
        </button>

        <button className="btn btn-warning" onClick={handleWithdraw}>
          Withdraw Funds
        </button>
      </div>

      {/* GOALS */}
      <div className="card p-3">
        <h4>Savings Goals</h4>

        {/* TEMPLATE DROPDOWN */}
        <select
          className="form-control mb-2"
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <option value="">Select Template (Optional)</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} (${t.suggestedAmount})
            </option>
          ))}
        </select>

        {/* INPUTS */}
        <input
          className="form-control mb-2"
          placeholder="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Target Amount"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={goalDeadline}
          onChange={(e) => setGoalDeadline(e.target.value)}
        />

        <button className="btn btn-primary mb-3" onClick={handleCreateGoal}>
          {editingId ? "Update Goal" : "Add Goal"}
        </button>

        {/* GOALS LIST */}
        {goals.length === 0 && <p>No goals yet.</p>}

        {goals.map((g) => (
          <div key={g._id} className="border p-2 mb-2">
            <strong>{g.name}</strong>
            <p>Amount: ${g.targetAmount}</p>
            <p>Deadline: {g.deadline?.split("T")[0]}</p>

            <button
              className="btn btn-warning me-2"
              onClick={() => handleEdit(g)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger"
              onClick={() => handleDelete(g._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsPage;
