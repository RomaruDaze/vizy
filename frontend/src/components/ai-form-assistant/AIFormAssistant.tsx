import { useState } from "react";
import "./ai-form-assistant.styles.css";

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "textarea" | "number";
  required: boolean;
  description: string;
  placeholder: string;
  options?: string[];
  validation?: (value: string) => string | null;
}

interface AIFormAssistantProps {
  onBack: () => void;
  onComplete: (formData: Record<string, any>) => void;
}

const AIFormAssistant = ({ onBack, onComplete }: AIFormAssistantProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");

  // Form fields for visa extension application
  const formFields: FormField[] = [
    {
      id: "applicantName",
      label: "Full Name (as shown on passport)",
      type: "text",
      required: true,
      description:
        "Enter your full name exactly as it appears on your passport",
      placeholder: "e.g., John Michael Smith",
    },
    {
      id: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      required: true,
      description: "Your birth date in YYYY-MM-DD format",
      placeholder: "YYYY-MM-DD",
    },
    {
      id: "nationality",
      label: "Nationality",
      type: "text",
      required: true,
      description: "Your country of citizenship",
      placeholder: "e.g., United States",
    },
    {
      id: "passportNumber",
      label: "Passport Number",
      type: "text",
      required: true,
      description: "Your passport number (letters and numbers only)",
      placeholder: "e.g., A12345678",
    },
    {
      id: "currentAddress",
      label: "Current Address in Japan",
      type: "textarea",
      required: true,
      description: "Your complete address in Japan including postal code",
      placeholder: "Enter your full address in Japan",
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "text",
      required: true,
      description: "Your phone number in Japan",
      placeholder: "e.g., 080-1234-5678",
    },
    {
      id: "visaType",
      label: "Current Visa Type",
      type: "select",
      required: true,
      description: "Select your current visa type",
      placeholder: "Select visa type",
      options: [
        "Student (留学)",
        "Work (就労)",
        "Family Stay (家族滞在)",
        "Cultural Activities (文化活動)",
        "Technical Intern Training (技能実習)",
        "Specified Skilled Worker (特定技能)",
        "Other (その他)",
      ],
    },
    {
      id: "currentStatus",
      label: "Current Status of Residence",
      type: "text",
      required: true,
      description: "Your current status (usually same as visa type)",
      placeholder: "e.g., Student",
    },
    {
      id: "expiryDate",
      label: "Current Visa Expiry Date",
      type: "date",
      required: true,
      description: "When your current visa expires",
      placeholder: "YYYY-MM-DD",
    },
    {
      id: "extensionReason",
      label: "Reason for Extension",
      type: "textarea",
      required: true,
      description: "Explain why you need to extend your stay",
      placeholder: "Explain your reason for extension...",
    },
  ];

  const currentField = formFields[currentStep];

  const handleInputChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [currentField.id]: value,
    }));

    // Clear error for this field
    if (errors[currentField.id]) {
      setErrors((prev) => ({
        ...prev,
        [currentField.id]: "",
      }));
    }
  };

  const getAISuggestion = async () => {
    setIsLoading(true);
    try {
      // Simulate AI suggestion (replace with actual AI API call)
      const suggestions = {
        applicantName:
          "Make sure to write your name exactly as it appears on your passport, including middle names if applicable.",
        dateOfBirth:
          "Use the format YYYY-MM-DD. For example, if you were born on March 15, 1995, write 1995-03-15.",
        nationality:
          "Write your country of citizenship, not your country of birth. For example: 'United States', 'Canada', 'United Kingdom'.",
        passportNumber:
          "Enter only the letters and numbers, no spaces or special characters. Usually starts with a letter followed by numbers.",
        currentAddress:
          "Include your postal code, prefecture, city, and detailed address. For example: 〒100-0001 東京都千代田区千代田1-1-1.",
        phoneNumber:
          "Use the format 080-XXXX-XXXX for mobile or 03-XXXX-XXXX for landline. Include the area code.",
        visaType:
          "Select the option that matches your current visa. If you're unsure, check your residence card or ask your school/employer.",
        currentStatus:
          "This is usually the same as your visa type. For students, write 'Student' or '留学'.",
        expiryDate:
          "This is the date your current visa expires. You should apply for extension 3 months before expiry.",
        extensionReason:
          "Be specific about why you need to stay longer. For students: mention continuing studies, for workers: mention ongoing employment.",
      };

      setAiSuggestion(
        suggestions[currentField.id as keyof typeof suggestions] ||
          "Please fill in this field according to the description provided."
      );
    } catch (error) {
      setAiSuggestion(
        "Unable to get AI suggestion at this time. Please refer to the field description."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (value: string): string | null => {
    if (currentField.required && !value.trim()) {
      return "This field is required";
    }

    // Add specific validations
    switch (currentField.id) {
      case "phoneNumber":
        if (value && !/^[\d-]+$/.test(value)) {
          return "Please enter a valid phone number";
        }
        break;
      case "passportNumber":
        if (value && !/^[A-Za-z0-9]+$/.test(value)) {
          return "Passport number should only contain letters and numbers";
        }
        break;
    }

    return null;
  };

  const handleNext = () => {
    const value = formData[currentField.id] || "";
    const error = validateField(value);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [currentField.id]: error,
      }));
      return;
    }

    if (currentStep < formFields.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setAiSuggestion("");
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setAiSuggestion("");
    }
  };

  const renderField = () => {
    const value = formData[currentField.id] || "";

    switch (currentField.type) {
      case "text":
      case "number":
        return (
          <input
            type={currentField.type}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentField.placeholder}
            className={`form-input ${errors[currentField.id] ? "error" : ""}`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`form-input ${errors[currentField.id] ? "error" : ""}`}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`form-select ${errors[currentField.id] ? "error" : ""}`}
          >
            <option value="">{currentField.placeholder}</option>
            {currentField.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentField.placeholder}
            className={`form-textarea ${
              errors[currentField.id] ? "error" : ""
            }`}
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="ai-form-container">
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>AI Form Assistant</h1>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep + 1) / formFields.length) * 100}%`,
            }}
          />
        </div>
        <p className="progress-text">
          Step {currentStep + 1} of {formFields.length}
        </p>
      </div>

      <div className="form-content">
        <div className="field-section">
          <h2>{currentField.label}</h2>
          <p className="field-description">{currentField.description}</p>

          {renderField()}

          {errors[currentField.id] && (
            <p className="error-message">{errors[currentField.id]}</p>
          )}
        </div>

        <div className="ai-assistant-section">
          <button
            className="ai-help-button"
            onClick={getAISuggestion}
            disabled={isLoading}
          >
            {isLoading ? "Getting AI Help..." : "🤖 Get AI Help"}
          </button>

          {aiSuggestion && (
            <div className="ai-suggestion">
              <h3>AI Suggestion:</h3>
              <p>{aiSuggestion}</p>
            </div>
          )}
        </div>

        <div className="form-navigation">
          <button
            className="nav-button prev"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          <button className="nav-button next" onClick={handleNext}>
            {currentStep === formFields.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIFormAssistant;
