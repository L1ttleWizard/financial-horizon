'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase-client';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { FaTrophy, FaUser } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAppSelector } from '@/store/hooks';
import { MdAddCircleOutline } from 'react-icons/md';
import { GoHomeFill } from 'react-icons/go';

import { ThemeToggleButton } from '@/components/ui/ThemeToggleButton';

import { useTheme } from "@/contexts/ThemeContext";

export const Header = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const onboardingCompleted = useAppSelector((state) => state.onboarding.hasCompleted);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Redirect to home after logout
  };

  return (
    <header className={`w-full shadow-md ${
      theme === 'dark'
        ? 'bg-[rgba(34,13,55,0.65)] shadow-[0px_4px_4px_rgba(0,0,0,0.2),_0px_4px_6px_-1px_rgba(0,0,0,0.5),_0px_2px_4px_-2px_rgba(0,0,0,0.1)]'
        : 'bg-white'
    }`}>
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className={`text-2xl font-bold hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-[#E8E1F0]' : 'text-gray-800'}`}>
          Финансовый Горизонт
        </Link>
        <nav className={`flex items-center gap-6 `} >
          <ThemeToggleButton/>
          {pathname !== '/' && (
            <Link href="/" className={`text-lg font-medium hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <GoHomeFill />
            </Link>
          )}
          <Link href="/leaderboard" className={`text-lg font-medium hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            <FaTrophy />
          </Link>
          {loading ? (
            <div className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Загрузка...</div>
          ) : user ? (
            <>
              <Link href="/profile" className={`text-lg font-medium hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <FaUser />
              </Link>
              <button onClick={handleLogout} className=" cursor-pointer text-lg font-medium text-red-600 hover:text-red-800 transition-colors">
                <FiLogOut />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors">
              <FiLogIn />
              </Link>
              {onboardingCompleted && (
                <Link href="/register" className="text-lg font-medium text-green-600 hover:text-green-800 transition-colors">
                  <MdAddCircleOutline />
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};