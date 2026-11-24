// REVORA Centralized Supabase Storage Service
// Handles client uploads via secure API routes and public/private URL resolution

export type StorageBucket =
  | 'vehicle-images'
  | 'profile-images'
  | 'dealership-images'
  | 'vehicle-documents';

export interface StorageUploadResult {
  success: boolean;
  filePath: string;
  publicUrl?: string; // Present for public buckets
  signedUrl?: string; // Present for private buckets
  error?: string;
}

// File Validation Constants
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_DOC_SIZE_BYTES = 15 * 1024 * 1024;   // 15MB

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported image format. Please upload JPEG, PNG, or WebP files.',
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Image file size exceeds the 10MB maximum limit.',
    };
  }
  return { isValid: true };
};

export const validateDocumentFile = (file: File): { isValid: boolean; error?: string } => {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported document format. Please upload PDF, JPEG, PNG, or WebP files.',
    };
  }
  if (file.size > MAX_DOC_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'Document file size exceeds the 15MB maximum limit.',
    };
  }
  return { isValid: true };
};

// 1. Upload Profile Image (Buyer or Seller)
export const uploadProfileImage = async (
  file: File,
  idToken: string
): Promise<StorageUploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { success: false, filePath: '', error: validation.error };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', 'profile-images');

  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, filePath: '', error: data.error || 'Upload failed' };
    }

    return {
      success: true,
      filePath: data.filePath,
      publicUrl: data.publicUrl,
    };
  } catch (err: any) {
    console.error('Profile image upload error:', err);
    return { success: false, filePath: '', error: err.message || 'Network error during upload' };
  }
};

// 2. Upload Vehicle Listing Image
export const uploadVehicleImage = async (
  file: File,
  vehicleId: string,
  idToken: string
): Promise<StorageUploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { success: false, filePath: '', error: validation.error };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', 'vehicle-images');
  formData.append('vehicleId', vehicleId);

  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, filePath: '', error: data.error || 'Upload failed' };
    }

    return {
      success: true,
      filePath: data.filePath,
      publicUrl: data.publicUrl,
    };
  } catch (err: any) {
    console.error('Vehicle image upload error:', err);
    return { success: false, filePath: '', error: err.message || 'Network error during upload' };
  }
};

// 3. Upload Dealership Showroom / Logo Image
export const uploadDealershipImage = async (
  file: File,
  dealershipId: string,
  idToken: string
): Promise<StorageUploadResult> => {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    return { success: false, filePath: '', error: validation.error };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', 'dealership-images');
  formData.append('dealershipId', dealershipId);

  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, filePath: '', error: data.error || 'Upload failed' };
    }

    return {
      success: true,
      filePath: data.filePath,
      publicUrl: data.publicUrl,
    };
  } catch (err: any) {
    console.error('Dealership image upload error:', err);
    return { success: false, filePath: '', error: err.message || 'Network error during upload' };
  }
};

// 4. Upload Private Vehicle Document (RC, Insurance, PUC)
export const uploadVehicleDocument = async (
  file: File,
  vehicleId: string,
  documentType: 'rc' | 'insurance' | 'puc' | 'service_record',
  idToken: string
): Promise<StorageUploadResult> => {
  const validation = validateDocumentFile(file);
  if (!validation.isValid) {
    return { success: false, filePath: '', error: validation.error };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', 'vehicle-documents');
  formData.append('vehicleId', vehicleId);
  formData.append('documentType', documentType);

  try {
    const res = await fetch('/api/storage/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, filePath: '', error: data.error || 'Upload failed' };
    }

    return {
      success: true,
      filePath: data.filePath,
      // Private documents DO NOT return public URLs
    };
  } catch (err: any) {
    console.error('Vehicle document upload error:', err);
    return { success: false, filePath: '', error: err.message || 'Network error during upload' };
  }
};

// 5. Get Short-Lived Signed URL for Private Vehicle Documents (default 60 seconds)
export const getPrivateDocumentSignedUrl = async (
  filePath: string,
  idToken: string,
  expiresInSeconds: number = 60
): Promise<{ success: boolean; signedUrl?: string; error?: string }> => {
  try {
    const res = await fetch('/api/storage/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        filePath,
        expiresIn: expiresInSeconds,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Authorization denied for private document' };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err: any) {
    console.error('Error obtaining signed document URL:', err);
    return { success: false, error: err.message || 'Failed to generate signed document URL' };
  }
};
