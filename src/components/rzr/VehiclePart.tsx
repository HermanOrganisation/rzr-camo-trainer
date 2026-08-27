import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { CamoComponent } from "@/data/rzrTraining";
import { cn } from "@/lib/utils";

interface VehiclePartProps {
  component: CamoComponent;
  image: string;
  detached: boolean;
  selected: boolean;
  interactive: boolean;
  onSelect: (id: string) => void;
  onDetach: (id: string) => void;
  onAttach: (id: string) => void;
}

const DRAG_THRESHOLD = 42;

/**
 * A removable camouflage layer. The visual is a cropped region of the base
 * photograph, so the part is always the real product imagery — never a
 * reconstruction. Outer element animates install/detach; inner element handles
 * the drag gesture so the two transforms never fight.
 */
export function VehiclePart({
  component,
  image,
  detached,
  selected,
  interactive,
  onSelect,
  onDetach,
  onAttach,
}: VehiclePartProps) {
  const { region, detached: park } = component;
  const [dragging, setDragging] = useState(false);
  const [dragHint, setDragHint] = useState<"x" | "y" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${region.left}%`,
        top: `${region.top}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
        zIndex: 10 + component.layer,
      }}
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
        ref={boxRef}
        className={cn(
          "relative h-full w-full overflow-hidden",
          interactive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        )}
        drag={interactive && !detached}
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
          const travelled = Math.hypot(info.offset.x, info.offset.y);
          if (travelled >= DRAG_THRESHOLD) onDetach(component.id);
        }}
        animate={{ scale: dragging ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        onClick={() => {
          if (dragging) return;
          onSelect(component.id);
          if (!interactive) return;
          if (detached) onAttach(component.id);
          else onDetach(component.id);
        }}
      >
        {/* Cropped photograph: sized so this box shows exactly `region`. */}
        <img
          src={image}
          alt=""
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={{
            width: `${(100 / region.width) * 100}%`,
            height: `${(100 / region.height) * 100}%`,
            left: `${(-region.left / region.width) * 100}%`,
            top: `${(-region.top / region.height) * 100}%`,
          }}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-all duration-300",
            dragging && "ring-2 ring-amber",
            !dragging && selected && "ring-1 ring-amber/70",
            !dragging && !selected && interactive && "ring-1 ring-olive/0 hover:ring-olive",
          )}
        />
        {dragHint && (
          <div className="label-tech pointer-events-none absolute bottom-1 left-1 bg-background/80 px-1 py-0.5 text-amber">
            {dragHint === "x" ? (park.x < 0 ? "◀ REMOVE" : "REMOVE ▶") : park.y < 0 ? "▲ LIFT" : "▼ LOWER"}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Marks the vacated mounting area. The photography does not document the
 * structure behind every cover, so the region is drawn as a neutral technical
 * silhouette instead of invented mechanical detail.
 */
export function PartSilhouette({ component }: { component: CamoComponent }) {
  const { region } = component;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="tech-hatch pointer-events-none absolute border border-dashed border-khaki/25 bg-background/55"
      style={{
        left: `${region.left}%`,
        top: `${region.top}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
        zIndex: 6,
      }}
    >
      <span className="label-tech absolute left-1 top-1 text-khaki/50">
        {component.code} MOUNT — VACANT
      </span>
    </motion.div>
  );
}
