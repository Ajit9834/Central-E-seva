# Document Wallet Feature

A comprehensive document management system similar to DigiLocker for securely storing and managing personal documents.

## Features Implemented

### ✅ Core Features
- **Document Upload**: Upload PDF, JPG, PNG files with validation
- **Document Management**: View, download, and delete documents
- **Document Types**: Support for various government document types
- **Search & Filter**: Search by name and filter by document type
- **Document Preview**: Preview PDFs and images in a modal
- **Responsive Design**: Mobile-friendly interface

### ✅ Backend Features
- **MongoDB Integration**: Store document metadata
- **File Storage**: Files saved in `/public/uploads`
- **API Routes**: RESTful APIs for CRUD operations
- **File Validation**: Type and size validation

### ✅ UI Components
- **DocumentWallet**: Main dashboard component
- **AddDocumentModal**: Upload modal with drag-and-drop
- **DocumentPreview**: Preview modal for documents

## Setup Instructions

### 1. Environment Setup
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/sevadesk
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start MongoDB
Ensure MongoDB is running on your system.

### 4. Run the Application
```bash
npm run dev
```

### 5. Access Document Wallet
Navigate to: `http://localhost:3000/documents`

## API Endpoints

### Upload Document
- **POST** `/api/documents/upload`
- **Body**: FormData with `file` and `documentType`

### Get Documents
- **GET** `/api/documents`
- **Query Params**: `type` (filter), `search` (search term)

### Delete Document
- **DELETE** `/api/documents/[id]`

## Document Types Supported

- Passport Photo
- Age Proof
- 10th Marksheet
- 12th Marksheet
- Graduation Marksheet
- Address Proof
- PAN Card
- Aadhar Card
- Voter ID
- Driving License
- Income Certificate
- Caste Certificate
- Birth Certificate
- Other

## File Upload Specifications

- **Supported Formats**: PDF, JPG, JPEG, PNG
- **Maximum File Size**: 10MB
- **Storage Location**: `/public/uploads/`

## Component Structure

```
src/
├── components/
│   ├── DocumentWallet.tsx      # Main dashboard
│   ├── AddDocumentModal.tsx    # Upload modal
│   └── DocumentPreview.tsx     # Preview modal
├── models/
│   └── Document.ts             # Mongoose model
├── lib/
│   └── mongodb.ts              # MongoDB connection
└── app/api/
    ├── documents/route.ts      # GET documents
    ├── documents/upload/route.ts # POST upload
    └── documents/[id]/route.ts # DELETE document
```

## Database Schema

```typescript
interface IDocument {
  documentType: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  userId: string;
}
```

## Accessibility Features

- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure
- ✅ Focus management in modals
- ✅ Color contrast compliance

## Security Features

- ✅ File type validation
- ✅ File size limits
- ✅ Secure file storage
- ✅ Input sanitization

## Future Enhancements

- User authentication system
- Document categories and folders
- Storage usage indicators
- Document sharing capabilities
- OCR for document text extraction
- Advanced search with filters
- Document versioning
- Expiry date tracking
- Multi-language support

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in `.env.local`

2. **File Upload Fails**
   - Check file size (max 10MB)
   - Verify file format (PDF, JPG, PNG)
   - Ensure `/public/uploads` directory exists

3. **Build Errors**
   - Run `npm install` to install dependencies
   - Check TypeScript configuration

## Development Notes

- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Tailwind CSS for styling
- MongoDB with Mongoose
- File-based storage system
