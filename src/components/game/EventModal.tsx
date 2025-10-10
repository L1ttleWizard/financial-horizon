// src/components/game/EventModal.tsx
'use client';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { makeChoice } from '@/store/slices/gameSlice';
import type { GameEvent, Choice } from '@/data/gameEvents';

interface ModalProps {
  event: GameEvent;
}

export function EventModal({ event }: ModalProps) {
  const dispatch = useDispatch();

  // Теперь мы передаем в makeChoice только сам объект Choice
  const handleChoice = (choice: Choice) => {
    dispatch(makeChoice(choice));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 modal-background">
      <div className="rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-fade-in-up bg-gray-900 bg-opacity-50">
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4">
          <Image
            src={event.illustration}
            alt={event.title}
            width={300}
            height={300}
            className="mb-4"
            priority
          />
        </div>
        <div className="text-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{event.title}</h2>
          <p className="text-gray-300 mb-6">{event.description}</p>
          <div id="event-choices" className="flex flex-col space-y-3">
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-4 bg-gray-800 rounded-lg hover:bg-blue-900 hover:shadow-md border-2 border-gray-700 hover:border-blue-500 transition-all transform hover:scale-102"
              >
                <p className="font-semibold text-white">{choice.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
