'use client';

import React, { useState } from 'react';
import { FileText, Lock, Eye, Download, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { uploadVehicleDocument, getPrivateDocumentSignedUrl } from '@/lib/storage/supabaseStorage';
import { useToast } from '@/components/common/Toast';

interface VehicleDocumentUploadProps {
  vehicleId: string;
  documentType: 'rc' | 'insurance' | 'puc' | 'service_record';
  title: string;
  description: string;
  currentDocumentPath?: string;
  onDocumentUploaded?: (filePath: string) => void;
}

export const VehicleDocumentUpload: React.FC<VehicleDocumentUploadProps> = ({
  vehicleId,
  documentType,
  title,
  description,
  currentDocumentPath,
  onDocumentUploaded,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [documentPath, setDocumentPath] = useState<string | null>(currentDocumentPath || null);
  const [uploading, setUploading] = useState(false);
  const [requestingUrl, setRequestingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!user) {
      setError('Please sign in to upload vehicle documents.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const idToken = await user.getIdToken();
      const res = await uploadVehicleDocument(file, vehicleId, documentType, idToken);

      if (!res.success || !res.filePath) {
        throw new Error(res.error || 'Failed to upload document.');
      }

      setDocumentPath(res.filePath);
      onDocumentUploaded?.(res.filePath);
      showToast(
        'Document Secured',
        `Successfully uploaded to private Supabase Storage.`,
        'success'
      );
    } catch (err: any) {
      console.error('Document upload error:', err);
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleViewPrivateDocument = async () => {
    if (!documentPath || !user) return;
    setRequestingUrl(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const res = await getPrivateDocumentSignedUrl(documentPath, idToken, 60);

      if (!res.success || !res.signedUrl) {
        throw new Error(res.error || 'Failed to generate signed document URL.');
      }

      // Open short-lived signed URL in a secure new tab
      window.open(res.signedUrl, '_blank', 'noopener,noreferrer');
      showToast('Secure Document Opened', 'Generated 60-second short-lived signed URL.', 'info');
    } catch (err: any) {
      console.error('Error opening document:', err);
      setError(err.message || 'Access denied.');
      showToast('Access Error', err.message || 'Could not access document.', 'warning');
    } finally {
      setRequestingUrl(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#60ADD9]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <Lock className="w-2.5 h-2.5" />
                Private
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>

        {documentPath && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded
          </span>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action controls */}
      <div className="flex items-center gap-2.5 pt-1">
        <label
          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer transition-colors flex items-center gap-2 ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#60ADD9]" />
              <span>Uploading...</span>
            </>
          ) : (
            <span>{documentPath ? 'Replace Document' : 'Upload Document'}</span>
          )}
        </label>

        {documentPath && (
          <button
            type="button"
            onClick={handleViewPrivateDocument}
            disabled={requestingUrl}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#60ADD9]/10 hover:bg-[#60ADD9]/20 border border-[#60ADD9]/30 text-[#60ADD9] transition-colors flex items-center gap-1.5"
          >
            {requestingUrl ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Authorizing...</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>View Securely</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
