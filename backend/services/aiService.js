const DEVICE_LIBRARY = {
  phone: {
    label: 'Smartphone',
    basePrice: 640,
    hazard: 'Low',
    emoji: '📱'
  },
  laptop: {
    label: 'Laptop',
    basePrice: 1680,
    hazard: 'Low',
    emoji: '💻'
  },
  battery: {
    label: 'Battery Pack',
    basePrice: 220,
    hazard: 'High',
    emoji: '🔋'
  },
  monitor: {
    label: 'Monitor',
    basePrice: 900,
    hazard: 'Medium',
    emoji: '🖥️'
  },
  printer: {
    label: 'Printer',
    basePrice: 780,
    hazard: 'Medium',
    emoji: '🖨️'
  }
};

const DEVICE_KEYS = Object.keys(DEVICE_LIBRARY);

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function hashCode(input = '') {
  let hash = 0;
  const text = normalize(input);
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function detectDevice(imageName = '') {
  const text = normalize(imageName);

  if (text.includes('phone') || text.includes('mobile') || text.includes('iphone') || text.includes('android')) {
    return 'phone';
  }
  if (text.includes('laptop') || text.includes('macbook') || text.includes('notebook')) {
    return 'laptop';
  }
  if (text.includes('battery') || text.includes('cell') || text.includes('powerbank')) {
    return 'battery';
  }
  if (text.includes('monitor') || text.includes('screen') || text.includes('display') || text.includes('crt')) {
    return 'monitor';
  }
  if (text.includes('printer')) {
    return 'printer';
  }

  return DEVICE_KEYS[hashCode(text) % DEVICE_KEYS.length];
}

function inferCondition(imageName = '') {
  const text = normalize(imageName);

  if (text.includes('new') || text.includes('mint') || text.includes('sealed')) {
    return { label: 'Excellent', multiplier: 1.1, score: 0.95 };
  }

  if (text.includes('cracked') || text.includes('broken') || text.includes('damaged')) {
    return { label: 'Damaged', multiplier: 0.78, score: 0.61 };
  }

  if (text.includes('old') || text.includes('used')) {
    return { label: 'Used', multiplier: 0.9, score: 0.78 };
  }

  return { label: 'Good', multiplier: 0.96, score: 0.86 };
}

function getDeviceProfile(device) {
  return DEVICE_LIBRARY[device] || DEVICE_LIBRARY.phone;
}

function inferHazardLevel(device) {
  return getDeviceProfile(device).hazard;
}

module.exports = {
  detectDevice,
  inferCondition,
  inferHazardLevel,
  getDeviceProfile,
  hashCode
};
