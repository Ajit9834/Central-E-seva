import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Document, CreateDocumentInput } from '@/models/Document';
import { WithId } from 'mongodb';

export async function GET() {
  try {
    // Try to fetch from database first
    try {
      const db = await connectToDatabase();
      const documents = await db.collection('documents').find({}).sort({ uploadedAt: -1 }).toArray();
      
      return NextResponse.json({ 
        success: true, 
        documents: documents.map((doc) => ({
          ...doc,
          _id: doc._id.toString(),
          fileUrl: doc.filePath || doc.fileUrl, // Map filePath to fileUrl
          documentType: doc.type || doc.documentType, // Map type to documentType
          originalName: doc.fileName || doc.originalName, // Map fileName to originalName
          uploadedAt: doc.uploadedAt instanceof Date ? doc.uploadedAt.toISOString() : doc.uploadedAt
        }))
      });
    } catch (dbError) {
      console.warn('MongoDB not available, reading from JSON fallback:', dbError);
      
      // Fallback to JSON file storage
      const fs = require('fs');
      const documentsPath = require('path').join(process.cwd(), 'data', 'documents.json');
      
      try {
        const data = await fs.promises.readFile(documentsPath, 'utf8');
        const documents = JSON.parse(data);
        
        return NextResponse.json({
          success: true,
          documents: documents.map((doc: any) => ({
            ...doc,
            fileUrl: doc.filePath || doc.fileUrl, // Map filePath to fileUrl
            documentType: doc.type || doc.documentType, // Map type to documentType
            originalName: doc.fileName || doc.originalName, // Map fileName to originalName
            uploadedAt: doc.uploadedAt instanceof Date ? doc.uploadedAt.toISOString() : doc.uploadedAt
          }))
        });
      } catch (fileError) {
        console.warn('No documents file found, returning empty array:', fileError);
        
        return NextResponse.json({
          success: true,
          documents: []
        });
      }
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDocumentInput = await request.json();
    const db = await connectToDatabase();
    
    const document: Omit<Document, '_id'> = {
      ...body,
      uploadedAt: new Date(),
      status: 'pending'
    };
    
    const result = await db.collection('documents').insertOne(document);
    
    return NextResponse.json({
      success: true,
      data: {
        ...document,
        _id: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
