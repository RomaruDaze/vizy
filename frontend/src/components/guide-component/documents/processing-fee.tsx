import "./document.styles.css";

const ProcessingFee = () => {
  return (
    <div className="document-content">
      <div className="document-section">
        <h2>Description</h2>
        <p>The required fee for visa extension processing.</p>
      </div>

      <div className="document-section">
        <h2>Requirements</h2>
        <ul>
          <li>Must be paid in Japanese yen</li>
          <li>Amount varies by visa type and duration</li>
          <li>Payment methods vary by office</li>
          <li>Receipt must be kept</li>
        </ul>
      </div>

      <div className="document-section">
        <h2>Tips</h2>
        <ul>
          <li>Check current fees before applying</li>
          <li>Bring exact change if paying in cash</li>
          <li>Keep payment receipt safe</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessingFee;
