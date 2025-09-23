import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const ApplicationDocument = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/user-guide");
  };

  return (
    <div className="document-page">
      <div className="document-header">
        <button className="back-button" onClick={handleBack}>
          <img
            src="https://img.icons8.com/sf-black-filled/100/FFFFFF/back.png"
            alt="Back"
          />
        </button>
        <h1>Application Extension Form (在留期間更新許可申請書)</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is an Application Extension Form?</h2>
          <p>
            The Application for Extension of Period of Stay
            (在留期間更新許可申請書) is an official form required by the
            Immigration Bureau for extending your stay in Japan. This form must
            be filled out completely and accurately with all required
            information.
          </p>
          <p>
            <strong>Form Number:</strong> 在留期間更新許可申請書 (Form 4-1-1)
          </p>
        </div>

        <div className="document-section">
          <h2>When to Submit</h2>
          <ul>
            <li>
              <strong>Timing:</strong> Submit 2-3 months before your current
              visa expires
            </li>
            <li>
              <strong>Deadline:</strong> At least 2 weeks before expiration
              (earlier is better)
            </li>
            <li>
              <strong>Processing Time:</strong> 2-4 weeks for standard
              processing
            </li>
            <li>
              <strong>Emergency:</strong> If your visa expires soon, contact
              immigration immediately
            </li>
          </ul>
        </div>

        <div className="document-section">
          <h2>How to Obtain the Form</h2>
          <div className="obtain-methods">
            <div className="method">
              <h3>🌐 Online Download</h3>
              <p>
                Download from the Immigration Bureau website (immigration.go.jp)
              </p>
              <ul>
                <li>Available in Japanese and English</li>
                <li>PDF format - print on A4 paper</li>
                <li>Latest version always available</li>
              </ul>
            </div>
            <div className="method">
              <h3>🏢 Immigration Office</h3>
              <p>Pick up in person at your local immigration office</p>
              <ul>
                <li>Free of charge</li>
                <li>Get assistance from staff if needed</li>
                <li>Multiple language versions available</li>
              </ul>
            </div>
            <div className="method">
              <h3>📮 By Mail</h3>
              <p>Request by mail from the Immigration Bureau</p>
              <ul>
                <li>Include self-addressed envelope</li>
                <li>Allow 1-2 weeks for delivery</li>
                <li>Specify language preference</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Step-by-Step Filling Instructions</h2>

          <div className="form-section">
            <h3>Section 1: Personal Information (個人情報)</h3>
            <div className="field-explanation">
              <h4>1. Full Name (氏名)</h4>
              <ul>
                <li>Write exactly as shown on your passport</li>
                <li>Use the same spelling and order</li>
                <li>Include middle names if applicable</li>
                <li>
                  <strong>Common mistake:</strong> Using nicknames or different
                  spellings
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>2. Date of Birth (生年月日)</h4>
              <ul>
                <li>Format: YYYY年MM月DD日 (e.g., 1990年03月15日)</li>
                <li>Use Japanese calendar format</li>
                <li>Double-check the year (Reiwa, Heisei, Showa)</li>
                <li>
                  <strong>Common mistake:</strong> Wrong calendar era conversion
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>3. Nationality (国籍)</h4>
              <ul>
                <li>Write your country of citizenship</li>
                <li>Use official country name in Japanese</li>
                <li>
                  Examples: アメリカ合衆国, イギリス, オーストラリア, カナダ
                </li>
                <li>
                  <strong>Common mistake:</strong> Using English country names
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>4. Passport Number (旅券番号)</h4>
              <ul>
                <li>Letters and numbers only (no spaces or hyphens)</li>
                <li>Include all characters exactly as shown</li>
                <li>Check for similar-looking characters (0 vs O, 1 vs I)</li>
                <li>
                  <strong>Common mistake:</strong> Adding spaces or special
                  characters
                </li>
              </ul>
            </div>
          </div>

          <div className="form-section">
            <h3>Section 2: Current Status (現在の在留状況)</h3>
            <div className="field-explanation">
              <h4>5. Current Status of Residence (現在の在留資格)</h4>
              <ul>
                <li>
                  Write your current visa type exactly as shown on your
                  residence card
                </li>
                <li>Examples: 技術・人文知識・国際業務, 留学, 家族滞在</li>
                <li>Use the official Japanese terminology</li>
                <li>
                  <strong>Common mistake:</strong> Using English visa type names
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>6. Current Visa Expiry Date (現在の在留期間満了日)</h4>
              <ul>
                <li>Format: YYYY年MM月DD日</li>
                <li>Check your residence card for the exact date</li>
                <li>This is the date your current visa expires</li>
                <li>
                  <strong>Common mistake:</strong> Confusing issue date with
                  expiry date
                </li>
              </ul>
            </div>
          </div>

          <div className="form-section">
            <h3>Section 3: Requested Status (希望する在留資格)</h3>
            <div className="field-explanation">
              <h4>7. Requested Period of Stay (希望する在留期間)</h4>
              <ul>
                <li>Usually the same as your current visa type</li>
                <li>If changing visa types, explain in the reason section</li>
                <li>Maximum period depends on your visa type</li>
                <li>
                  <strong>Common mistake:</strong> Requesting longer period than
                  allowed
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>8. Reason for Extension (在留期間更新の理由)</h4>
              <ul>
                <li>Be specific and detailed</li>
                <li>Explain why you need to stay longer</li>
                <li>Mention your current activities (work, study, etc.)</li>
                <li>
                  <strong>Common mistake:</strong> Being too vague or generic
                </li>
              </ul>
            </div>
          </div>

          <div className="form-section">
            <h3>Section 4: Contact Information (連絡先情報)</h3>
            <div className="field-explanation">
              <h4>9. Current Address (現在の住所)</h4>
              <ul>
                <li>Write your current address in Japan</li>
                <li>Include postal code (郵便番号)</li>
                <li>Use the address format: 〒123-4567 東京都渋谷区...</li>
                <li>
                  <strong>Common mistake:</strong> Using old address or wrong
                  postal code
                </li>
              </ul>
            </div>

            <div className="field-explanation">
              <h4>10. Phone Number (電話番号)</h4>
              <ul>
                <li>Include area code (e.g., 03-1234-5678)</li>
                <li>Use a number where you can be reached</li>
                <li>Include mobile number if different</li>
                <li>
                  <strong>Common mistake:</strong> Using international format
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Required Supporting Documents</h2>
          <div className="documents-list">
            <div className="document-category">
              <h3>Essential Documents (必須書類)</h3>
              <ul>
                <li>✅ Current passport (original + copy)</li>
                <li>✅ Residence card (original + copy)</li>
                <li>✅ ID photo (4cm x 3cm, taken within 3 months)</li>
                <li>✅ Application fee (4,000 yen revenue stamp)</li>
              </ul>
            </div>

            <div className="document-category">
              <h3>Work Visa Documents (就労ビザ)</h3>
              <ul>
                <li>✅ Certificate of Employment (在職証明書)</li>
                <li>
                  ✅ Company registration certificate (法人登録事項証明書)
                </li>
                <li>✅ Tax payment certificate (納税証明書)</li>
                <li>✅ Salary certificate (給与証明書)</li>
              </ul>
            </div>

            <div className="document-category">
              <h3>Student Visa Documents (留学ビザ)</h3>
              <ul>
                <li>✅ Certificate of enrollment (在学証明書)</li>
                <li>✅ Academic transcript (成績証明書)</li>
                <li>✅ Bank balance certificate (残高証明書)</li>
                <li>
                  ✅ Scholarship certificate (奨学金証明書) - if applicable
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Common Mistakes to Avoid</h2>
          <div className="mistakes-list">
            <div className="mistake-category">
              <h3>❌ Form Filling Errors</h3>
              <ul>
                <li>Leaving fields blank (use "なし" if not applicable)</li>
                <li>Using pencil instead of pen</li>
                <li>Writing outside the designated boxes</li>
                <li>Using correction fluid or tape</li>
                <li>Inconsistent handwriting (mix of print and cursive)</li>
              </ul>
            </div>

            <div className="mistake-category">
              <h3>❌ Information Errors</h3>
              <ul>
                <li>Name spelling different from passport</li>
                <li>Wrong date format or calendar era</li>
                <li>Incorrect visa type or status</li>
                <li>Outdated address or contact information</li>
                <li>Missing required documents</li>
              </ul>
            </div>

            <div className="mistake-category">
              <h3>❌ Submission Errors</h3>
              <ul>
                <li>Submitting too close to expiry date</li>
                <li>Missing application fee</li>
                <li>Incomplete document set</li>
                <li>Wrong immigration office</li>
                <li>Not making copies for personal records</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Processing Timeline</h2>
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Submission (提出)</h3>
                <p>Submit application and documents at immigration office</p>
                <p>
                  <strong>Time:</strong> 30-60 minutes
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Initial Review (初回審査)</h3>
                <p>Staff checks completeness and basic requirements</p>
                <p>
                  <strong>Time:</strong> 1-3 days
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Detailed Review (詳細審査)</h3>
                <p>Immigration officers review all documents and information</p>
                <p>
                  <strong>Time:</strong> 2-3 weeks
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Decision (決定)</h3>
                <p>Approval or rejection decision is made</p>
                <p>
                  <strong>Time:</strong> 1-2 days
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Notification (通知)</h3>
                <p>You receive postcard notification to pick up result</p>
                <p>
                  <strong>Time:</strong> 1-2 days
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Important Tips</h2>
          <div className="tips-grid">
            <div className="tip">
              <h3>📝 Before Filling</h3>
              <ul>
                <li>Read all instructions carefully</li>
                <li>Gather all required documents first</li>
                <li>Make copies of everything</li>
                <li>Use a black pen with good ink flow</li>
              </ul>
            </div>

            <div className="tip">
              <h3>✍️ While Filling</h3>
              <ul>
                <li>Write clearly and legibly</li>
                <li>Use consistent handwriting style</li>
                <li>Double-check all information</li>
                <li>Don't rush - take your time</li>
              </ul>
            </div>

            <div className="tip">
              <h3>📋 Before Submitting</h3>
              <ul>
                <li>Review every field carefully</li>
                <li>Ensure all documents are included</li>
                <li>Check that photos meet requirements</li>
                <li>Verify application fee is correct</li>
              </ul>
            </div>

            <div className="tip">
              <h3> After Submitting</h3>
              <ul>
                <li>Keep your receipt safe</li>
                <li>Don't leave Japan while processing</li>
                <li>Check your mailbox regularly</li>
                <li>Contact immigration if no response after 4 weeks</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Emergency Situations</h2>
          <div className="emergency-info">
            <h3>What to do if your visa expires soon:</h3>
            <ol>
              <li>
                <strong>Immediate Action:</strong> Contact your local
                immigration office immediately
              </li>
              <li>
                <strong>Explain:</strong> Tell them your situation and why
                you're late
              </li>
              <li>
                <strong>Submit:</strong> File your application as soon as
                possible
              </li>
              <li>
                <strong>Stay:</strong> Don't leave Japan until you get a
                decision
              </li>
              <li>
                <strong>Follow up:</strong> Check status regularly and respond
                to requests
              </li>
            </ol>

            <h3>What to do if your application is rejected:</h3>
            <ol>
              <li>
                <strong>Review:</strong> Read the rejection notice carefully
              </li>
              <li>
                <strong>Identify:</strong> Understand the reasons for rejection
              </li>
              <li>
                <strong>Correct:</strong> Fix the issues mentioned
              </li>
              <li>
                <strong>Reapply:</strong> Submit a new application with
                corrections
              </li>
              <li>
                <strong>Seek help:</strong> Consider consulting an immigration
                lawyer
              </li>
            </ol>
          </div>
        </div>

        <div className="document-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <h3>Immigration Bureau Headquarters</h3>
            <p>
              <strong>Phone:</strong> 03-3580-4111
            </p>
            <p>
              <strong>Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM
            </p>
            <p>
              <strong>Website:</strong> immigration.go.jp
            </p>

            <h3>Find Your Local Office</h3>
            <p>
              Use the <strong>Locator</strong> tab in this app to find the
              nearest immigration office to your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDocument;
