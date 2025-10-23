import {
  FaGrinStars,
  FaGrinBeam,
  FaSmile,
  FaMeh,
  FaFrown,
  FaSadCry,
} from "react-icons/fa";
import { ReactNode } from "react";

export const getMoodEmoji = (mood: number): ReactNode => {
  const size = 70;
  if (mood >= 90) return <FaGrinStars size={size} className="text-green-400" />;
  if (mood >= 70) return <FaGrinBeam size={size} className="text-green-300" />;
  if (mood >= 50) return <FaSmile size={size} className="text-yellow-300" />;
  if (mood >= 30) return <FaMeh size={size} className="text-gray-400" />;
  if (mood > 10) return <FaFrown size={size} className="text-orange-400" />;
  if (mood <= 10) return <FaSadCry size={size} className="text-red-500" />;
  return <FaMeh size={size} className="text-gray-400" />;
};

