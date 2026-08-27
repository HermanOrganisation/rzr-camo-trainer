import { CheckCircle2, ChevronRight } from "lucide-react";
import { CAMO_COMPONENTS, DISASSEMBLY_ANGLE, resolveAngle } from "@/data/rzrTraining";
import type { TrainingState } from "@/hooks/useTrainingState";
import { cn } from "@/lib/utils";
import { ComponentImage } from "./ComponentImage";

export function PartsSidebar({
  state,
  onOpenTraining,
}: {
  state: TrainingState;
  onOpenTraining: (id: string) => void;
}) {
  const { mode, camo, selected, setSelected, isDetached, togglePart, completed } = state;
  const disassembly = mode === "disassembly";
  const reference = resolveAngle(DISASSEMBLY_ANGLE, camo);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-hairline px-4 py-3">
        <h2 className="label-tech text-khaki">CAMOUFLAGE COMPONENTS</h2>
        <p className="label-tech mt-1 text-[9px] text-muted-foreground">
          {disassembly ? "SELECT TO DETACH / REATTACH" : "SELECT TO HIGHLIGHT"}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {CAMO_COMPONENTS.map((c) => {
          const detached = isDetached(c.id);
          const active = selected === c.id;
          const done = completed.includes(c.id);
          return (
            <div
              key={c.id}
              className={cn(
                "group border-b border-hairline transition-colors",
                active ? "bg-amber/8" : "hover:bg-panel-raised/60",
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelected(c.id);
                  if (disassembly) togglePart(c.id);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <ComponentImage
                  component={c}
                  camo={camo}
                  vehicleImage={reference.image}
                  vehicleAspect={reference.aspect ?? 1}
                  className={cn(
                    "h-10 shrink-0 transition-opacity",
                    detached ? "opacity-40" : "opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "label-tech border px-1.5 py-0.5",
                    active
                      ? "border-amber text-amber"
                      : "border-hairline text-muted-foreground group-hover:border-olive",
                  )}
                >
                  {c.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {c.shortName}
                  </span>
                  <span className="label-tech mt-1 flex items-center gap-2">
                    <span className={detached ? "text-khaki" : "text-olive"}>
                      {detached ? "○ DETACHED" : "● INSTALLED"}
                    </span>
                    {active && <span className="text-amber">ACTIVE</span>}
                  </span>
                </span>
                {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-olive" />}
              </button>
              <button
                type="button"
                onClick={() => onOpenTraining(c.id)}
                className="label-tech flex w-full items-center justify-between px-4 pb-3 text-muted-foreground transition-colors hover:text-amber"
              >
                VIEW TRAINING
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
