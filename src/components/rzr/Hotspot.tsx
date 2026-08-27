import { useState } from "react";
import { motion } from "framer-motion";
import type { CamoComponent } from "@/data/rzrTraining";
import { cn } from "@/lib/utils";

interface HotspotProps {
  component: CamoComponent;
  detached: boolean;
  selected: boolean;
  onOpen: (id: string) => void;
  onSelect: (id: string) => void;
}

export function Hotspot({ component, detached, selected, onOpen, onSelect }: HotspotProps) {
  const [open, setOpen] = useState(false);
  const flipLeft = component.hotspot.x > 62;

  return (
    <div
      className="absolute z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${component.hotspot.x}%`, top: `${component.hotspot.y}%` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Component ${component.code} — ${component.name}`}
        onClick={() => {
          onSelect(component.id);
          setOpen((v) => !v);
        }}
        onDoubleClick={() => onOpen(component.id)}
        className="relative grid h-11 w-11 place-items-center rounded-full"
      >
        <span
          className={cn(
            "hotspot-pulse absolute h-5 w-5 rounded-full",
            detached ? "bg-khaki/60" : "bg-amber/60",
          )}
        />
        <span
          className={cn(
            "relative grid h-5 w-5 place-items-center rounded-full border text-[9px] font-semibold transition-all duration-300",
            detached
              ? "border-khaki/70 bg-background/80 text-khaki"
              : "border-amber bg-background/80 text-amber",
            selected && "scale-125 shadow-[0_0_0_4px_color-mix(in_oklab,var(--amber)_22%,transparent)]",
          )}
        >
          {component.code}
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className={cn(
            "absolute top-1/2 z-50 w-56 -translate-y-1/2 border border-hairline bg-panel/95 p-3 backdrop-blur-sm",
            flipLeft ? "right-full mr-3" : "left-full ml-3",
          )}
        >
          <div className="label-tech text-amber">COMPONENT {component.code}</div>
          <div className="mt-1 text-sm font-medium leading-tight text-foreground">
            {component.name}
          </div>
          <div className="label-tech mt-2 flex items-center gap-1.5 text-muted-foreground">
            <span className={detached ? "text-khaki" : "text-olive"}>{detached ? "○" : "●"}</span>
            {detached ? "DETACHED" : "INSTALLED"}
          </div>
          <button
            type="button"
            onClick={() => onOpen(component.id)}
            className="label-tech mt-3 w-full border border-amber/50 bg-amber/10 py-1.5 text-amber transition-colors hover:bg-amber/20"
          >
            VIEW TRAINING
          </button>
        </motion.div>
      )}
    </div>
  );
}
