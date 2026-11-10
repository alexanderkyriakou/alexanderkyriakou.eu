export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export function gcd(a, b) { return b ? gcd(b, a % b) : a; }
export function reducedRatio(width, height) {
  const divisor = gcd(width, height);
  return [width / divisor, height / divisor];
}
export function fitCrop(width, height, ratio) {
  const w = Math.min(width, height * ratio);
  const h = w / ratio;
  return { x: (width - w) / 2, y: (height - h) / 2, w, h };
}
export function moveCrop(crop, dx, dy, width, height) {
  return { ...crop, x: clamp(crop.x + dx, 0, width - crop.w), y: clamp(crop.y + dy, 0, height - crop.h) };
}
export function scaleCrop(crop, factor, width, height, ratio) {
  const w = clamp(crop.w * factor, Math.min(Math.max(16, ratio), width, height * ratio), Math.min(width, height * ratio));
  const h = w / ratio;
  return { x: clamp(crop.x + (crop.w - w) / 2, 0, width - w), y: clamp(crop.y + (crop.h - h) / 2, 0, height - h), w, h };
}
export function resizeCrop(crop, corner, dx, dy, width, height, ratio) {
  const right = corner.includes('e'), bottom = corner.includes('s');
  const anchorX = right ? crop.x : crop.x + crop.w;
  const anchorY = bottom ? crop.y : crop.y + crop.h;
  const maxW = Math.min(right ? width - anchorX : anchorX, (bottom ? height - anchorY : anchorY) * ratio);
  // Project the pointer onto the ratio-constrained diagonal.
  const delta = ((right ? dx : -dx) + (bottom ? dy : -dy) / ratio) / (1 + 1 / ratio ** 2);
  const w = clamp(crop.w + delta, Math.min(Math.max(16, ratio), maxW), maxW), h = w / ratio;
  return { x: right ? anchorX : anchorX - w, y: bottom ? anchorY : anchorY - h, w, h };
}
export function outputSize(crop, rw, rh, requestedWidth, exact = true) {
  const maxW = Math.min(crop.w, 8192, 8192 * rw / rh, Math.sqrt(16_000_000 * rw / rh));
  const target = Math.min(maxW, requestedWidth || maxW);
  // Small crops cannot always fit a complete ratio unit (1.91:1 = 191:100).
  if (!exact || target < rw) {
    const width = Math.max(1, Math.floor(target));
    return { width, height: Math.max(1, Math.min(Math.floor(crop.h), 8192, Math.floor(16_000_000 / width), Math.round(width * rh / rw))) };
  }
  const units = Math.floor(target / rw);
  return { width: units * rw, height: units * rh };
}
export function downloadName(name, rw, rh, extension) {
  const stem = name.replace(/\.[^.]+$/, '') || 'image';
  return `${stem}-${rw}-${rh}.${extension}`;
}
