import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CAMO_COMPONENTS,
  DISASSEMBLY_ANGLE,
  resolveAngle,
  VIEW_ANGLES,
  type AngleId,
} from "@/data/rzrTraining";
import type { TrainingState } from "@/hooks/useTrainingState";
import { cn } from "@/lib/utils";
import { Hotspot } from "./Hotspot";
import { PartSilhouette, VehiclePart } from "./VehiclePart";

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 3;

interface RZRViewerProps {
  state: TrainingState;
  onOpenTraining: (id: string) => void;
}

export function RZRViewer({ state, onOpenTraining }: RZRViewerProps) {
  const { mode, angle, stepAngle, setAngle, selected, setSelected, isDetached } = state;
  const disassembly = mode === "disassembly";
  const activeAngle = resolveAngle(disassembly ? DISASSEMBLY_ANGLE : angle);

  const stageRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const stateRef = useRef({ zoom, pan, disassembly });
  stateRef.current = { zoom, pan, disassembly };

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    resetView();
  }, [mode, resetView]);

  // Cursor-anchored, delta-normalised wheel/pinch zoom on a non-passive listener.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const { zoom: z, pan: p } = stateRef.current;
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * Math.exp(-dy * 0.0016)));
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left - rect.width / 2;
      const py = e.clientY - rect.top - rect.height / 2;
      const k = next / z;
      setPan({ x: px - (px - p.x) * k, y: py - (py - p.y) * k });
      setZoom(next);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag: rotates through the documented frames in inspection mode,
  // pans the stage when zoomed in.
  const gesture = useRef<{ x: number; y: number; panX: number; panY: number; used: boolean } | null>(
    null,
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-part],[data-hotspot]")) return;
    gesture.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, used: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (stateRef.current.zoom > 1.02) {
      setPan({ x: g.panX + dx, y: g.panY + dy });
      return;
    }
    if (stateRef.current.disassembly) return;
    if (!g.used && Math.abs(dx) > 60) {
      stepAngle(dx < 0 ? 1 : -1);
      gesture.current = { ...g, x: e.clientX, used: false };
    }
  };

  const endGesture = () => {
    gesture.current = null;
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
        className="relative min-h-0 flex-1 touch-none overflow-hidden bg-background select-none [container-type:size]"
        style={{ cursor: zoom > 1.02 ? "grab" : disassembly ? "default" : "ew-resize" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)]" />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: "center center",
            transition: gesture.current ? "none" : "transform 220ms ease-out",
          }}
        >
          {/* Vehicle box: matches the photograph's aspect so every %-positioned
              overlay stays aligned at any viewport size. */}
          <div
            className="relative"
            style={{
              aspectRatio: `${activeAngle.aspect ?? 1}`,
              width: `min(62%, ${(78 * (activeAngle.aspect ?? 1)).toFixed(2)}cqh)`,
            }}
          >
            {/* Ground shadow */}
            <div className="pointer-events-none absolute bottom-[-3%] left-1/2 h-[7%] w-[74%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />

            {/* Layer 0 — base photograph */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={activeAngle.id}
                src={activeAngle.image}
                alt="MRZR fitted with the Armadillo camouflage cover system"
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 h-full w-full select-none object-contain"
              />
            </AnimatePresence>

            {/* Layers 1–5 — removable covers (exploded view) */}
            {disassembly && (
              <>
                <AnimatePresence>
                  {CAMO_COMPONENTS.filter((c) => isDetached(c.id)).map((c) => (
                    <PartSilhouette key={c.id} component={c} />
                  ))}
                </AnimatePresence>

                {/* Layer 7 — technical leader lines */}
                <svg
                  className="pointer-events-none absolute inset-0 z-30 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {CAMO_COMPONENTS.filter((c) => isDetached(c.id)).map((c) => {
                    const cx = c.region.left + c.region.width / 2;
                    const cy = c.region.top + c.region.height / 2;
                    return (
                      <line
                        key={c.id}
                        x1={cx}
                        y1={cy}
                        x2={cx + c.detached.x}
                        y2={cy + c.detached.y}
                        stroke="var(--khaki)"
                        strokeOpacity="0.45"
                        strokeWidth="0.15"
                        strokeDasharray="1.2 1"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>

                {CAMO_COMPONENTS.map((c) => (
                  <div key={c.id} data-part>
                    <VehiclePart
                      component={c}
                      image={activeAngle.image ?? ""}
                      detached={isDetached(c.id)}
                      selected={selected === c.id}
                      interactive
                      onSelect={setSelected}
                      onDetach={state.detachPart}
                      onAttach={state.attachPart}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Layer 6 — hotspots */}
            {!disassembly &&
              CAMO_COMPONENTS.map((c) => (
                <div key={c.id} data-hotspot>
                  <Hotspot
                    component={c}
                    detached={isDetached(c.id)}
                    selected={selected === c.id}
                    onOpen={onOpenTraining}
                    onSelect={setSelected}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Rotation arrows */}
        {!disassembly && (
          <>
            <ViewerArrow side="left" onClick={() => stepAngle(-1)} />
            <ViewerArrow side="right" onClick={() => stepAngle(1)} />
          </>
        )}

        {/* Zoom cluster */}
        <div className="absolute right-4 top-4 z-40 flex flex-col border border-hairline bg-panel/80 backdrop-blur-sm">
          <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.2))}>
            <Plus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z / 1.2))}>
            <Minus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Reset view" onClick={resetView}>
            <Maximize2 className="h-3.5 w-3.5" />
          </IconBtn>
        </div>

        <div className="label-tech absolute left-4 top-4 z-40 text-muted-foreground">
          ZOOM {zoom.toFixed(2)}×
        </div>
      </div>

      {/* Angle controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline bg-panel/60 px-4 py-2.5">
        <div className="label-tech flex items-center gap-2 text-muted-foreground">
          <span className="text-khaki">VIEW ANGLE:</span>
          <span className="text-foreground">
            {disassembly ? "DISASSEMBLY REFERENCE — FRONT — 000°" : activeAngle.readout}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {VIEW_ANGLES.map((a) => (
            <AngleButton
              key={a.id}
              id={a.id}
              label={a.label}
              available={a.available}
              active={!disassembly && angle === a.id}
              onClick={() => setAngle(a.id)}
              disabled={disassembly}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AngleButton({
  label,
  available,
  active,
  onClick,
  disabled,
}: {
  id: AngleId;
  label: string;
  available: boolean;
  active: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  const off = !available || disabled;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={off}
      title={available ? undefined : "No photography available for this angle yet"}
      className={cn(
        "label-tech border px-2.5 py-1.5 transition-colors",
        active
          ? "border-amber bg-amber/15 text-amber"
          : off
            ? "cursor-not-allowed border-hairline text-muted-foreground/40"
            : "border-hairline text-muted-foreground hover:border-olive hover:text-foreground",
      )}
    >
      {label}
      {!available && <span className="ml-1.5 text-[8px] opacity-70">NO ASSET</span>}
    </button>
  );
}

function ViewerArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous view" : "Next view"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-40 grid h-12 w-9 -translate-y-1/2 place-items-center border border-hairline bg-panel/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-amber/60 hover:text-amber",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center border-b border-hairline text-muted-foreground transition-colors last:border-b-0 hover:bg-amber/10 hover:text-amber"
    >
      {children}
    </button>
  );
}
