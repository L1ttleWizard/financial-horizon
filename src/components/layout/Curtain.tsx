"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CurtainProps {
  isLoading: boolean;
}

export default function Curtain({ isLoading }: CurtainProps) {
  const { theme } = useTheme();
  const [isClosed, setIsClosed] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsClosed(false), 100); // Small delay
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const doorColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200';

  return (
    <div
      className={`fixed inset-0 z-[100] flex ${isClosed ? '' : 'pointer-events-none'}`}
    >
      {/* Left Door */}
      <div
        className={`w-1/2 h-full ${doorColor} transform transition-transform duration-500 ease-in-out ${
          isClosed ? 'translate-x-0' : '-translate-x-full'
        }`}
      ></div>
      {/* Right Door */}
      <div
        className={`w-1/2 h-full ${doorColor} transform transition-transform duration-500 ease-in-out ${
          isClosed ? 'translate-x-0' : 'translate-x-full'
        }`}
      ></div>
    </div>
  );
}
