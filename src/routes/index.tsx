import { createFileRoute } from "@tanstack/react-router";
import { CircleHelp, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DisassemblyCoach } from "@/components/rzr/DisassemblyCoach";
import { ModeSelector } from "@/components/rzr/ModeSelector";
import { PartsSidebar } from "@/components/rzr/PartsSidebar";
import { ProgressIndicator } from "@/components/rzr/ProgressIndicator";
import { ResetVehicleButton } from "@/components/rzr/ResetVehicleButton";
import { RZRViewer } from "@/components/rzr/RZRViewer";
import { TrainingModal } from "@/components/rzr/TrainingModal";
import { CAMO_COMPONENTS } from "@/data/rzrTraining";
import { useTrainingState } from "@/hooks/useTrainingState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RZR Camouflage System — Interactive Product Training" },
      {
        name: "description",
        content:
          "Interactive training interface for the RZR camouflage cover system: 360° inspection, exploded-view disassembly, and per-component removal procedures.",
      },
      { property: "og:title", content: "RZR Camouflage System — Interactive Product Training" },
      {
        property: "og:description",
        content:
          "Inspect, detach and learn every camouflage component of the RZR cover system in a technical training interface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainingApp,
});

function TrainingApp() {
  const state = useTrainingState();
  const [modalId, setModalId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const modalComponent = CAMO_COMPONENTS.find((c) => c.id === modalId) ?? null;

  const openTraining = (id: string) => {
    state.setSelected(id);
    setModalId(id);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* TOP BAR */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-hairline bg-panel/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-[3px] bg-amber" />
          <div>
            <h1 className="text-base font-semibold uppercase tracking-[0.18em] text-foreground sm:text-lg">
              RZR Camouflage System
            </h1>
            <p className="label-tech mt-0.5 text-khaki">Interactive Product Training</p>
          </div>
        </div>

        <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-8">
          <ProgressIndicator {...state.progress} />
        </div>

        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="label-tech order-2 flex items-center gap-2 border border-hairline px-3 py-2 text-muted-foreground transition-colors hover:border-amber/60 hover:text-amber sm:order-3"
        >
          <CircleHelp className="h-3.5 w-3.5" />
          HELP
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* MAIN COLUMN */}
        <main className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <ModeSelector mode={state.mode} onChange={state.setMode} />
              <CamoSelector camo={state.camo} onChange={state.setCamo} />
            </div>

              <ResetVehicleButton
                onReset={state.resetVehicle}
                disabled={state.detached.length === 0}
              />
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="label-tech border border-hairline px-3 py-2.5 text-muted-foreground transition-colors hover:text-amber lg:hidden"
              >
                PARTS
              </button>
            </div>
          </div>

          <RZRViewer state={state} onOpenTraining={openTraining} />

          <DisassemblyCoach open={state.coachOpen} onDismiss={state.dismissCoach} />
        </main>

        {/* SIDEBAR (desktop) */}
        <aside className="hidden w-80 shrink-0 border-l border-hairline bg-sidebar lg:block">
          <PartsSidebar state={state} onOpenTraining={openTraining} />
        </aside>
      </div>

      {/* SIDEBAR DRAWER (tablet / mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute bottom-0 left-0 right-0 max-h-[70vh] border-t border-hairline bg-sidebar"
            >
              <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
                <span className="label-tech text-khaki">COMPONENT DRAWER</span>
                <button
                  type="button"
                  aria-label="Close parts drawer"
                  onClick={() => setDrawerOpen(false)}
                  className="text-muted-foreground hover:text-amber"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <PartsSidebar state={state} onOpenTraining={openTraining} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRAINING MODAL */}
      <TrainingModal
        component={modalComponent}
        camo={state.camo}

        completed={modalId ? state.completed.includes(modalId) : false}
        detached={modalId ? state.isDetached(modalId) : false}
        onClose={() => setModalId(null)}
        onComplete={state.markComplete}
      />

      {/* HELP */}
      <AnimatePresence>
        {helpOpen && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/75" onClick={() => setHelpOpen(false)} />
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative z-10 w-full max-w-lg border border-hairline bg-panel p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="label-tech text-amber">SYSTEM HELP</div>
                  <h2 className="mt-1 text-lg font-semibold uppercase tracking-wide">
                    Training workflow
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Close help"
                  onClick={() => setHelpOpen(false)}
                  className="text-muted-foreground hover:text-amber"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-foreground/85">
                <li>
                  <span className="label-tech text-khaki">01 INSPECT</span> — drag the viewer
                  horizontally or use the arrows to move between documented views. Scroll or pinch
                  to zoom.
                </li>
                <li>
                  <span className="label-tech text-khaki">02 SELECT</span> — click a numbered
                  hotspot or a row in the components panel.
                </li>
                <li>
                  <span className="label-tech text-khaki">03 DETACH</span> — in disassembly mode,
                  drag a cover away from the vehicle or click it. Click again to reattach.
                </li>
                <li>
                  <span className="label-tech text-khaki">04 LEARN</span> — open the component
                  training card and mark it complete.
                </li>
                <li>
                  <span className="label-tech text-khaki">05 RESET</span> — restore every cover with
                  RESET VEHICLE.
                </li>
              </ol>
              <p className="label-tech mt-5 border border-hairline bg-background/40 px-3 py-2 leading-relaxed text-muted-foreground">
                ANGLES MARKED “NO ASSET” HAVE NO PHOTOGRAPHY ON FILE AND FALL BACK TO THE NEAREST
                DOCUMENTED VIEW.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
