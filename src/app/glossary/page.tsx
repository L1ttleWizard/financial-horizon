// src/app/glossary/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { glossaryData } from '@/data/glossaryData';
import { AccordionItem } from '@/components/ui/AccordionItem';

export default function GlossaryPage() {
  const [openTermId, setOpenTermId] = useState<number | null>(null);

  const handleTermClick = (termId: number) => {
    setOpenTermId(openTermId === termId ? null : termId);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">Глоссарий</h1>
          <p className="text-gray-600 mt-2">Ключевые финансовые термины, которые стоит знать.</p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
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