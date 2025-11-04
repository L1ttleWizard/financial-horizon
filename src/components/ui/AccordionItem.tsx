'use client';

import { useTheme } from '@/contexts/ThemeContext';
import Link from "next/link";

interface AccordionItemProps {
  term: {
    title: string;
    definition: string;
    wikiLink: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({ term, isOpen, onClick }: AccordionItemProps) {
  const { theme } = useTheme();
  return (
    <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>

      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
      >
        <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{term.title}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className={`pb-4 px-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>

          <p>{term.definition}</p>
          <Link
            href={term.wikiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Подробнее в google
          </Link>
        </div>
      </div>
    </div>
  );
}