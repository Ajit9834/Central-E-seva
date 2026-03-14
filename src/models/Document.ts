import { ObjectId, Document as MongoDocument } from 'mongodb';

export interface Document extends MongoDocument {
  _id: ObjectId;
  title: string;
  type: 'aadhar' | 'pan' | 'driving' | 'birth' | 'passport' | 'other';
  description?: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  status: 'pending' | 'review' | 'verified' | 'approved' | 'rejected';
  userId?: string;
  metadata?: {
    extractedText?: string;
    ocrConfidence?: number;
    [key: string]: unknown;
  };
}

export interface CreateDocumentInput {
  title: string;
  type: Document['type'];
  description?: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  userId?: string;
  metadata?: Document['metadata'];
}

export interface UpdateDocumentInput {
  title?: string;
  description?: string;
  status?: Document['status'];
  metadata?: Document['metadata'];
}
