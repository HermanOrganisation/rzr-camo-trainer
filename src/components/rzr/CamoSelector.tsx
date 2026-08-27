import { CAMO_OPTIONS, type CamoPattern } from "@/data/rzrAssets";
import { TechButton } from "./RZRViewer";

export function CamoSelector({
  camo,
  onChange,
}: {
  camo: CamoPattern;
  onChange: (next: CamoPattern) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="label-tech text-khaki">CAMO:</span>
      {CAMO_OPTIONS.map((option) => (
        <TechButton
          key={option.id}
          active={camo === option.id}
          disabled={!option.available}
          title={option.available ? undefined : "No photography available for this pattern yet"}
          onClick={() => onChange(option.id)}
        >
          {option.label}
          {!option.available && <span className="ml-1.5 text-[8px] opacity-70">NO ASSET</span>}
        </TechButton>
      ))}
    </div>
  );
}
