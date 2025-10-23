// src/components/admin/UserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const basePath = '/financial-horizon';

interface UserForAdminView {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  disabled: boolean;
}

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserForAdminView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${basePath}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch users');
        } else {
            const text = await response.text();
            console.error("Server returned non-JSON response:", text);
            throw new Error(`Failed to fetch users. Server returned status ${response.status}.`);
        }
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleRoleChange = async (uid: string, newRole: 'admin' | 'user') => {
    setMessage(null);
    setError(null);
    try {
        const idToken = await user!.getIdToken();
        const response = await fetch(`${basePath}/api/admin/users/${uid}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ role: newRole }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update role');
        }
        setMessage(data.message);
        // Refresh user list
        fetchUsers();
    } catch (err: any) {
        setError(err.message);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;

    setMessage(null);
    setError(null);
    try {
        const idToken = await user!.getIdToken();
        const response = await fetch(`${basePath}/api/admin/users/${uid}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete user');
        }
        setMessage(data.message);
        // Refresh user list
        fetchUsers();
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading users...</p>;

  return (
    <div className="bg-gray-700 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-bold mb-4">User Management</h3>
      {error && <p className="text-red-400 bg-red-900 p-3 rounded-md mb-4">Error: {error}</p>}
      {message && <p className="text-green-400 bg-green-900 p-3 rounded-md mb-4">{message}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {users.map((u) => (
              <tr key={u.uid}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{u.displayName || 'No Name'}</div>
                  <div className="text-sm text-gray-400">{u.email}</div>
                  <div className="text-xs text-gray-500">UID: {u.uid}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-green-800 text-green-200' : 'bg-gray-600 text-gray-300'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                        {u.role === 'user' ? (
                            <button onClick={() => handleRoleChange(u.uid, 'admin')} className="text-green-400 hover:text-green-300">Make Admin</button>
                        ) : (
                            <button onClick={() => handleRoleChange(u.uid, 'user')} className="text-yellow-400 hover:text-yellow-300" disabled={u.uid === user?.uid}>
                                Revoke Admin
                            </button>
                        )}
                        <button onClick={() => handleDeleteUser(u.uid)} className="text-red-500 hover:text-red-400" disabled={u.uid === user?.uid}>
                            Delete
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
