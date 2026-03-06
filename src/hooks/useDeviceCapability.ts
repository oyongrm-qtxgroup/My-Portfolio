import { useMemo } from "react";

export type DeviceTier = "high" | "medium" | "low";

function detectGPUTier(): number {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return 0;
    const webgl = gl as WebGLRenderingContext;
    const debugInfo = webgl.getExtension("WEBGL_debug_renderer_info");
    if (debugInfo) {
      const renderer = webgl.getParameter(
        debugInfo.UNMASKED_RENDERER_WEBGL,
      ) as string;
      const lower = renderer.toLowerCase();
      // Low-end / software renderers
      if (
        lower.includes("swiftshader") ||
        lower.includes("llvmpipe") ||
        lower.includes("software") ||
        lower.includes("microsoft basic")
      ) {
        return 0;
      }
      // Integrated GPUs — medium
      if (
        lower.includes("intel") ||
        lower.includes("mesa") ||
        lower.includes("apple gpu") ||
        lower.includes("adreno 6") ||
        lower.includes("mali-g7")
      ) {
        return 1;
      }
      // Discrete GPUs — high
      if (
        lower.includes("nvidia") ||
        lower.includes("geforce") ||
        lower.includes("radeon") ||
        lower.includes("adreno 7") ||
        lower.includes("apple m")
      ) {
        return 2;
      }
    }
    // If we can't detect, check for WebGL2 as a proxy
    if (canvas.getContext("webgl2")) return 1;
    return 0;
  } catch {
    return 0;
  }
}

function detectDeviceTier(): DeviceTier {
  // Respect reduced-motion preference
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "low";
  }

  const cores = navigator.hardwareConcurrency ?? 2;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  const isMobile =
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    );

  const gpuTier = detectGPUTier();

  // Score system: GPU (0-2), cores (0-2), memory (0-2), mobile penalty
  let score = gpuTier;
  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0;
  score += memory >= 8 ? 2 : memory >= 4 ? 1 : 0;
  if (isMobile) score -= 1;

  if (score >= 5) return "high";
  if (score >= 2) return "medium";
  return "low";
}

let cachedTier: DeviceTier | null = null;

export function getDeviceTier(): DeviceTier {
  if (cachedTier) return cachedTier;
  if (typeof window === "undefined") return "medium";
  cachedTier = detectDeviceTier();
  return cachedTier;
}

export function useDeviceCapability(): DeviceTier {
  return useMemo(() => getDeviceTier(), []);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
