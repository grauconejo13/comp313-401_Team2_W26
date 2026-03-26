import { useState, useEffect } from "react";
import {
  addExpense,
  getExpenses,
  deleteExpense,
} from "../api/expenseApi";

const categories = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other",
];

const classifications = ["Necessary", "Avoidable"] as const;

const ExpensePage = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [classification, setClassification] = useState("");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [expenses, setExpenses] = useState<any[]>([]);

  //Load expenses on page load
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to load expenses", err);
    }
  };

  //Add expense
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!amount || !category || !classification || !reason || !date) {
      setError("All fields are required.");
      return;
    }

    try {
      await addExpense({
        amount: Number(amount),
        category,
        classification: classification as "Necessary" | "Avoidable",
        reason,
        date,
      });

      setMessage("Expense added successfully!");

      // reset form
      setAmount("");
      setCategory("");
      setClassification("");
      setReason("");
      setDate("");

      loadExpenses(); 
    } catch (err: any) {
      setError(err || "Failed to add expense.");
    }
  };

  // Delete expense
  const handleDelete = async (id: string) => {
    try {
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Expense</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="form-control mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className="form-control mb-3"
          value={classification}
          onChange={(e) => setClassification(e.target.value)}
        >
          <option value="">Select classification</option>
          {classifications.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="btn btn-primary">Add Expense</button>
      </form>

      {/*  EXPENSE LIST */}
      <h3 className="mt-4">Your Expenses</h3>

      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <ul className="list-group">
          {expenses.map((exp) => (
            <li
              key={exp._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>${exp.amount}</strong> - {exp.category} ({exp.classification})
                <br />
                <small>
                  {exp.reason} |{" "}
                  {new Date(exp.date).toLocaleDateString()}
                </small>
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(exp._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpensePage;
