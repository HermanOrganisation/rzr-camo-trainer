import { RotateCcw } from "lucide-react";

export function ResetVehicleButton({
  onReset,
  disabled,
}: {
  onReset: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className="label-tech flex items-center gap-2 border border-khaki/50 bg-khaki/10 px-4 py-2.5 text-khaki transition-colors hover:bg-khaki/20 disabled:cursor-not-allowed disabled:border-hairline disabled:bg-transparent disabled:text-muted-foreground/40"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      RESET VEHICLE
    </button>
  );
}
