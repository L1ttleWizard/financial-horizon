// src/app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

interface UserData {
  uid: string;
  nickname: string;
  week: number;
  netWorth: number;
}

const PAYDAY_CYCLE = 4; // This should be consistent with gameSlice

export async function GET() {
  if (!admin.apps.length) {
    console.error('Firebase Admin SDK not initialized.');
    return NextResponse.json({ error: 'Internal Server Error: Firebase Admin SDK not initialized.' }, { status: 500 });
  }

  try {
    const userRecords = await adminAuth.listUsers();
    const authUsers = userRecords.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));

    if (authUsers.length === 0) {
      return NextResponse.json([]);
    }

    const uids = authUsers.map(user => user.uid);
    const userDocs = await adminDb.collection('users').where(admin.firestore.FieldPath.documentId(), 'in', uids).get();
    const firestoreData = new Map(userDocs.docs.map(doc => [doc.id, doc.data()]));

    const leaderboardData: UserData[] = authUsers.map(user => {
      const firestoreUser = firestoreData.get(user.uid);

      if (firestoreUser && firestoreUser.gameState) {
        const lastNetWorthPoint = firestoreUser.gameState.netWorthHistory?.slice(-1)[0];
        return {
          uid: user.uid,
          nickname: firestoreUser.nickname || user.email || 'Anonymous',
          week: Math.floor((firestoreUser.gameState.day || 0) / PAYDAY_CYCLE),
          netWorth: lastNetWorthPoint ? lastNetWorthPoint.netWorth : 0,
        };
      } else {
        // User from Auth who hasn't played or has no gameState
        return {
          uid: user.uid,
          nickname: user.displayName || user.email || 'Anonymous',
          week: 0,
          netWorth: 0,
        };
      }
    });

    // Sort by week descending, then by netWorth descending
    leaderboardData.sort((a, b) => {
      if (b.week !== a.week) {
        return b.week - a.week;
      }
      return b.netWorth - a.netWorth;
    });

    // Return the top 20 users
    return NextResponse.json(leaderboardData.slice(0, 20));
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
