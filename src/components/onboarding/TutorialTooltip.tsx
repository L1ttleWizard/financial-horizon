"use client";

import { useAppDispatch } from "@/store/hooks";
import { TutorialStep } from "@/data/onboardingData";
import { CSSProperties } from "react";
import { nextStep } from "@/store/slices/onboardingSlice";
import { useRouter } from "next/navigation";

interface TooltipProps {
  step: TutorialStep;
  targetRect: DOMRect | null;
}

export function TutorialTooltip({ step, targetRect }: TooltipProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getPositionStyles = (): CSSProperties => {
    const tooltipWidth = 320; // Ширина тултипа (w-80)
    const tooltipHeight = 200; // Примерная высота тултипа
    const offset = 16; // Отступ в 1rem
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

    if (!targetRect) {
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    }

    let top = 0;
    let left = 0;
    let transform = "";

    switch (step.position) {
      case "top":
        top = targetRect.top - offset;
        left = targetRect.left + targetRect.width / 2;
        transform = "translate(-50%, -100%)";
        // Если тултип выходит за верхнюю границу, показываем снизу
        if (top - tooltipHeight < 0) {
          top = targetRect.bottom + offset;
          transform = "translate(-50%, 0)";
        }
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2;
        transform = "translate(-50%, 0)";
        // Если тултип выходит за нижнюю границу, показываем сверху
        if (top + tooltipHeight > viewportHeight) {
          top = targetRect.top - offset;
          transform = "translate(-50%, -100%)";
        }
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - offset;
        transform = "translate(-100%, -50%)";
        // Если тултип выходит за левую границу, показываем справа
        if (left - tooltipWidth < 0) {
          left = targetRect.right + offset;
          transform = "translate(0, -50%)";
        }
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + offset;
        transform = "translate(0, -50%)";
        // Если тултип выходит за правую границу, показываем слева
        if (left + tooltipWidth > viewportWidth) {
          left = targetRect.left - offset;
          transform = "translate(-100%, -50%)";
        }
        break;
      default:
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left + targetRect.width / 2;
        transform = "translate(-50%, -50%)";
    }

    // Дополнительная проверка границ
    left = Math.max(16, Math.min(left, viewportWidth - tooltipWidth - 16));
    top = Math.max(16, Math.min(top, viewportHeight - tooltipHeight - 16));

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform,
    };
  };

  const handleNext = () => {
    const action = step.nextStepAction;
    
    // Handle navigation actions
    if (action.type === "onboarding/goToSavingsPage") {
      router.push("/savings");
      dispatch(nextStep());
    } else if (action.type === "onboarding/returnToMainPage") {
      router.push("/");
      dispatch(nextStep());
    } else if (action.type === "onboarding/finishOnboarding") {
      localStorage.setItem("onboardingCompleted", "true");
      dispatch({ type: "onboarding/finishOnboarding" });
    } else {
      // Handle other actions (like game/startNextTurn, onboarding/nextStep)
      dispatch({ type: action.type, payload: action.payload });
    }
  };

  return (
    <div
      style={getPositionStyles()}
      className="fixed z-[101] bg-white rounded-lg shadow-2xl p-6 w-80 transition-opacity duration-300"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
      <p className="text-gray-600 mb-4">{step.text}</p>
      <button
        onClick={handleNext}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        {step.buttonText}
      </button>
    </div>
  );
}
