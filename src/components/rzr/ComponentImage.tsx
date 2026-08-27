import { getPartImage, type CamoPattern } from "@/data/rzrAssets";
import type { CamoComponent } from "@/data/rzrTraining";
import { cropStyle, regionAspect } from "@/lib/vehicleGeometry";
import { cn } from "@/lib/utils";

interface ComponentImageProps {
  component: CamoComponent;
  camo: CamoPattern;
  /** Photograph the crop is taken from when no per-part image exists */
  vehicleImage: string | undefined;
  /** Aspect ratio of `vehicleImage` */
  vehicleAspect?: number;
  className?: string;
}

/**
 * Visual of a single camouflage component. Uses the uploaded per-part
 * photograph when one exists, otherwise crops the component's region out of
 * the vehicle photograph so the imagery is always the real product.
 */
export function ComponentImage({
  component,
  camo,
  vehicleImage,
  vehicleAspect = 1,
  className,
}: ComponentImageProps) {
  const partImage = getPartImage(camo, component.id);
  const aspect = partImage ? undefined : regionAspect(component.region, vehicleAspect);

  return (
    <div
      className={cn("relative overflow-hidden border border-hairline bg-background/60", className)}
      style={aspect ? { aspectRatio: `${aspect}` } : undefined}
    >
      {partImage ? (
        <img
          src={partImage}
          alt={component.name}
          className="absolute inset-0 h-full w-full object-contain"
        />
      ) : vehicleImage ? (
        <img
          src={vehicleImage}
          alt={component.name}
          draggable={false}
          className="pointer-events-none absolute select-none"
          style={cropStyle(component.region)}
        />
      ) : (
        <span className="label-tech absolute inset-0 grid place-items-center text-muted-foreground">
          NO IMAGE
        </span>
      )}
    </div>
  );
}
