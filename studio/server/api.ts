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
import { primitiveRegistry } from "../../foundation/layout/registry/primitives";
import type { ProjectDocument } from "../engine/tree/types";
import { createPage, renamePage, pageNameToRoute } from "../engine/tree/operations";
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

  router.post("/project/reset", (_req: Request, res: Response) => {
    const project: ProjectDocument = {
      name: "My App",
      version: "1.0.0",
      theme: "light",
      pages: [],
      services: [],
      navigation: { type: "stack", screens: [] },
    };
    // Always create a default tabs group
    (project as any).screenGroups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: [] }];
    saveProject(project);
    const generatedDir = path.join(projectDir, "generated");
    if (fs.existsSync(generatedDir)) {
      fs.rmSync(generatedDir, { recursive: true, force: true });
    }
    const broadcast = (_req.app as any).broadcast;
    if (broadcast) broadcast("project:reset", project);
    res.json(project);
  });

  router.get("/registry", (_req: Request, res: Response) => {
    res.json({
      layouts: layoutRegistry,
      components: componentRegistry,
      blocks: blockRegistry,
      primitives: primitiveRegistry,
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

    // Auto-place new page in the tabs group (create one if none exists)
    const screenGroups: any[] = (project as any).screenGroups || [];
    let tabsGroup = screenGroups.find((g: any) => g.type === 'tabs');
    if (!tabsGroup) {
      tabsGroup = { id: 'grp_' + Date.now(), name: 'tabs', type: 'tabs', screenIds: [] };
      screenGroups.push(tabsGroup);
    }
    tabsGroup.screenIds.push(page.id);
    (project as any).screenGroups = screenGroups;

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
    // Also remove from all screenGroups
    if ((project as any).screenGroups) {
      (project as any).screenGroups = (project as any).screenGroups.map((g: any) => ({
        ...g, screenIds: (g.screenIds || []).filter((sid: string) => sid !== req.params.id),
      }));
    }
    saveProject(project);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:deleted", { id: req.params.id });
    res.json({ ok: true });
  });

  router.put("/pages/:id/rename", (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ error: "Name cannot be empty" });
      return;
    }
    const project = loadProject();
    const id = req.params.id as string;
    const page = project.pages.find((p) => p.id === id);
    if (!page) { res.status(404).json({ error: "Page not found" }); return; }
    const newRoute = pageNameToRoute(name);
    const conflict = project.pages.find((p) => p.id !== id && p.route === newRoute);
    if (conflict) {
      res.status(409).json({ error: `Route already exists: ${newRoute}` });
      return;
    }
    const { project: updatedProject, oldRoute } = renamePage(project, id, name);
    saveProject(updatedProject);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("page:renamed", { id, name, route: newRoute, oldRoute });
    res.json({ id, name, route: newRoute, oldRoute });
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

  router.post("/generate", (req: Request, res: Response) => {
    const project = loadProject();
    const useLocalFoundation = req.body?.localFoundation === true;
    const foundationSourcePath = path.resolve(process.cwd(), "foundation");
    const options = useLocalFoundation
      ? { foundationMode: "local" as const, foundationSourcePath }
      : undefined;
    const { files } = generateProject(project, options);
    const outputDir = path.join(projectDir, "generated");
    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }
    res.json({ ok: true, files: files.map((f) => f.path), outputDir });
  });

  // Generate all files and return their content (for the IDE panel)
  router.post("/generate/all", (req: Request, res: Response) => {
    const project = loadProject();
    const useLocalFoundation = req.body?.localFoundation === true;
    const foundationSourcePath = path.resolve(process.cwd(), "foundation");
    const options = useLocalFoundation
      ? { foundationMode: "local" as const, foundationSourcePath }
      : undefined;
    const { files } = generateProject(project, options);
    // Also write to disk
    const outputDir = path.join(projectDir, "generated");
    for (const file of files) {
      const filePath = path.join(outputDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }
    res.json({ ok: true, files });
  });

  // Write a single generated file back to disk (IDE edit sync)
  router.post("/generate/write", (req: Request, res: Response) => {
    const { path: filePath, content } = req.body;
    if (!filePath || typeof content !== 'string') { res.status(400).json({ error: 'Missing path or content' }); return; }
    const outputDir = path.join(projectDir, "generated");
    const fullPath = path.join(outputDir, filePath);
    // Security: ensure path stays within generated/
    if (!fullPath.startsWith(outputDir)) { res.status(403).json({ error: 'Forbidden' }); return; }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    const broadcast = (req.app as any).broadcast;
    if (broadcast) broadcast("file:written", { path: filePath });
    res.json({ ok: true });
  });

  router.post("/generate/preview/:pageId", (req: Request, res: Response) => {
    const project = loadProject();
    const page = project.pages.find((p) => p.id === req.params.pageId);
    if (!page) { res.status(404).json({ error: "Page not found" }); return; }
    res.json({ code: generatePageCode(page) });
  });

  // ---------------------------------------------------------------------------
  // Placeholder API — example endpoints for testing queries in the studio
  // ---------------------------------------------------------------------------
  router.get("/placeholder/users", (_req, res) => {
    res.json([
      { id: 1, name: "Alice Martin", email: "alice@example.com", role: "admin", avatar: "https://i.pravatar.cc/150?u=alice", createdAt: "2024-01-15" },
      { id: 2, name: "Bob Dupont", email: "bob@example.com", role: "user", avatar: "https://i.pravatar.cc/150?u=bob", createdAt: "2024-02-20" },
      { id: 3, name: "Carol Smith", email: "carol@example.com", role: "user", avatar: "https://i.pravatar.cc/150?u=carol", createdAt: "2024-03-10" },
    ]);
  });

  router.get("/placeholder/users/:id", (req, res) => {
    const users: Record<string, any> = {
      "1": { id: 1, name: "Alice Martin", email: "alice@example.com", role: "admin", bio: "Product designer", avatar: "https://i.pravatar.cc/150?u=alice" },
      "2": { id: 2, name: "Bob Dupont", email: "bob@example.com", role: "user", bio: "Developer", avatar: "https://i.pravatar.cc/150?u=bob" },
    };
    res.json(users[req.params.id] || { error: "Not found" });
  });

  router.get("/placeholder/posts", (_req, res) => {
    res.json([
      { id: 1, title: "Getting started with Flipova", body: "Lorem ipsum dolor sit amet...", userId: 1, tags: ["tutorial", "intro"], publishedAt: "2024-03-01", likes: 42 },
      { id: 2, title: "Building mobile apps fast", body: "Consectetur adipiscing elit...", userId: 2, tags: ["mobile", "tips"], publishedAt: "2024-03-15", likes: 18 },
      { id: 3, title: "Design systems in 2025", body: "Sed do eiusmod tempor...", userId: 1, tags: ["design", "systems"], publishedAt: "2024-04-01", likes: 67 },
    ]);
  });

  router.get("/placeholder/products", (_req, res) => {
    res.json([
      { id: 1, name: "Pro Plan", price: 29.99, currency: "USD", category: "subscription", inStock: true, image: "https://picsum.photos/seed/prod1/200" },
      { id: 2, name: "Team Plan", price: 79.99, currency: "USD", category: "subscription", inStock: true, image: "https://picsum.photos/seed/prod2/200" },
      { id: 3, name: "Enterprise", price: 299.99, currency: "USD", category: "subscription", inStock: false, image: "https://picsum.photos/seed/prod3/200" },
    ]);
  });

  router.get("/placeholder/stats", (_req, res) => {
    res.json({
      totalUsers: 1284,
      activeToday: 342,
      revenue: 48920.50,
      growth: 12.4,
      topCountries: ["FR", "US", "DE", "GB"],
      chartData: [120, 145, 132, 178, 195, 210, 234],
    });
  });

  router.post("/placeholder/auth/login", (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) { res.status(400).json({ error: "Missing credentials" }); return; }
    res.json({ token: "placeholder_jwt_token_" + Date.now(), user: { id: 1, email, name: "Demo User", role: "user" } });
  });

  router.post("/placeholder/users", (req, res) => {
    const { name, email, role } = req.body || {};
    res.status(201).json({ id: Date.now(), name: name || "New User", email: email || "user@example.com", role: role || "user", createdAt: new Date().toISOString() });
  });

  router.put("/placeholder/users/:id", (req, res) => {
    const { name, email, role } = req.body || {};
    res.json({ id: Number(req.params.id), name: name || "Updated User", email: email || "user@example.com", role: role || "user", updatedAt: new Date().toISOString() });
  });

  router.patch("/placeholder/users/:id", (req, res) => {
    res.json({ id: Number(req.params.id), ...req.body, updatedAt: new Date().toISOString() });
  });

  router.delete("/placeholder/users/:id", (req, res) => {
    res.json({ ok: true, deleted: Number(req.params.id) });
  });

  router.post("/placeholder/posts", (req, res) => {
    const { title, body, userId } = req.body || {};
    res.status(201).json({ id: Date.now(), title: title || "New Post", body: body || "", userId: userId || 1, publishedAt: new Date().toISOString() });
  });

  router.put("/placeholder/posts/:id", (req, res) => {
    res.json({ id: Number(req.params.id), ...req.body, updatedAt: new Date().toISOString() });
  });

  router.delete("/placeholder/posts/:id", (req, res) => {
    res.json({ ok: true, deleted: Number(req.params.id) });
  });

  // ---------------------------------------------------------------------------
  // Snack export — reads files from generated/ on disk and sends them to Snack
  // ---------------------------------------------------------------------------
  router.post("/snack/export", (_req: Request, res: Response) => {
    const generatedDir = path.join(projectDir, "generated");

    if (!fs.existsSync(generatedDir)) {
      res.status(400).json({ error: "No generated files found. Run /generate first." });
      return;
    }

    // Read all files from generated/ recursively
    let diskFiles: { path: string; content: string }[] = [];

    function readDir(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          readDir(fullPath);
        } else {
          if (entry.name.endsWith('.yml') || entry.name === '.gitignore' || entry.name === '.npmrc') continue;
          const relativePath = path.relative(generatedDir, fullPath).replace(/\\/g, "/");
          try {
            diskFiles.push({ path: relativePath, content: fs.readFileSync(fullPath, "utf-8") });
          } catch {}
        }
      }
    }

    readDir(generatedDir);

    // Convert to Snack file format
    const snackFiles: Record<string, { type: 'CODE'; contents: string }> = {};
    for (const file of diskFiles) {
      snackFiles[file.path] = { type: 'CODE', contents: file.content };
    }

    // Extract dependencies from package.json
    let dependencies: Record<string, { version: string }> = {};
    const pkgFile = diskFiles.find(f => f.path === 'package.json');
    if (pkgFile) {
      try {
        const pkg = JSON.parse(pkgFile.content);
        for (const [name, version] of Object.entries(pkg.dependencies || {})) {
          dependencies[name] = { version: String(version).replace(/^[~^]/, '') };
        }
      } catch {}
    }

    const project = loadProject();
    res.json({ files: snackFiles, dependencies, name: project.name });
  });

  return router;
}
