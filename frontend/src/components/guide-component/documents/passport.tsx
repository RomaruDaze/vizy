import "./document.styles.css";
import passport from "../../../../public/passport.svg";
import passportCover from "../../../../public/passport-cover.svg";

const Passport = () => {
  return (
    <div className="document-content">
      <div className="document-image">
        <img src={passportCover} alt="Passport Cover" />
        <img src={passport} alt="Passport" />
      </div>

      <div className="document-text">
        <h2>Passport</h2>
        <p>
          Your passport is one of the most important documents for visa
          extension. It serves as your primary identification and proof of
          nationality.
        </p>

        <div className="requirements-section">
          <h3>Requirements</h3>
          <ul>
            <li>Must be valid for the entire period of your stay</li>
            <li>Should have at least 2 blank pages</li>
            <li>Must be in good condition (no tears or damage)</li>
            <li>Should be the same passport used for your original visa</li>
            <li>Must not expire within 6 months of your application</li>
          </ul>
        </div>

        <div className="tips-section">
          <h3>Important Tips</h3>
          <ul>
            <li>Check your passport expiration date well in advance</li>
            <li>Make photocopies of all pages for your records</li>
            <li>Keep your passport in a safe, secure location</li>
            <li>If your passport is damaged, consider renewing it first</li>
            <li>
              Ensure all information in your passport is current and accurate
            </li>
          </ul>
        </div>

        <div className="warning-section">
          <h3>⚠️ Important Notes</h3>
          <p>
            If your passport is close to expiration, it's recommended to renew
            it before applying for a visa extension. A valid passport is
            essential for all immigration procedures.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Passport;
