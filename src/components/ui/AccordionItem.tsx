'use client';

interface AccordionItemProps {
  term: {
    title: string;
    definition: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({ term, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
      >
        <span className="text-lg font-semibold text-gray-800">{term.title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
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
        <div className="pb-4 px-2 text-gray-600">
          {term.definition}
        </div>
      </div>
    </div>
  );
}