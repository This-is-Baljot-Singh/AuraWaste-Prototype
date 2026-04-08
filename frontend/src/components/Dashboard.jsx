function Dashboard({ result }) {
  const fallback = [
    { label: 'Formal recycling target', value: '35%', note: 'Year 3 target from prototype roadmap' },
    { label: 'EPR fraud reduction', value: '<5%', note: 'Through ledger-backed verification' },
    { label: 'Pickup response time', value: '<2h', note: 'Collector assignment in real time' },
    { label: 'Traceability', value: '100%', note: 'On-chain chain of custody' }
  ];

  const live = result
    ? [
        { label: 'Formal recycling target', value: result.dashboard.formalRecyclingRate, note: 'Projected Year 3 outcome' },
        { label: 'EPR fraud reduction', value: result.dashboard.eprFraudReduction, note: 'No paper-trading path' },
        { label: 'Pickup response time', value: result.dashboard.pickupResponseTime, note: 'Assigned collector ETA' },
        { label: 'Traceability', value: result.dashboard.traceability, note: 'Immutable ledger logging' }
      ]
    : fallback;

  return (
    <section className="grid stats-grid">
      {live.map((item) => (
        <div className="stat-card card" key={item.label}>
          <div className="stat-title">{item.label}</div>
          <div className="stat-value">{item.value}</div>
          <div className="stat-note">{item.note}</div>
        </div>
      ))}
    </section>
  );
}

export default Dashboard;