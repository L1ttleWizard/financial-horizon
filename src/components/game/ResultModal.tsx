// src/components/game/ResultModal.tsx
'use client';
import { useDispatch } from 'react-redux';
import { closeResultModal } from '@/store/slices/gameSlice';
import type { Choice } from '@/data/gameEvents';

// Определяем тип для эффектов для переиспользования
type ChoiceEffects = Choice['effects'];

interface ResultModalProps {
  result: {
    outcomeText: string;
    learningPoint: string;
    effects: ChoiceEffects; // <-- Принимаем эффекты как prop
  };
}

// Вспомогательный компонент для отображения "таблетки" с изменением
const EffectPill = ({ label, value, icon }: { label: string, value: number, icon: string }) => {
    if (value === 0) return null; // Не отображаем, если изменение нулевое
    
    const isPositive = value > 0;
    const colorClasses = isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const sign = isPositive ? '+' : '';

    return (
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${colorClasses}`}>
            <span>{icon}</span>
            <span>{label}:</span>
            <span>{sign}{value}</span>
        </div>
    )
}


export function ResultModal({ result }: ResultModalProps) {
    const dispatch = useDispatch();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ваш выбор:</h2>
                <p className="text-gray-700 text-lg mb-6">{result.outcomeText}</p>

                {/* НОВЫЙ БЛОК ДЛЯ ОТОБРАЖЕНИЯ ИЗМЕНЕНИЙ */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {result.effects.balance && <EffectPill label="Баланс" value={result.effects.balance} icon="💰" />}
                    {result.effects.mood && <EffectPill label="Настроение" value={result.effects.mood} icon="❤️" />}
                    {result.effects.savings && <EffectPill label="Сбережения" value={result.effects.savings} icon="📈" />}
                    {result.effects.debt && <EffectPill label="Долг" value={result.effects.debt} icon="💳" />}
                </div>

                <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-8">
                    <h3 className="font-bold text-yellow-800">💡 Что нужно знать:</h3>
                    <p className="text-yellow-700">{result.learningPoint}</p>
                </div>

                <button
                    onClick={() => dispatch(closeResultModal())}
                    className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Понятно, дальше!
                </button>
            </div>
        </div>
    );
}