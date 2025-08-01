import React from "react";
import { useNavigate } from "react-router-dom";
import "./actionbutton.styles.css";

export interface SerializableActionButton {
  id: string;
  text: string;
  route: string;
  icon: string;
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
            onClick={() => {
              navigate(button.route);
            }}
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
