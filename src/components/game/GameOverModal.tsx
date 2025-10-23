// src/components/game/GameOverModal.tsx
'use client';
import { useDispatch } from 'react-redux';
import { resetGame } from '@/store/slices/gameSlice';

interface ModalProps {
    reason: 'DEBT_SPIRAL' | 'EMOTIONAL_BURNOUT' | 'BANKRUPTCY';
    message: string;
}

const reasonInfo = {
    DEBT_SPIRAL: { title: 'Долговая спираль', icon: '⛓️' },
    EMOTIONAL_BURNOUT: { title: 'Эмоциональное выгорание', icon: '💔' },
    BANKRUPTCY: { title: 'Банкротство', icon: '📉' },
}

export function GameOverModal({ reason, message }: ModalProps) {
    const dispatch = useDispatch();
    const { title, icon } = reasonInfo[reason];

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(45, 55, 72, 0.5)' }}>
            <div className="rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full flex flex-col items-center text-center animate-fade-in-up text-white bg-gray-900 bg-opacity-50">
                <div className="text-7xl mb-4">{icon}</div>
                <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-4">{title}</h2>
                <p className="text-gray-300 text-lg mb-8">{message}</p>
                
                <p className="text-gray-400 mb-6">Время извлечь уроки из своих ошибок и начать с чистого листа.</p>

                <button
                    onClick={() => dispatch(resetGame())}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Начать заново
                </button>
            </div>
        </div>
    );
}
