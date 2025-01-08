const http = require('http');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 3002;
const SECRET = 'key';

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/push") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const sig = `sha256=${crypto.createHmac("sha256", SECRET).update(body).digest("hex")}`;
            const githubSig = req.headers["x-hub-signature-256"];
            if (sig !== githubSig) {
                res.statusCode = 403;
                res.end("Forbidden: Invalid signature");
                return;
            }

            const payload = JSON.parse(body);
            if (payload.ref === "refs/heads/main") {
                console.log("Main branch updated. Pulling changes and restarting React server...");
                exec("git pull && npm install && npm start", (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Error during update: ${err.message}`);
                        res.statusCode = 500;
                        res.end("Internal Server Error");
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                    res.statusCode = 200;
                    res.end("React server updated and restarted");
                });
            } else {
                console.log(`Ignored branch: ${payload.ref}`);
                res.statusCode = 200;
                res.end("Branch ignored");
            }
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});
