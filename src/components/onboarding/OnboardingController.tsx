// src/components/onboarding/OnboardingController.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { onboardingSteps } from "@/data/onboardingData";
import {
  setOnboardingCompleted,
  startOnboarding,
  nextStep,
} from "@/store/slices/onboardingSlice";
import { SpotlightOverlay } from "./SpotlightOverlay";
import { TutorialTooltip } from "./TutorialTooltip";

export function OnboardingController() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { isActive, currentStep } = useAppSelector((state) => state.onboarding);
  // "Слушаем" состояние ВСЕХ модальных окон, которые могут конфликтовать
  const {
    isEventModalOpen,
    isResultModalOpen,
    isGlossaryForced,
    gameOverState,
  } = useAppSelector((state) => state.game);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (!isClient) return;
    const completed = localStorage.getItem("onboardingCompleted") === "true";
    dispatch(setOnboardingCompleted(completed));
    if (!completed && !isActive) {
      setTimeout(() => dispatch(startOnboarding()), 500);
    }
  }, [isClient, dispatch, isActive]);

  // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: Определяем, есть ли активная игровая модалка ---
  const isGameModalActive =
    isEventModalOpen ||
    isResultModalOpen ||
    isGlossaryForced ||
    gameOverState.isGameOver;

  // Определяем текущий шаг онбординга
  const step = onboardingSteps.find((s) => s.step === currentStep);

  useEffect(() => {
    // Если онбординг неактивен ИЛИ есть активная игровая модалка, онбординг должен "спать"
    if (!isActive || !isClient) {
      setTargetRect(null);
      return;
    }

    if (!step) return;

    // --- Логика триггеров и навигации ---
    // СНАЧАЛА обрабатываем триггеры, чтобы не блокировать переход шага при открытии модалок
    const stepTrigger = step.trigger;
    if (stepTrigger) {
      const currentValue = {
        isEventModalOpen,
        isResultModalOpen,
        pathname,
      }[stepTrigger.stateKey];

      if (currentValue === stepTrigger.expectedValue) {
        setTimeout(() => dispatch(nextStep()), 300);
        return;
      }
    }

    // Если активна игровая модалка, но наша цель НЕ элементы модалки, то скрываем подсказку
    if (
      isGameModalActive &&
      step.highlightTarget !== "#event-modal" &&
      step.highlightTarget !== "#event-choices"
    ) {
      setTargetRect(null);
      return;
    }

    // Navigation actions are now handled in TutorialTooltip button click
    // This useEffect only handles target positioning and triggers

    const updateTarget = () => {
      if (!step.highlightTarget) {
        setTargetRect(null);
        return;
      }
      const targetElement = document.querySelector(step.highlightTarget);
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        requestAnimationFrame(updateTarget);
      }
    };

    updateTarget();

    // Добавляем isGameModalActive в зависимости, чтобы useEffect перезапускался при открытии/закрытии модалок
  }, [
    isActive,
    currentStep,
    isEventModalOpen, // Добавлено!
    isResultModalOpen,
    dispatch,
    router,
    pathname,
    isClient,
    isGameModalActive,
    step,
  ]);

  // If the user is logged in, disable the onboarding controller entirely.
  if (user) {
    return null;
  }

  // Основное правило: если онбординг неактивен или нет текущего шага, ничего не рендерим
  if (!isClient || !isActive || !step) {
    return null;
  }

  // Уточняющее правило: если активна игровая модалка, 
  // а шаг онбординга НЕ относится к элементам модалки, тоже ничего не рендерим.
  if (
    isGameModalActive &&
    step.highlightTarget !== "#event-modal" &&
    step.highlightTarget !== "#event-choices"
  ) {
    return null;
  }

  const currentStepData = onboardingSteps.find((s) => s.step === currentStep);

  return (
    <>
      <SpotlightOverlay targetRect={targetRect} />
      {currentStepData && (
        <TutorialTooltip step={currentStepData} targetRect={targetRect} />
      )}
    </>
  );
}
