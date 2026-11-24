'use client';

import React, { useState } from 'react';
import { Camera, User as UserIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { uploadProfileImage } from '@/lib/storage/supabaseStorage';
import { updateUserProfileDocument } from '@/lib/firebase/firestore';
import { useToast } from '@/components/common/Toast';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUploaded?: (publicUrl: string) => void;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoUploaded,
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    currentPhotoUrl || profile?.profilePhotoUrl || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setError(null);

    if (!user) {
      setError('Please sign in to upload a profile photograph.');
      return;
    }

    setUploading(true);

    try {
      // 1. Get Firebase ID token
      const idToken = await user.getIdToken();

      // 2. Upload to Supabase Storage 'profile-images' bucket
      const result = await uploadProfileImage(file, idToken);

      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || 'Failed to upload profile picture.');
      }

      setPhotoUrl(result.publicUrl);

      // 3. Update Firestore user profile
      await updateUserProfileDocument(user.uid, {
        profilePhotoUrl: result.publicUrl,
      });

      await refreshProfile();
      onPhotoUploaded?.(result.publicUrl);
      showToast('Profile Photo Updated', 'Uploaded successfully to Supabase Storage.', 'success');
    } catch (err: any) {
      console.error('Profile photo upload error:', err);
      setError(err.message || 'Failed to upload photo.');
      showToast('Upload Error', err.message || 'Failed to upload photo.', 'warning');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10 flex items-center justify-center text-gray-400 shadow-xl">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-gray-500" />
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1.5">
              <Loader2 className="w-6 h-6 text-[#60ADD9] animate-spin" />
              <span className="text-[9px] uppercase font-bold tracking-wider text-white">Uploading</span>
            </div>
          )}
        </div>

        {/* Change button overlay */}
        <label
          htmlFor="profile-photo-input"
          className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#60ADD9] hover:bg-[#4E9BC7] text-[#070B0D] shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
          title="Upload or change profile picture"
        >
          <Camera className="w-3.5 h-3.5" />
          <input
            id="profile-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-center">
        <span className="text-[11px] font-semibold text-gray-400 block">
          {photoUrl ? 'Profile Picture' : 'Add Profile Picture'}
        </span>
        <span className="text-[9px] text-gray-500 block">
          JPEG, PNG, WebP up to 10MB
        </span>
      </div>

      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
