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
  type: "text" | "select" | "multiSelect" | "date" | "conditionalSelect";
  options?: string[];
  placeholder?: string;
  conditionalOptions?: string[];
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
      setLoading(false);
    };

    loadUserProfile();
  }, [currentUser]);

  // Document options based on visa type
  const getDocumentOptions = (visaType: string) => {
    const commonDocuments = [
      "Application for Extension of Period of Stay",
      "Passport",
      "Residence Card",
      "ID Photo",
      "Processing Fee",
    ];

    const workDocuments = [
      "Certificate of Employment",
      "Company Registration Certificate",
      "Company's Financial Documents",
      "Resident Tax Certificate",
      "Tax Payment Certificate",
    ];

    const studentDocuments = [
      "Certificate of Enrollment",
      "Academic Transcript",
      "Bank Balance Certificate",
      "Scholarship Award Certificate",
      "Certificate of Remittance",
      "Letter of Guarantee",
    ];

    const familyDocuments = [
      "Marriage Certificate",
      "Birth Certificate",
      "Bank Statement",
      "Letter of Guarantee",
      "Family Register",
      "Resident Certificate",
      "Certificate of Employment",
      "Resident Tax Certificate",
      "Tax Payment Certificate",
    ];

    const specifiedSkillDocuments = [
      "Certificate of Employment",
      "Company Registration Certificate",
      "Company's Financial Documents",
      "Resident Tax Certificate",
      "Tax Payment Certificate",
    ];

    switch (visaType) {
      case "Work Residency":
        return [...commonDocuments, ...workDocuments];
      case "International Student Residency":
        return [...commonDocuments, ...studentDocuments];
      case "Family Residency":
        return [...commonDocuments, ...familyDocuments];
      case "Specified Skill Worker Residency":
        return [...commonDocuments, ...specifiedSkillDocuments];
      default:
        return commonDocuments;
    }
  };

  const questions: Question[] = [
    {
      id: "deadline",
      question: "What's your deadline?",
      type: "date",
      placeholder: "Select your deadline",
    },
    {
      id: "ResidencyType",
      question: "What's your current Residency type?",
      type: "select",
      options: [
        "International Student Residency",
        "Work Residency",
        "Family Residency",
        "Specified Skill Worker Residency",
      ],
    },
    {
      id: "purpose",
      question: "What do you want to do?",
      type: "conditionalSelect",
      options: [
        "Extend my current Residency",
        "Change to a different Residency type",
      ],
      conditionalOptions: [
        "International Student Residency",
        "Work Residency",
        "Family Residency",
        "Specified Skill Worker Residency",
      ],
    },
    {
      id: "documents",
      question: "Which documents do you already have?",
      type: "multiSelect",
      options: [], // This will be dynamically populated
    },
    {
      id: "experience",
      question: "Have you applied for a Residency before?",
      type: "select",
      options: [
        "Yes, successfully",
        "Yes, but was rejected",
        "No, this is my first time",
        "I'm not sure",
      ],
    },
  ];

  // Get the target visa type for document filtering
  const getTargetVisaType = () => {
    if (answers.purpose === "Extend my current Residency") {
      return answers.ResidencyType;
    } else if (answers.purpose === "Change to a different Residency type") {
      return answers.purpose_target;
    }
    return null;
  };

  // Update document options based on target visa type
  const targetVisaType = getTargetVisaType();
  const documentOptions = targetVisaType
    ? getDocumentOptions(targetVisaType)
    : [];

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
      answer === "Change to a different Residency type"
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

  // Update the current question's options if it's the documents question
  if (currentQuestion.id === "documents") {
    currentQuestion.options = documentOptions;
  }

  const canProceed = (() => {
    if (
      currentQuestion.type === "conditionalSelect" &&
      answers[currentQuestion.id] === "Change to a different Residency type"
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
            min={new Date().toISOString().split("T")[0]}
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

        // Show visa type info if this is the documents question
        const showVisaInfo =
          currentQuestion.id === "documents" && targetVisaType;

        return (
          <div className="multi-select-container">
            {showVisaInfo && (
              <div className="visa-type-info">
                <p>
                  Documents required for: <strong>{targetVisaType}</strong>
                </p>
              </div>
            )}
            <div className="options-container">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  className={`option-button ${
                    selectedOptions.includes(option) ? "selected" : ""
                  }`}
                  onClick={() => {
                    const newSelection = selectedOptions.includes(option)
                      ? selectedOptions.filter(
                          (item: string) => item !== option
                        )
                      : [...selectedOptions, option];
                    handleAnswer(currentQuestion.id, newSelection);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case "conditionalSelect":
        const currentResidencyType = answers["ResidencyType"];
        const availableTargetOptions =
          currentQuestion.conditionalOptions?.filter(
            (option) => option !== currentResidencyType
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
                "Change to a different Residency type" && (
                <div className="conditional-options">
                  <label className="conditional-label">
                    Select your target Residency type:
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
