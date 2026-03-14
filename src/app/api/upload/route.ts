import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    try {
      await require('fs').promises.mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(uploadsDir, file.name);

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      message: "File uploaded successfully",
      fileName: file.name,
      size: file.size,
      path: `/uploads/${file.name}`
    });

  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
