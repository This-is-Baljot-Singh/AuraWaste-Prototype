const express = require('express');
const cors = require('cors');
const wasteRoutes = require('./routes/wasteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'aurawaste-backend', version: '2.0.0' });
});

app.use('/api', wasteRoutes);

app.listen(PORT, () => {
  console.log(`AuraWaste backend running on port ${PORT}`);
});
