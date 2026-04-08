function Result({ data, error }) {
  if (error) {
    return (
      <div className="result-card card error-box" style={{ gridColumn: '1 / -1' }}>
        <strong>Analysis error:</strong> {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="result-card card" style={{ gridColumn: '1 / -1' }}>
        <div className="section-label">Results</div>
        <h2>Awaiting analysis</h2>
        <p className="muted">
          Run the demo or load a sample to see the detected device, valuation, pickup assignment,
          blockchain record, and EPR token.
        </p>
      </div>
    );
  }

  return (
    <div className="result-card card highlight" style={{ gridColumn: '1 / -1' }}>
      <div className="section-label">Analysis result</div>
      <h2>
        {data.device.emoji} {data.device.label}
      </h2>
      <p className="muted">
        Condition: <strong>{data.condition.label}</strong> • Confidence:{' '}
        <strong>{Math.round(data.device.confidence * 100)}%</strong> • Hazard:{' '}
        <strong>{data.device.hazard}</strong>
      </p>

      <div className="stats-grid grid">
        <div className="stat-card card">
          <div className="stat-title">Estimated value</div>
          <div className="stat-value">₹{data.valuation.finalPrice}</div>
          <div className="stat-note">
            Base ₹{data.valuation.basePrice} · bonus ₹{data.valuation.bonus} · deduction ₹
            {data.valuation.logisticsDeduction}
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-title">Collector</div>
          <div className="stat-value" style={{ fontSize: '1.6rem' }}>
            {data.collector.name}
          </div>
          <div className="stat-note">
            {data.collector.zone} · ETA {data.collector.etaMinutes} min
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-title">Compliance</div>
          <div className="stat-value" style={{ fontSize: '1.6rem' }}>
            {data.compliance.status}
          </div>
          <div className="stat-note">{data.compliance.verificationMode}</div>
        </div>

        <div className="stat-card card">
          <div className="stat-title">EPR token</div>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>
            {data.blockchain.tokenId}
          </div>
          <div className="stat-note">
            {data.blockchain.status} · Block {data.blockchain.blockNo}
          </div>
        </div>
      </div>

      <div className="stats-grid grid" style={{ marginTop: 18 }}>
        <div className="stat-card card">
          <div className="stat-title">Environmental impact</div>
          <div className="stat-note">Recovered: {data.impact.eWasteRecoveredKg} kg</div>
          <div className="stat-note">CO₂ avoided: {data.impact.co2SavedKg} kg</div>
          <div className="stat-note">Lead avoided: {data.impact.toxicLeadAvoidedGrams} g</div>
        </div>

        <div className="stat-card card">
          <div className="stat-title">Chain trace</div>
          <div className="stat-note">Tx hash: {data.blockchain.txHash}</div>
          <div className="stat-note">Ledger timestamp: {new Date(data.blockchain.timestamp).toLocaleString()}</div>
          <div className="stat-note">Formal share: {data.impact.formalChannelShare}</div>
        </div>
      </div>
    </div>
  );
}

export default Result;