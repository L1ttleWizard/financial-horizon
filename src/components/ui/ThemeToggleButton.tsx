'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md text-semibold transition-transform duration-300 transform ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 rotate-180' : 'text-gray-700 hover:bg-gray-200 rotate-0'}`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
};
