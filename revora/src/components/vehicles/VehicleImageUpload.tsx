'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { uploadVehicleImage } from '@/lib/storage/supabaseStorage';
import { useToast } from '@/components/common/Toast';

interface VehicleImageUploadProps {
  vehicleId: string;
  initialImages?: string[];
  maxImages?: number;
  onImagesChange?: (urls: string[]) => void;
}

export const VehicleImageUpload: React.FC<VehicleImageUploadProps> = ({
  vehicleId,
  initialImages = [],
  maxImages = 12,
  onImagesChange,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);

    if (!user) {
      setError('Please sign in to upload vehicle images.');
      return;
    }

    if (images.length + selectedFiles.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images per vehicle.`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const idToken = await user.getIdToken();
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const res = await uploadVehicleImage(file, vehicleId, idToken);
        if (res.success && res.publicUrl) {
          uploadedUrls.push(res.publicUrl);
        } else {
          console.warn('File upload warning:', res.error);
        }
      }

      if (uploadedUrls.length > 0) {
        const updated = [...images, ...uploadedUrls];
        setImages(updated);
        onImagesChange?.(updated);
        showToast(
          'Images Uploaded',
          `Successfully uploaded ${uploadedUrls.length} vehicle photo(s) to Supabase Storage.`,
          'success'
        );
      }
    } catch (err: any) {
      console.error('Vehicle image upload error:', err);
      setError(err.message || 'Failed to upload images.');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, i) => i !== indexToRemove);
    setImages(updated);
    onImagesChange?.(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
            Vehicle Photographs
          </label>
          <span className="text-[11px] text-gray-500">
            Upload high-resolution exterior, interior, dashboard, and odometer photos ({images.length}/{maxImages})
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div
            key={url + idx}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 group"
          >
            <img
              src={url}
              alt={`Vehicle upload ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#60ADD9] text-[#070B0D]">
                Cover Photo
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload Button Tile */}
        {images.length < maxImages && (
          <label
            className={`aspect-[4/3] rounded-2xl border-2 border-dashed border-white/15 hover:border-[#60ADD9] bg-white/[0.02] hover:bg-white/[0.05] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={handleFilesSelect}
              className="hidden"
            />
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-[#60ADD9] animate-spin" />
                <span className="text-[10px] font-bold uppercase text-gray-400">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#60ADD9]" />
                <span className="text-xs font-bold text-white">Add Photos</span>
                <span className="text-[9px] text-gray-500">JPEG, PNG, WebP</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
};
