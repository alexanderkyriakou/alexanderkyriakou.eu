import { clamp } from './geometry.js';

export function viewportLayout(width, height, viewportWidth, viewportHeight, padding, view) {
  const availableW = viewportWidth-padding.left-padding.right;
  const availableH = viewportHeight-padding.top-padding.bottom;
  if (availableW<=0 || availableH<=0) return null;
  const scale = Math.min(availableW/width,availableH/height)*view.zoom;
  const w = width*scale, h = height*scale;
  const maxPanX = Math.abs(w-availableW)/2+Math.min(w,availableW)*.15;
  const maxPanY = Math.abs(h-availableH)/2+Math.min(h,availableH)*.15;
  const panX = clamp(view.panX,-maxPanX,maxPanX), panY = clamp(view.panY,-maxPanY,maxPanY);
  return { w,h,scale,panX,panY,maxPanX,maxPanY,
    left:padding.left+(availableW-w)/2+panX, top:padding.top+(availableH-h)/2+panY };
}

export function zoomAround(view, requestedZoom, point, center, limits = {min:.25,max:16}) {
  const zoom = clamp(requestedZoom,limits.min,limits.max), factor = zoom/view.zoom;
  return { zoom, panX:point.x-center.x-(point.x-center.x-view.panX)*factor,
    panY:point.y-center.y-(point.y-center.y-view.panY)*factor };
}
