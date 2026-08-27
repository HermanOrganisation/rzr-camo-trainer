import { useCallback, useEffect, useRef, useState } from "react";

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 3;
const ZOOM_INTENSITY = 0.0016;

const clamp = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

interface Gesture {
  x: number;
  y: number;
  panX: number;
  panY: number;
}

/**
 * Cursor-anchored zoom plus pan/rotate gestures for the viewer stage.
 * Horizontal drags step through the documented view angles while at rest zoom;
 * once zoomed in, the same drag pans the stage.
 */
export function useViewerTransform({
  onSwipe,
  swipeEnabled,
}: {
  onSwipe: (direction: 1 | -1) => void;
  swipeEnabled: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Latest values for the non-passive wheel listener and pointer handlers.
  const latest = useRef({ zoom, pan, onSwipe, swipeEnabled });
  latest.current = { zoom, pan, onSwipe, swipeEnabled };

  const reset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomBy = useCallback((factor: number) => setZoom((z) => clamp(z * factor)), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const { zoom: z, pan: p } = latest.current;
      const next = clamp(z * Math.exp(-dy * ZOOM_INTENSITY));
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

  const gesture = useRef<Gesture | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-part],[data-hotspot]")) return;
    gesture.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    if (latest.current.zoom > 1.02) {
      setPan({ x: g.panX + dx, y: g.panY + (e.clientY - g.y) });
      return;
    }
    if (!latest.current.swipeEnabled || Math.abs(dx) <= 60) return;
    latest.current.onSwipe(dx < 0 ? 1 : -1);
    gesture.current = { ...g, x: e.clientX };
  };

  const endGesture = () => {
    gesture.current = null;
    setDragging(false);
  };

  return {
    stageRef,
    zoom,
    pan,
    dragging,
    reset,
    zoomIn: () => zoomBy(1.2),
    zoomOut: () => zoomBy(1 / 1.2),
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endGesture,
      onPointerCancel: endGesture,
    },
  };
}
