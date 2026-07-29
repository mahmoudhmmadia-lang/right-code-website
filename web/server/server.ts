import cors from "cors";
import express from "express";
import http from "node:http";
import https from "node:https";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = Number(process.env.PORT || 3001);

const app = express();
const apiUrl = new URL(process.env.API_URL || "http://localhost:5000");

app.use(cors());
app.use("/api", (req, res) => {
  const transport = apiUrl.protocol === "https:" ? https : http;
  const headers = { ...req.headers, host: apiUrl.host };
  const proxy = transport.request(
    {
      protocol: apiUrl.protocol,
      hostname: apiUrl.hostname,
      port: apiUrl.port,
      method: req.method,
      path: `/api${req.url}`,
      headers,
    },
    (upstream) => {
      res.status(upstream.statusCode ?? 502);
      for (const [key, value] of Object.entries(upstream.headers)) {
        if (value !== undefined) res.setHeader(key, value);
      }
      upstream.pipe(res);
    },
  );

  proxy.on("error", () => {
    if (!res.headersSent) res.status(502).json({ message: "Content API is unavailable" });
  });
  req.pipe(proxy);
});
app.use(express.static(join(__dirname, "dist")));

app.get(/^\/(.*)/, (_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
