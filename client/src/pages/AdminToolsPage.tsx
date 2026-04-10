import { Link } from "react-router-dom";

export default function AdminToolsPage() {
  return (
    <div className="container-fluid py-4 px-4">
      <h2 className="mb-4">Admin Tools</h2>

      <div className="row g-3">
        <div className="col-md-6">
          <Link to="/admin/categories">
            <div className="card p-4 text-center h-100 shadow-sm">
              <h5>Manage Categories</h5>
              <p className="text-muted">Control income & expense categories</p>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/admin/templates">
            <div className="card p-4 text-center h-100 shadow-sm">
              <h5>Manage Templates</h5>
              <p className="text-muted">Create financial templates</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
