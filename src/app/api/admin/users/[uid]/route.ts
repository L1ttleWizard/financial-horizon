// src/app/api/admin/users/[uid]/route.ts
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper function to verify admin privileges
async function verifyAdmin(idToken: string): Promise<boolean> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();

    if (userDoc.exists && userDoc.data()?.role === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return false;
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  const isAdmin = await verifyAdmin(idToken);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { uid } = params;

  try {
    // You might want to prevent an admin from deleting themselves.
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.uid === uid) {
        return NextResponse.json({ error: 'Admin cannot delete self' }, { status: 400 });
    }

    await adminAuth.deleteUser(uid);
    // Also delete the user's document from Firestore
    await adminDb.collection('users').doc(uid).delete();

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
