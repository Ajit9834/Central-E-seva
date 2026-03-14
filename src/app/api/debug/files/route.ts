import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadsDir);
    
    const fileDetails = await Promise.all(
      files.slice(0, 5).map(async (file) => {
        const filePath = join(uploadsDir, file);
        const stats = await readFile(filePath);
        return {
          name: file,
          size: stats.length,
          url: `/uploads/${file}`,
          fullUrl: `http://localhost:3000/uploads/${file}`
        };
      })
    );

    return NextResponse.json({
      success: true,
      uploadsDir,
      totalFiles: files.length,
      sampleFiles: fileDetails
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
      uploadsDir: join(process.cwd(), 'public', 'uploads')
    }, { status: 500 });
  }
}
