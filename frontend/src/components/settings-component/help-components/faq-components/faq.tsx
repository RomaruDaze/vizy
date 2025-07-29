import { useState } from "react";
import { useLanguage } from "../../../../contexts/LanguageContext";
import "./faq.styles.css";

interface FAQProps {
  // Removed: onBack: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ = ({}: FAQProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: t("how_reset_password"),
      answer: t("reset_password_answer"),
      category: "account",
    },
    {
      id: "2",
      question: t("how_delete_account"),
      answer: t("delete_account_answer"),
      category: "account",
    },
    {
      id: "3",
      question: t("how_change_theme"),
      answer: t("change_theme_answer"),
      category: "app",
    },
    {
      id: "4",
      question: t("how_find_immigration_offices"),
      answer: t("find_immigration_offices_answer"),
      category: "features",
    },
    {
      id: "5",
      question: t("how_find_photo_booths"),
      answer: t("find_photo_booths_answer"),
      category: "features",
    },
    {
      id: "6",
      question: t("how_contact_support"),
      answer: t("contact_support_answer"),
      category: "support",
    },
    {
      id: "7",
      question: t("is_data_secure"),
      answer: t("data_secure_answer"),
      category: "privacy",
    },
    {
      id: "8",
      question: t("can_use_offline"),
      answer: t("offline_usage_answer"),
      category: "app",
    },
    {
      id: "9",
      question: t("how_update_profile"),
      answer: t("update_profile_answer"),
      category: "account",
    },
    {
      id: "10",
      question: t("incorrect_information"),
      answer: t("incorrect_information_answer"),
      category: "support",
    },
  ];

  const categories = [
    { id: "all", name: t("all_questions") },
    { id: "account", name: t("account") },
    { id: "app", name: t("app_features") },
    { id: "features", name: t("locator_features") },
    { id: "support", name: t("support") },
    { id: "privacy", name: t("privacy_security") },
  ];

  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      // If the clicked item is already open, close it
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      // If opening a new item, close all others and open only this one
      return [itemId];
    });
  };

  return (
    <div className="settings-container-page">
      <div className="faq-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-input-container">
            <img
              src="https://img.icons8.com/ios-filled/100/FFFFFF/search--v1.png"
              alt="Search"
              className="search-icon"
            />
            <input
              type="text"
              placeholder={t("search_faq")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <img
                  src="https://img.icons8.com/sf-black-filled/100/999999/close.png"
                  alt="Clear"
                />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="faq-list-container">
          <div className="faq-list">
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((item) => (
                <div key={item.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="question-text">{item.question}</span>
                    <img
                      src={`https://img.icons8.com/ios-filled/100/${
                        expandedItems.includes(item.id)
                          ? "filled-circle"
                          : "give-way--v1"
                      }.png`}
                      alt={
                        expandedItems.includes(item.id) ? t("collapse") : t("expand")
                      }
                      className="expand-icon"
                    />
                  </button>
                  {expandedItems.includes(item.id) && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <img
                  src="https://img.icons8.com/sf-black-filled/100/999999/search.png"
                  alt="No Results"
                  className="no-results-icon"
                />
                <p>{t("no_faq_items_found")}</p>
                <p>{t("try_different_keywords")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
