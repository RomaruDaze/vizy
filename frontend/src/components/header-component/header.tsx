import React, { useState } from "react";
import "./header.styles.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <button
        className={`menu-button ${isOpen ? "open" : ""}`}
        onClick={handleClick}
        aria-label="Toggle menu"
      >
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </header>
  );
};

export default Header;
