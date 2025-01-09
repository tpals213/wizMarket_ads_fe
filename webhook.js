const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = 3003;

// GitHub Webhook Secret
const SECRET = 'key';

// Middleware for parsing JSON
app.use(bodyParser.json());

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  // Validate signature
  if (!signature) {
    return res.status(400).send('Missing signature');
  }

  const expectedSignature =
    'sha256=' +
    crypto
      .createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).send('Invalid signature');
  }

  // Handle GitHub payload
  if (req.body.ref === 'refs/heads/main') {
    console.log('Push to main branch detected');
    // TODO: Add your logic here (e.g., trigger build, notify React, etc.)
    return res.status(200).send('Webhook received successfully');
  }

  return res.status(200).send('Event ignored');
});

// Start server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
