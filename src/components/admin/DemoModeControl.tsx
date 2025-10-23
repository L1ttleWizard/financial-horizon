'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startDemo, stopDemo } from '@/store/slices/demoSlice';
import { setGameState, resetGame, startDemoEvent } from '@/store/slices/gameSlice';
import { demoEvents } from '@/data/demoEvents';

export default function DemoModeControl() {
  const dispatch = useAppDispatch();
  const { isActive, originalGameState } = useAppSelector((state) => state.demo);
  const gameState = useAppSelector((state) => state.game);

  const handleStartDemo = () => {
    // Save the current game state and start the demo
    dispatch(startDemo(gameState));
    dispatch(resetGame());
    dispatch(startDemoEvent(demoEvents[0]));
  };

  const handleStopDemo = () => {
    if (originalGameState) {
      // Restore the original game state
      dispatch(setGameState(originalGameState));
    }
    // Reset the demo state
    dispatch(stopDemo());
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Управление демо-режимом</h3>
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-gray-400">
          {isActive
            ? 'Демо-режим активен. Кнопка "Следующая неделя" на главной странице будет проигрывать демо-события.'
            : 'Включите демо-режим, чтобы пошагово просмотреть заскриптованные события.'}
        </p>
        {!isActive ? (
          <button 
            onClick={handleStartDemo}
            className="py-2 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm"
          >
            Включить демо-режим
          </button>
        ) : (
          <button 
            onClick={handleStopDemo}
            className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm"
          >
            Выключить демо-режим
          </button>
        )}
      </div>
    </div>
  );
}