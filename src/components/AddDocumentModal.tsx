'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText } from 'lucide-react';

// Import Document interface from DocumentWallet
interface Document {
  _id: string;
  documentType: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface DocumentUpload {
  title: string;
  type: string;
  file: File;
}

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentUpload: (document: Document) => void;
}

const DOCUMENT_TYPES = [
  'Passport Photo',
  'Age Proof',
  '10th Marksheet',
  '12th Marksheet',
  'Graduation Marksheet',
  'Address Proof',
  'PAN Card',
  'Aadhar Card',
  'Voter ID',
  'Driving License',
  'Income Certificate',
  'Caste Certificate',
  'Birth Certificate',
  'Other'
];

export default function AddDocumentModal({ isOpen, onClose, onDocumentUpload }: AddDocumentModalProps) {
  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setDocumentType('');
    setSelectedFile(null);
    setDragActive(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, JPG, or PNG file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Scenario 1: Missing or undefined event object
    if (!event) {
      console.error("Event object is null or undefined");
      return;
    }
    
    if (!event.target) {
      console.error("Event target is null or undefined");
      return;
    }
    
    if (!event.target.files) {
      console.error("Event target files is null or undefined");
      return;
    }
    
    if (event.target.files.length === 0) {
      console.error("No files selected");
      return;
    }

    const file = event.target.files[0];

    // Additional validation for file object
    if (!file) {
      console.error("File object is null or undefined");
      return;
    }

    // Now, safely access file.type because 'file' is guaranteed to exist
    if (file.type) {
      handleFileSelect(file);
    } else {
      console.error("File object or its 'type' property is undefined.");
    }
  };

  const handleUpload = async () => {
    if (!documentType || !selectedFile) {
      alert('Please select document type and file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', documentType);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Scenario 2: Check if the document object is defined after async operation
        if (!data) {
          alert('Server returned invalid response');
          return;
        }
        
        if (!data.success) {
          alert(data.error || 'Server operation failed');
          return;
        }
        
        if (!data.document) {
          alert('Server did not return document data');
          return;
        }
        
        // Validate required document properties
        const requiredProps = ['_id', 'documentType', 'fileName', 'originalName', 'fileUrl', 'fileSize', 'mimeType', 'uploadedAt'];
        const missingProps = requiredProps.filter(prop => !(prop in data.document));
        
        if (missingProps.length > 0) {
          alert('Server returned incomplete document data');
          return;
        }
        
        onDocumentUpload(data.document);
        handleClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Document</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close modal"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              id="document-type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select document type"
            >
              <option value="">Select document type</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label="Upload document file"
              />

              {selectedFile ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Drag and drop your file here, or{' '}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, or PNG (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!documentType || !selectedFile || uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
