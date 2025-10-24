// src/components/game/BalanceCard.tsx
"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { formatCurrency } from "@/lib/format";
import { FaRegMoneyBillAlt } from "react-icons/fa";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const MAX_BALANCE = 10000;
  const MIN_BALANCE = 0;
  let badnessFactor =
    (MAX_BALANCE - balance) / (MAX_BALANCE - MIN_BALANCE);
  badnessFactor = Math.max(0, Math.min(badnessFactor, 1));

  return (
    <DashboardCard
      title="Баланс"
      value={`₽${formatCurrency(balance)}`}
      icon={<FaRegMoneyBillAlt color="green" size={70} />}
      badnessFactor={badnessFactor}
    />
  );
}
