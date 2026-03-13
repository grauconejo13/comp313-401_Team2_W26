import { Link } from "react-router-dom";
import Dashboard from "./DashboardPage";

function HomePage() {
  const isLoggedIn = false; // later replace with auth logic

  if (!isLoggedIn) {
    return (
      <div className="container text-center mt-5">
        <h1>Welcome to ClearPath</h1>
        <p>Track your income and expenses easily.</p>

        <Link to="/login" className="btn btn-primary m-2">
          Login
        </Link>

        <Link to="/register" className="btn btn-secondary m-2">
          Register
        </Link>
      </div>
    );
  }

  return <Dashboard />;
}

export default HomePage;