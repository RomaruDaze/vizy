import React, { useState } from "react";
import "./checklist.styles.css";

const Checklist = () => {
  const [uncheckedItems, setUncheckedItems] = useState([
    "Passport",
    "Visa Renewal Application Form",
    "Photo (30mm x 40mm)",
    "Financial Statement",
  ]);

  const [checkedItems, setCheckedItems] = useState([
    "Residence Card",
    "Enrollment Certificate",
    "University Transcript",
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isUnchecking, setIsUnchecking] = useState(false);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleCheckItem = () => {
    if (selectedItem) {
      // Remove from unchecked items
      setUncheckedItems((prev) => prev.filter((item) => item !== selectedItem));
      // Add to checked items
      setCheckedItems((prev) => [...prev, selectedItem]);
      // Set notification message
      setNotificationMessage(`${selectedItem} has been checked!`);
      setIsUnchecking(false);
      // Show notification
      setShowNotification(true);
      // Hide notification after 2 seconds
      setTimeout(() => setShowNotification(false), 2000);
      // Close modal
      handleCloseModal();
    }
  };

  const handleUncheckItem = () => {
    if (selectedItem) {
      // Remove from checked items
      setCheckedItems((prev) => prev.filter((item) => item !== selectedItem));
      // Add to unchecked items
      setUncheckedItems((prev) => [...prev, selectedItem]);
      // Set notification message
      setNotificationMessage(`${selectedItem} has been unchecked!`);
      setIsUnchecking(true);
      // Show notification
      setShowNotification(true);
      // Hide notification after 2 seconds
      setTimeout(() => setShowNotification(false), 2000);
      // Close modal
      handleCloseModal();
    }
  };

  const isItemCompleted = selectedItem
    ? checkedItems.includes(selectedItem)
    : false;

  return (
    <div className="checklist-container">
      <div className="checklist-card">
        {/* Title bar */}
        <div className="checklist-title">
          <h5>Document Checklist</h5>
        </div>

        {/* Content area */}
        <div className="checklist-content">
          {/* Unchecked items section */}
          <div className="checklist-section">
            <h6 className="section-title">Required Documents</h6>
            <ul className="document-list">
              {uncheckedItems.map((item, index) => (
                <li
                  key={`unchecked-${item}-${index}`}
                  className="document-item uncompleted"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="item-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="checklist-divider"></div>

          {/* Checked items section */}
          <div className="checklist-section">
            <h6 className="section-title">Completed Documents</h6>
            <ul className="document-list">
              {checkedItems.map((item, index) => (
                <li
                  key={`checked-${item}-${index}`}
                  className="document-item completed"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="item-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Document Details</h5>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-title-section">
                <h6>{selectedItem}</h6>
                <button className="question-button">?</button>
              </div>
              <p>Status: {isItemCompleted ? "Completed" : "Required"}</p>
              <div className="modal-buttons">
                {isItemCompleted ? (
                  <button
                    className="modal-button uncheck-button"
                    onClick={handleUncheckItem}
                  >
                    <span className="button-text">Uncheck</span>
                  </button>
                ) : (
                  <>
                    <button
                      className="modal-button not-yet-button"
                      onClick={handleCloseModal}
                    >
                      <span className="button-icon">×</span>
                      <span className="button-text">Not Yet</span>
                    </button>
                    <button
                      className="modal-button check-button"
                      onClick={handleCheckItem}
                    >
                      <span className="button-icon">✓</span>
                      <span className="button-text">Prepared</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className={`notification ${isUnchecking ? "uncheck" : ""}`}>
          <span>{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Checklist;
