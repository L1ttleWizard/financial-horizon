'use client';

import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md text-semibold   ${theme ==='dark'? 'text-gray-300 hover:bg-gray-700': 'text-gray-700 hover:bg-gray-200'}`}

    >
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
};
