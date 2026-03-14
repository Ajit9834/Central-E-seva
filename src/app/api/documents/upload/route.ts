import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Document } from '@/models/Document';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Map frontend document types to backend enum values
function mapDocumentType(type: string): Document['type'] {
  const typeMap: Record<string, Document['type']> = {
    'Aadhar Card': 'aadhar',
    'PAN Card': 'pan',
    'Driving License': 'driving',
    'Birth Certificate': 'birth',
    'Passport Photo': 'passport',
    'Other': 'other'
  };
  
  return typeMap[type] || 'other';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create document object with correct type mapping
    const document = {
      title: title || file.name,
      type: mapDocumentType(documentType) || 'other',
      description: '',
      filePath: `/uploads/${filename}`,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      status: 'pending'
    };

    // Try to save to database, fallback to JSON if MongoDB is not available
    try {
      console.log('Attempting to connect to database...');
      console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
      console.log('MongoDB DB:', process.env.MONGODB_DB || 'Not set');
      
      const db = await connectToDatabase();
      console.log('Connected to database successfully');
      
      const dbDocument: Omit<Document, '_id'> = document;
      console.log('Document to insert:', JSON.stringify(dbDocument, null, 2));
      
      const result = await db.collection('documents').insertOne(dbDocument);
      console.log('Document inserted successfully, ID:', result.insertedId);

      return NextResponse.json({
        success: true,
        document: {
          ...document,
          _id: result.insertedId.toString(),
          documentType: document.type,
          originalName: document.fileName,
          fileUrl: document.filePath,
          uploadedAt: document.uploadedAt.toISOString()
        }
      });
    } catch (dbError) {
      const error = dbError as Error;
      console.error('MongoDB error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.warn('MongoDB not available, saving to JSON fallback:', error);
      
      // Fallback to JSON file storage
      const fs = require('fs');
      const documentsPath = join(process.cwd(), 'data', 'documents.json');
      
      try {
        await mkdir(join(process.cwd(), 'data'), { recursive: true });
      } catch (e) {
        // Directory might already exist
      }
      
      let documents = [];
      try {
        const data = await fs.promises.readFile(documentsPath, 'utf8');
        documents = JSON.parse(data);
      } catch (e) {
        // File might not exist, start with empty array
      }
      
      const documentWithId = {
        ...document,
        _id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      documents.push(documentWithId);
      await fs.promises.writeFile(documentsPath, JSON.stringify(documents, null, 2));
      
      return NextResponse.json({
        success: true,
        document: {
          ...documentWithId,
          documentType: document.type,
          originalName: document.fileName,
          fileUrl: document.filePath,
          uploadedAt: document.uploadedAt.toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
