import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../../contexts/AuthContext";
import "../account-components/account.styles.css";
import "./help.styles.css";

interface HelpProps {
  onBack: () => void;
}

const Help = ({ onBack }: HelpProps) => {
  const { currentUser } = useAuth();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFAQ = () => {
    // TODO: Implement FAQ functionality
    console.log("FAQ clicked");
  };

  const handleUserGuide = () => {
    // TODO: Implement User Guide functionality
    console.log("User Guide clicked");
  };

  const handleContactSupport = () => {
    setShowContactPopup(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.message.trim()
    ) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const templateParams = {
        to_email: import.meta.env.VITE_ADMIN_EMAIL,
        from_name: currentUser?.displayName || "Vizy User",
        from_email: currentUser?.email || "user@vizy.com",
        subject: formData.title,
        category: formData.category,
        message: formData.message,
        time: new Date().toLocaleString(),
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setMessage("Message sent successfully! We'll get back to you soon.");
      setTimeout(() => {
        setShowContactPopup(false);
        setMessage("");
        setFormData({ title: "", category: "", message: "" });
      }, 2000);
    } catch (error) {
      console.error("Email send error:", error);
      setMessage("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setFormData({ title: "", category: "", message: "" });
    setMessage("");
  };

  return (
    <div className="settings-container-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>Help & Support</h1>
      </div>

      <div className="help-content">
        {/* FAQ Button */}
        <div className="help-section">
          <button className="help-button" onClick={handleFAQ}>
            <div className="help-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/faq.png"
                alt="FAQ"
              />
            </div>
            <div className="help-content-text">
              <span className="help-text">FAQ</span>
              <span className="help-subtitle">
                Find answers to frequently asked questions
              </span>
            </div>
            <div className="help-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>

        {/* User Guide Button */}
        <div className="help-section">
          <button className="help-button" onClick={handleUserGuide}>
            <div className="help-icon">
              <img
                src="https://img.icons8.com/sf-black-filled/100/FFFFFF/book.png"
                alt="Guide"
              />
            </div>
            <div className="help-content-text">
              <span className="help-text">User Guide</span>
              <span className="help-subtitle">
                Learn how to use the app effectively
              </span>
            </div>
            <div className="help-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>

        {/* Contact Support Button */}
        <div className="help-section">
          <button className="help-button" onClick={handleContactSupport}>
            <div className="help-icon">
              <img
                src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/external-customer-digital-nomad-tanah-basah-glyph-tanah-basah.png"
                alt="Help"
              />
            </div>
            <div className="help-content-text">
              <span className="help-text">Contact Support</span>
              <span className="help-subtitle">
                Get in touch with our support team
              </span>
            </div>
            <div className="help-arrow">
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Contact Support Popup */}
      {showContactPopup && (
        <div className="popup-overlay" onClick={closeContactPopup}>
          <div
            className="popup-content contact-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <button className="close-button" onClick={closeContactPopup}>
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Close"
                />
              </button>
              <h3>Contact Support</h3>
            </div>
            <div className="popup-body">
              <form onSubmit={handleSubmitContact} className="contact-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Problem Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your issue in detail..."
                    rows={6}
                    required
                  />
                </div>

                {message && (
                  <div
                    className={`message ${
                      message.includes("successfully") ? "success" : "error"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeContactPopup}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
