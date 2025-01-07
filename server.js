const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();
const PORT = 3002; // Webhook 서버 포트
const SECRET = "key"; // GitHub/GitLab Webhook Secret

app.use(bodyParser.json());

// Webhook 엔드포인트
app.post("/webhook", (req, res) => {
    const sig = req.headers["x-hub-signature-256"];
    const hmac = crypto.createHmac("sha256", SECRET);
    const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest("hex")}`;

    if (sig !== digest) {
        return res.status(403).send("Forbidden: Invalid signature");
    }

    const branch = req.body.ref;
    if (branch === "refs/heads/main") {
        console.log("Main branch updated. Pulling changes...");

        exec("git pull && npm install && npm run build", (err, stdout, stderr) => {
            if (err) {
                console.error(`Error during git pull: ${err.message}`);
                return res.status(500).send("Internal Server Error");
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            res.status(200).send("Webhook processed successfully");
        });
    } else {
        console.log(`Ignored branch: ${branch}`);
        res.status(200).send("Branch ignored");
    }
});

app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});
