import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Gauge, Play, X } from "lucide-react";
import { getAsset, type CamoPattern } from "@/data/rzrAssets";
import { DISASSEMBLY_ANGLE, resolveAngle, type CamoComponent } from "@/data/rzrTraining";
import { cn } from "@/lib/utils";
import { ComponentImage } from "./ComponentImage";

interface TrainingModalProps {
  component: CamoComponent | null;
  camo: CamoPattern;
  completed: boolean;
  detached: boolean;
  onClose: () => void;
  onComplete: (id: string) => void;
}

export function TrainingModal({
  component,
  camo,
  completed,
  detached,
  onClose,
  onComplete,
}: TrainingModalProps) {
  const reference = resolveAngle(DISASSEMBLY_ANGLE, camo);

  return (
    <AnimatePresence>
      {component && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden border border-hairline bg-panel shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-7">
              <div>
                <div className="label-tech text-amber">COMPONENT {component.code}</div>
                <h2 className="mt-1 text-lg font-semibold uppercase tracking-wide text-foreground sm:text-xl">
                  {component.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close training"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center border border-hairline text-muted-foreground transition-colors hover:border-amber/60 hover:text-amber"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-5 sm:p-7 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="label-tech mb-2 text-khaki">TRAINING VIDEO</div>
                <div className="tech-grid-fine relative aspect-video w-full overflow-hidden border border-hairline bg-background">
                  <img
                    src={getAsset(camo, "infrastructure")}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain opacity-20"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <button
                      type="button"
                      className="group grid h-20 w-20 place-items-center rounded-full border border-amber/60 bg-amber/10 transition-all hover:scale-105 hover:bg-amber/20"
                      aria-label="Play training video"
                    >
                      <Play className="h-7 w-7 translate-x-0.5 text-amber" />
                    </button>
                  </div>
                  <div className="label-tech absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-hairline bg-background/85 px-3 py-2 text-muted-foreground">
                    <span>REC {component.code} / REMOVAL PROCEDURE</span>
                    <span>{component.videoUrl ? "READY" : "MEDIA PENDING"}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Stat icon={Clock} label="EST. TIME" value={component.estTime} />
                  <Stat icon={Gauge} label="DIFFICULTY" value={component.difficulty} />
                  <Stat
                    icon={CheckCircle2}
                    label="STATUS"
                    value={completed ? "COMPLETED" : "NOT COMPLETED"}
                    highlight={completed}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="label-tech mb-2 text-khaki">COMPONENT REFERENCE</div>
                <ComponentImage
                  component={component}
                  camo={camo}
                  vehicleImage={reference.image}
                  vehicleAspect={reference.aspect ?? 1}
                  className="w-full"
                />

                <div className="label-tech mt-5 border border-hairline bg-background/40 px-3 py-2 text-muted-foreground">
                  CURRENT STATE:{" "}
                  <span className={detached ? "text-khaki" : "text-olive"}>
                    {detached ? "DETACHED" : "INSTALLED"}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={completed}
                  onClick={() => onComplete(component.id)}
                  className={cn(
                    "label-tech mt-auto w-full border py-3 transition-colors",
                    completed
                      ? "cursor-default border-olive/50 bg-olive/15 text-olive"
                      : "border-amber bg-amber/15 text-amber hover:bg-amber/25",
                  )}
                >
                  {completed ? "✓ TRAINING COMPLETE" : "MARK TRAINING COMPLETE"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="border border-hairline bg-background/40 px-3 py-2.5">
      <div className="label-tech flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div
        className={cn(
          "mt-1 text-xs font-semibold tracking-wide",
          highlight ? "text-olive" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}
