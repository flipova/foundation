/**
 * Studio Server
 *
 * Express server that serves the builder UI, REST API, and WebSocket.
 */

import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import fs from "fs";
import { createRouter } from "./api";

const DEFAULT_PORT = 4200;

function findWebUI(): string | null {
  const candidates = [
    path.resolve(__dirname, "../web/index.html"),
    path.resolve(__dirname, "../../studio/web/index.html"),
    path.resolve(__dirname, "../../../studio/web/index.html"),
    path.resolve(process.cwd(), "studio/web/index.html"),
    path.resolve(process.cwd(), "node_modules/@flipova/foundation/studio/web/index.html"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
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

  const webUIPath = findWebUI();
  let webUIContent: string | null = null;
  if (webUIPath) {
    webUIContent = fs.readFileSync(webUIPath, "utf-8");
  }

  app.get("/", (_req, res) => {
    if (webUIContent) {
      res.type("html").send(webUIContent);
    } else {
      res.json({ status: "studio-api-only", message: "Web UI not found. Searched: studio/web/index.html" });
    }
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/ws" });

  const clients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  const broadcast = (type: string, payload: unknown) => {
    const message = JSON.stringify({ type, payload });
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  (app as any).broadcast = broadcast;

  server.listen(port, () => {
    console.log(`\n  ✦ Flipova Studio`);
    console.log(`  http://localhost:${port}`);
    console.log(`  UI: ${webUIPath ? "loaded" : "not found"}\n`);
  });

  return { app, server, wss, broadcast };
}
