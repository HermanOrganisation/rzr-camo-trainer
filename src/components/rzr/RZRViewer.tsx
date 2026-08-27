import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import { CAMO_COMPONENTS, DISASSEMBLY_ANGLE, resolveAngle, VIEW_ANGLES } from "@/data/rzrTraining";
import { getAsset } from "@/data/rzrAssets";
import type { TrainingState } from "@/hooks/useTrainingState";
import { useViewerTransform } from "@/hooks/useViewerTransform";
import { cn } from "@/lib/utils";
import { Hotspot } from "./Hotspot";
import { PartReveal, PartSilhouette, VehiclePart } from "./VehiclePart";

interface RZRViewerProps {
  state: TrainingState;
  onOpenTraining: (id: string) => void;
}

export function RZRViewer({ state, onOpenTraining }: RZRViewerProps) {
  const { mode, angle, stepAngle, setAngle, camo, selected, setSelected, isDetached } = state;
  const disassembly = mode === "disassembly";
  const activeAngle = resolveAngle(disassembly ? DISASSEMBLY_ANGLE : angle, camo);
  const bareImage = getAsset(camo, "bare");
  const aspect = activeAngle.aspect ?? 1;

  const view = useViewerTransform({ onSwipe: stepAngle, swipeEnabled: !disassembly });
  const { zoom, pan } = view;

  useEffect(() => {
    view.reset();
  }, [mode, view.reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const detachedParts = CAMO_COMPONENTS.filter((c) => isDetached(c.id));

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={view.stageRef}
        {...view.handlers}
        className="relative min-h-0 flex-1 touch-none overflow-hidden bg-background select-none [container-type:size]"
        style={{ cursor: zoom > 1.02 ? "grab" : disassembly ? "default" : "ew-resize" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)]" />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: "center center",
            transition: view.dragging ? "none" : "transform 220ms ease-out",
          }}
        >
          {/* Vehicle box: matches the photograph's aspect so every %-positioned
              overlay stays aligned at any viewport size. */}
          <div
            className="relative"
            style={{
              aspectRatio: `${aspect}`,
              width: `min(62%, ${(78 * aspect).toFixed(2)}cqh)`,
            }}
          >
            {/* Ground shadow */}
            <div className="pointer-events-none absolute bottom-[-3%] left-1/2 h-[7%] w-[74%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />

            {/* Layer 0 — base photograph */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={`${activeAngle.id}-${camo}`}
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

            {disassembly && (
              <>
                {/* Layer 6 — uncovered vehicle revealed where a cover was removed */}
                <AnimatePresence>
                  {detachedParts.map((c) =>
                    bareImage ? (
                      <PartReveal key={c.id} component={c} bareImage={bareImage} />
                    ) : (
                      <PartSilhouette key={c.id} component={c} />
                    ),
                  )}
                </AnimatePresence>

                {/* Layer 30 — technical leader lines */}
                <svg
                  className="pointer-events-none absolute inset-0 z-30 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {detachedParts.map((c) => {
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

                {/* Layers 10+ — removable covers */}
                {CAMO_COMPONENTS.map((c) => (
                  <div key={c.id} data-part>
                    <VehiclePart
                      component={c}
                      image={activeAngle.image ?? ""}
                      detached={isDetached(c.id)}
                      selected={selected === c.id}
                      onSelect={setSelected}
                      onSetDetached={state.setPartDetached}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Layer 40 — hotspots */}
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
          <IconBtn label="Zoom in" onClick={view.zoomIn}>
            <Plus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Zoom out" onClick={view.zoomOut}>
            <Minus className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn label="Reset view" onClick={view.reset}>
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
            <TechButton
              key={a.id}
              active={!disassembly && angle === a.id}
              disabled={!a.available || disassembly}
              title={a.available ? undefined : "No photography available for this angle yet"}
              onClick={() => setAngle(a.id)}
            >
              {a.label}
              {!a.available && <span className="ml-1.5 text-[8px] opacity-70">NO ASSET</span>}
            </TechButton>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Shared tactical button used by the angle and camouflage selectors. */
export function TechButton({
  active,
  disabled,
  title,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  title?: string | undefined;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "label-tech border px-2.5 py-1.5 transition-colors",
        active
          ? "border-amber bg-amber/15 text-amber"
          : disabled
            ? "cursor-not-allowed border-hairline text-muted-foreground/40"
            : "border-hairline text-muted-foreground hover:border-olive hover:text-foreground",
      )}
    >
      {children}
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
