// src/components/game/EventModal.tsx
'use client';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { makeChoice } from '@/store/slices/gameSlice';
import type { GameEvent, Choice } from '@/data/gameEvents';
import { useState, useEffect } from 'react';

interface ModalProps {
  event: GameEvent;
}

export function EventModal({ event }: ModalProps) {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(event.illustration);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const response = await fetch(`/api/generate-image?prompt=${encodeURIComponent(event.description)}`);
        if (!response.ok) {
          throw new Error('Failed to generate image');
        }
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (error) {
        console.error("Error generating image:", error);
        // Fallback to static image if generation fails
        setImageUrl(event.illustration);
      }
    };

    if (event.description) {
      generateImage();
    }
  }, [event.description, event.illustration]);

  // Теперь мы передаем в makeChoice только сам объект Choice
  const handleChoice = (choice: Choice) => {
    dispatch(makeChoice(choice));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-fade-in-up">
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl p-4">
          <Image
            src={imageUrl}
            alt={event.title}
            width={300}
            height={300}
            className="mb-4"
            priority
          />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-6">{event.description}</p>
          <div id="event-choices" className="flex flex-col space-y-3">
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-md border-2 border-gray-200 hover:border-blue-300 transition-all transform hover:scale-102"
              >
                <p className="font-semibold text-gray-800">{choice.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}