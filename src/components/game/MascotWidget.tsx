import Image from "next/image";

// src/components/game/MascotWidget.tsx
export function MascotWidget() {
  return (
    <div className="bg-white rounded-xl shadow-lg text-center h-full flex flex-col justify-center p-3">
      <div className="w-57 h-57 bg-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
        <Image src="/globe.svg" width={30} height={32} alt="Mascot" className="w-30 h-32" />
      </div>
      <h3 className="text-lg font-bold text-gray-800">Ваш Помощник</h3>
      <p className="text-sm text-gray-500">
        Я здесь, чтобы давать советы и помогать в трудную минуту!
      </p>
    </div>
  );
}
