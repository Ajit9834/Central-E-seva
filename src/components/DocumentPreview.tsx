'use client';

import React from 'react';
import { X, Download } from 'lucide-react';

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

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function DocumentPreview({ isOpen, onClose, document }: DocumentPreviewProps) {
  const handleDownload = () => {
    if (!document || !document.fileUrl) {
      alert('File URL not available for download');
      return;
    }
    
    // Create proper URL for the file
    const fileUrl = document.fileUrl.startsWith('http') 
      ? document.fileUrl 
      : `${window.location.origin}${document.fileUrl}`;
    
    const link = window.document.createElement('a');
    link.href = fileUrl;
    link.download = document.originalName || 'download';
    link.target = '_blank';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileUrl = () => {
    if (!document || !document.fileUrl) {
      return '';
    }
    return document.fileUrl.startsWith('http') 
      ? document.fileUrl 
      : `${window.location.origin}${document.fileUrl}`;
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {document.originalName}
            </h3>
            <p className="text-sm text-gray-600">{document.documentType}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download document"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <div className="max-w-full mx-auto">
            {document.mimeType === 'application/pdf' ? (
              <iframe
                src={getFileUrl()}
                className="w-full h-[600px] border border-gray-300 rounded-lg"
                title={`PDF preview: ${document.originalName}`}
              />
            ) : document.mimeType.startsWith('image/') ? (
              <img
                src={getFileUrl()}
                alt={document.originalName}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Preview not available</p>
                  <p className="text-sm mb-4">This file type cannot be previewed</p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium text-gray-900">{document.documentType}</p>
            </div>
            <div>
              <p className="text-gray-500">Size</p>
              <p className="font-medium text-gray-900">
                {Math.round(document.fileSize / 1024)} KB
              </p>
            </div>
            <div>
              <p className="text-gray-500">Format</p>
              <p className="font-medium text-gray-900">
                {document.mimeType.split('/')[1]?.toUpperCase() || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Uploaded</p>
              <p className="font-medium text-gray-900">
                {formatDate(document.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
