"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMascot } from "@/store/slices/gameSlice";
import { useTheme } from "@/contexts/ThemeContext";
import { mascots } from "@/data/mascotsData";

export default function MascotSelector() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const selectedMascot = useAppSelector((state) => state.game.mascot);
  const [currentMascot, setCurrentMascot] = useState(selectedMascot);

  const handleSelectMascot = (mascotId: string) => {
    setCurrentMascot(mascotId);
    dispatch(setMascot(mascotId));
  };

  return (
    <div
      className={`p-4 rounded-xl mt-4  ${
        theme === "dark" ? "bg-[rgba(13,4,32,0.35)]" : "bg-gray-100"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Выбор маскота
      </h2>
      <div className="flex justify-center flex-row gap-4 flex-wrap">
        {mascots.map((mascot, index) => (
          <div
            key={mascot.id}
            className={`cursor-pointer border-2 p-2 rounded-lg ${
              currentMascot === mascot.id
                ? "border-blue-500"
                : "border-transparent"
            } ${mascot.className}`}
            onClick={() => handleSelectMascot(mascot.id)}
          >
            <Image
              src={mascot.path}
              alt={mascot.name}
              width={100}
              height={100}
              priority={index === 0}
            />
            <p
              className={`text-center mt-2 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {mascot.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
