/**
 * Studio Server
 *
 * Serves the pre-built studio UI, REST API, and WebSocket.
 * The UI must be built before starting (npm run build handles this).
 */

import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import fs from "fs";
import { createRouter } from "./api";

const DEFAULT_PORT = 4200;

function findStudioDist(): string | null {
  const candidates = [
    path.resolve(__dirname, "../app/dist"),
    path.resolve(__dirname, "../../studio/app/dist"),
    path.resolve(__dirname, "../../../studio/app/dist"),
    path.resolve(process.cwd(), "studio/app/dist"),
    path.resolve(process.cwd(), "node_modules/@flipova/foundation/studio/app/dist"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p) && fs.existsSync(path.join(p, "index.html"))) return p;
  }
  return null;
}

export function startServer(options: { port?: number; projectDir?: string } = {}) {
  const port = options.port || DEFAULT_PORT;
  const projectDir = options.projectDir || process.cwd();
  const studioDir = path.join(projectDir, ".flipova-studio");

  if (!fs.existsSync(studioDir)) {
    fs.mkdirSync(studioDir, { recursive: true });
  }

  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use("/api", createRouter(studioDir, projectDir));

  const dist = findStudioDist();
  if (dist) {
    app.use(express.static(dist));
    app.get("/{0,}", (_req, res) => { res.sendFile(path.join(dist, "index.html")); });
  } else {
    app.get("/", (_req, res) => {
      res.status(503).json({ error: "Studio UI not built. Run: npm run build" });
    });
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });
  const clients = new Set<WebSocket>();
  wss.on("connection", (ws) => { clients.add(ws); ws.on("close", () => clients.delete(ws)); });

  const broadcast = (type: string, payload: unknown) => {
    const msg = JSON.stringify({ type, payload });
    for (const c of clients) if (c.readyState === WebSocket.OPEN) c.send(msg);
  };
  (app as any).broadcast = broadcast;

  server.listen(port, () => {
    console.log(`  UI: ${dist ? "ready" : "NOT BUILT (run npm run build)"}`);
  });

  return { app, server, wss, broadcast };
}
