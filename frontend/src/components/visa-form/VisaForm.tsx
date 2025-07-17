import { useState } from "react";
import "./visa-form.styles.css";
import visaForm1 from "../../assets/images/form-page1.jpg";
import visaForm2 from "../../assets/images/form-page2.jpg";

interface VisaFormProps {
  onBack: () => void;
}

const VisaForm = ({ onBack }: VisaFormProps) => {
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [selectedField, setSelectedField] = useState<string>("");

  // Separate state for each form
  const [form1State, setForm1State] = useState({
    zoomLevel: 1,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    panOffset: { x: 0, y: 0 },
    initialDistance: 0,
    initialZoom: 1,
  });

  const [form2State, setForm2State] = useState({
    zoomLevel: 1,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    panOffset: { x: 0, y: 0 },
    initialDistance: 0,
    initialZoom: 1,
  });

  // Add these state variables for touch handling
  const [form1TouchStart, setForm1TouchStart] = useState({
    x: 0,
    y: 0,
    time: 0,
  });
  const [form2TouchStart, setForm2TouchStart] = useState({
    x: 0,
    y: 0,
    time: 0,
  });

  const handleFieldClick = (fieldId: string) => {
    setSelectedField(fieldId);
    setShowAIPopup(true);
  };

  const handleClosePopup = () => {
    setShowAIPopup(false);
    setSelectedField("");
  };

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Add this function to constrain pan movement
  const constrainPan = (x: number, y: number, zoom: number) => {
    const containerWidth = 1200;
    const containerHeight = 800;
    const maxX = (containerWidth * zoom - containerWidth) / 2;
    const maxY = (containerHeight * zoom - containerHeight) / 2;

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // Form 1 handlers
  const handleForm1MouseDown = (e: React.MouseEvent) => {
    setForm1State((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: {
        x: e.clientX - prev.panOffset.x,
        y: e.clientY - prev.panOffset.y,
      },
    }));
  };

  const handleForm1MouseMove = (e: React.MouseEvent) => {
    if (form1State.isDragging) {
      const newPan = {
        x: e.clientX - form1State.dragStart.x,
        y: e.clientY - form1State.dragStart.y,
      };
      const constrained = constrainPan(
        newPan.x,
        newPan.y,
        form1State.zoomLevel
      );
      setForm1State((prev) => ({ ...prev, panOffset: constrained }));
    }
  };

  const handleForm1MouseUp = () => {
    setForm1State((prev) => ({ ...prev, isDragging: false }));
  };

  const handleForm1MouseLeave = () => {
    setForm1State((prev) => ({ ...prev, isDragging: false }));
  };

  const handleForm1TouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setForm1TouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      });
      // Don't set isDragging immediately - wait for movement
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setForm1State((prev) => ({
        ...prev,
        isDragging: false,
        initialDistance: distance,
        initialZoom: prev.zoomLevel,
      }));
    }
  };

  const handleForm1TouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - form1TouchStart.x);
      const deltaY = Math.abs(touch.clientY - form1TouchStart.y);
      const deltaTime = Date.now() - form1TouchStart.time;

      // Only start dragging if there's significant movement and it's been a short time
      if (
        !form1State.isDragging &&
        (deltaX > 10 || deltaY > 10) &&
        deltaTime < 300
      ) {
        setForm1State((prev) => ({
          ...prev,
          isDragging: true,
          dragStart: {
            x: touch.clientX - prev.panOffset.x,
            y: touch.clientY - prev.panOffset.y,
          },
        }));
      }

      if (form1State.isDragging) {
        e.preventDefault();
        const newPan = {
          x: touch.clientX - form1State.dragStart.x,
          y: touch.clientY - form1State.dragStart.y,
        };
        const constrained = constrainPan(
          newPan.x,
          newPan.y,
          form1State.zoomLevel
        );
        setForm1State((prev) => ({ ...prev, panOffset: constrained }));
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / form1State.initialDistance;
      const newZoom = Math.max(1, Math.min(3, form1State.initialZoom * scale));
      setForm1State((prev) => ({ ...prev, zoomLevel: newZoom }));
      const constrained = constrainPan(
        form1State.panOffset.x,
        form1State.panOffset.y,
        newZoom
      );
      setForm1State((prev) => ({ ...prev, panOffset: constrained }));
    }
    // If not dragging or zooming, don't prevent default - allow normal scrolling
  };

  const handleForm1TouchEnd = () => {
    setForm1State((prev) => ({
      ...prev,
      isDragging: false,
      initialDistance: 0,
    }));
    setForm1TouchStart({ x: 0, y: 0, time: 0 });
  };

  const handleForm1Wheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(1, Math.min(3, form1State.zoomLevel + delta));
      setForm1State((prev) => ({ ...prev, zoomLevel: newZoom }));
      const constrained = constrainPan(
        form1State.panOffset.x,
        form1State.panOffset.y,
        newZoom
      );
      setForm1State((prev) => ({ ...prev, panOffset: constrained }));
    }
  };

  // Form 2 handlers (same logic but for form2State)
  const handleForm2MouseDown = (e: React.MouseEvent) => {
    setForm2State((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: {
        x: e.clientX - prev.panOffset.x,
        y: e.clientY - prev.panOffset.y,
      },
    }));
  };

  const handleForm2MouseMove = (e: React.MouseEvent) => {
    if (form2State.isDragging) {
      const newPan = {
        x: e.clientX - form2State.dragStart.x,
        y: e.clientY - form2State.dragStart.y,
      };
      const constrained = constrainPan(
        newPan.x,
        newPan.y,
        form2State.zoomLevel
      );
      setForm2State((prev) => ({ ...prev, panOffset: constrained }));
    }
  };

  const handleForm2MouseUp = () => {
    setForm2State((prev) => ({ ...prev, isDragging: false }));
  };

  const handleForm2MouseLeave = () => {
    setForm2State((prev) => ({ ...prev, isDragging: false }));
  };

  const handleForm2TouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setForm2TouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      });
      // Don't set isDragging immediately - wait for movement
    } else if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setForm2State((prev) => ({
        ...prev,
        isDragging: false,
        initialDistance: distance,
        initialZoom: prev.zoomLevel,
      }));
    }
  };

  const handleForm2TouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - form2TouchStart.x);
      const deltaY = Math.abs(touch.clientY - form2TouchStart.y);
      const deltaTime = Date.now() - form2TouchStart.time;

      // Only start dragging if there's significant movement and it's been a short time
      if (
        !form2State.isDragging &&
        (deltaX > 10 || deltaY > 10) &&
        deltaTime < 300
      ) {
        setForm2State((prev) => ({
          ...prev,
          isDragging: true,
          dragStart: {
            x: touch.clientX - prev.panOffset.x,
            y: touch.clientY - prev.panOffset.y,
          },
        }));
      }

      if (form2State.isDragging) {
        e.preventDefault();
        const newPan = {
          x: touch.clientX - form2State.dragStart.x,
          y: touch.clientY - form2State.dragStart.y,
        };
        const constrained = constrainPan(
          newPan.x,
          newPan.y,
          form2State.zoomLevel
        );
        setForm2State((prev) => ({ ...prev, panOffset: constrained }));
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / form2State.initialDistance;
      const newZoom = Math.max(1, Math.min(3, form2State.initialZoom * scale));
      setForm2State((prev) => ({ ...prev, zoomLevel: newZoom }));
      const constrained = constrainPan(
        form2State.panOffset.x,
        form2State.panOffset.y,
        newZoom
      );
      setForm2State((prev) => ({ ...prev, panOffset: constrained }));
    }
    // If not dragging or zooming, don't prevent default - allow normal scrolling
  };

  const handleForm2TouchEnd = () => {
    setForm2State((prev) => ({
      ...prev,
      isDragging: false,
      initialDistance: 0,
    }));
    setForm2TouchStart({ x: 0, y: 0, time: 0 });
  };

  const handleForm2Wheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(1, Math.min(3, form2State.zoomLevel + delta));
      setForm2State((prev) => ({ ...prev, zoomLevel: newZoom }));
      const constrained = constrainPan(
        form2State.panOffset.x,
        form2State.panOffset.y,
        newZoom
      );
      setForm2State((prev) => ({ ...prev, panOffset: constrained }));
    }
  };

  // Add reset handlers
  const handleForm1Reset = () => {
    setForm1State({
      zoomLevel: 1,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      panOffset: { x: 0, y: 0 },
      initialDistance: 0,
      initialZoom: 1,
    });
  };

  const handleForm2Reset = () => {
    setForm2State({
      zoomLevel: 1,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      panOffset: { x: 0, y: 0 },
      initialDistance: 0,
      initialZoom: 1,
    });
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
      {/* Header */}
      <div className="form-header">
        <button className="back-button-form" onClick={onBack}>
          <img src="https://img.icons8.com/sf-black-filled/100/back.png" />
        </button>
        <h1>Application Form Guide</h1>
      </div>
      <div className="form-container-wrapper">
        {/* Scrollable Content Container */}
        <div className="scrollable-content">
          <p>＜＜＜＜＜ scroll here ＞＞＞＞＞</p>
        </div>
        <div className="form-container">
          {/* Form 1 */}
          <div
            className="form-1-image-container"
            onMouseDown={handleForm1MouseDown}
            onMouseMove={handleForm1MouseMove}
            onMouseUp={handleForm1MouseUp}
            onMouseLeave={handleForm1MouseLeave}
            onTouchStart={handleForm1TouchStart}
            onTouchMove={handleForm1TouchMove}
            onTouchEnd={handleForm1TouchEnd}
            onWheel={handleForm1Wheel}
            style={{ cursor: form1State.isDragging ? "grabbing" : "grab" }}
          >
            {/* Reset Button for Form 1 */}
            {form1State.zoomLevel > 1 && (
              <button
                className="reset-button-form"
                onClick={handleForm1Reset}
                title="Reset zoom and position"
              >
                ↺
              </button>
            )}

            <div
              className="form-content-wrapper"
              style={{
                transform: `translate(${form1State.panOffset.x}px, ${form1State.panOffset.y}px) scale(${form1State.zoomLevel})`,
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
        </div>
      </div>

      {/* Form 2 */}
      <div
        className="form-2-image-container"
        onMouseDown={handleForm2MouseDown}
        onMouseMove={handleForm2MouseMove}
        onMouseUp={handleForm2MouseUp}
        onMouseLeave={handleForm2MouseLeave}
        onTouchStart={handleForm2TouchStart}
        onTouchMove={handleForm2TouchMove}
        onTouchEnd={handleForm2TouchEnd}
        onWheel={handleForm2Wheel}
        style={{ cursor: form2State.isDragging ? "grabbing" : "grab" }}
      >
        {/* Reset Button for Form 2 */}
        {form2State.zoomLevel > 1 && (
          <button
            className="reset-button-form"
            onClick={handleForm2Reset}
            title="Reset zoom and position"
          >
            ↺
          </button>
        )}

        <div
          className="form-content-wrapper"
          style={{
            transform: `translate(${form2State.panOffset.x}px, ${form2State.panOffset.y}px) scale(${form2State.zoomLevel})`,
            transformOrigin: "center",
          }}
        >
          <img
            src={visaForm2}
            alt="Visa Extension Application Form"
            className="form-image"
            draggable={false}
          />

          {/* Interactive Field Buttons for Form 2 */}
          <button
            className="field-button field-17"
            onClick={() => handleFieldClick("field-17")}
            title="Click for help with Nationality/Region"
          >
            <span className="field-number">17</span>
          </button>

          <button
            className="field-button field-18"
            onClick={() => handleFieldClick("field-18")}
            title="Click for help with Date of Birth"
          >
            <span className="field-number">18</span>
          </button>

          <button
            className="field-button field-19"
            onClick={() => handleFieldClick("field-19")}
            title="Click for help with Name"
          >
            <span className="field-number">19</span>
          </button>

          <button
            className="field-button field-20"
            onClick={() => handleFieldClick("field-20")}
            title="Click for help with Sex"
          >
            <span className="field-number">20</span>
          </button>

          <button
            className="field-button field-21"
            onClick={() => handleFieldClick("field-21")}
            title="Click for help with Marital Status"
          >
            <span className="field-number">21</span>
          </button>

          <button
            className="field-button field-22"
            onClick={() => handleFieldClick("field-22")}
            title="Click for help with Occupation"
          >
            <span className="field-number">22</span>
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
              <h3>{getFieldInfo(selectedField).title}</h3>
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
