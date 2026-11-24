import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyFirebaseIdToken, canManageDealership } from '@/lib/firebase/serverAuth';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_DOC_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_DOC_SIZE_BYTES,
  StorageBucket,
} from '@/lib/storage/supabaseStorage';

// Extension to MIME Type Mapping
const EXTENSION_MIME_MAP: Record<string, string[]> = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  pdf: ['application/pdf'],
};

// Magic Bytes / File Header Signatures
const validateMagicBytes = (buffer: Buffer, mimeType: string): boolean => {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return mimeType === 'image/jpeg';
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return mimeType === 'image/png';
  }

  // WebP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return mimeType === 'image/webp';
  }

  // PDF: %PDF (25 50 44 46)
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return mimeType === 'application/pdf';
  }

  return false;
};

const SANITIZED_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Cryptographically Verify Firebase Authentication ID Token
    const authHeader = req.headers.get('Authorization');
    const user = await verifyFirebaseIdToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or expired Firebase authentication token.' },
        { status: 401 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = formData.get('bucket') as StorageBucket | null;
    const rawVehicleId = (formData.get('vehicleId') as string | null) || 'unassigned';
    const rawDealershipId = (formData.get('dealershipId') as string | null) || 'unassigned';
    const rawDocumentType = (formData.get('documentType') as string | null) || 'doc';

    if (!file || !bucket) {
      return NextResponse.json(
        { error: 'Bad request. File and target bucket are required.' },
        { status: 400 }
      );
    }

    const validBuckets: StorageBucket[] = [
      'vehicle-images',
      'profile-images',
      'dealership-images',
      'vehicle-documents',
    ];

    if (!validBuckets.includes(bucket)) {
      return NextResponse.json(
        { error: `Invalid storage bucket: ${bucket}` },
        { status: 400 }
      );
    }

    // 3. Path Traversal & Identifier Sanitization
    if (rawVehicleId !== 'unassigned' && !SANITIZED_ID_REGEX.test(rawVehicleId)) {
      return NextResponse.json(
        { error: 'Invalid vehicle identifier format. Alphanumeric, underscores, and hyphens only.' },
        { status: 400 }
      );
    }

    if (rawDealershipId !== 'unassigned' && !SANITIZED_ID_REGEX.test(rawDealershipId)) {
      return NextResponse.json(
        { error: 'Invalid dealership identifier format. Alphanumeric, underscores, and hyphens only.' },
        { status: 400 }
      );
    }

    if (!SANITIZED_ID_REGEX.test(rawDocumentType)) {
      return NextResponse.json(
        { error: 'Invalid document type format.' },
        { status: 400 }
      );
    }

    const vehicleId = rawVehicleId;
    const dealershipId = rawDealershipId;
    const documentType = rawDocumentType;

    // 4. Dealership Permission Check: Enforce Authorized Staff / Owner Access
    if (bucket === 'dealership-images') {
      if (dealershipId === 'unassigned') {
        return NextResponse.json(
          { error: 'Dealership ID is required for dealership image uploads.' },
          { status: 400 }
        );
      }

      const isAuthorizedDealer = await canManageDealership(user.uid, dealershipId);
      if (!isAuthorizedDealer) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have authorization to manage images for this dealership.' },
          { status: 403 }
        );
      }
    }

    // 5. File Size & MIME Type Validation on Server
    const isDocument = bucket === 'vehicle-documents';
    const allowedTypes = isDocument ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
    const maxSize = isDocument ? MAX_DOC_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type '${file.type}'. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds the maximum permitted limit of ${maxSize / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // 6. File Extension & Magic Bytes Validation
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const permittedMimesForExt = EXTENSION_MIME_MAP[extension] || [];

    if (!permittedMimesForExt.includes(file.type)) {
      return NextResponse.json(
        { error: `File extension '.${extension}' does not match declared MIME type '${file.type}'.` },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const isSignatureValid = validateMagicBytes(fileBuffer, file.type);

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'File content does not match the binary signature of the declared file type.' },
        { status: 400 }
      );
    }

    // 7. Secure Path Generation (Protected against Overwrite and Traversal)
    const timestamp = Date.now();
    const randomNonce = crypto.randomBytes(4).toString('hex');
    const safeBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 32);

    let storagePath = '';

    switch (bucket) {
      case 'profile-images':
        // Scoped strictly to the authenticated Firebase UID
        storagePath = `profiles/${user.uid}/avatar_${timestamp}_${randomNonce}.${extension}`;
        break;

      case 'vehicle-images':
        // Scoped strictly to the authenticated seller UID
        storagePath = `vehicles/${user.uid}/${vehicleId}/${timestamp}_${randomNonce}_${safeBaseName}.${extension}`;
        break;

      case 'dealership-images':
        // Scoped to verified dealership ID
        storagePath = `dealerships/${dealershipId}/${timestamp}_${randomNonce}_${safeBaseName}.${extension}`;
        break;

      case 'vehicle-documents':
        // Private document path scoped strictly to the authenticated user UID
        storagePath = `documents/${user.uid}/${vehicleId}/${documentType}_${timestamp}_${randomNonce}.${extension}`;
        break;
    }

    // 8. Upload File using Server-Side Privileged Supabase Client
    const supabase = getSupabaseServerClient();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false, // Prevent unintentional overwrite of existing files
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Failed to upload file to storage.' },
        { status: 500 }
      );
    }

    // 9. Return Response (Private bucket never exposes public URL)
    if (bucket === 'vehicle-documents') {
      return NextResponse.json({
        success: true,
        bucket,
        filePath: storagePath,
      });
    }

    // Public buckets: Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      bucket,
      filePath: storagePath,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error('Server upload route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during upload.' },
      { status: 500 }
    );
  }
}
