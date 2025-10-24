import {
  FaGrinStars,
  FaGrinBeam,
  FaSmile,
  FaMeh,
  FaFrown,
  FaSadCry,
} from "react-icons/fa";
import { ReactNode } from "react";

interface MoodStyle {
  icon: ReactNode;
  color: string;
}

export const getMoodStyle = (mood: number): MoodStyle => {
  const size = 70;
  if (mood >= 90) {
    return {
      icon: <FaGrinStars size={size} style={{ color: "#4ade80" }} />,
      color: "#4ade80", // green-400
    };
  }
  if (mood >= 70) {
    return {
      icon: <FaGrinBeam size={size} style={{ color: "#86efac" }} />,
      color: "#86efac", // green-300
    };
  }
  if (mood >= 50) {
    return {
      icon: <FaSmile size={size} style={{ color: "#fde047" }} />,
      color: "#fde047", // yellow-300
    };
  }
  if (mood >= 30) {
    return {
      icon: <FaMeh size={size} style={{ color: "#9ca3af" }} />,
      color: "#9ca3af", // gray-400
    };
  }
  if (mood > 10) {
    return {
      icon: <FaFrown size={size} style={{ color: "#fb923c" }} />,
      color: "#fb923c", // orange-400
    };
  }
  return {
    icon: <FaSadCry size={size} style={{ color: "#ef4444" }} />,
    color: "#ef4444", // red-500
  };
};

export const getMoodEmoji = (mood: number): ReactNode => {
  return getMoodStyle(mood).icon;
};

