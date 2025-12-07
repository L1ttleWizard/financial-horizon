"use client";

import Curtain from "@/components/layout/Curtain";
import { useLoading } from "@/contexts/LoadingContext";

export default function CurtainController() {
    const { isLoading } = useLoading();
    return <Curtain isLoading={isLoading} />;
}
