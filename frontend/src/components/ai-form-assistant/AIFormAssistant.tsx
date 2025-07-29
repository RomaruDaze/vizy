import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../../contexts/LanguageContext";
import "./ai-form-assistant.styles.css";
import { aiModel } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { getPopupState, setPopupState } from "../../services/popupService";
import {
  saveConversation,
  updateConversation,
  getConversations,
  deleteConversation,
  type Conversation,
  type Message,
} from "../../services/conversationService";

interface AIFormAssistantProps {
  onBack: () => void;
}

const AIFormAssistant = ({}: AIFormAssistantProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t("ai_welcome"),
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [showQuickTips, setShowQuickTips] = useState(false);
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      if (currentUser?.uid) {
        try {
          const loadedConversations = await getConversations(currentUser.uid);
          setConversations(loadedConversations);
        } catch (error) {
          console.error("Error loading conversations:", error);
        }
      }
    };

    loadConversations();
  }, [currentUser]);

  // Check if user has seen the welcome popup
  useEffect(() => {
    const checkWelcomePopup = async () => {
      if (currentUser?.uid) {
        try {
          const hasSeenWelcome = await getPopupState(
            currentUser.uid,
            "aiFormWelcome"
          );
          if (!hasSeenWelcome) {
            setShowWelcomePopup(true);
          } else {
            // Show quick tips if user has seen welcome but no conversations yet
            if (conversations.length === 0) {
              setShowQuickTips(true);
            }
          }
        } catch (error) {
          console.error("Error checking welcome popup state:", error);
          setShowWelcomePopup(true);
        }
      }
    };

    checkWelcomePopup();
  }, [currentUser, conversations.length]);

  const handleCloseWelcomePopup = async () => {
    setShowWelcomePopup(false);

    if (currentUser?.uid) {
      try {
        await setPopupState(currentUser.uid, "aiFormWelcome", true);
        // Show quick tips after closing welcome popup
        setShowQuickTips(true);
      } catch (error) {
        console.error("Error saving popup state:", error);
      }
    }
  };

  const handleQuickTipClick = (question: string) => {
    // Don't set inputText, directly send the message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setShowQuickTips(false);
    setIsLoading(true);

    // Send the AI response
    getAIResponse(question)
      .then((aiResponse) => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        // Save conversation to Firebase
        if (currentUser?.uid) {
          if (currentConversationId) {
            updateConversation(
              currentUser.uid,
              currentConversationId,
              finalMessages
            );
          } else {
            saveConversation(currentUser.uid, finalMessages).then(
              (conversationId) => {
                setCurrentConversationId(conversationId);
              }
            );
          }
        }
      })
      .catch((error) => {
        console.error("AI Error:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setMessages(finalMessages);

        // Save conversation even if there's an error
        if (currentUser?.uid) {
          if (currentConversationId) {
            updateConversation(
              currentUser.uid,
              currentConversationId,
              finalMessages
            );
          } else {
            saveConversation(currentUser.uid, finalMessages).then(
              (conversationId) => {
                setCurrentConversationId(conversationId);
              }
            );
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputText);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save conversation to Firebase
      if (currentUser?.uid) {
        if (currentConversationId) {
          // Update existing conversation
          await updateConversation(
            currentUser.uid,
            currentConversationId,
            finalMessages
          );
        } else {
          // Create new conversation
          const conversationId = await saveConversation(
            currentUser.uid,
            finalMessages
          );
          setCurrentConversationId(conversationId);
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      // Save conversation even if there's an error
      if (currentUser?.uid) {
        if (currentConversationId) {
          await updateConversation(
            currentUser.uid,
            currentConversationId,
            finalMessages
          );
        } else {
          const conversationId = await saveConversation(
            currentUser.uid,
            finalMessages
          );
          setCurrentConversationId(conversationId);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (conversation: Conversation) => {
    setMessages(conversation.messages);
    setCurrentConversationId(conversation.id);
    setShowHistoryPopup(false);
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: "1",
        text: t("ai_welcome"),
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    setCurrentConversationId(null);
    setShowHistoryPopup(false);
    setShowQuickTips(true);
  };

  const deleteConversationById = async (conversationId: string) => {
    if (currentUser?.uid) {
      try {
        await deleteConversation(currentUser.uid, conversationId);
        const updatedConversations = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        setConversations(updatedConversations);

        // If we're deleting the current conversation, start a new one
        if (conversationId === currentConversationId) {
          startNewConversation();
        }
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      const systemPrompt = `You are a helpful AI assistant specializing in Japanese visa applications. 
You help users fill out visa extension forms by providing clear, accurate guidance.

**Key areas you can help with:**
- **Full name** (as shown on passport)
- **Date of birth** (YYYY-MM-DD format)
- **Nationality** (country of citizenship)
- **Passport number** (letters and numbers only)
- **Current address in Japan** (with postal code)
- **Phone number** (Japanese format)
- **Visa type selection**
- **Current status of residence**
- **Visa expiry date**
- **Reason for extension**

Provide helpful, specific guidance using markdown formatting. Be concise but thorough. If the user asks about a specific field, give detailed instructions for that field.

Use **bold** for important terms, \`code\` for specific formats, and bullet points for lists.`;

      const fullPrompt = `${systemPrompt}\n\n**User question:** ${userInput}`;

      const result = await aiModel.generateContent(fullPrompt);
      const response = result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error("Firebase AI Error:", error);
      throw error;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handlePlusClick = () => {
    setShowMediaButtons(!showMediaButtons);
  };

  const handleCameraClick = () => {
    // TODO: Implement camera functionality
    console.log("Camera clicked");
    setShowMediaButtons(false);
  };

  const handleImageClick = () => {
    // TODO: Implement image upload functionality
    console.log("Image upload clicked");
    setShowMediaButtons(false);
  };

  return (
    <div className="ai-form-container">
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="welcome-popup-overlay">
          <div className="welcome-popup-content">
            <div className="welcome-popup-header">
              <h2>{t("welcome_ai_assistant")}</h2>
            </div>

            <div className="welcome-popup-body">
              <div className="feature-section">
                <h3>{t("what_i_can_help")}</h3>
                <ul>
                  <li>
                    <strong>{t("form_guidance")}:</strong>{" "}
                    {t("form_guidance_desc")}
                  </li>
                  <li>
                    <strong>{t("field_explanations")}:</strong>{" "}
                    {t("field_explanations_desc")}
                  </li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>{t("how_to_use")}</h3>
                <ul>
                  <li>{t("detailed_explanations")}</li>
                  <li>{t("follow_up_questions")}</li>
                </ul>
              </div>

              <div className="example-section">
                <h3>{t("try_asking_me")}</h3>
                <div className="example-questions">
                  <button className="example-question">
                    {t("full_name_question")}
                  </button>
                  <button className="example-question">
                    {t("address_format_question")}
                  </button>
                  <button className="example-question">
                    {t("visa_expiry_question")}
                  </button>
                </div>
              </div>
            </div>

            <div className="welcome-popup-footer">
              <button
                className="got-it-button"
                onClick={handleCloseWelcomePopup}
              >
                {t("lets_start")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Popup */}
      {showHistoryPopup && (
        <div className="welcome-popup-overlay">
          <div className="welcome-popup-content">
            <div className="welcome-popup-header">
              <h2>{t("conversation_history")}</h2>
            </div>

            <div className="welcome-popup-body">
              <button
                className="new-conversation-button"
                onClick={startNewConversation}
              >
                {t("start_new_conversation")}
              </button>

              <div className="conversations-list">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="conversation-item">
                    <div
                      className="conversation-content"
                      onClick={() => loadConversation(conversation)}
                    >
                      <div className="conversation-info">
                        <div className="conversation-preview">
                          {conversation.messages[1]?.text.slice(0, 50)}...
                        </div>
                        <div className="conversation-date">
                          {formatDate(conversation.updatedAt)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="delete-conversation-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversationById(conversation.id);
                      }}
                    >
                      <img
                        src="https://img.icons8.com/ios-glyphs/100/FFFFFF/trash.png"
                        alt="Delete"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="welcome-popup-footer">
              <button
                className="got-it-button"
                onClick={() => setShowHistoryPopup(false)}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-header">
        <button className="back-button" onClick={handleBackToHome}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <div className="form-header-title">
          <img
            src="https://img.icons8.com/glyph-neue/30/FFFFFF/bard--v2.png"
            alt="Vizy AI Assistant"
          />
          <h1>{t("vizy_ai_assistant")}</h1>
        </div>
        <button
          className="history-button"
          onClick={() => setShowHistoryPopup(true)}
        >
          <img
            src="https://img.icons8.com/material-outlined/50/activity-history.png"
            alt="History"
          />
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === "user" ? "user" : "ai"}`}
            >
              <div className="message-content">
                <div className="message-text">
                  {message.sender === "ai" ? (
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  ) : (
                    message.text
                  )}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Quick Tips Message */}
          {showQuickTips && (
            <div className="message ai">
              <div className="message-content">
                <div className="message-text">
                  <div className="quick-tips-message">
                    <p>
                      <strong>{t("ai_quick_tips")}</strong>
                    </p>
                    <div className="quick-tips-grid">
                      <button
                        className="quick-tip-button"
                        onClick={() =>
                          handleQuickTipClick(t("full_name_question"))
                        }
                      >
                        <div className="quick-tip-icon">👤</div>
                        <div className="quick-tip-text">
                          <strong>{t("full_name")}</strong>
                          <span>{t("full_name_desc")}</span>
                        </div>
                      </button>

                      <button
                        className="quick-tip-button"
                        onClick={() =>
                          handleQuickTipClick(t("address_format_question"))
                        }
                      >
                        <div className="quick-tip-icon">🏠</div>
                        <div className="quick-tip-text">
                          <strong>{t("address")}</strong>
                          <span>{t("address_desc")}</span>
                        </div>
                      </button>

                      <button
                        className="quick-tip-button"
                        onClick={() =>
                          handleQuickTipClick(t("visa_expiry_question"))
                        }
                      >
                        <div className="quick-tip-icon">📅</div>
                        <div className="quick-tip-text">
                          <strong>{t("visa_expiry_date")}</strong>
                          <span>{t("visa_expiry_desc")}</span>
                        </div>
                      </button>

                      <button
                        className="quick-tip-button"
                        onClick={() =>
                          handleQuickTipClick(t("documents_question"))
                        }
                      >
                        <div className="quick-tip-icon">📋</div>
                        <div className="quick-tip-text">
                          <strong>{t("documents")}</strong>
                          <span>{t("documents_desc")}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="message-time">{formatTime(new Date())}</div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="message ai">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="input-container">
        <div className="input-wrapper">
          {!showMediaButtons ? (
            <>
              <button
                className="plus-button"
                onClick={handlePlusClick}
                disabled={isLoading}
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/100/FFFFFF/plus-math.png"
                  alt="Plus"
                />
              </button>
              <div className="input-area">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t("ask_anything_about_visa")}
                  className="message-input"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="send-button"
                >
                  <img
                    src="https://img.icons8.com/ios-glyphs/100/FFFFFF/filled-sent.png"
                    alt="Send"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="media-buttons-container">
              <button
                className="media-button camera-button"
                onClick={handleCameraClick}
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/100/FFFFFF/camera.png"
                  alt="Camera"
                />
                <span>{t("camera")}</span>
              </button>
              <button
                className="media-button image-button"
                onClick={handleImageClick}
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/100/FFFFFF/image.png"
                  alt="Image"
                />
                <span>{t("image")}</span>
              </button>
              <button className="close-media-button" onClick={handlePlusClick}>
                <img
                  src="https://img.icons8.com/ios-glyphs/100/FFFFFF/multiply.png"
                  alt="Close"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFormAssistant;
