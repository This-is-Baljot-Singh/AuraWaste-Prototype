import { useMemo, useState } from 'react';
import './App.css';
import Upload from './components/Upload.jsx';
import Result from './components/Result.jsx';
import Dashboard from './components/Dashboard.jsx';

const SAMPLE_FILES = [
  { label: 'Phone', fileName: 'phone-cracked.jpg' },
  { label: 'Laptop', fileName: 'used-laptop.png' },
  { label: 'Battery', fileName: 'battery-pack.jpg' },
  { label: 'Monitor', fileName: 'monitor-old.jpg' },
  { label: 'Printer', fileName: 'printer-broken.jpg' }
];

const DEFAULT_RESULT = null;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('phone-cracked.jpg');
  const [result, setResult] = useState(DEFAULT_RESULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedSample = useMemo(
    () => SAMPLE_FILES.find((item) => item.fileName === selectedFileName) || SAMPLE_FILES[0],
    [selectedFileName]
  );

  const handlePickSample = (fileName) => {
    setSelectedFileName(fileName);
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
    setSelectedFileName(file?.name || selectedFileName);
    setError('');

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const analyze = async () => {
    try {
      setLoading(true);
      setError('');

      const payload = {
        image: selectedFile?.name || selectedFileName,
        fileName: selectedFile?.name || selectedFileName,
        isSample: !selectedFile
      };

      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Analysis request failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (fileName) => {
    handlePickSample(fileName);
    analyzeWithName(fileName);
  };

  const analyzeWithName = async (fileName) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: fileName,
          fileName,
          isSample: true
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Analysis request failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const heroStats = result
    ? [
        { label: 'Fair value', value: `₹${result.valuation.finalPrice}` },
        { label: 'Collector ETA', value: `${result.collector.etaMinutes} min` },
        { label: 'Hazard level', value: result.device.hazard },
        { label: 'EPR token', value: result.blockchain.tokenId }
      ]
    : [
        { label: 'Formal recycling target', value: '35%' },
        { label: 'Fraud reduction target', value: '<5%' },
        { label: 'Pickup response', value: '<2h' },
        { label: 'Traceability', value: '100% on-chain' }
      ];

  return (
    <div className="app-shell">
      <section className="hero card">
        <div className="hero-copy">
          <div className="pill">AuraWaste • AI + Blockchain + IoT + ZKP</div>
          <h1>Sustainable e-waste tracking for India.</h1>
          <p className="muted">
            A prototype that identifies discarded devices, values them fairly, assigns collectors,
            and simulates an immutable EPR trail.
          </p>

          <div className="hero-actions">
            <button className="btn primary" onClick={analyze} disabled={loading}>
              {loading ? 'Analyzing…' : 'Run Demo'}
            </button>
            <button
              className="btn secondary"
              onClick={() => loadSample(selectedSample.fileName)}
              disabled={loading}
            >
              Load Sample
            </button>
          </div>

          <div className="mini-grid" style={{ marginTop: 22 }}>
            <div><span>AI model</span><strong>YOLOv8</strong></div>
            <div><span>Traceability</span><strong>Blockchain</strong></div>
            <div><span>Identity</span><strong>ZK Proof</strong></div>
            <div><span>Pickup</span><strong>Doorstep</strong></div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Selected e-waste preview" />
            ) : (
              <div className="preview-placeholder">
                <div className="preview-icon">♻️</div>
                <div>Drop an e-waste image here</div>
                <small>or use the sample payload</small>
              </div>
            )}
          </div>

          <div className="mini-grid">
            {heroStats.slice(0, 4).map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dashboard result={result} />

      <section className="main-grid grid">
        <Upload
          selectedFile={selectedFile}
          selectedFileName={selectedFileName}
          selectedSample={selectedSample}
          loading={loading}
          onAnalyze={analyze}
          onFileChange={handleFileChange}
          onPickSample={handlePickSample}
          onLoadSample={loadSample}
        />

        <div className="process-card card">
          <div className="section-label">Workflow</div>
          <h2>End-to-end chain of custody</h2>
          <p className="muted">
            This demo mirrors the report architecture: AI identifies the device, valuation sets the
            fair price, pickup routes to a verified collector, and the final custody trail is
            recorded as an EPR token on the ledger. The report describes this same 5-layer flow
            across perception, AI processing, identity, ledger, and compliance output.
          </p>

          {[
            ['1', 'Capture', 'Consumer uploads a device photo or chooses a sample.'],
            ['2', 'Identify', 'YOLOv8-style detection classifies the device and condition.'],
            ['3', 'Assign', 'Nearest kabadiwala is matched for doorstep pickup.'],
            ['4', 'Verify', 'Ledger event and compliance token are generated.']
          ].map(([step, title, desc]) => (
            <div className="timeline-item" key={step}>
              <div className="timeline-badge">{step}</div>
              <div>
                <div className="timeline-title">{title}</div>
                <div className="timeline-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="result-grid grid">
        <Result data={result} error={error} />
      </section>
    </div>
  );
}

export default App;