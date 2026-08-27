import { motion } from "framer-motion";

export function ProgressIndicator({
  done,
  total,
  percent,
}: {
  done: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="label-tech flex items-baseline justify-between gap-4">
        <span className="text-khaki">TRAINING PROGRESS</span>
        <span className="text-amber">{percent}%</span>
      </div>
      <div className="mt-1.5 h-[3px] w-full bg-panel-raised">
        <motion.div
          className="h-full bg-amber"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        />
      </div>
      <div className="label-tech mt-1.5 text-muted-foreground">
        {done} / {total} COMPONENTS COMPLETE
      </div>
    </div>
  );
}
