import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "How do I reset my password?",
      answer:
        "Go to Settings → Privacy & Security → Reset Password. Enter your email and we'll send you a password reset link.",
      category: "account",
    },
    {
      id: "2",
      question: "How do I delete my account?",
      answer:
        "Go to Settings → Privacy & Security → Delete Account. Please note this action cannot be undone.",
      category: "account",
    },
    {
      id: "3",
      question: "How do I change my theme?",
      answer:
        "Go to Settings → Accessibility → Theme. Choose from our available color themes.",
      category: "app",
    },
    {
      id: "4",
      question: "How do I find immigration offices?",
      answer:
        "Use the Locator feature in the bottom navigation. It will show you nearby immigration offices on the map.",
      category: "features",
    },
    {
      id: "5",
      question: "How do I find photo booths?",
      answer:
        "Use the Locator feature and toggle to 'Photo Booths' to see nearby photo booth locations.",
      category: "features",
    },
    {
      id: "6",
      question: "How do I contact support?",
      answer:
        "Go to Settings → Help & Support → Contact Support. Fill out the form and we'll get back to you.",
      category: "support",
    },
    {
      id: "7",
      question: "Is my data secure?",
      answer:
        "Yes, we use Firebase authentication and follow security best practices to protect your information.",
      category: "privacy",
    },
    {
      id: "8",
      question: "Can I use the app offline?",
      answer:
        "Some features work offline, but you'll need internet for maps and real-time data.",
      category: "app",
    },
    {
      id: "9",
      question: "How do I update my profile?",
      answer:
        "Go to Settings → Account → Edit Profile to update your information.",
      category: "account",
    },
    {
      id: "10",
      question: "What if I find incorrect information?",
      answer:
        "Please contact support with the details and we'll verify and update the information.",
      category: "support",
    },
  ];

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "account", name: "Account" },
    { id: "app", name: "App Features" },
    { id: "features", name: "Locator Features" },
    { id: "support", name: "Support" },
    { id: "privacy", name: "Privacy & Security" },
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
              placeholder="Search FAQ..."
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
                        expandedItems.includes(item.id) ? "Collapse" : "Expand"
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
                <p>No FAQ items found for your search.</p>
                <p>Try different keywords or browse all categories.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
