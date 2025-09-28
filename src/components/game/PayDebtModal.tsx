// src/components/game/PayDebtModal.tsx
'use client';

import { useState } from 'react';

interface ModalProps {
    currentDebt: number;
    currentBalance: number;
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export function PayDebtModal({ currentDebt, currentBalance, onClose, onConfirm }: ModalProps) {
    const [amount, setAmount] = useState('');
    
    const maxPayable = Math.min(currentBalance, currentDebt);
    const amountNumber = Number(amount);
    const isInvalid = amountNumber <= 0 || amountNumber > maxPayable;

    const handleConfirm = () => {
        if (!isInvalid) {
            onConfirm(amountNumber);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full flex flex-col animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Погашение долга</h2>
                
                <div className="mb-4">
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Текущий долг:</span>
                        <span className="font-bold text-red-600">${currentDebt}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Ваш баланс:</span>
                        <span className="font-bold text-green-600">${currentBalance}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Сумма к погашению</label>
                    <input 
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Максимум: $${maxPayable}`}
                        className="w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={() => setAmount(String(maxPayable))}
                        className="text-sm text-blue-600 hover:underline mt-1"
                    >
                        Заплатить максимум
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isInvalid}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Погасить
                    </button>
                </div>
            </div>
        </div>
    );
}