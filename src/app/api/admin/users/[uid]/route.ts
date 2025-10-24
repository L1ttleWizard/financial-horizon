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

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const authorization = (await headers()).get('Authorization');
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
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const firebaseUser = await adminAuth.getUser(uid);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || 'N/A',
      displayName: firebaseUser.displayName || 'No Name',
      role: userDoc.data()?.role || 'user',
      disabled: firebaseUser.disabled,
      gameState: userDoc.data()?.gameState, // Assuming gameState is stored here
    };

    return NextResponse.json({ user: userData });
  } catch (error: unknown) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const authorization = (await headers()).get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  const isAdmin = await verifyAdmin(idToken);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { uid } = params;
  const { gameState } = await request.json();

  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Deep merge the existing gameState with the new one
    const existingState = userDoc.data()?.gameState || {};
    const newState = { ...existingState, ...gameState };

    await userRef.set({ gameState: newState }, { merge: true });

    return NextResponse.json({ message: 'Game state updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating game state:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { uid: string } }
) {
  const authorization = (await headers()).get('Authorization');
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
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    const firebaseError = error as { code?: string };
    if (firebaseError.code === 'auth/user-not-found') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
