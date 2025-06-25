import { useState } from "react";
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
  const [notifications, setNotifications] = useState<
    Array<{
      message: string;
      isUnchecking: boolean;
      id: number;
    }>
  >([]);

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
      setUncheckedItems((prev) => prev.filter((item) => item !== selectedItem));
      setCheckedItems((prev) => [...prev, selectedItem]);

      const newId = Date.now();
      setNotifications((prev) => [
        ...prev,
        {
          message: `${selectedItem} has been checked!`,
          isUnchecking: false,
          id: newId,
        },
      ]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newId));
      }, 2000);

      handleCloseModal();
    }
  };

  const handleUncheckItem = () => {
    if (selectedItem) {
      setCheckedItems((prev) => prev.filter((item) => item !== selectedItem));
      setUncheckedItems((prev) => [...prev, selectedItem]);

      const newId = Date.now();
      setNotifications((prev) => [
        ...prev,
        {
          message: `${selectedItem} has been unchecked!`,
          isUnchecking: true,
          id: newId,
        },
      ]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newId));
      }, 2000);

      handleCloseModal();
    }
  };

  const isItemCompleted = selectedItem
    ? checkedItems.includes(selectedItem)
    : false;

  return (
    <div className="checklist-container">
      <div className="checklist-card">
        <div className="checklist-title">
          <h5>Document Checklist</h5>
        </div>

        <div className="checklist-content">
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

          <div className="checklist-divider"></div>

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

      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`notification ${
              notification.isUnchecking ? "uncheck" : ""
            }`}
            style={{
              transform: `translateY(${-index * 80}px)`,
              transition: "transform 0.3s ease",
            }}
          >
            <span>{notification.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checklist;
