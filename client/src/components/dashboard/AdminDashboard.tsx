import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    status: "Active",
  });

  const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/stats`);
        console.log("Stats API:", `${API}/api/admin/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, [API]);

  return (
    <div
      className="container-fluid py-4 px-4"
      style={{ background: "var(--bg)" }}
    >
      <h2 className="mb-4" style={{ color: "var(--text)" }}>
        Admin Dashboard
      </h2>

      {/* 📊 STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Users", value: stats.totalUsers },
          { label: "Active Users", value: stats.activeUsers },
          { label: "Total Transactions", value: stats.totalTransactions },
          { label: "Status", value: stats.status },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm h-100 text-center p-3">
              <h6 className="text-muted">{item.label}</h6>
              <h3 className="fw-bold">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/admin/tools" className="btn btn-outline-primary">
          Open Admin Tools
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
