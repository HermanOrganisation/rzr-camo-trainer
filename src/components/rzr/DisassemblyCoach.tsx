import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick } from "lucide-react";

export function DisassemblyCoach({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: (forever: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-20 left-1/2 z-40 w-[min(24rem,90vw)] -translate-x-1/2 border border-amber/40 bg-panel/95 p-4 backdrop-blur"
        >
          <div className="label-tech flex items-center gap-2 text-amber">
            <MousePointerClick className="h-3.5 w-3.5" />
            DISASSEMBLY MODE ACTIVE
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            Drag a highlighted camouflage component away from the vehicle or select a component from
            the parts panel.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onDismiss(false)}
              className="label-tech flex-1 border border-amber bg-amber/15 py-2 text-amber transition-colors hover:bg-amber/25"
            >
              GOT IT
            </button>
            <button
              type="button"
              onClick={() => onDismiss(true)}
              className="label-tech flex-1 border border-hairline py-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              DON'T SHOW AGAIN
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
