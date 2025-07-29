import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../contexts/LanguageContext";
import FAQ from "./faq-components/faq";
import "./help.styles.css";

interface HelpProps {
  onBack: () => void;
}

const Help = ({ onBack }: HelpProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showFAQPopup, setShowFAQPopup] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFAQ = () => {
    setShowFAQPopup(true);
  };

  const handleUserGuide = () => {
    navigate("/user-guide");
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
      setMessage(t("please_fill_all_fields"));
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

      setMessage(t("message_sent_successfully"));
      setTimeout(() => {
        setShowContactPopup(false);
        setMessage("");
        setFormData({ title: "", category: "", message: "" });
      }, 2000);
    } catch (error) {
      console.error("Email send error:", error);
      setMessage(t("failed_to_send_message"));
    } finally {
      setLoading(false);
    }
  };

  const closeContactPopup = () => {
    setShowContactPopup(false);
    setFormData({ title: "", category: "", message: "" });
    setMessage("");
  };

  const closeFAQPopup = () => {
    setShowFAQPopup(false);
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
        <h1>{t("help_support")}</h1>
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
                {t("find_answers_frequently_asked")}
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
              <span className="help-text">{t("user_guide")}</span>
              <span className="help-subtitle">
                {t("learn_use_app_effectively")}
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
              <span className="help-text">{t("contact_support")}</span>
              <span className="help-subtitle">
                {t("get_touch_support_team")}
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

      {/* FAQ Popup */}
      {showFAQPopup && (
        <div className="popup-overlay" onClick={closeFAQPopup}>
          <div
            className="popup-content faq-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <button className="close-button" onClick={closeFAQPopup}>
                <img
                  src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
                  alt="Close"
                />
              </button>
              <h3>{t("faqs")}</h3>
            </div>
            <FAQ />
          </div>
        </div>
      )}

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
              <h3>{t("contact_support")}</h3>
            </div>
            <div className="popup-body">
              <form onSubmit={handleSubmitContact} className="contact-form">
                <div className="form-group">
                  <label htmlFor="title">{t("title")} *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={t("brief_description_issue")}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">{t("problem_category")} *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t("select_category")}</option>
                    <option value="technical">{t("technical_issue")}</option>
                    <option value="account">{t("account_problem")}</option>
                    <option value="feature">{t("feature_request")}</option>
                    <option value="bug">{t("bug_report")}</option>
                    <option value="general">{t("general_inquiry")}</option>
                    <option value="other">{t("other")}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">{t("message")} *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t("describe_issue_detail")}
                    rows={6}
                    required
                  />
                </div>

                {message && (
                  <div
                    className={`message ${
                      message.includes(t("successfully")) ? "success" : "error"
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
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? t("sending") : t("send_message")}
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
