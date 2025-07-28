import { useState, useRef, useEffect } from "react";
import "./ai-form-assistant.styles.css";
import { aiModel } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { getPopupState, setPopupState } from "../../services/popupService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIFormAssistantProps {
  onBack: () => void;
}

const AIFormAssistant = ({ onBack }: AIFormAssistantProps) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI visa application assistant. I can help you fill out your visa extension form step by step. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          }
        } catch (error) {
          console.error("Error checking welcome popup state:", error);
          // Show popup if there's an error (better user experience)
          setShowWelcomePopup(true);
        }
      }
    };

    checkWelcomePopup();
  }, [currentUser]);

  const handleCloseWelcomePopup = async () => {
    setShowWelcomePopup(false);

    // Mark popup as seen in Firebase
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

    setMessages((prev) => [...prev, userMessage]);
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

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      // Create a context-aware prompt for visa assistance
      const systemPrompt = `You are a helpful AI assistant specializing in Japanese visa applications. 
      You help users fill out visa extension forms by providing clear, accurate guidance.
      
      Key areas you can help with:
      - Full name (as shown on passport)
      - Date of birth (YYYY-MM-DD format)
      - Nationality (country of citizenship)
      - Passport number (letters and numbers only)
      - Current address in Japan (with postal code)
      - Phone number (Japanese format)
      - Visa type selection
      - Current status of residence
      - Visa expiry date
      - Reason for extension
      
      Provide helpful, specific guidance. Be concise but thorough. If the user asks about a specific field, give detailed instructions for that field.`;

      const fullPrompt = `${systemPrompt}\n\nUser question: ${userInput}`;

      // Generate content using Firebase AI
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

  return (
    <div className="ai-form-container">
      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div className="welcome-popup-overlay">
          <div className="welcome-popup-content">
            <div className="welcome-popup-header">
              <h2>Welcome to AI Form Assistant!</h2>
              {/* Removed the X button */}
            </div>

            <div className="welcome-popup-body">
              <div className="feature-section">
                <h3>✨ What I can help you with:</h3>
                <ul>
                  <li>
                    <strong>Form Guidance:</strong> Get step-by-step help with
                    visa extension forms
                  </li>
                  <li>
                    <strong>Field Explanations:</strong> Understand what each
                    field requires
                  </li>
                </ul>
              </div>

              <div className="feature-section">
                <h3>💡 How to use:</h3>
                <ul>
                  <li>I'll provide detailed explanations and examples</li>
                  <li>Feel free to ask follow-up questions</li>
                </ul>
              </div>

              <div className="example-section">
                <h3>Try asking me:</h3>
                <div className="example-questions">
                  <button className="example-question">
                    "How do I fill out the full name field?"
                  </button>
                  <button className="example-question">
                    "What format should I use for my address?"
                  </button>
                  <button className="example-question">
                    "Help me with the visa expiry date field"
                  </button>
                </div>
              </div>
            </div>

            <div className="welcome-popup-footer">
              <button
                className="got-it-button"
                onClick={handleCloseWelcomePopup}
              >
                Let's start !
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>AI Form Assistant</h1>
        <p className="header-subtitle">Your personal visa application helper</p>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === "user" ? "user" : "ai"}`}
            >
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
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

        <div className="input-container">
          <div className="input-wrapper">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Feel free to ask me anything about visa ..."
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
        </div>
      </div>
    </div>
  );
};

export default AIFormAssistant;
