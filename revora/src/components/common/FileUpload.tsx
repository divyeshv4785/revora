'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface FileUploadProps {
  accept?: string;
  maxSizeBytes?: number;
  label?: string;
  hint?: string;
  isDocument?: boolean;
  disabled?: boolean;
  onFileSelect: (file: File) => Promise<void> | void;
  currentPreviewUrl?: string;
  onClearPreview?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeBytes = 10 * 1024 * 1024,
  label = 'Upload File',
  hint = 'Supports JPEG, PNG, WebP up to 10MB',
  isDocument = false,
  disabled = false,
  onFileSelect,
  currentPreviewUrl,
  onClearPreview,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPreviewUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setError(null);

    // Validate size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB limit.`);
      return;
    }

    // Set preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    setSelectedFileName(file.name);
    setUploading(true);

    try {
      await onFileSelect(file);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClearPreview?.();
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </label>
      )}

      {error && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#60ADD9] bg-[#60ADD9]/10'
            : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
        } ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={disabled || uploading}
          onChange={handleInputChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative inline-block group">
            <img
              src={previewUrl}
              alt="Uploaded Preview"
              className="w-24 h-24 object-cover rounded-xl border border-white/20 mx-auto shadow-md"
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#60ADD9] animate-spin" />
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-2 truncate max-w-[200px] mx-auto">
              {selectedFileName || 'Click to replace'}
            </p>
          </div>
        ) : isDocument && selectedFileName ? (
          <div className="flex items-center justify-center gap-3 py-2">
            <FileText className="w-8 h-8 text-[#60ADD9]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[220px]">
                {selectedFileName}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Selected
              </p>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-[#60ADD9] flex items-center justify-center mx-auto">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isDocument ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-white">
                {uploading
                  ? 'Uploading to Supabase Storage...'
                  : 'Click or drag file to upload'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{hint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
