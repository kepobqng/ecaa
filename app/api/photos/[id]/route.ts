import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "photos.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(dbPath);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read photos from database
async function readPhotos() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Write photos to database
async function writePhotos(photos: any[]) {
  await ensureDataDir();
  await fs.writeFile(dbPath, JSON.stringify(photos, null, 2));
}

// DELETE - Remove photo by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Photo ID is required" },
        { status: 400 }
      );
    }

    const photos = await readPhotos();
    const photoIndex = photos.findIndex((photo: any) => photo.id === id);

    if (photoIndex === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Remove the photo
    photos.splice(photoIndex, 1);
    await writePhotos(photos);

    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
