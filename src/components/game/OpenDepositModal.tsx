// src/components/game/OpenDepositModal.tsx
"use client";
import { useState } from "react";
import { BankOffer } from "@/data/bankOffers";
import { formatCurrency } from "@/lib/format";

interface ModalProps {
  offer: BankOffer;
  balance: number;
  debt: number; // <-- НОВОЕ
  onClose: () => void;
  onConfirm: (payload: {
    offer: BankOffer;
    amount: number;
    term: number;
  }) => void;
}

export function OpenDepositModal({
  offer,
  balance,
  debt,
  onClose,
  onConfirm,
}: ModalProps) {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState(offer.termOptions[0]);

  const amountNumber = Number(amount);
  const maxDeposit = Math.min(balance, offer.maxDeposit);
  const isInvalid =
    amountNumber < offer.minDeposit || amountNumber > maxDeposit;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(45, 55, 72, 0.5)' }}>
      <div className="rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in-up text-white bg-gray-900 bg-opacity-50">
        <h2 className="text-2xl font-bold mb-2">
          Вклад в &quot;{offer.bankName}&quot;
        </h2>
        <p className="text-sm text-gray-300 mb-4">
          Мин: ₽{formatCurrency(offer.minDeposit)}, Макс: ₽{formatCurrency(offer.maxDeposit)}
        </p>

        {/* НОВЫЙ БЛОК С ИНФОРМАЦИЕЙ */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-sm">
          <div className="flex justify-between">
            <span>Ваш баланс:</span>
            <span className="font-bold text-green-400">₽{formatCurrency(balance)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ваш долг:</span>
            <span className="font-bold text-red-400">₽{formatCurrency(debt)}</span>
          </div>
        </div>

        {/* Выбор суммы */}
        <div className="mb-4">
          <label className="block font-medium">Сумма</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Доступно: ₽${formatCurrency(balance)}`}
            className="w-full mt-1 p-2 border rounded-lg bg-gray-700 text-white border-gray-600"
          />
        </div>

        {/* Выбор срока */}
        <div className="mb-6">
          <label className="block font-medium">Срок (недель)</label>
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded-lg bg-gray-700 text-white border-gray-600"
          >
            {offer.termOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 py-3 rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={() => onConfirm({ offer, amount: amountNumber, term })}
            disabled={isInvalid}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-400"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}