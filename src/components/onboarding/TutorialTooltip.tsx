"use client";

import { useAppDispatch } from "@/store/hooks";
import { TutorialStep } from "@/data/onboardingData";
import { CSSProperties } from "react";
import { nextStep, finishOnboarding } from "@/store/slices/onboardingSlice";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

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
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 768;

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
        if (top - tooltipHeight < 0) {
          top = targetRect.bottom + offset;
          transform = "translate(-50%, 0)";
        }
        break;
      case "bottom":
        top = targetRect.bottom + offset;
        left = targetRect.left + targetRect.width / 2;
        transform = "translate(-50%, 0)";
        if (top + tooltipHeight > viewportHeight) {
          top = targetRect.top - offset;
          transform = "translate(-50%, -100%)";
        }
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - offset;
        transform = "translate(-100%, -50%)";
        if (left - tooltipWidth < 0) {
          left = targetRect.right + offset;
          transform = "translate(0, -50%)";
        }
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + offset;
        transform = "translate(0, -50%)";
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
      dispatch({ type: action.type, payload: action.payload });
    }
  };
  const { theme } = useTheme();
  const handleSkip = () => {
    localStorage.setItem("onboardingCompleted", "true");
    dispatch(finishOnboarding());
  };

  return (
    <div
      style={getPositionStyles()}
      className={`fixed z-101 text-white rounded-lg shadow-2xl p-6 w-80 transition-opacity duration-300 animate-fade-in ${theme==="dark" ?"bg-[rgba(48,19,110,0.65)] border border-[rgba(255,255,255,0.3)] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] rounded-xl":"bg-gray-100 text-gray-400"
      }`}>
      <h3 className="text-xl font-bold  mb-2">{step.title}</h3>
      <p className=" mb-4 text-sm">{step.text}</p>
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          {step.buttonText}
        </button>
        {step.step <= 1 && (
          <button
            onClick={handleSkip}
            className="w-full bg-transparent  text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition">
            Пропустить обучение
          </button>
        )}
      </div>
    </div>
  );
}
