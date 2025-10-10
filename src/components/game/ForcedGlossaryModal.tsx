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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 modal-background">
      <div className="rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full flex flex-col animate-fade-in-up text-white bg-gray-900 bg-opacity-50">
        <div className="text-center mb-4">
          <span className="text-5xl">🎓</span>
          <h2 className="text-3xl font-bold text-white mt-2">
            Время учиться!
          </h2>
          <p className="text-gray-300">
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