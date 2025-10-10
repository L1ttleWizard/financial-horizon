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

  const { isActive, currentStep, hasCompleted } = useAppSelector((state) => state.onboarding);
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

  // This useEffect now correctly handles the onboarding flow for logged-in users.
  useEffect(() => {
    // Wait for client-side and for user to be authenticated.
    if (!isClient || !user) return;

    const completed = localStorage.getItem("onboardingCompleted") === "true";
    if (completed && !hasCompleted) {
        dispatch(setOnboardingCompleted(true));
    }

    // If onboarding has not been completed and is not currently active, start it.
    if (!completed && !isActive) {
      setTimeout(() => dispatch(startOnboarding()), 500);
    }
  }, [isClient, user, dispatch, isActive, hasCompleted]);

  const isGameModalActive =
    isEventModalOpen ||
    isResultModalOpen ||
    isGlossaryForced ||
    gameOverState.isGameOver;

  const step = onboardingSteps.find((s) => s.step === currentStep);

  useEffect(() => {
    if (!isActive || !isClient) {
      setTargetRect(null);
      return;
    }

    if (!step) return;

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

    if (
      isGameModalActive &&
      step.highlightTarget !== "#event-modal" &&
      step.highlightTarget !== "#event-choices"
    ) {
      setTargetRect(null);
      return;
    }

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

  }, [
    isActive,
    currentStep,
    isEventModalOpen,
    isResultModalOpen,
    dispatch,
    router,
    pathname,
    isClient,
    isGameModalActive,
    step,
  ]);

  if (!isClient || !isActive || !step) {
    return null;
  }

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