const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 3003; // 포트 번호
const SECRET = 'key'; // 테스트용 Secret 키

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

    // Execute Git Pull
    exec('git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`Git pull error: ${error.message}`);
        return res.status(500).send(`Git pull failed: ${error.message}`);
      }
      console.log(`Git pull output: ${stdout}`);

      // Restart React server (using npm start)
      exec('pkill -f "npm start" && npm start', { cwd: '/path/to/react-app' }, (restartError, restartStdout, restartStderr) => {
        if (restartError) {
          console.error(`React server restart error: ${restartError.message}`);
          return res.status(500).send(`React server restart failed: ${restartError.message}`);
        }
        console.log(`React server restarted: ${restartStdout}`);
        return res.status(200).send('Webhook received and React server restarted');
      });
    });
  } else {
    return res.status(200).send('Event ignored');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
