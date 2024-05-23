import { WebGLRenderer } from "three";

export function createRenderer(canvas) {
  const renderer = new WebGLRenderer({ antialias: true, canvas });
  return renderer;
}
