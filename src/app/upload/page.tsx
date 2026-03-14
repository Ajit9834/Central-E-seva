'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface UploadResponse {
  error?: string;
  message?: string;
}

export default function UploadExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error || 'Upload failed'}`);
      } else {
        setMessage(`Success: ${data.message || 'File uploaded successfully'}`);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessage(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <nav className="menu-bar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>SevaDesk</h2>
          </div>
          <div className="nav-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/schemes" className="nav-link">Schemes</a>
            <a href="/documents" className="nav-link">Documents</a>
            <a href="/chat" className="nav-link">Chat</a>
            <a href="/upload" className="nav-link active">Upload</a>
          </div>
        </div>
      </nav>
      
      <div className="upload-container">
        <h2>File Upload Example</h2>
        
        <form onSubmit={uploadFile} className="upload-form">
          <div className="upload-form-group">
            <label htmlFor="fileInput">Select File:</label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="upload-file-input"
              accept="image/*,.pdf,.doc,.docx"
              disabled={uploading}
            />
            {selectedFile && (
              <div className="selected-file">
                <span>Selected: {selectedFile.name}</span>
                <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="upload-button"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>

        {message && (
          <div className={`upload-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="upload-debug-info">
          <h3>Debug Instructions:</h3>
          <ol>
            <li>Open browser console (F12)</li>
            <li>Go to Network tab</li>
            <li>Upload a file</li>
            <li>Check the request details</li>
            <li>Look for status code and response</li>
          </ol>
        </div>
      </div>
    </>
  );
}
