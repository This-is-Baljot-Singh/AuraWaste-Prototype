const express = require('express');
const router = express.Router();

const {
  detectDevice,
  inferCondition,
  inferHazardLevel,
  getDeviceProfile,
  hashCode
} = require('../services/aiService');
const { createChainOfCustody, logTransaction, shortHash } = require('../services/blockchainService');

const COLLECTORS = [
  { name: 'Ravi Kumar', zone: 'North Delhi', distanceKm: 2.1 },
  { name: 'Ayesha Khan', zone: 'South Delhi', distanceKm: 1.7 },
  { name: 'Imran Shaikh', zone: 'West Delhi', distanceKm: 3.4 },
  { name: 'Priya Nair', zone: 'Central Delhi', distanceKm: 1.2 },
  { name: 'Sanjay Verma', zone: 'East Delhi', distanceKm: 2.8 }
];

const RECYCLER = 'GreenLoop Authorized Recycler';

function assignCollector(seed = '', device = 'phone') {
  const index = hashCode(`${seed}:${device}`) % COLLECTORS.length;
  const collector = COLLECTORS[index];
  const eta = 18 + (hashCode(seed) % 22);
  return { ...collector, etaMinutes: eta };
}

function calculateValuation(device, condition, seed = '') {
  const profile = getDeviceProfile(device);
  const logisticsDeduction = 90 + (hashCode(seed) % 55);
  const bonus = device === 'laptop' ? 120 : device === 'phone' ? 60 : 30;
  const raw = profile.basePrice * condition.multiplier;
  const finalPrice = Math.max(120, Math.round(raw + bonus - logisticsDeduction));

  return {
    basePrice: profile.basePrice,
    conditionMultiplier: condition.multiplier,
    logisticsDeduction,
    bonus,
    finalPrice
  };
}

function buildImpact(device, finalPrice) {
  const kgRecovered = Number((finalPrice / 1000).toFixed(2));
  const co2Saved = Number((kgRecovered * 2.8).toFixed(2));
  const leadPrevented = device === 'monitor' ? 18 : device === 'battery' ? 9 : 4;

  return {
    eWasteRecoveredKg: kgRecovered,
    co2SavedKg: co2Saved,
    toxicLeadAvoidedGrams: leadPrevented,
    formalChannelShare: '100% traced'
  };
}

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'aurawaste-api' });
});

router.post('/analyze', async (req, res) => {
  try {
    const imageSeed = req.body.image || req.body.imageName || req.body.fileName || req.body.name || 'sample-device.jpg';
    const device = detectDevice(imageSeed);
    const condition = inferCondition(imageSeed);
    const collector = assignCollector(imageSeed, device);
    const valuation = calculateValuation(device, condition, imageSeed);
    const blockchain = logTransaction({ device, valuation, collector, recycler: RECYCLER, imageSeed });
    const chain = createChainOfCustody({ device, collector, recycler: RECYCLER });
    const profile = getDeviceProfile(device);

    const response = {
      requestId: shortHash(`${imageSeed}|${Date.now()}`),
      input: {
        fileName: imageSeed,
        isSample: !!req.body.isSample
      },
      device: {
        key: device,
        label: profile.label,
        emoji: profile.emoji,
        hazard: inferHazardLevel(device),
        confidence: condition.score
      },
      condition: {
        label: condition.label,
        multiplier: condition.multiplier
      },
      valuation,
      collector,
      recycler: RECYCLER,
      blockchain,
      chain,
      compliance: {
        status: 'EPR Token Ready',
        tokenId: blockchain.tokenId,
        verificationMode: 'Ledger-backed + ZKP ready'
      },
      impact: buildImpact(device, valuation.finalPrice),
      dashboard: {
        formalRecyclingRate: '35%',
        eprFraudReduction: '<5%',
        pickupResponseTime: '<2h',
        traceability: '100% on-chain'
      }
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

module.exports = router;
