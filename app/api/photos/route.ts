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
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Write photos to database
async function writePhotos(photos: any[]) {
  await ensureDataDir();
  await fs.writeFile(dbPath, JSON.stringify(photos, null, 2));
}

// GET - Retrieve all photos
export async function GET() {
  try {
    const photos = await readPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST - Add new photo
export async function POST(request: NextRequest) {
  try {
    const { photoData, fileName, fileType, description } = await request.json();

    if (!photoData || !fileName) {
      return NextResponse.json(
        { error: "Photo data and filename are required" },
        { status: 400 }
      );
    }

    const photos = await readPhotos();
    const newPhoto = {
      id: Date.now().toString(),
      data: photoData,
      fileName,
      fileType,
      description: description || "",
      uploadDate: new Date().toISOString(),
    };

    photos.push(newPhoto);
    await writePhotos(photos);

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save photo" },
      { status: 500 }
    );
  }
}
