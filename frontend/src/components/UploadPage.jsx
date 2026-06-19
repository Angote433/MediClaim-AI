import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function UploadPage({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('No file selected');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword'].includes(file.type)) {
      setError('Please upload a JPEG, PNG, PDF, or DOCX file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onUploadSuccess(response.data.data);
      } else {
        setError(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
    disabled: uploading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 hero">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🏥 MediClaim AI
          </h1>
          <p className="text-xl text-gray-600">
            Automated Medical Receipt Fraud Detection
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Upload a medical receipt to detect fraud in 30 seconds
          </p>
        </div>

        {/* Upload Area */}
        <div className="card p-8 mb-6">
          <div
            {...getRootProps()}
            className={`
              border-4 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all duration-300
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">
                  Analyzing receipt...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This usually takes 15-30 seconds
                </p>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                  {isDragActive 
                    ? 'Drop the receipt here...' 
                    : 'Drag & drop a receipt, or click to browse'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: JPEG, PNG, PDF, DOCX • Max size: 10MB
                </p>
              </>
            )}
          </div>

          {/* Preview */}
          {preview && !uploading && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Receipt preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="feature-icon">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">Image Forensics</h3>
            <p className="text-sm text-gray-600">
              Detects digital manipulation and editing
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="feature-icon">💰</div>
            <h3 className="font-bold text-gray-800 mb-2">Cost Validation</h3>
            <p className="text-sm text-gray-600">
              Compares prices against market rates
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="feature-icon">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Real-time Results</h3>
            <p className="text-sm text-gray-600">
              Get fraud assessment in 30 seconds
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🔒 All data is processed securely and deleted after analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;