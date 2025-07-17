import { useState } from "react";
import "./visa-form.styles.css";
import visaForm1 from "../../assets/images/form-page1.jpg";

interface VisaFormProps {
  onBack: () => void;
}

const VisaForm = ({ onBack }: VisaFormProps) => {
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [selectedField, setSelectedField] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialZoom, setInitialZoom] = useState(1);

  const handleFieldClick = (fieldId: string) => {
    setSelectedField(fieldId);
    setShowAIPopup(true);
  };

  const handleClosePopup = () => {
    setShowAIPopup(false);
    setSelectedField("");
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 1)); // Changed from 0.5 to 1
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Add this function to constrain pan movement
  const constrainPan = (x: number, y: number, zoom: number) => {
    const containerWidth = 1200; // Approximate container width
    const containerHeight = 800; // Approximate container height
    const maxX = (containerWidth * zoom - containerWidth) / 2;
    const maxY = (containerHeight * zoom - containerHeight) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  // Update handleMouseMove
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      const constrained = constrainPan(newPan.x, newPan.y, zoomLevel);
      setPanOffset(constrained);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - dragging
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - panOffset.x,
        y: touch.clientY - panOffset.y,
      });
    } else if (e.touches.length === 2) {
      // Two touches - pinch to zoom
      setIsDragging(false);
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
      setInitialZoom(zoomLevel);
    }
  };

  // Update handleTouchMove
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      e.preventDefault();
      const touch = e.touches[0];
      const newPan = {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      };
      const constrained = constrainPan(newPan.x, newPan.y, zoomLevel);
      setPanOffset(constrained);
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / initialDistance;
      const newZoom = Math.max(1, Math.min(3, initialZoom * scale)); // Changed from 0.5 to 1
      setZoomLevel(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setInitialDistance(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel((prev) => Math.max(1, Math.min(3, prev + delta))); // Changed from 0.5 to 1
    }
  };

  const getFieldInfo = (fieldId: string) => {
    const fieldInfo: Record<string, { title: string; description: string }> = {
      "field-1": {
        title: "国籍・地域 (Nationality/Region)",
        description:
          "Enter your country of citizenship. For example: United States, Canada, United Kingdom",
      },
      "field-2": {
        title: "生年月日 (Date of Birth)",
        description:
          "Enter your birth date in YYYY-MM-DD format. For example: 1995-03-15",
      },
      "field-3": {
        title: "氏名 (Name)",
        description:
          "Enter your full name exactly as it appears on your passport. Include middle names if applicable.",
      },
      "field-4": {
        title: "性別 (Sex)",
        description: "Select your gender: Male (男) or Female (女)",
      },
      "field-5": {
        title: "配偶者の有無 (Marital Status)",
        description: "Select your marital status: Married (有) or Single (無)",
      },
      "field-6": {
        title: "職業 (Occupation)",
        description: "Enter your current occupation or job title",
      },
      "field-7": {
        title: "本国における居住地 (Home Town/City)",
        description: "Enter your hometown or city in your home country",
      },
      "field-8": {
        title: "住居地 (Address in Japan)",
        description:
          "Enter your complete address in Japan including postal code, prefecture, city, and detailed address",
      },
      "field-9": {
        title: "電話番号 (Telephone Number)",
        description:
          "Enter your phone number in Japan. Include area code for landline or mobile number format",
      },
      "field-10": {
        title: "旅券 (Passport)",
        description:
          "Enter your passport number and expiration date. Passport number should contain only letters and numbers",
      },
      "field-11": {
        title: "現に有する在留資格 (Current Status of Residence)",
        description:
          "Enter your current visa type and status. This is usually the same as your visa type",
      },
      "field-12": {
        title: "在留カード番号 (Residence Card Number)",
        description:
          "Enter your residence card number (在留カード番号) exactly as shown on your card",
      },
      "field-13": {
        title: "希望する在留期間 (Desired Length of Extension)",
        description:
          "Enter how long you want to extend your stay. Note: This may not be granted as requested",
      },
      "field-14": {
        title: "更新の理由 (Reason for Extension)",
        description:
          "Provide a detailed explanation of why you need to extend your stay. Be specific about your circumstances",
      },
      "field-15": {
        title: "犯罪を理由とする処分を受けたことの有無 (Criminal Record)",
        description:
          "Indicate if you have any criminal record in Japan or overseas, including traffic violations",
      },
      "field-16": {
        title: "在日親族及び同居者 (Family in Japan)",
        description:
          "Indicate if you have family members living in Japan or anyone you currently reside with",
      },
    };
    return (
      fieldInfo[fieldId] || {
        title: "Field",
        description: "No information available",
      }
    );
  };

  return (
    <div className="visa-form-container">
      {/* Header with Zoom Controls */}
      <div className="form-header">
        <button className="back-button" onClick={onBack}>
          <img src="https://img.icons8.com/sf-black-filled/100/back.png" />
        </button>
        <h1>Application Form Guide</h1>
      </div>

      {/* Form Image with Interactive Buttons */}
      <div
        className="form-image-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div
          className="form-content-wrapper"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center",
          }}
        >
          <img
            src={visaForm1}
            alt="Visa Extension Application Form"
            className="form-image"
            draggable={false}
          />

          {/* Interactive Field Buttons */}
          <button
            className="field-button field-1"
            onClick={() => handleFieldClick("field-1")}
            title="Click for help with Nationality/Region"
          >
            <span className="field-number">1</span>
          </button>

          <button
            className="field-button field-2"
            onClick={() => handleFieldClick("field-2")}
            title="Click for help with Date of Birth"
          >
            <span className="field-number">2</span>
          </button>

          <button
            className="field-button field-3"
            onClick={() => handleFieldClick("field-3")}
            title="Click for help with Name"
          >
            <span className="field-number">3</span>
          </button>

          <button
            className="field-button field-4"
            onClick={() => handleFieldClick("field-4")}
            title="Click for help with Sex"
          >
            <span className="field-number">4</span>
          </button>

          <button
            className="field-button field-5"
            onClick={() => handleFieldClick("field-5")}
            title="Click for help with Marital Status"
          >
            <span className="field-number">5</span>
          </button>

          <button
            className="field-button field-6"
            onClick={() => handleFieldClick("field-6")}
            title="Click for help with Occupation"
          >
            <span className="field-number">6</span>
          </button>

          <button
            className="field-button field-7"
            onClick={() => handleFieldClick("field-7")}
            title="Click for help with Home Town/City"
          >
            <span className="field-number">7</span>
          </button>

          <button
            className="field-button field-8"
            onClick={() => handleFieldClick("field-8")}
            title="Click for help with Address in Japan"
          >
            <span className="field-number">8</span>
          </button>

          <button
            className="field-button field-9"
            onClick={() => handleFieldClick("field-9")}
            title="Click for help with Telephone Number"
          >
            <span className="field-number">9</span>
          </button>

          <button
            className="field-button field-10"
            onClick={() => handleFieldClick("field-10")}
            title="Click for help with Passport"
          >
            <span className="field-number">10</span>
          </button>

          <button
            className="field-button field-11"
            onClick={() => handleFieldClick("field-11")}
            title="Click for help with Status of Residence"
          >
            <span className="field-number">11</span>
          </button>

          <button
            className="field-button field-12"
            onClick={() => handleFieldClick("field-12")}
            title="Click for help with Residence Card Number"
          >
            <span className="field-number">12</span>
          </button>

          <button
            className="field-button field-13"
            onClick={() => handleFieldClick("field-13")}
            title="Click for help with Desired Length of Extension"
          >
            <span className="field-number">13</span>
          </button>

          <button
            className="field-button field-14"
            onClick={() => handleFieldClick("field-14")}
            title="Click for help with Reason for Extension"
          >
            <span className="field-number">14</span>
          </button>

          <button
            className="field-button field-15"
            onClick={() => handleFieldClick("field-15")}
            title="Click for help with Criminal Record"
          >
            <span className="field-number">15</span>
          </button>

          <button
            className="field-button field-16"
            onClick={() => handleFieldClick("field-16")}
            title="Click for help with Family in Japan"
          >
            <span className="field-number">16</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Popup */}
      {showAIPopup && (
        <div className="ai-popup-overlay" onClick={handleClosePopup}>
          <div
            className="ai-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ai-popup-header">
              <h3>🤖 AI Assistant - {getFieldInfo(selectedField).title}</h3>
              <button className="close-button" onClick={handleClosePopup}>
                ×
              </button>
            </div>
            <div className="ai-popup-body">
              <p>
                <strong>Description:</strong>
              </p>
              <p>{getFieldInfo(selectedField).description}</p>
              <p>
                <strong>Tips:</strong>
              </p>
              <ul>
                <li>Make sure to write clearly and accurately</li>
                <li>Use the exact format requested</li>
                <li>Double-check your information before submitting</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaForm;
