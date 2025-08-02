import React from "react";
import { useNavigate } from "react-router-dom";

export interface SerializableActionButton {
  id: string;
  text: string;
  route: string;
  icon: string;
  action?: "reminder" | "document-checklist" | "default";
}

interface ActionButtonsProps {
  buttons: SerializableActionButton[];
  title?: string;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  title = "Quick Actions:",
  className = "",
}) => {
  const navigate = useNavigate();

  if (!buttons || buttons.length === 0) {
    return null;
  }

  const handleButtonClick = (button: SerializableActionButton) => {
    if (button.action === "reminder") {
      // Set a flag in localStorage
      localStorage.setItem("openReminder", "true");
      // Navigate to home
      navigate("/home");
    } else if (button.action === "document-checklist") {
      // Set a flag in localStorage for document checklist
      localStorage.setItem("openDocumentChecklist", "true");
      // Navigate to home
      navigate("/home");
    } else {
      // Default navigation
      navigate(button.route);
    }
  };

  return (
    <div className={`action-buttons-container ${className}`}>
      <p>
        <strong>{title}</strong>
      </p>
      <div className="action-buttons-grid">
        {buttons.map((button) => (
          <button
            key={button.id}
            className="action-button"
            onClick={() => handleButtonClick(button)}
          >
            <img src={button.icon} alt={button.text} />
            <span>{button.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActionButtons;
