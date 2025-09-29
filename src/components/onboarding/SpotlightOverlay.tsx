// src/components/onboarding/SpotlightOverlay.tsx
"use client";

interface SpotlightProps {
  targetRect: DOMRect | null; // Размеры и позиция подсвечиваемого элемента
}

export function SpotlightOverlay({ targetRect }: SpotlightProps) {
  return (
    <div className="fixed inset-0 z-[100]">
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.x - 5}
                y={targetRect.y - 5}
                width={targetRect.width + 10}
                height={targetRect.height + 10}
                rx="15" // Скругляем углы "дырки"
                fill="black"
                className="transition-all duration-500 ease-in-out"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="black"
          opacity="0.7"
          mask="url(#spotlight-mask)"
        />
      </svg>
    </div>
  );
}
