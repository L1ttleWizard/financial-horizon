import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppSelector } from "@/store/hooks";
import { mascots } from "@/data/mascotsData";

export function MascotWidget() {
  const { theme } = useTheme();
  const selectedMascotId = useAppSelector((state) => state.game.mascot);
  const selectedMascot =
    mascots.find((m) => m.id === selectedMascotId) || mascots[0];
  const mascotPath = selectedMascot.path;

  return (
    <div
      className={`rounded-xl shadow-lg text-center h-full flex flex-col justify-center p-3 ${
        theme === "dark"
          ? "bg-[rgba(48,19,110,0.6)] border border-[rgba(255,255,255,0.3)] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
          : "bg-white"
      }`}
    >
      <div
        className={`w-57 h-57 rounded-full mx-auto mb-8 flex items-center justify-center ${
          theme === "dark" ? "bg-[rgba(13,4,32,0.35)]" : "bg-gray-200"
        }`}
      >
        <Image
          src={mascotPath}
          width={200}
          height={200}
          alt="Mascot"
          className={` ${selectedMascot.className} w-42 h-42 `}
          priority
        />
      </div>
      <h3
        className={`text-lg font-bold ${
          theme === "dark" ? "text-white" : "text-gray-800"
        }`}
      >
        Ваш Помощник
      </h3>
      <p
        className={`text-sm ${
          theme === "dark" ? "text-gray-300" : "text-gray-500"
        }`}
      >
        Я здесь, чтобы давать советы и помогать в трудную минуту!
      </p>
    </div>
  );
}
