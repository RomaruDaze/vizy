import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "../../contexts/LanguageContext";
import "./ai.styles.css";
import { aiModel } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { getPopupState, setPopupState } from "../../services/popupService";
import BottomNavigation from "../shared/bottom-navigation";
import {
  saveConversation,
  updateConversation,
  getConversations,
  deleteConversation,
  type Conversation,
  type Message,
} from "../../services/conversationService";
import ActionButtons, { type SerializableActionButton } from "./actionbutton";

interface AIFormAssistantProps {
  onBack: () => void;
}

const AIFormAssistant = ({}: AIFormAssistantProps) => {
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
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [shouldLoadLastConversation, setShouldLoadLastConversation] =
    useState(true);

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

          // Load the most recent conversation if available and we haven't loaded one yet
          if (shouldLoadLastConversation && loadedConversations.length > 0) {
            const lastConversation = loadedConversations[0]; // Most recent conversation
            setMessages(lastConversation.messages);
            setCurrentConversationId(lastConversation.id);
            setShouldLoadLastConversation(false);

            // Remove the persistent action buttons restoration logic
            // const lastAIMessage = lastConversation.messages
            //   .filter((msg) => msg.sender === "ai")
            //   .pop();

            // if (lastAIMessage && lastAIMessage.actionButtons) {
            //   setPersistentActionButtons(lastAIMessage.actionButtons);
            // }
          }
        } catch (error) {
          console.error("Error loading conversations:", error);
        }
      }
    };

    loadConversations();
  }, [currentUser, shouldLoadLastConversation]);

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
              // setShowQuickTips(true); // This line was removed
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
      } catch (error) {
        console.error("Error saving popup state:", error);
      }
    }
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
        text: aiResponse.text,
        sender: "ai",
        timestamp: new Date(),
        // Only include actionButtons if they exist and are not undefined
        ...(aiResponse.actions &&
          aiResponse.actions.length > 0 && {
            actionButtons: aiResponse.actions,
          }),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Remove the persistent action buttons logic - they should only appear with the specific message
      // setPersistentActionButtons(aiResponse.actions);

      // Save conversation to Firebase
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
    setShouldLoadLastConversation(false); // Prevent auto-loading after manually loading

    // Remove the persistent action buttons restoration logic
    // const lastAIMessage = conversation.messages
    //   .filter((msg) => msg.sender === "ai")
    //   .pop();

    // if (lastAIMessage && lastAIMessage.actionButtons) {
    //   setPersistentActionButtons(lastAIMessage.actionButtons);
    // } else {
    //   setPersistentActionButtons([]); // Clear if no action buttons
    // }
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
    setShouldLoadLastConversation(false); // Prevent auto-loading after starting new conversation
    // Remove the persistent action buttons clearing
    // setPersistentActionButtons([]); // Clear action buttons for new conversation
  };

  const deleteConversationById = async (conversationId: string) => {
    if (currentUser?.uid) {
      try {
        await deleteConversation(currentUser.uid, conversationId);
        const updatedConversations = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        setConversations(updatedConversations);

        // If we're deleting the current conversation, load the next most recent one
        if (conversationId === currentConversationId) {
          if (updatedConversations.length > 0) {
            const nextConversation = updatedConversations[0];
            setMessages(nextConversation.messages);
            setCurrentConversationId(nextConversation.id);
          } else {
            // If no conversations left, start a new one
            startNewConversation();
          }
        }
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }
  };

  const getAIResponse = async (
    userInput: string
  ): Promise<{
    text: string;
    actions?: SerializableActionButton[];
  }> => {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const systemPrompt = `You are a helpful AI assistant specializing in Japanese visa applications. 
You help users fill out visa extension forms by providing clear, accurate guidance.

**Available App Features:**
- **Locator**: Find nearby immigration offices and photo booths for visa photos
- **Document Checklist**: View required documents for your visa type
- **Visa Status**: Track your application progress
- **Settings**: Manage your profile and preferences

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

**Interactive Guidance:**
When users ask about:
- "Find immigration office" → Guide to Locator (immigration offices)
- "Find photo booth" or "passport photo" → Guide to Locator (photo booths)
- "Check documents" → Guide to Document Checklist
- "Track application" → Guide to Visa Status
- "Apply for extension" → Guide through the process

**Important Guidelines:**
- ALWAYS recommend using the app's built-in features first
- For photo-related queries, guide users to the Locator feature to find photo booths
- For location queries, guide users to the Locator feature
- For document queries, guide users to the Document Checklist
- Do NOT recommend external services like Google Maps, Yahoo Maps, or other apps
- Focus on the app's capabilities and how they can help the user

Provide helpful, specific guidance using markdown formatting. Be concise but thorough. If the user asks about a specific field, give detailed instructions for that field.

Use **bold** for important terms, \`code\` for specific formats, and bullet points for lists.`;

        const fullPrompt = `${systemPrompt}\n\n**User question:** ${userInput}`;

        const result = await aiModel.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        // Analyze user input for app navigation
        const actions = analyzeUserIntent(userInput, text);

        return {
          text,
          actions: actions.length > 0 ? actions : undefined,
        };
      } catch (error: any) {
        lastError = error;

        // If it's a rate limit error, wait before retrying
        if (
          error.message?.includes("429") ||
          error.message?.includes("overloaded")
        ) {
          const waitTime = attempt * 2000; // 2s, 4s, 6s
          console.log(
            `API overloaded, retrying in ${waitTime}ms (attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        // For other errors, throw immediately
        throw error;
      }
    }

    // If all retries failed, return a fallback response
    console.error("All AI retries failed:", lastError);
    return {
      text: "I'm experiencing high traffic right now. Please try again in a few moments, or you can use the quick action buttons below for immediate help.",
      actions: analyzeUserIntent(userInput, ""), // Still show relevant actions
    };
  };

  const analyzeUserIntent = (userInput: string, _aiResponse: string) => {
    const input = userInput.toLowerCase();
    const actions: SerializableActionButton[] = [];

    // Only show relevant actions based on user intent
    if (
      input.includes("immigration") ||
      input.includes("office") ||
      input.includes("where") ||
      input.includes("location") ||
      input.includes("submit")
    ) {
      actions.push({
        id: "locator",
        text: "Find Immigration Office",
        route: "/locator",
        icon: "https://img.icons8.com/ios-glyphs/100/FFFFFF/map-marker.png",
      });
    }

    // Add photo booth detection
    if (
      input.includes("photo") ||
      input.includes("photobooth") ||
      input.includes("photo booth") ||
      input.includes("passport photo") ||
      input.includes("photo studio") ||
      input.includes("photo machine") ||
      input.includes("photo booth") ||
      input.includes("take photo") ||
      input.includes("get photo") ||
      input.includes("photo for visa") ||
      input.includes("visa photo")
    ) {
      actions.push({
        id: "photobooth",
        text: "Find Photo Booths",
        route: "/locator?type=photobooth",
        icon: "https://img.icons8.com/ios-glyphs/100/FFFFFF/camera.png",
      });
    }

    if (
      input.includes("document") ||
      input.includes("checklist") ||
      input.includes("required") ||
      input.includes("paperwork") ||
      input.includes("what do i need")
    ) {
      actions.push({
        id: "documents",
        text: "View Required Documents",
        route: "/user-guide",
        icon: "https://img.icons8.com/ios-glyphs/100/FFFFFF/document.png",
      });
    }

    if (
      input.includes("apply") ||
      input.includes("extension") ||
      input.includes("how to apply")
    ) {
      actions.push(
        {
          id: "documents",
          text: "View Required Documents",
          route: "/user-guide",
          icon: "https://img.icons8.com/ios-glyphs/100/FFFFFF/document.png",
        },
        {
          id: "locator",
          text: "Find Immigration Office",
          route: "/locator",
          icon: "https://img.icons8.com/ios-glyphs/100/FFFFFF/map-marker.png",
        }
      );
    }

    return actions;
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

  // Add this function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    // Hide quick tips when user starts typing
    if (e.target.value.trim()) {
      // setShowQuickTips(false); // This line was removed
    }
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
        <div className="form-header-title">
          <img
            src="https://img.icons8.com/glyph-neue/30/FFFFFF/bard--v2.png"
            alt="Vizy AI"
          />
          <h1>{t("vizy_ai")}</h1>
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

                {/* Show action buttons only with the specific AI message that has them */}
                {message.sender === "ai" &&
                  message.actionButtons &&
                  message.actionButtons.length > 0 && (
                    <ActionButtons buttons={message.actionButtons} />
                  )}
              </div>
            </div>
          ))}

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
                  onChange={handleInputChange}
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
      <div className="bottom-section">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default AIFormAssistant;
