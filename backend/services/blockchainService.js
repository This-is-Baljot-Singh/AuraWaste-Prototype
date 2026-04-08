const crypto = require('crypto');

function shortHash(seed) {
  return '0x' + crypto.createHash('sha256').update(String(seed)).digest('hex').slice(0, 16);
}

function makeTimestamp(offsetMinutes = 0) {
  return new Date(Date.now() + offsetMinutes * 60 * 1000).toISOString();
}

function createChainOfCustody({ device, collector, recycler }) {
  return [
    {
      step: 'Request Created',
      actor: 'Consumer',
      status: 'Logged',
      timestamp: makeTimestamp(-12)
    },
    {
      step: 'AI Valuation Complete',
      actor: 'AuraWaste AI',
      status: 'Verified',
      timestamp: makeTimestamp(-8)
    },
    {
      step: 'Collector Assigned',
      actor: collector.name,
      status: 'Dispatched',
      timestamp: makeTimestamp(-4)
    },
    {
      step: 'Physical Pickup',
      actor: collector.name,
      status: 'Transferred',
      timestamp: makeTimestamp(-1)
    },
    {
      step: 'Recycler Confirmation',
      actor: recycler,
      status: 'Minted',
      timestamp: makeTimestamp(0)
    }
  ];
}

function logTransaction({ device, valuation, collector, recycler, imageSeed }) {
  const txSeed = `${device}|${valuation.finalPrice}|${collector.name}|${recycler}|${imageSeed}|${Date.now()}`;
  const tokenSeed = `${imageSeed}|${device}|${collector.zone}`;

  return {
    txHash: shortHash(txSeed),
    blockNo: 104820 + (shortHash(tokenSeed).charCodeAt(2) % 5000),
    tokenId: `EPR-${shortHash(tokenSeed).slice(2, 10).toUpperCase()}`,
    status: 'Recorded on Immutable Ledger',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  createChainOfCustody,
  logTransaction,
  shortHash
};
