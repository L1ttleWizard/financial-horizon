export const getMoodEmoji = (mood: number): string => {
  if (mood >= 90) return '🤩';
  if (mood >= 70) return '😄';
  if (mood >= 50) return '😊';
  if (mood >= 30) return '😐';
  if (mood > 10) return '😟';
  if (mood <= 10) return '😭';
  return '😐';
};