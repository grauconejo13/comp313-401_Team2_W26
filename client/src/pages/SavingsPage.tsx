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
  const [showGoalOptions, setShowGoalOptions] = useState(false);
  const [goalMode, setGoalMode] = useState<"template" | "manual" | "">("");

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalDeadline, setGoalDeadline] = useState("");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [selectedTemplateData, setSelectedTemplateData] = useState<any>(null);
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);

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
    } catch {
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

  // Template handler
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);

    const template = templates.find((t) => t._id === value);

    if (template) {
      setGoalName(template.name);
      setSelectedTemplateData(template);

      const fields = template.sections.flatMap((section: any) =>
        section.fields.map((f: any) => ({
          key: f.key,
          label: f.label,
          type: f.type,
          value: ""
        }))
      );

      setDynamicFields(fields);
    }
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
        await updateGoal(editingId, {
          name: goalName,
          targetAmount: Number(goalAmount),
          deadline: goalDeadline
        });

        setMessage("Goal updated successfully!");
        setEditingId(null);
      } else {
        await createGoal({
            name: goalName,
            targetAmount: Number(goalAmount),
            deadline: goalDeadline,
            templateType: selectedTemplateData?.type || null,
            fields: dynamicFields.map((f) => ({
              key: f.key,
              value: f.value
            }))
        });
        setMessage("Goal created successfully!");
      }

      setGoalName("");
      setGoalAmount("");
      setGoalDeadline("");
      setSelectedTemplate("");
      setDynamicFields([]);
      setShowGoalOptions(false);
      setGoalMode("");

      loadData();
    } catch (err: any) {
      setError(err);
    }
  };

  // Edit goal
  const handleEdit = (goal: Goal) => {
    setEditingId(goal._id);
    setGoalName(goal.name);
    setGoalAmount(String(goal.targetAmount));
    setGoalDeadline(goal.deadline?.split("T")[0]);
    setSelectedTemplate("");
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

        {!showGoalOptions && (
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowGoalOptions(true)}
          >
            Add New Goal
          </button>
        )}

        {showGoalOptions && !goalMode && (
          <div className="mb-3">
            <button
              className="btn btn-info me-2"
              onClick={() => setGoalMode("template")}
            >
              With Template
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setGoalMode("manual")}
            >
              Without Template
            </button>
          </div>
        )}

        {/* TEMPLATE MODE */}
        {goalMode === "template" && (
          <>
            <select
              className="form-control mb-2"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* DYNAMIC FIELDS */}
            {dynamicFields.map((field, index) => (
              <div key={field.key}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  className="form-control mb-2"
                  value={field.value}
                  onChange={(e) => {
                    const updated = [...dynamicFields];
                    updated[index].value = e.target.value;
                    setDynamicFields(updated);
                  }}
                />
              </div>
            ))}

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

            <button className="btn btn-success mb-3" onClick={handleCreateGoal}>
              Create Goal
            </button>
          </>
        )}

        {/* MANUAL MODE */}
        {goalMode === "manual" && (
          <>
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

            <button className="btn btn-success mb-3" onClick={handleCreateGoal}>
              Create Goal
            </button>
          </>
        )}

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
