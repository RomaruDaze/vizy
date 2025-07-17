import "./document.styles.css";

const IDPhoto = () => {
  return (
    <div className="document-content">
      <div className="document-section">
        <h2>Description</h2>
        <p>
          Recent passport-style photograph meeting Japanese immigration
          standards.
        </p>
      </div>

      <div className="document-section">
        <h2>Requirements</h2>
        <ul>
          <li>Taken within the last 3 months</li>
          <li>4cm x 3cm size</li>
          <li>Plain white background</li>
          <li>No glasses or head coverings</li>
          <li>Neutral facial expression</li>
        </ul>
      </div>

      <div className="document-section">
        <h2>Tips</h2>
        <ul>
          <li>Use a professional photo service</li>
          <li>Ensure good lighting and clarity</li>
          <li>Follow Japanese photo standards exactly</li>
        </ul>
      </div>
    </div>
  );
};

export default IDPhoto;
