import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { token } = useAuth();
  const isLoggedIn = !!token;

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

  return <Navigate to="/dashboard" />;
}

export default HomePage;