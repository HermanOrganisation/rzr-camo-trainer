import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAMO_COMPONENTS,
  DISASSEMBLY_ANGLE,
  TOTAL_COMPONENTS,
  VIEW_ANGLES,
  type AngleId,
} from "@/data/rzrTraining";

export type ViewerMode = "inspection" | "disassembly";

const STORAGE_KEY = "rzr-camo-training-v1";

interface Persisted {
  completed: string[];
  coachDismissed: boolean;
}

export function useTrainingState() {
  const [mode, setModeRaw] = useState<ViewerMode>("inspection");
  const [angle, setAngle] = useState<AngleId>("front-34");
  const [selected, setSelected] = useState<string | null>(null);
  const [detached, setDetached] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [coachDismissed, setCoachDismissed] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        if (Array.isArray(parsed.completed)) setCompleted(parsed.completed);
        if (typeof parsed.coachDismissed === "boolean") setCoachDismissed(parsed.coachDismissed);
      }
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, coachDismissed }));
    } catch {
      /* ignore write failures */
    }
  }, [completed, coachDismissed, hydrated]);

  const setMode = useCallback(
    (next: ViewerMode) => {
      setModeRaw(next);
      if (next === "disassembly") {
        setAngle(DISASSEMBLY_ANGLE);
        if (!coachDismissed) setCoachOpen(true);
      } else {
        setCoachOpen(false);
      }
    },
    [coachDismissed],
  );

  const stepAngle = useCallback((direction: 1 | -1) => {
    setAngle((current) => {
      const usable = VIEW_ANGLES.filter((a) => a.available);
      const index = usable.findIndex((a) => a.id === current);
      const next = usable[(index + direction + usable.length) % usable.length];
      return next ? next.id : current;
    });
  }, []);

  const isDetached = useCallback((id: string) => detached.includes(id), [detached]);

  const detachPart = useCallback((id: string) => {
    setDetached((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const attachPart = useCallback((id: string) => {
    setDetached((prev) => prev.filter((p) => p !== id));
  }, []);

  const toggleDetached = useCallback((id: string) => {
    setDetached((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }, []);

  const resetVehicle = useCallback(() => {
    setDetached([]);
    setSelected(null);
  }, []);

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const dismissCoach = useCallback((forever: boolean) => {
    setCoachOpen(false);
    if (forever) setCoachDismissed(true);
  }, []);

  const progress = useMemo(() => {
    const done = completed.filter((id) => CAMO_COMPONENTS.some((c) => c.id === id)).length;
    return { done, total: TOTAL_COMPONENTS, percent: Math.round((done / TOTAL_COMPONENTS) * 100) };
  }, [completed]);

  return {
    mode,
    setMode,
    angle,
    setAngle,
    stepAngle,
    selected,
    setSelected,
    detached,
    isDetached,
    detachPart,
    attachPart,
    toggleDetached,
    resetVehicle,
    completed,
    markComplete,
    progress,
    coachOpen,
    dismissCoach,
  };
}

export type TrainingState = ReturnType<typeof useTrainingState>;
