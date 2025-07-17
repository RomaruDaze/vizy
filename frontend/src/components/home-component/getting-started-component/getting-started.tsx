import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  saveUserProfile,
  getUserProfile,
} from "../../../services/userProfileService";
import "./getting-started.styles.css";

interface GettingStartedProps {
  onBack: () => void;
  onComplete: (answers: Record<string, any>) => void;
}

interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "multiSelect" | "date" | "conditionalSelect"; // Added conditionalSelect
  options?: string[];
  placeholder?: string;
  conditionalOptions?: string[]; // For the dropdown that appears
}

const GettingStarted = ({ onComplete }: GettingStartedProps) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showConditional, setShowConditional] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile && Object.keys(profile).length > 0) {
            setAnswers(profile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserProfile();
  }, [currentUser]);

  const questions: Question[] = [
    {
      id: "deadline",
      question: "What's your deadline?",
      type: "date",
      placeholder: "Select your deadline",
    },
    {
      id: "visaType",
      question: "What's your current visa type?",
      type: "select",
      options: [
        "International Student Visa",
        "Work Visa",
        "Family Visa",
        "Specified Skill Worker Visa",
      ],
    },
    {
      id: "purpose",
      question: "What do you want to do?",
      type: "conditionalSelect",
      options: ["Extend my current visa", "Change to a different visa type"],
      conditionalOptions: [
        "International Student Visa",
        "Work Visa",
        "Family Visa",
        "Specified Skill Worker Visa",
      ],
    },
    {
      id: "documents",
      question: "Which documents do you already have?",
      type: "multiSelect",
      options: [
        "Passport",
        "Birth Certificate",
        "Educational Certificates",
        "Employment Records",
        "Financial Statements",
        "Medical Records",
        "Police Clearance",
      ],
    },
    {
      id: "experience",
      question: "Have you applied for a visa before?",
      type: "select",
      options: [
        "Yes, successfully",
        "Yes, but was rejected",
        "No, this is my first time",
        "I'm not sure",
      ],
    },
  ];

  const handleAnswer = async (questionId: string, answer: any) => {
    const newAnswers = {
      ...answers,
      [questionId]: answer,
    };
    setAnswers(newAnswers);

    // Auto-save to Firebase after each answer
    if (currentUser) {
      try {
        await saveUserProfile(currentUser.uid, newAnswers);
      } catch (error) {
        console.error("Error auto-saving:", error);
      }
    }

    // Show conditional dropdown for purpose question
    if (
      questionId === "purpose" &&
      answer === "Change to a different visa type"
    ) {
      setShowConditional(true);
    } else if (questionId === "purpose") {
      setShowConditional(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save to Firebase before completing
      if (currentUser) {
        try {
          await saveUserProfile(currentUser.uid, answers);
        } catch (error) {
          console.error("Error saving profile:", error);
        }
      }

      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = (() => {
    if (
      currentQuestion.type === "conditionalSelect" &&
      answers[currentQuestion.id] === "Change to a different visa type"
    ) {
      return (
        answers[currentQuestion.id] && answers[`${currentQuestion.id}_target`]
      );
    }
    return (
      answers[currentQuestion.id] &&
      (Array.isArray(answers[currentQuestion.id])
        ? answers[currentQuestion.id].length > 0
        : true)
    );
  })();

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "date":
        return (
          <input
            type="date"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="question-input"
            min={new Date().toISOString().split("T")[0]} // Set minimum date to today
          />
        );

      case "text":
        return (
          <input
            type="text"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="question-input"
          />
        );

      case "select":
        return (
          <div className="options-container">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                className={`option-button ${
                  answers[currentQuestion.id] === option ? "selected" : ""
                }`}
                onClick={() => handleAnswer(currentQuestion.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "multiSelect":
        const selectedOptions = answers[currentQuestion.id] || [];
        return (
          <div className="options-container">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                className={`option-button ${
                  selectedOptions.includes(option) ? "selected" : ""
                }`}
                onClick={() => {
                  const newSelection = selectedOptions.includes(option)
                    ? selectedOptions.filter((item: string) => item !== option)
                    : [...selectedOptions, option];
                  handleAnswer(currentQuestion.id, newSelection);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case "conditionalSelect":
        const currentVisaType = answers["visaType"];
        const availableTargetOptions =
          currentQuestion.conditionalOptions?.filter(
            (option) => option !== currentVisaType
          );

        return (
          <div className="conditional-select-container">
            <div className="options-container">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  className={`option-button ${
                    answers[currentQuestion.id] === option ? "selected" : ""
                  }`}
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>

            {showConditional &&
              answers[currentQuestion.id] ===
                "Change to a different visa type" && (
                <div className="conditional-options">
                  <label className="conditional-label">
                    Select your target visa type:
                  </label>
                  <div className="options-container">
                    {availableTargetOptions?.map((option) => (
                      <button
                        key={option}
                        className={`option-button ${
                          answers[`${currentQuestion.id}_target`] === option
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswer(`${currentQuestion.id}_target`, option)
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="getting-started-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="getting-started-question-container">
      <div className="getting-started-question-content">


        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="progress-text">
            {currentStep + 1} of {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-section">
          <h2 className="question-title">{currentQuestion.question}</h2>
          <div className="question-content">{renderQuestion()}</div>
        </div>

        {/* Navigation */}
        <div className="navigation-buttons">
          {currentStep > 0 && (
            <button className="previous-button" onClick={handleBack}>
              <img
                src="https://img.icons8.com/sf-black-filled/100/999999/back.png"
                alt="Back"
              />
              Back
            </button>
          )}

          <button
            className={`next-button ${canProceed ? "active" : "disabled"}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastStep ? "Finish" : "Next"}
            <img
              src="https://img.icons8.com/sf-black-filled/100/999999/forward.png"
              alt="Next"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
