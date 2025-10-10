export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(amount);
};