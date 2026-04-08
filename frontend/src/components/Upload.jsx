const HINTS = [
  { label: 'Phone', fileName: 'phone-cracked.jpg' },
  { label: 'Laptop', fileName: 'used-laptop.png' },
  { label: 'Battery', fileName: 'battery-pack.jpg' },
  { label: 'Monitor', fileName: 'monitor-old.jpg' },
  { label: 'Printer', fileName: 'printer-broken.jpg' }
];

function Upload({
  selectedFile,
  selectedFileName,
  selectedSample,
  loading,
  onAnalyze,
  onFileChange,
  onLoadSample
}) {
  const handleInputChange = (event) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="upload-card card">
      <div className="section-label">Upload / Simulate</div>
      <h2>Test the valuation engine</h2>
      <p className="muted">
        Rename your file to phone, laptop, battery, monitor, or printer to make the demo deterministic.
      </p>

      <label className="file-drop">
        <input type="file" accept="image/*" onChange={handleInputChange} />
        <span>
          {selectedFile ? selectedFile.name : 'Choose an image file'}
          <br />
          <small style={{ display: 'block', marginTop: 8, color: '#94a3b8' }}>
            {selectedFile ? 'File selected successfully' : 'Click to browse or drag a sample into the flow'}
          </small>
        </span>
      </label>

      <div className="hint-row">
        {HINTS.map((item) => (
          <button
            key={item.fileName}
            type="button"
            className={`chip ${selectedFileName === item.fileName ? 'active' : ''}`}
            onClick={() => onLoadSample(item.fileName)}
            disabled={loading}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="inline-actions">
        <button type="button" className="btn primary" onClick={onAnalyze} disabled={loading}>
          {loading ? 'Running…' : 'Analyze Waste'}
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => onLoadSample(selectedSample.fileName)}
          disabled={loading}
        >
          Use sample
        </button>
      </div>
    </div>
  );
}

export default Upload;