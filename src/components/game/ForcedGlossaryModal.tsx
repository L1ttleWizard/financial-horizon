// src/components/game/ForcedGlossaryModal.tsx
"use client";
import { useDispatch } from "react-redux";
import { confirmGlossaryRead } from "@/store/slices/gameSlice";
import type { Term } from "@/data/glossaryData";

interface ModalProps {
  term: Term;
}

export function ForcedGlossaryModal({ term }: ModalProps) {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full flex flex-col animate-fade-in-up">
        <div className="text-center mb-4">
          <span className="text-5xl">🎓</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Время учиться!
          </h2>
          <p className="text-gray-500">
            Прочитайте термин, чтобы продолжить игру.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-6">
          <h3 className="text-2xl font-bold text-yellow-900 mb-2">
            {term.title}
          </h3>
          <p className="text-yellow-800 text-base">{term.definition}</p>
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
