import { useNavigate } from "react-router-dom";
import "./documents.styles.css";

const PassportDocument = () => {
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
        <h1>Passport (旅券)</h1>
      </div>

      <div className="document-content">
        <div className="document-section">
          <h2>What is a Passport?</h2>
          <p>
            A passport is an official travel document issued by your home
            country's government that serves as proof of your identity and
            nationality when traveling internationally. For visa applications in
            Japan, your passport is the primary identification document.
          </p>
          <p>
            <strong>Important:</strong> Your passport must be valid for at least
            6 months beyond your intended stay in Japan and have sufficient
            blank pages for visa stamps.
          </p>
        </div>

        <div className="document-section">
          <h2>Passport Requirements for Visa Applications</h2>
          <div className="requirements-grid">
            <div className="requirement-card">
              <h3>✅ Validity Period</h3>
              <ul>
                <li>
                  Must be valid for at least 6 months beyond your intended stay
                </li>
                <li>Check expiry date before applying for visa extension</li>
                <li>Renew if expiring within 6 months</li>
                <li>
                  <strong>Common mistake:</strong> Applying with passport
                  expiring soon
                </li>
              </ul>
            </div>

            <div className="requirement-card">
              <h3>📄 Blank Pages</h3>
              <ul>
                <li>At least 2 blank pages required for visa stamps</li>
                <li>Pages must be completely blank (no stamps or markings)</li>
                <li>Check both visa pages and endorsement pages</li>
                <li>
                  <strong>Common mistake:</strong> Not having enough blank pages
                </li>
              </ul>
            </div>

            <div className="requirement-card">
              <h3> Physical Condition</h3>
              <ul>
                <li>No tears, water damage, or excessive wear</li>
                <li>All pages must be intact and readable</li>
                <li>Cover should not be damaged or separated</li>
                <li>
                  <strong>Common mistake:</strong> Submitting damaged passport
                </li>
              </ul>
            </div>

            <div className="requirement-card">
              <h3> Machine Readable</h3>
              <ul>
                <li>Must be machine-readable (issued after 2006)</li>
                <li>Biometric passport preferred (e-passport)</li>
                <li>MRZ (Machine Readable Zone) must be clear</li>
                <li>
                  <strong>Common mistake:</strong> Using very old passport
                  format
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>How to Obtain a New Passport</h2>
          <div className="obtain-methods">
            <div className="method">
              <h3>🏢 Embassy/Consulate (Recommended)</h3>
              <p>Apply at your home country's embassy or consulate in Japan</p>
              <ul>
                <li>Most convenient for residents in Japan</li>
                <li>Staff can assist with application process</li>
                <li>Usually faster processing than home country</li>
                <li>Can handle emergency situations</li>
              </ul>
              <div className="method-steps">
                <h4>Steps:</h4>
                <ol>
                  <li>Check embassy website for requirements</li>
                  <li>Download and fill application form</li>
                  <li>Gather required documents and photos</li>
                  <li>Make appointment (if required)</li>
                  <li>Submit application in person</li>
                  <li>Pay applicable fees</li>
                  <li>Collect new passport when ready</li>
                </ol>
              </div>
            </div>

            <div className="method">
              <h3>🏠 Home Country</h3>
              <p>Apply at passport office in your home country</p>
              <ul>
                <li>Usually cheapest option</li>
                <li>Can use existing documents more easily</li>
                <li>May require someone to collect for you</li>
                <li>Longer processing time if not in person</li>
              </ul>
              <div className="method-steps">
                <h4>Steps:</h4>
                <ol>
                  <li>Visit official passport office website</li>
                  <li>Complete online application form</li>
                  <li>Gather required documents</li>
                  <li>Submit application in person or by mail</li>
                  <li>Pay processing fees</li>
                  <li>Track application status online</li>
                  <li>Receive passport by mail or pickup</li>
                </ol>
              </div>
            </div>

            <div className="method">
              <h3>🚨 Emergency Passport</h3>
              <p>For urgent travel situations</p>
              <ul>
                <li>Available at embassies/consulates</li>
                <li>Limited validity (usually 1 year)</li>
                <li>Higher fees apply</li>
                <li>Must prove emergency need</li>
              </ul>
              <div className="method-steps">
                <h4>Steps:</h4>
                <ol>
                  <li>Contact embassy immediately</li>
                  <li>Explain emergency situation</li>
                  <li>Provide proof of urgent travel</li>
                  <li>Submit minimal required documents</li>
                  <li>Pay emergency processing fees</li>
                  <li>Receive temporary passport</li>
                  <li>Apply for full passport later</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Required Documents for Passport Application</h2>
          <div className="documents-list">
            <div className="document-category">
              <h3>Essential Documents (必須書類)</h3>
              <ul>
                <li>✅ Completed passport application form</li>
                <li>✅ Current passport (if renewing)</li>
                <li>✅ Birth certificate (original + copy)</li>
                <li>✅ National ID card (original + copy)</li>
                <li>✅ Passport photos (2-4 copies, recent)</li>
                <li>✅ Application fee payment</li>
              </ul>
            </div>

            <div className="document-category">
              <h3>Additional Documents (追加書類)</h3>
              <ul>
                <li>✅ Marriage certificate (if name changed)</li>
                <li>✅ Divorce decree (if applicable)</li>
                <li>✅ Court order (if name changed by court)</li>
                <li>✅ Naturalization certificate (if applicable)</li>
                <li>✅ Police report (if passport lost/stolen)</li>
                <li>✅ Affidavit of loss (if applicable)</li>
              </ul>
            </div>

            <div className="document-category">
              <h3>For Minors (未成年者)</h3>
              <ul>
                <li>✅ Both parents' consent forms</li>
                <li>✅ Parents' identification documents</li>
                <li>✅ Court order (if one parent has custody)</li>
                <li>✅ Guardian's documents (if applicable)</li>
                <li>✅ School enrollment certificate</li>
                <li>✅ Additional photos (if required)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Passport Photo Requirements</h2>
          <div className="photo-requirements">
            <div className="photo-specs">
              <h3>📏 Size and Format</h3>
              <ul>
                <li>
                  <strong>Size:</strong> 2 inches x 2 inches (51mm x 51mm)
                </li>
                <li>
                  <strong>Format:</strong> Color photo, not black and white
                </li>
                <li>
                  <strong>Background:</strong> Plain white or off-white
                </li>
                <li>
                  <strong>Quality:</strong> High resolution, clear and sharp
                </li>
              </ul>
            </div>

            <div className="photo-specs">
              <h3>👤 Appearance Requirements</h3>
              <ul>
                <li>
                  <strong>Expression:</strong> Neutral expression, mouth closed
                </li>
                <li>
                  <strong>Eyes:</strong> Open and looking directly at camera
                </li>
                <li>
                  <strong>Head:</strong> Centered, face taking up 70-80% of
                  photo
                </li>
                <li>
                  <strong>Clothing:</strong> Plain, everyday clothing (no
                  uniforms)
                </li>
              </ul>
            </div>

            <div className="photo-specs">
              <h3> What NOT to Wear</h3>
              <ul>
                <li>No hats, caps, or head coverings (except religious)</li>
                <li>No sunglasses or tinted glasses</li>
                <li>No headphones or earbuds</li>
                <li>No jewelry that obscures face</li>
                <li>No military or uniform clothing</li>
              </ul>
            </div>

            <div className="photo-specs">
              <h3> Recency Requirements</h3>
              <ul>
                <li>
                  <strong>Age:</strong> Taken within last 6 months
                </li>
                <li>
                  <strong>Appearance:</strong> Must reflect current appearance
                </li>
                <li>
                  <strong>Changes:</strong> Update if significant changes
                  (surgery, etc.)
                </li>
                <li>
                  <strong>Multiple photos:</strong> Use same photo for all
                  copies
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Processing Times and Fees</h2>
          <div className="processing-info">
            <div className="processing-type">
              <h3>🕐 Standard Processing</h3>
              <ul>
                <li>
                  <strong>Time:</strong> 4-6 weeks
                </li>
                <li>
                  <strong>Cost:</strong> $110-165 USD (varies by country)
                </li>
                <li>
                  <strong>Best for:</strong> Non-urgent applications
                </li>
                <li>
                  <strong>Delivery:</strong> Regular mail or pickup
                </li>
              </ul>
            </div>

            <div className="processing-type">
              <h3>⚡ Expedited Processing</h3>
              <ul>
                <li>
                  <strong>Time:</strong> 2-3 weeks
                </li>
                <li>
                  <strong>Cost:</strong> $170-220 USD (varies by country)
                </li>
                <li>
                  <strong>Best for:</strong> Urgent travel needs
                </li>
                <li>
                  <strong>Delivery:</strong> Express mail or pickup
                </li>
              </ul>
            </div>

            <div className="processing-type">
              <h3> Emergency Processing</h3>
              <ul>
                <li>
                  <strong>Time:</strong> 24-48 hours
                </li>
                <li>
                  <strong>Cost:</strong> $200-300 USD (varies by country)
                </li>
                <li>
                  <strong>Best for:</strong> Life-or-death emergencies
                </li>
                <li>
                  <strong>Delivery:</strong> Immediate pickup only
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Common Mistakes to Avoid</h2>
          <div className="mistakes-list">
            <div className="mistake-category">
              <h3>❌ Application Errors</h3>
              <ul>
                <li>Incorrect information on application form</li>
                <li>Missing required documents</li>
                <li>Using old photos that don't look like you</li>
                <li>Not signing the application form</li>
                <li>Submitting incomplete payment</li>
              </ul>
            </div>

            <div className="mistake-category">
              <h3>❌ Photo Mistakes</h3>
              <ul>
                <li>Wrong size or format</li>
                <li>Inappropriate background color</li>
                <li>Wearing prohibited items (hats, sunglasses)</li>
                <li>Using old photos (over 6 months old)</li>
                <li>Poor quality or blurry images</li>
              </ul>
            </div>

            <div className="mistake-category">
              <h3>❌ Timing Mistakes</h3>
              <ul>
                <li>Applying too close to travel date</li>
                <li>Not accounting for processing delays</li>
                <li>Forgetting to renew before expiry</li>
                <li>Not checking visa requirements</li>
                <li>Assuming expedited service is always available</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Passport Security and Safety</h2>
          <div className="security-tips">
            <div className="security-category">
              <h3>🔒 Keep It Safe</h3>
              <ul>
                <li>Store in a secure location when not traveling</li>
                <li>Never leave unattended in public places</li>
                <li>Use hotel safe when traveling</li>
                <li>Keep separate from other important documents</li>
                <li>Consider using a passport holder or wallet</li>
              </ul>
            </div>

            <div className="security-category">
              <h3> Make Copies</h3>
              <ul>
                <li>Photocopy the information page</li>
                <li>Store copies in different locations</li>
                <li>Keep digital copies in secure cloud storage</li>
                <li>Give copies to trusted family/friends</li>
                <li>Carry copies when traveling (not original)</li>
              </ul>
            </div>

            <div className="security-category">
              <h3>🚨 If Lost or Stolen</h3>
              <ul>
                <li>Report immediately to local police</li>
                <li>Contact your embassy/consulate right away</li>
                <li>File a police report and get a copy</li>
                <li>Apply for emergency passport if needed</li>
                <li>Notify relevant authorities (banks, etc.)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Passport Renewal Timeline</h2>
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Check Expiry Date</h3>
                <p>Verify when your passport expires</p>
                <p>
                  <strong>Time:</strong> Check 6 months before travel
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Gather Documents</h3>
                <p>Collect all required documents and photos</p>
                <p>
                  <strong>Time:</strong> 1-2 weeks
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Submit application at embassy or passport office</p>
                <p>
                  <strong>Time:</strong> 1 day
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Processing</h3>
                <p>Passport office processes your application</p>
                <p>
                  <strong>Time:</strong> 4-6 weeks (standard)
                </p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Collection</h3>
                <p>Pick up your new passport</p>
                <p>
                  <strong>Time:</strong> 1 day
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Important Tips</h2>
          <div className="tips-grid">
            <div className="tip">
              <h3> Plan Ahead</h3>
              <ul>
                <li>Check expiry date 6 months before travel</li>
                <li>Apply for renewal early to avoid rush</li>
                <li>Consider processing delays during peak seasons</li>
                <li>Have backup plans if delays occur</li>
              </ul>
            </div>

            <div className="tip">
              <h3>📸 Photo Quality</h3>
              <ul>
                <li>Use professional photo service</li>
                <li>Follow all size and format requirements</li>
                <li>Take multiple photos to choose from</li>
                <li>Keep extra copies for future use</li>
              </ul>
            </div>

            <div className="tip">
              <h3>📋 Documentation</h3>
              <ul>
                <li>Make copies of everything before submitting</li>
                <li>Keep receipts and tracking numbers</li>
                <li>Take photos of documents with phone</li>
                <li>Store important info in multiple places</li>
              </ul>
            </div>

            <div className="tip">
              <h3> Budget Planning</h3>
              <ul>
                <li>Factor in processing fees</li>
                <li>Consider expedited service costs</li>
                <li>Budget for photo services</li>
                <li>Plan for potential travel to embassy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="document-section">
          <h2>Emergency Situations</h2>
          <div className="emergency-info">
            <h3>What to do if your passport is lost or stolen:</h3>
            <ol>
              <li>
                <strong>Immediate Action:</strong> Report to local police and
                get a police report
              </li>
              <li>
                <strong>Contact Embassy:</strong> Call your embassy/consulate
                immediately
              </li>
              <li>
                <strong>Gather Documents:</strong> Collect any remaining
                identification documents
              </li>
              <li>
                <strong>Apply for Emergency Passport:</strong> Submit
                application for temporary passport
              </li>
              <li>
                <strong>Follow Up:</strong> Apply for full passport replacement
                when possible
              </li>
            </ol>

            <h3>What to do if your passport expires soon:</h3>
            <ol>
              <li>
                <strong>Check Validity:</strong> Verify if you have enough time
                for renewal
              </li>
              <li>
                <strong>Choose Processing:</strong> Select standard or expedited
                service
              </li>
              <li>
                <strong>Gather Documents:</strong> Collect all required
                materials quickly
              </li>
              <li>
                <strong>Submit Application:</strong> Apply as soon as possible
              </li>
              <li>
                <strong>Track Progress:</strong> Monitor application status
                regularly
              </li>
            </ol>
          </div>
        </div>

        <div className="document-section">
          <h2>Country-Specific Information</h2>
          <div className="country-info">
            <h3>🇺🇸 United States</h3>
            <ul>
              <li>
                <strong>Processing Time:</strong> 4-6 weeks standard, 2-3 weeks
                expedited
              </li>
              <li>
                <strong>Cost:</strong> $130 standard, $190 expedited
              </li>
              <li>
                <strong>Website:</strong> travel.state.gov
              </li>
              <li>
                <strong>Embassy Tokyo:</strong> 03-3224-5000
              </li>
            </ul>

            <h3>🇬🇧 United Kingdom</h3>
            <ul>
              <li>
                <strong>Processing Time:</strong> 3 weeks standard, 1 week fast
                track
              </li>
              <li>
                <strong>Cost:</strong> £75.50 standard, £142 fast track
              </li>
              <li>
                <strong>Website:</strong> gov.uk/british-passport
              </li>
              <li>
                <strong>Embassy Tokyo:</strong> 03-5211-1100
              </li>
            </ul>

            <h3>🇺 Australia</h3>
            <ul>
              <li>
                <strong>Processing Time:</strong> 3 weeks standard, 2 business
                days urgent
              </li>
              <li>
                <strong>Cost:</strong> A$301 standard, A$456 urgent
              </li>
              <li>
                <strong>Website:</strong> passports.gov.au
              </li>
              <li>
                <strong>Embassy Tokyo:</strong> 03-5232-4111
              </li>
            </ul>

            <h3>🇨🇦 Canada</h3>
            <ul>
              <li>
                <strong>Processing Time:</strong> 20 business days standard, 2-9
                days urgent
              </li>
              <li>
                <strong>Cost:</strong> C$120 standard, C$160 urgent
              </li>
              <li>
                <strong>Website:</strong> canada.ca/passport
              </li>
              <li>
                <strong>Embassy Tokyo:</strong> 03-5412-6200
              </li>
            </ul>
          </div>
        </div>

        <div className="document-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <h3>General Passport Information</h3>
            <p>
              <strong>Emergency Hotline:</strong> Contact your embassy's
              emergency line
            </p>
            <p>
              <strong>Online Resources:</strong> Check embassy websites for
              latest information
            </p>
            <p>
              <strong>Appointment Booking:</strong> Most embassies require
              appointments
            </p>

            <h3>Find Your Embassy</h3>
            <p>
              Use the <strong>Locator</strong> tab in this app to find the
              nearest embassy or consulate to your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportDocument;
