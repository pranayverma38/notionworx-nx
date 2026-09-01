import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

const OBSOLETE_DATA_ROOT = path.join(process.cwd(), "data", "obselete");

function resolveObsoletePath(segments: string[]): string | null {
  const resolvedPath = path.resolve(OBSOLETE_DATA_ROOT, ...segments);
  if (
    resolvedPath !== OBSOLETE_DATA_ROOT &&
    !resolvedPath.startsWith(`${OBSOLETE_DATA_ROOT}${path.sep}`)
  ) {
    return null;
  }

  return resolvedPath;
}

function inferContentType(filePath: string): string {
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }

  if (filePath.endsWith(".txt") || filePath.endsWith(".md")) {
    return "text/plain; charset=utf-8";
  }

  return "application/octet-stream";
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ segments: string[] }> },
) {
  const { segments } = await context.params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const resolvedPath = resolveObsoletePath(segments);
  if (!resolvedPath) {
    return NextResponse.json({ message: "Invalid obsolete path" }, { status: 400 });
  }

  try {
    const stats = await fs.stat(resolvedPath);
    if (!stats.isFile()) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const fileContents = await fs.readFile(resolvedPath);
    return new NextResponse(fileContents, {
      headers: {
        "content-type": inferContentType(resolvedPath),
        "cache-control": "public, max-age=300",
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
}
