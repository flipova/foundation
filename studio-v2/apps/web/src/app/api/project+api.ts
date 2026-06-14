import { ProjectDocument } from '@flipova/studio-core';
import { generateProject } from '@flipova/studio-engine';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const project: ProjectDocument = await req.json();

    // Generate the project files
    const { files, warnings } = generateProject(project, { snackMode: true });

    // Ensure preview directory exists
    const previewDir = path.join(process.cwd(), 'preview');
    await fs.mkdir(previewDir, { recursive: true });

    // Write all files
    for (const file of files) {
      const fullPath = path.join(previewDir, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.content);
    }

    return Response.json({ success: true, warnings, files });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
