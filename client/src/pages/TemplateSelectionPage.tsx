import { useEffect, useState } from "react";
import { getTemplates, Template } from "../api/templateApi";
import { useNavigate } from "react-router-dom";

const TemplateSelectionPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (err: any) {
        setError(err);
      }
    };

    fetchTemplates();
  }, []);

  const handleSelect = (template: Template) => {
    navigate("/create-goal", { state: template });
  };

  return (
    <div className="container mt-4">
      <h2>Select a Savings Goal Template</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {templates.map((t) => (
        <div key={t._id} className="card p-3 mb-3">
          <h5>{t.name}</h5>
          <p>Suggested Amount: ${t.suggestedAmount}</p>

          <button
            className="btn btn-primary"
            onClick={() => handleSelect(t)}
          >
            Use Template
          </button>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelectionPage;
