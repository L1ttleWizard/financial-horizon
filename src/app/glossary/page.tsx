// src/app/glossary/page.tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import Link from 'next/link';
import { glossaryData } from '@/data/glossaryData';
import { AccordionItem } from '@/components/ui/AccordionItem';

export default function GlossaryPage() {
  const { theme } = useTheme();
  const [openTermId, setOpenTermId] = useState<number | null>(null);

  const handleTermClick = (termId: number) => {
    setOpenTermId(openTermId === termId ? null : termId);
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className={`text-3xl sm:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Глоссарий</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Ключевые финансовые термины, которые стоит знать.</p>
        </header>

        <div className={`rounded-xl shadow-md p-4 sm:p-6 ${theme === 'dark' ? 'bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)]' : 'bg-white'}`}>

          {glossaryData.map((term) => (
            <AccordionItem
              key={term.id}
              term={term}
              isOpen={openTermId === term.id}
              onClick={() => handleTermClick(term.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition">
              Вернуться к игре
          </Link>
        </div>
      </div>
    </main>
  );
}