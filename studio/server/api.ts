/**
 * Studio REST API
 *
 * Endpoints for project management, page CRUD, registry introspection,
 * and code generation. Imports foundation registries directly.
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { layoutRegistry } from "../../foundation/layout/registry/layouts";
import { componentRegistry } from "../../foundation/layout/registry/components";
import { blockRegistry } from "../../foundation/layout/registry/blocks";
import type { ProjectDocument } from "../engine/tree/types";
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

  router.get("/project", (_req: Request, res: Response) => {
    res.json(loadProject());
  });

  router.put("/project", (req: Request, res: Response) => {
    saveProject(req.body);
    res.json({ ok: true });
  });

  router.get("/registry", (_req: Request, res: Response) => {
    res.json({
      layouts: layoutRegistry,
      components: componentRegistry,
      blocks: blockRegistry,
    });
  });

  router.get("/registry/layouts", (_req: Request, res: Response) => {
    res.json(layoutRegistry);
  });

  router.get("/registry/components", (_req: Request, res: Response) => {
    res.json(componentRegistry);
  });

  router.get("/registry/blocks", (_req: Request, res: Response) => {
    res.json(blockRegistry);
  });

  router.post("/pages", (req: Request, res: Response) => {
    const project = loadProject();
    const page = createPage(req.body.name, req.body.layoutId);
    project.pages.push(page);
    project.navigation.screens.push({ name: page.name, pageId: page.id });
    saveProject(project);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:created", page);
    res.json(page);
  });

  router.put("/pages/:id", (req: Request, res: Response) => {
    const project = loadProject();
    const index = project.pages.findIndex((p) => p.id === req.params.id);
    if (index === -1) { res.status(404).json({ error: "Page not found" }); return; }
    project.pages[index] = { ...req.body, updatedAt: new Date().toISOString() };
    saveProject(project);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:updated", project.pages[index]);
    res.json(project.pages[index]);
  });

  router.delete("/pages/:id", (req: Request, res: Response) => {
    const project = loadProject();
    project.pages = project.pages.filter((p) => p.id !== req.params.id);
    project.navigation.screens = project.navigation.screens.filter((s) => s.pageId !== req.params.id);
    saveProject(project);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:deleted", { id: req.params.id });
    res.json({ ok: true });
  });

  router.put("/project/theme", (req: Request, res: Response) => {
    const project = loadProject();
    project.theme = req.body.theme;
    saveProject(project);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("theme:changed", { theme: project.theme });
    res.json({ ok: true });
  });

  router.put("/project/navigation", (req: Request, res: Response) => {
    const project = loadProject();
    project.navigation = req.body;
    saveProject(project);
    res.json({ ok: true });
  });

  router.post("/project/services", (req: Request, res: Response) => {
    const project = loadProject();
    project.services.push(req.body);
    saveProject(project);
    res.json({ ok: true });
  });

  router.post("/generate", (_req: Request, res: Response) => {
    const project = loadProject();
    const files = generateProject(project);
    const outputDir = path.join(projectDir, "generated");
    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }
    res.json({ ok: true, files: files.map((f) => f.path), outputDir });
  });

  router.post("/generate/preview/:pageId", (req: Request, res: Response) => {
    const project = loadProject();
    const page = project.pages.find((p) => p.id === req.params.pageId);
    if (!page) { res.status(404).json({ error: "Page not found" }); return; }
    res.json({ code: generatePageCode(page) });
  });

  return router;
}
