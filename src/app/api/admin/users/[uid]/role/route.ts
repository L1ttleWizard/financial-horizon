// src/app/api/admin/users/[uid]/role/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { headers as nextHeaders } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper function to verify admin privileges
async function verifyAdmin(idToken: string): Promise<string | null> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

    if (userDoc.exists && userDoc.data()?.role === 'admin') {
      return decodedToken.uid;
    }
    return null;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return null;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const authorization = (await nextHeaders()).get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  const adminUid = await verifyAdmin(idToken);

  if (!adminUid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { uid } = params;
  const { role } = await request.json();

  if (!role || (role !== 'admin' && role !== 'user')) {
    return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
  }

  // Prevent an admin from accidentally revoking their own admin status
  if (adminUid === uid && role === 'user') {
    return NextResponse.json({ error: 'Admin cannot revoke their own admin status' }, { status: 400 });
  }

  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return NextResponse.json({ error: 'User not found in Firestore' }, { status: 404 });
    }

    await userRef.update({ role });

    return NextResponse.json({ message: `User role updated to ${role}` });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
