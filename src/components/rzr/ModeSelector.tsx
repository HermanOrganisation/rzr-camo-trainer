import { motion } from "framer-motion";
import { Boxes, Rotate3d } from "lucide-react";
import type { ViewerMode } from "@/hooks/useTrainingState";
import { cn } from "@/lib/utils";

const MODES: { id: ViewerMode; label: string; icon: typeof Rotate3d }[] = [
  { id: "inspection", label: "360° INSPECTION MODE", icon: Rotate3d },
  { id: "disassembly", label: "DISASSEMBLY MODE", icon: Boxes },
];

export function ModeSelector({
  mode,
  onChange,
}: {
  mode: ViewerMode;
  onChange: (m: ViewerMode) => void;
}) {
  return (
    <div className="relative flex border border-hairline bg-panel/70 p-1 backdrop-blur-sm">
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={cn(
              "label-tech relative flex items-center gap-2 px-4 py-2.5 transition-colors sm:px-6",
              active ? "text-amber" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="mode-indicator"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="absolute inset-0 border border-amber/60 bg-amber/12"
              />
            )}
            <m.icon className="relative h-3.5 w-3.5" />
            <span className="relative">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
