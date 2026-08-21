const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ReferralHire backend is running');
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/jobs', require('./routes/jobRoutes'));

app.use('/api/referrals', require('./routes/referralRoutes'));

app.use('/api/dashboard', require('./routes/dashboardRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));