'use client';

import { useAuth } from '@/contexts/AuthContext';


export default function ProfilePage() {
  const { user, loading } = useAuth();

  // While loading, show a loading indicator
  if (loading) {
    return <div style={containerStyle}><p>Загрузка...</p></div>;
  }

  // If user is logged in, show their profile
  return (
    user && (
      <div style={containerStyle}>
        <div style={profileCardStyle}>
          <h1>Профиль пользователя</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
          {/* More user data can be added here later */}
        </div>
      </div>
    )
  );
}

// Styles
const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '2rem',
  minHeight: 'calc(100vh - 80px)', // Adjust 80px based on header height
  backgroundColor: '#f9fafb',
};

const profileCardStyle: React.CSSProperties = {
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '600px',
};
