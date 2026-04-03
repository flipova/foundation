/**
 * Studio Server
 *
 * Express server that:
 * - Serves the web builder UI (static files)
 * - Provides REST API for project CRUD
 * - WebSocket for live preview sync
 * - Triggers code generation on save
 */

import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import fs from "fs";
import { createRouter } from "./api";

const DEFAULT_PORT = 4200;

export function startServer(options: { port?: number; projectDir?: string } = {}) {
  const port = options.port || DEFAULT_PORT;
  const projectDir = options.projectDir || process.cwd();
  const studioDir = path.join(projectDir, ".flipova-studio");

  if (!fs.existsSync(studioDir)) {
    fs.mkdirSync(studioDir, { recursive: true });
  }

  const app = express();
  app.use(express.json({ limit: "10mb" }));

  const webDir = path.join(__dirname, "../web/dist");
  if (fs.existsSync(webDir)) {
    app.use(express.static(webDir));
  }

  app.use("/api", createRouter(studioDir, projectDir));

  app.get("*", (_req, res) => {
    const indexPath = path.join(webDir, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ status: "studio-api-only", message: "Web UI not built yet. Run the web build." });
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
    console.log(`\n  Flipova Studio running at http://localhost:${port}\n`);
  });

  return { app, server, wss, broadcast };
}
