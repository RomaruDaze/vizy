import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  saveUserProfile,
  getUserProfile,
} from "../../services/userProfileService";

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
  const { t, language } = useLanguage();
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
      t("application_extension_form"),
      t("passport"),
      t("residence_card"),
      t("id_photo"),
      t("processing_fee"),
    ];

    const workDocuments = [
      t("certificate_of_employment"),
      t("company_registration_certificate"),
      t("company_financial_documents"),
      t("resident_tax_certificate"),
      t("tax_payment_certificate"),
    ];

    const studentDocuments = [
      t("certificate_of_enrollment"),
      t("academic_transcript"),
      t("bank_balance_certificate"),
      t("scholarship_award_certificate"),
      t("certificate_of_remittance"),
      t("letter_of_guarantee"),
    ];

    const familyDocuments = [
      t("marriage_certificate"),
      t("birth_certificate"),
      t("bank_statement"),
      t("letter_of_guarantee"),
      t("family_register"),
      t("resident_certificate"),
      t("certificate_of_employment"),
      t("resident_tax_certificate"),
      t("tax_payment_certificate"),
    ];

    const specifiedSkillDocuments = [
      t("certificate_of_employment"),
      t("company_registration_certificate"),
      t("company_financial_documents"),
      t("resident_tax_certificate"),
      t("tax_payment_certificate"),
    ];

    switch (visaType) {
      case t("work_residency"):
        return [...commonDocuments, ...workDocuments];
      case t("international_student_residency"):
        return [...commonDocuments, ...studentDocuments];
      case t("family_residency"):
        return [...commonDocuments, ...familyDocuments];
      case t("specified_skill_worker_residency"):
        return [...commonDocuments, ...specifiedSkillDocuments];
      default:
        return commonDocuments;
    }
  };

  const questions: Question[] = [
    {
      id: "deadline",
      question: t("whats_your_deadline"),
      type: "date",
      placeholder: t("select_your_deadline"),
    },
    {
      id: "ResidencyType",
      question: t("whats_your_current_residency_type"),
      type: "select",
      options: [
        t("international_student_residency"),
        t("work_residency"),
        t("family_residency"),
        t("specified_skill_worker_residency"),
      ],
    },
    {
      id: "purpose",
      question: t("what_do_you_want_to_do"),
      type: "conditionalSelect",
      options: [
        t("extend_current_residency"),
        t("change_to_different_residency_type"),
      ],
      conditionalOptions: [
        t("international_student_residency"),
        t("work_residency"),
        t("family_residency"),
        t("specified_skill_worker_residency"),
      ],
    },
    {
      id: "documents",
      question: t("which_documents_do_you_have"),
      type: "multiSelect",
      options: [], // This will be dynamically populated
    },
    {
      id: "experience",
      question: t("have_you_applied_before"),
      type: "select",
      options: [
        t("yes_successfully"),
        t("yes_but_rejected"),
        t("no_first_time"),
        t("not_sure"),
      ],
    },
  ];

  // Get the target visa type for document filtering
  const getTargetVisaType = () => {
    if (answers.purpose === t("extend_current_residency")) {
      return answers.ResidencyType;
    } else if (answers.purpose === t("change_to_different_residency_type")) {
      return answers.purpose_target;
    }
    return null;
  };

  // Update document options based on target visa type
  const targetVisaType = getTargetVisaType();
  const documentOptions = targetVisaType
    ? getDocumentOptions(targetVisaType)
    : [];

  const handleAnswer = async (
    questionId: string,
    answer: string | string[]
  ) => {
    const newAnswers = {
      ...answers,
      [questionId]: answer,
    };
    setAnswers(newAnswers);

    // Remove auto-save to Firebase - only save when complete
    // if (currentUser) {
    //   try {
    //     await saveUserProfile(currentUser.uid, newAnswers);
    //   } catch (error) {
    //     console.error("Error auto-saving:", error);
    //   }
    // }

    // Show conditional dropdown for purpose question
    if (
      questionId === "purpose" &&
      answer === t("change_to_different_residency_type")
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
      // Save to Firebase when all questions are completed
      if (currentUser) {
        try {
          // Save answers and current language preference
          await saveUserProfile(currentUser.uid, {
            ...answers,
            language: language, // Save the current language preference
          });
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
      answers[currentQuestion.id] === t("change_to_different_residency_type")
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

        return (
          <div className="multi-select-container">
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
                t("change_to_different_residency_type") && (
                <div className="conditional-options">
                  <label className="conditional-label">
                    {t("select_target_residency_type")}
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
            {currentStep + 1} {t("of")} {questions.length}
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
              {t("back")}
            </button>
          )}

          <button
            className={`next-button ${canProceed ? "active" : "disabled"}`}
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastStep ? t("finish") : t("next")}
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
