import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    console.log('MONGODB_DB:', process.env.MONGODB_DB || 'Not set');
    
    const db = await connectToDatabase();
    console.log('Connected to database successfully');
    
    // Test basic operation
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Test document count
    const count = await db.collection('documents').countDocuments();
    console.log('Document count:', count);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      collections: collections.map(c => c.name),
      documentCount: count,
      env: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        mongodbDb: process.env.MONGODB_DB || 'Not set'
      }
    });
  } catch (error) {
    const err = error as Error;
    console.error('MongoDB connection failed:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return NextResponse.json({
      success: false,
      error: err.message,
      env: {
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
        mongodbDb: process.env.MONGODB_DB || 'Not set'
      }
    }, { status: 500 });
  }
}
