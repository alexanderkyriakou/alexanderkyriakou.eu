import { clamp, fitCrop } from './geometry.js';
import { viewportLayout } from './viewport.js';

export function frameForCrop(crop, layout) {
  return { x:layout.left+crop.x*layout.scale, y:layout.top+crop.y*layout.scale, w:crop.w*layout.scale, h:crop.h*layout.scale };
}
export function viewForCrop(crop, frame, width, height, vw, vh, padding) {
  const base = viewportLayout(width,height,vw,vh,padding,{zoom:1,panX:0,panY:0});
  const scale = frame.w/crop.w;
  const cx = padding.left+(vw-padding.left-padding.right)/2, cy = padding.top+(vh-padding.top-padding.bottom)/2;
  return { zoom:scale/base.scale, panX:frame.x-crop.x*scale-cx+width*scale/2, panY:frame.y-crop.y*scale-cy+height*scale/2 };
}
// Clamp the image beneath a stationary frame, so exports never include empty canvas.
export function cropViewportLayout(width,height,vw,vh,padding,view,frame) {
  const aw = vw-padding.left-padding.right, ah = vh-padding.top-padding.bottom;
  const fit = Math.min(aw/width,ah/height);
  const minZoom = Math.max(frame.w/width,frame.h/height)/fit;
  const zoom = clamp(view.zoom,minZoom,Math.max(16/fit,minZoom));
  const scale = fit*zoom, w = width*scale, h = height*scale;
  const cx = padding.left+aw/2, cy = padding.top+ah/2;
  const left = clamp(cx-w/2+view.panX,frame.x+frame.w-w,frame.x);
  const top = clamp(cy-h/2+view.panY,frame.y+frame.h-h,frame.y);
  return { w,h,scale,left,top,zoom,panX:left-cx+w/2,panY:top-cy+h/2,maxPanX:Math.max(0,w-frame.w),maxPanY:Math.max(0,h-frame.h) };
}
export function sourceCrop(frame,layout,width,height,ratio) {
  const w = Math.min(width,height*ratio,Number((frame.w/layout.scale).toFixed(7))), h = w/ratio;
  return { x:clamp(Number(((frame.x-layout.left)/layout.scale).toFixed(7)),0,width-w), y:clamp(Number(((frame.y-layout.top)/layout.scale).toFixed(7)),0,height-h), w,h };
}
export function initialFrame(width,height,vw,vh,padding,ratio,selection = null,frameScale = 1) {
  const layout = viewportLayout(width,height,vw,vh,padding,{zoom:1,panX:0,panY:0});
  const maximum = frameForCrop(fitCrop(width,height,ratio),layout);
  const factor = Math.min(frameScale,(vw-padding.left-padding.right)/maximum.w,(vh-padding.top-padding.bottom)/maximum.h);
  const frame = {x:maximum.x+maximum.w*(1-factor)/2,y:maximum.y+maximum.h*(1-factor)/2,w:maximum.w*factor,h:maximum.h*factor};
  // Keep tiny selections intact when reopening or enlarging the viewport.
  if (selection && frame.w/selection.w>16) {
    const w = selection.w*16, h = w/ratio;
    return {x:frame.x+(frame.w-w)/2,y:frame.y+(frame.h-h)/2,w,h};
  }
  return frame;
}
export function frameBounds(layout,vw,vh,padding) {
  const x = Math.max(padding.left,layout.left), y = Math.max(padding.top,layout.top);
  return { x,y,w:Math.max(0,Math.min(vw-padding.right,layout.left+layout.w)-x),h:Math.max(0,Math.min(vh-padding.bottom,layout.top+layout.h)-y) };
}
