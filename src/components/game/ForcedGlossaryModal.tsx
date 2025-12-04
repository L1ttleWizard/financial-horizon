// src/components/game/ForcedGlossaryModal.tsx
"use client";
import { useDispatch } from "react-redux";
import { confirmGlossaryRead } from "@/store/slices/gameSlice";
import type { Term } from "@/data/glossaryData";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  term: Term;
}

export function ForcedGlossaryModal({ term }: ModalProps) {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(45, 55, 72, 0.5)' }}>
      <div className={`rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full flex flex-col animate-fade-in-up  ${theme==="dark" ?" text-white bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-xl":"bg-gray-100 text-gray-700"
      }`}>
        <div className="text-center mb-4">
          <span className="text-5xl">🎓</span>
          <h2 className="text-3xl font-bold text-gray-2 00 mt-2">
            Время учиться!
          </h2>
          <p className="">
            Прочитайте термин, чтобы продолжить игру.
          </p>
        </div>

        <div className="bg-yellow-500 border-l-4 border-yellow-300 p-4 rounded-r-lg my-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            {term.title}
          </h3>
          <p className="text-yellow-100 text-base">{term.definition}</p>
        </div>

        <button
          onClick={() => dispatch(confirmGlossaryRead())}
          className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Я прочитал и понял
        </button>
      </div>
    </div>
  );
}