import { ProjectDocument } from '@flipova/studio-core';
import fs from 'fs/promises';
import path from 'path';

const PROJECT_FILE = path.join(process.cwd(), 'studio.json');

export async function GET() {
  try {
    const data = await fs.readFile(PROJECT_FILE, 'utf-8');
    return Response.json({ success: true, project: JSON.parse(data) });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return Response.json({ success: true, project: null });
    }
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const project: ProjectDocument = await req.json();
    await fs.writeFile(PROJECT_FILE, JSON.stringify(project, null, 2), 'utf-8');
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fs.unlink(PROJECT_FILE);
    return Response.json({ success: true });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return Response.json({ success: true });
    }
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
