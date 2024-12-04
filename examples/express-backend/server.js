const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const NexusGG = require('nexus-node-sdk');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth'); // Mimics a game client communicating with a backend service
const creatorProgramRoutes = require('./routes/creatorProgram'); // Nexus specific routes
const purchaseFlowRoutes = require('./routes/purchaseFlow');

// Nexus configuration
NexusGG.config(
  process.env.NEXUS_PUBLIC_KEY,
  process.env.NEXUS_PRIVATE_KEY,
  'sandbox',
);

const app = express();
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS for cross-origin requests (Unity)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creator-program', creatorProgramRoutes);
app.use('/api/purchase-flow', purchaseFlowRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
