import { ObjectId, Document as MongoDocument } from 'mongodb';

export interface Document extends MongoDocument {
  _id: ObjectId;
  title: string;
  type: 'aadhar' | 'pan' | 'driving' | 'birth' | 'passport' | 'age_proof' | 'tenth_marksheet' | 'twelfth_marksheet' | 'graduation_marksheet' | 'address_proof' | 'voter_id' | 'income_certificate' | 'caste_certificate' | 'other';
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
