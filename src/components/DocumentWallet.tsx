'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Search, Filter, Plus, Eye } from 'lucide-react';
import AddDocumentModal, { DocumentUpload } from './AddDocumentModal';
import DocumentPreview from './DocumentPreview';

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

export default function DocumentWallet() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Set empty array to prevent crashes
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  };

  const getSearchSuggestions = () => {
    if (!searchTerm) return DOCUMENT_TYPES.slice(0, 5);
    
    const suggestions = DOCUMENT_TYPES.filter(type =>
      type.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
    
    return suggestions;
  };

  const handleDocumentUpload = (documentData: Document) => {
    // Scenario 2: Check if the document object is defined after async operation
    if (!documentData) {
      console.error("Document object is null or undefined");
      return;
    }
    
    if (!documentData.documentType || typeof documentData.documentType === 'undefined') {
      console.error("Error: documentData.documentType is undefined.");
      return;
    }
    
    if (!documentData._id) {
      console.error("Error: documentData._id is undefined.");
      return;
    }
    
    // Add the server-returned document to the state
    setDocuments(prev => [documentData, ...prev]);
    setIsModalOpen(false);
    // Refresh documents list from server to ensure consistency
    fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== id));
      } else {
        alert('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleDownload = (document: Document) => {
    // Validate document and fileUrl
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

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-shell overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">My Documents</h1>
              <p className="text-slate-400 mt-1">Securely store and manage your important documents</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Document
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative search-container">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents or document types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/8 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500"
              />
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 glass border border-white/8 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm text-slate-200 border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {suggestion}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                id="document-filter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white/5 border border-white/8 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none text-slate-200"
                aria-label="Filter by document type"
              >
                <option value="all" className="bg-slate-800">All Types</option>
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type} className="bg-slate-800">{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Showing {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by uploading your first document'}
            </p>
            {!searchTerm && selectedType === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <div key={document._id} className="glass glass-hover rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {document.originalName}
                      </h3>
                      <p className="text-sm text-slate-400">{document.documentType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>{formatDate(document.uploadedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {(document.mimeType === 'application/pdf' || document.mimeType.startsWith('image/')) && (
                    <button
                      onClick={() => handlePreview(document)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-slate-300 rounded hover:bg-white/10 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={() => handleDownload(document)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white/5 text-slate-300 rounded hover:bg-white/10 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(document._id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDocumentUpload={handleDocumentUpload}
      />

      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        document={selectedDocument}
      />
    </div>
  );
}
