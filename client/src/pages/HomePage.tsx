import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { token } = useAuth();
  const isLoggedIn = !!token;

  if (!isLoggedIn) {
    return (
      <div className="cp-page-hero">
        <div className="container text-center">
          <div className="cp-card-elevated text-center">
            <h1 className="cp-home-title">Welcome to ClearPath</h1>
            <p className="cp-home-lead">
              Take control of your finances. Track income, monitor expenses,
              manage debts, and plan your financial future — built for students,
              ready for real life.
            </p>
            <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
              <Link to="/login" className="btn btn-primary px-4">
                Log in
              </Link>
              <Link to="/register" className="btn btn-outline-primary px-4">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Navigate to="/dashboard" />;
}

export default HomePage;
