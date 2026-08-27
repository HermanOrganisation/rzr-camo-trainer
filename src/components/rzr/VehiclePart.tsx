import { motion } from "framer-motion";
import { useState } from "react";
import type { CamoComponent } from "@/data/rzrTraining";
import { cropStyle, regionStyle } from "@/lib/vehicleGeometry";
import { cn } from "@/lib/utils";

interface VehiclePartProps {
  component: CamoComponent;
  image: string;
  detached: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onSetDetached: (id: string, detached: boolean) => void;
}

const DRAG_THRESHOLD = 42;

/**
 * A removable camouflage layer. The visual is a cropped region of the base
 * photograph, so the part is always the real product imagery. The outer
 * element animates install/detach; the inner element handles the drag gesture
 * so the two transforms never fight.
 */
export function VehiclePart({
  component,
  image,
  detached,
  selected,
  onSelect,
  onSetDetached,
}: VehiclePartProps) {
  const { region, detached: park } = component;
  const [dragging, setDragging] = useState(false);
  const [dragHint, setDragHint] = useState<"x" | "y" | null>(null);

  return (
    <motion.div
      className="absolute"
      style={regionStyle(region, 10 + component.layer)}
      animate={{
        // park.x / park.y are % of the vehicle box; motion's % is % of the
        // element, so rescale by the crop size.
        x: detached ? `${(park.x / region.width) * 100}%` : "0%",
        y: detached ? `${(park.y / region.height) * 100}%` : "0%",
        rotate: detached ? park.rotate : 0,
        scale: detached ? 0.92 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 20,
        mass: 0.7,
        // Reattachment returns the stack sequentially, ~80ms apart.
        delay: detached ? 0 : component.layer * 0.08,
      }}
    >
      <motion.div
        className={cn(
          "relative h-full w-full overflow-hidden",
          detached ? "cursor-pointer" : "cursor-grab active:cursor-grabbing",
        )}
        drag={!detached}
        dragSnapToOrigin
        dragElastic={0.45}
        dragMomentum={false}
        onDragStart={() => {
          setDragging(true);
          onSelect(component.id);
        }}
        onDrag={(_, info) => {
          setDragHint(Math.abs(info.offset.x) >= Math.abs(info.offset.y) ? "x" : "y");
        }}
        onDragEnd={(_, info) => {
          setDragging(false);
          setDragHint(null);
          if (Math.hypot(info.offset.x, info.offset.y) >= DRAG_THRESHOLD) {
            onSetDetached(component.id, true);
          }
        }}
        animate={{ scale: dragging ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={() => {
          if (dragging) return;
          onSelect(component.id);
          onSetDetached(component.id, !detached);
        }}
      >
        {/* Cropped photograph: sized so this box shows exactly `region`. */}
        <img
          src={image}
          alt=""
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={cropStyle(region)}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-all duration-300",
            dragging
              ? "ring-2 ring-amber"
              : selected
                ? "ring-1 ring-amber/70"
                : "ring-1 ring-olive/0 hover:ring-olive",
          )}
        />
        {dragHint && (
          <div className="label-tech pointer-events-none absolute bottom-1 left-1 bg-background/80 px-1 py-0.5 text-amber">
            {dragHint === "x"
              ? park.x < 0
                ? "◀ REMOVE"
                : "REMOVE ▶"
              : park.y < 0
                ? "▲ LIFT"
                : "▼ LOWER"}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Reveals the uncovered vehicle in the area a detached cover used to occupy,
 * by cropping the bare-vehicle photograph to that same region.
 */
export function PartReveal({
  component,
  bareImage,
}: {
  component: CamoComponent;
  bareImage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="pointer-events-none absolute overflow-hidden ring-1 ring-amber/40"
      style={regionStyle(component.region, 6)}
    >
      <img
        src={bareImage}
        alt=""
        draggable={false}
        className="absolute select-none"
        style={cropStyle(component.region)}
      />
      <span className="label-tech absolute left-1 top-1 bg-background/70 px-1 text-amber/80">
        {component.code} EXPOSED
      </span>
    </motion.div>
  );
}

/**
 * Fallback for when no uncovered-vehicle photography is on file: marks the
 * vacated mounting area as a neutral technical silhouette instead of invented
 * mechanical detail.
 */
export function PartSilhouette({ component }: { component: CamoComponent }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="tech-hatch pointer-events-none absolute border border-dashed border-khaki/25 bg-background/55"
      style={regionStyle(component.region, 6)}
    >
      <span className="label-tech absolute left-1 top-1 text-khaki/50">
        {component.code} MOUNT — VACANT
      </span>
    </motion.div>
  );
}
