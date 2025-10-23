// src/app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

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

export async function GET(request: Request) {
  if (!admin.apps.length) {
    console.error('Firebase Admin SDK not initialized.');
    return NextResponse.json({ error: 'Internal Server Error: Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  const authorization = headers().get('Authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const idToken = authorization.split('Bearer ')[1];
  const isAdmin = await verifyAdmin(idToken);

  if (!isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const userRecords = await adminAuth.listUsers();
    const users = userRecords.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      disabled: user.disabled,
      // Note: Custom claims and roles from Firestore need to be fetched separately if needed
    }));

    // If you also need the role from Firestore for each user in the list
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const userDoc = await adminDb.collection('users').doc(user.uid).get();
        const userDocData = userDoc.exists ? userDoc.data() : null;
        return {
          ...user,
          // Use displayName from Auth if it exists, otherwise use nickname from Firestore
          displayName: user.displayName || userDocData?.nickname,
          role: userDocData ? userDocData.role : 'user',
        };
      })
    );

    return NextResponse.json({ users: usersWithRoles });
  } catch (error) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
