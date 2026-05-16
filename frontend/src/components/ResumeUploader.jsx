import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import axios from 'axios';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('Please select a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('/api/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const rawText = response.data?.text;
      const safeText = typeof rawText === 'string'
        ? rawText
        : rawText != null
          ? JSON.stringify(rawText)
          : '';

      setUploadedFile({
        name: file.name,
        size: file.size,
        text: safeText,
        pages: response.data.pages ?? 0
      });

      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Uploading and processing...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            <FileText size={48} className="text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <X size={16} />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload your resume
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}

      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            Extracted Text Preview:
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
            {typeof uploadedFile.text === 'string' && uploadedFile.text.length > 0
              ? `${uploadedFile.text.substring(0, 500)}...`
              : 'No preview available.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;