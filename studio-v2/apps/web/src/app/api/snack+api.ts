import { ProjectDocument } from '@flipova/studio-core';
import { generateProject } from '@flipova/studio-engine';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { project, localFoundation }: { project: ProjectDocument, localFoundation?: boolean } = await req.json();

    // Generate project files for snack
    const { files } = generateProject(project, { 
      snackMode: true,
      foundationMode: localFoundation ? 'local' : 'registry',
      foundationSourcePath: localFoundation ? path.join(process.cwd(), '../../../foundation') : undefined
    });

    // Format for snack-sdk
    const snackFiles: Record<string, { type: 'CODE' | 'ASSET'; contents: string }> = {};
    for (const file of files) {
      // Snack expects paths without leading slash
      const p = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      snackFiles[p] = { type: 'CODE', contents: file.content };
    }

    // Parse package.json to get dependencies
    let dependencies = {};
    const pkgFile = files.find(f => f.path === 'package.json');
    if (pkgFile) {
      const pkg = JSON.parse(pkgFile.content);
      const rawDeps = pkg.dependencies || {};
      dependencies = Object.fromEntries(
        Object.entries(rawDeps).map(([name, version]) => [name, { version }])
      );
    }

    return Response.json({
      success: true,
      files: snackFiles,
      dependencies,
      name: project.name || 'Flipova Preview'
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
