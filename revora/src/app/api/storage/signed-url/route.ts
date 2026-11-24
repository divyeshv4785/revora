import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseIdToken, canAccessVehicleDocument } from '@/lib/firebase/serverAuth';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// Strict path format: documents/{sellerUid}/{vehicleId}/{filename}
const DOCUMENT_PATH_REGEX = /^documents\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9._-]+)$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Firebase ID Token
    const authHeader = req.headers.get('Authorization');
    const user = await verifyFirebaseIdToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or expired Firebase authentication token.' },
        { status: 401 }
      );
    }

    // 2. Parse Body
    const body = await req.json().catch(() => ({}));
    const { filePath, expiresIn = 60 } = body;

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json(
        { error: 'Bad request. filePath is required.' },
        { status: 400 }
      );
    }

    // 3. Security: Path Traversal & Format Verification
    const match = filePath.match(DOCUMENT_PATH_REGEX);
    if (!match) {
      return NextResponse.json(
        { error: 'Access denied. Invalid document path format or path traversal attempt detected.' },
        { status: 403 }
      );
    }

    const documentOwnerUid = match[1];

    // 4. Permission Check: Enforce Owner or Authorized Staff Access
    const isAuthorized = await canAccessVehicleDocument(user.uid, documentOwnerUid);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden. You do not have authorization to view this private vehicle document.' },
        { status: 403 }
      );
    }

    // 5. Generate Short-Lived Signed URL via Supabase Storage
    const supabase = getSupabaseServerClient();
    const expiry = Math.min(Math.max(Number(expiresIn) || 60, 15), 3600); // Between 15s and 1hr

    const { data, error } = await supabase.storage
      .from('vehicle-documents')
      .createSignedUrl(filePath, expiry);

    if (error || !data?.signedUrl) {
      console.error('Error creating signed URL in Supabase:', error);
      return NextResponse.json(
        { error: error?.message || 'Failed to generate signed document URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      expiresIn: expiry,
    });
  } catch (err: any) {
    console.error('Signed URL route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error generating signed URL.' },
      { status: 500 }
    );
  }
}
