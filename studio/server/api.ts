/**
 * Studio REST API
 *
 * Endpoints for project management, page CRUD, and code generation.
 */

import { Router } from "express";
import fs from "fs";
import path from "path";
import type { ProjectDocument, PageDocument } from "../engine/tree/types";
import { createPage } from "../engine/tree/operations";
import { generateProject, generatePageCode } from "../engine/codegen";

export function createRouter(studioDir: string, projectDir: string): Router {
  const router = Router();
  const projectFile = path.join(studioDir, "project.json");

  function loadProject(): ProjectDocument {
    if (fs.existsSync(projectFile)) {
      return JSON.parse(fs.readFileSync(projectFile, "utf-8"));
    }
    const project: ProjectDocument = {
      name: "My App",
      version: "1.0.0",
      theme: "light",
      pages: [],
      services: [],
      navigation: { type: "stack", screens: [] },
    };
    saveProject(project);
    return project;
  }

  function saveProject(project: ProjectDocument): void {
    fs.writeFileSync(projectFile, JSON.stringify(project, null, 2));
  }

  router.get("/project", (_req, res) => {
    res.json(loadProject());
  });

  router.put("/project", (req, res) => {
    saveProject(req.body);
    res.json({ ok: true });
  });

  router.get("/registry", (_req, res) => {
    const { layoutRegistry } = require("@flipova/foundation/layout/registry/layouts");
    const { componentRegistry } = require("@flipova/foundation/layout/registry/components");
    const { blockRegistry } = require("@flipova/foundation/layout/registry/blocks");
    res.json({ layouts: layoutRegistry, components: componentRegistry, blocks: blockRegistry });
  });

  router.post("/pages", (req, res) => {
    const project = loadProject();
    const page = createPage(req.body.name, req.body.layoutId);
    project.pages.push(page);
    saveProject(project);
    res.json(page);
  });

  router.put("/pages/:id", (req, res) => {
    const project = loadProject();
    const index = project.pages.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Page not found" });
    project.pages[index] = { ...req.body, updatedAt: new Date().toISOString() };
    saveProject(project);

    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:updated", project.pages[index]);

    res.json(project.pages[index]);
  });

  router.delete("/pages/:id", (req, res) => {
    const project = loadProject();
    project.pages = project.pages.filter((p) => p.id !== req.params.id);
    saveProject(project);
    res.json({ ok: true });
  });

  router.post("/generate", (_req, res) => {
    const project = loadProject();
    const files = generateProject(project);
    const outputDir = path.join(projectDir, "generated");

    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }

    res.json({ ok: true, files: files.map((f) => f.path) });
  });

  router.post("/generate/preview/:pageId", (req, res) => {
    const project = loadProject();
    const page = project.pages.find((p) => p.id === req.params.pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ code: generatePageCode(page) });
  });

  return router;
}
