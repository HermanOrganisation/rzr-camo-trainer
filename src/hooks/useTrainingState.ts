import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CAMO_COMPONENTS,
  DISASSEMBLY_ANGLE,
  TOTAL_COMPONENTS,
  VIEW_ANGLES,
  type AngleId,
} from "@/data/rzrTraining";
import type { CamoPattern } from "@/data/rzrAssets";

export type ViewerMode = "inspection" | "disassembly";

const STORAGE_KEY = "rzr-camo-training-v2";

interface Persisted {
  completed: string[];
  coachDismissed: boolean;
  camo: CamoPattern;
}

function readPersisted(): Partial<Persisted> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Persisted>) : {};
  } catch {
    return {};
  }
}

export function useTrainingState() {
  const [mode, setModeRaw] = useState<ViewerMode>("inspection");
  const [angle, setAngle] = useState<AngleId>("front-34");
  const [camo, setCamo] = useState<CamoPattern>("forest");
  const [selected, setSelected] = useState<string | null>(null);
  const [detached, setDetached] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [coachDismissed, setCoachDismissed] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readPersisted();
    if (Array.isArray(saved.completed)) setCompleted(saved.completed);
    if (typeof saved.coachDismissed === "boolean") setCoachDismissed(saved.coachDismissed);
    if (saved.camo === "forest" || saved.camo === "desert") setCamo(saved.camo);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, coachDismissed, camo }));
    } catch {
      /* ignore write failures */
    }
  }, [completed, coachDismissed, camo, hydrated]);

  const setMode = useCallback(
    (next: ViewerMode) => {
      setModeRaw(next);
      if (next !== "disassembly") {
        setCoachOpen(false);
        return;
      }
      setAngle(DISASSEMBLY_ANGLE);
      if (!coachDismissed) setCoachOpen(true);
    },
    [coachDismissed],
  );

  const stepAngle = useCallback((direction: 1 | -1) => {
    setAngle((current) => {
      const usable = VIEW_ANGLES.filter((a) => a.available);
      const index = usable.findIndex((a) => a.id === current);
      return usable[(index + direction + usable.length) % usable.length]?.id ?? current;
    });
  }, []);

  const isDetached = useCallback((id: string) => detached.includes(id), [detached]);

  const setPartDetached = useCallback((id: string, next: boolean) => {
    setDetached((prev) => (next ? [...new Set([...prev, id])] : prev.filter((p) => p !== id)));
  }, []);

  const togglePart = useCallback((id: string) => {
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
    camo,
    setCamo,
    selected,
    setSelected,
    detached,
    isDetached,
    setPartDetached,
    togglePart,
    resetVehicle,
    completed,
    markComplete,
    progress,
    coachOpen,
    dismissCoach,
  };
}

export type TrainingState = ReturnType<typeof useTrainingState>;
