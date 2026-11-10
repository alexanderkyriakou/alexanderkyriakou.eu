import { clamp, reducedRatio, fitCrop, moveCrop, scaleCrop, resizeCrop, outputSize, downloadName } from './geometry.js';
import { viewportLayout, zoomAround } from './viewport.js';
import { viewForCrop, cropViewportLayout, sourceCrop, initialFrame, frameBounds } from './crop-viewport.js';
import { initIdleMotion } from './idle-motion.js';

const $ = (id) => document.getElementById(id);
const state = { image: null, file: null, url: null, sourceFormat:null, ratio: [16, 9], cropActive: false, adjustingOnCanvas: false, crop: null, cropFrame:null, cropLayout:null, frameKey:null, frameScale:1, requestedWidth: null, revision: 0, loadId: 0, worker: null, cropWorker:null, exportingCrop:false, cropExportBytes:null, busy: false, result: null, previewURLs: [], previewReady: false };
const view = { zoom:1,panX:0,panY:0 };
let displayedScale = 1, cancelZoomEdit = false, zoomDirty = false;
let lastCropView = false, cropExportId = 0;
initIdleMotion();
let drag = null;
let idleScroll = 0;
const compactViewport = matchMedia('(max-width: 768px)');
function setOptimizationOpen(open) {
  $('optimization-body').hidden = !open;
  $('toggle-optimization').setAttribute('aria-expanded', String(open));
  $('toggle-optimization').title = open ? 'Hide optimization settings' : 'Show optimization settings';
  document.body.classList.toggle('optimization-open', open);
  if (open && compactViewport.matches) $('aspect-tools').open = false;
  if (state.image) { fitStage(); fitComparison(); }
}
$('toggle-optimization').addEventListener('click', () => setOptimizationOpen($('optimization-body').hidden));
$('drop-field').addEventListener('click', (event) => {
  if (!event.target.closest('button, a, input')) $('file-input').click();
});
const bytes = (n) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KiB` : `${(n / 1048576).toFixed(2)} MiB`;
function displayRatio(width,height) {
  const [rw,rh] = reducedRatio(width,height);
  return Math.max(rw,rh)<=100 ? `${rw}:${rh}` : `${(width/height).toFixed(2)}:1`;
}
const ratioValue = () => state.ratio[0] / state.ratio[1];
const size = () => outputSize(state.crop, ...state.ratio, state.requestedWidth, state.cropActive);
let toastTimer;

function dismissToast() {
  const toast = $('toast');

  if (toast.hidden || toast.hasAttribute('data-closing')) return;

  clearTimeout(toastTimer);
  toast.setAttribute('data-closing', '');

  const delay = matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : 600;

  toastTimer = setTimeout(() => {
    toast.hidden = true;
    toast.removeAttribute('data-closing');
    $('status').textContent = '';
  }, delay);
}

function announce(message) {
  clearTimeout(toastTimer);

  const toast = $('toast');
  toast.removeAttribute('data-closing');

  $('status').textContent = message;
  toast.hidden = false;

  toastTimer = setTimeout(dismissToast, 10000);
}

$('dismiss-toast').addEventListener('click', dismissToast);
function showError(message = '') { $('error').hidden = !message; $('error').textContent = message; }

function stopEncoding() {
  state.worker?.terminate(); state.worker = null; state.busy = false;
  $('encode-progress').hidden = true; $('optimize').disabled = false;
}
function stopCropExport() {
  cropExportId++; state.cropWorker?.terminate(); state.cropWorker = null;
  state.exportingCrop = false; $('download-crop').disabled = false;
  $('crop-progress').hidden = true; $('optimize').disabled = state.busy;
}
function invalidate(render = true) {
  state.revision++; stopCropExport(); stopEncoding(); state.result = null; state.cropExportBytes = null; state.previewReady = false;
  for (const url of state.previewURLs) URL.revokeObjectURL(url);
  state.previewURLs = [];
  $('before-image').removeAttribute('src'); $('after-image').removeAttribute('src');
  $('comparison-empty').textContent = 'Your crop, with fewer bytes. A preview will appear here.';
  $('comparison-images').hidden = true; $('comparison-empty').hidden = false;
  $('download-optimized').disabled = true; $('comparison-slider').disabled = true;
  $('encode-result').textContent = '';
  $('encode-result').classList.remove('saving');
  if (render) updatePreviewMode();
}
function updatePreviewMode() {
  document.body.classList.toggle('crop-tools-open', $('aspect-tools').open);
  document.body.classList.toggle('is-adjusting', state.adjustingOnCanvas);
  const editing = cropEditing();
  if (editing!==lastCropView) {
    if (editing) state.frameKey = null; else resetView(false);
    lastCropView = editing;
  }
  const comparing = state.previewReady && !editing;
  $('comparison-mount').hidden = !comparing;
  $('image-space').hidden = !state.image || comparing;
  $('crop-box').hidden = !editing;
  $('crop-adjustments').disabled = !state.cropActive;
  $('adjust-on-image').disabled = !state.cropActive;
  $('finish-crop').hidden = !state.adjustingOnCanvas;
  $('stage').classList.toggle('is-comparing', comparing);
  if (state.image) { fitStage(); fitComparison(); }
}
function cropEditing() { return state.cropActive && state.adjustingOnCanvas; }
$('adjust-on-image').addEventListener('click', () => {
  state.adjustingOnCanvas = true; $('aspect-tools').open = false;
  updatePreviewMode(); $('crop-box').focus({preventScroll:true});
});
$('finish-crop').addEventListener('click', () => {
  state.adjustingOnCanvas = false; $('aspect-tools').open = false; updatePreviewMode();
  $('aspect-tools').querySelector('summary').focus({preventScroll:true});
});
function updateRatioLabel(text = state.ratio.join(':')) {
  if (!state.cropActive && Math.max(...state.ratio) > 100) text = `${ratioValue().toFixed(2)}:1`;
  const status = `${state.cropActive ? 'Cropped' : 'Original'} · ${text}`;
  $('aspect-summary').textContent = status;
  const toggle = $('aspect-tools').querySelector('summary');
  toggle.setAttribute('aria-label',`Aspect ratio · ${status}`);
  toggle.title = `${$('aspect-tools').open ? 'Hide' : 'Show'} aspect ratio tools · ${status}`;
  $('selected-ratio').textContent = state.cropActive ? text : 'Original';
  $('frame-ratio').textContent = text;
  const type = formatLabel(state.sourceFormat);
  const downloadLabel = `${state.cropActive ? 'Download crop' : 'Download image'} · ${type}`;
  $('download-crop').setAttribute('aria-label',downloadLabel); $('download-crop').title = downloadLabel;
  $('download-crop-label').textContent = downloadLabel;
  $('crop-export-note').textContent = state.sourceFormat==='png'
    ? 'Keeps PNG lossless. Choose WebP or AVIF in Optimize for a smaller file.'
    : `Keeps the original ${type} format; re-encoded at quality 90. Use Optimize to tune size and quality.`;
}
function useOriginal() {
  if (!state.image) return;
  const w = state.image.naturalWidth, h = state.image.naturalHeight;
  state.ratio = reducedRatio(w, h); state.cropActive = false; state.adjustingOnCanvas = false;
  state.crop = { x: 0, y: 0, w, h }; state.requestedWidth = null;
  state.cropFrame = null; state.frameKey = null; state.frameScale = 1;
  resetView(false);
  resetPlatformPreset();
  for (const button of document.querySelectorAll('[data-ratio]')) button.setAttribute('aria-pressed', 'false');
  invalidate(); updateRatioLabel(); renderCrop();
}
$('use-original').addEventListener('click', useOriginal);
$('aspect-tools').addEventListener('toggle', () => {
  if ($('aspect-tools').open && state.cropActive) state.adjustingOnCanvas = true;
  if ($('aspect-tools').open && compactViewport.matches) setOptimizationOpen(false);
  updatePreviewMode(); if (state.image) updateRatioLabel($('frame-ratio').textContent);
});
compactViewport.addEventListener('change', () => {
  if (compactViewport.matches) setOptimizationOpen(false);
});
function setRatio(rw, rh, fromPreset = false) {
  // Retain the relative crop size and subject position when changing its shape.
  const previous = state.crop;
  const fraction = state.cropActive ? previous.w/fitCrop(state.image.naturalWidth,state.image.naturalHeight,ratioValue()).w : 1;
  state.ratio = reducedRatio(rw, rh); state.requestedWidth = null; state.cropActive = true;
  const text = `${rw}:${rh}`;
  $('selected-ratio').textContent = text; $('frame-ratio').textContent = text;
  $('ratio-width').value = state.ratio[0]; $('ratio-height').value = state.ratio[1];
  for (const button of document.querySelectorAll('[data-ratio]')) button.setAttribute('aria-pressed', String(button.dataset.ratio === text));
  if (!fromPreset) resetPlatformPreset();
  state.adjustingOnCanvas = true; state.frameKey = null; state.cropFrame = null;
  if (state.image) {
    const {naturalWidth:w,naturalHeight:h} = state.image, maximum = fitCrop(w,h,ratioValue());
    const cw = maximum.w*fraction, ch = cw/ratioValue();
    state.crop = {x:clamp(previous.x+previous.w/2-cw/2,0,w-cw),y:clamp(previous.y+previous.h/2-ch/2,0,h-ch),w:cw,h:ch};
  }
  invalidate(); updateRatioLabel(text);
}
function updateDimensions(force = false) {
  if (!state.image) return;
  const { width, height } = size();
  // A layout observer may run between typing and blur. Preserve the draft input.
  if (force || document.activeElement !== $('output-width')) $('output-width').value = width;
  $('output-height').textContent = height;
  $('output-width').step = !state.cropActive || size().width < state.ratio[0] ? 1 : state.ratio[0]; $('output-width').min = 1;
  $('output-width').max = outputSize(state.crop, ...state.ratio, null, state.cropActive).width;
  const fileSize = state.result?.blob.size ?? state.cropExportBytes;
  $('crop-meta').textContent = `Output ${width.toLocaleString()} × ${height.toLocaleString()} px · ${displayRatio(width,height)}${fileSize===null ? '' : ` · ${bytes(fileSize)}`}`;
  $('output-help').textContent = 'Height follows your ratio. No upscaling. Max 16 MP.';
}
function renderCrop() {
  if (!state.image || !state.cropFrame) return;
  const {x,y,w,h} = state.cropFrame;
  Object.assign($('crop-box').style,{left:`${x}px`,top:`${y}px`,width:`${w}px`,height:`${h}px`});
  const stage = $('stage');
  const max = initialFrame(state.image.naturalWidth,state.image.naturalHeight,stage.clientWidth,stage.clientHeight,paddingFor(stage),ratioValue());
  state.frameScale = w/max.w;
  const percent = Math.round(100*state.frameScale);
  $('crop-scale').min = Math.min(25,percent); $('crop-scale').max = Math.max(100,percent);
  $('crop-scale').value = percent; $('crop-scale-value').textContent = `${percent}%`;
  $('crop-scale').setAttribute('aria-valuetext',`${percent}%`);
  updateDimensions();
}
function fitStage() {
  if (!state.image || $('image-space').hidden) return;
  const {naturalWidth:w,naturalHeight:h} = state.image;
  let layout, rect;
  if (cropEditing()) {
    const stage = $('stage'), vw = stage.clientWidth, vh = stage.clientHeight, pad = paddingFor(stage);
    if (vw-pad.left-pad.right<=0 || vh-pad.top-pad.bottom<=0) return;
    const key = JSON.stringify([vw,vh,pad]);
    if (!state.cropFrame || state.frameKey!==key) {
      state.cropFrame = initialFrame(w,h,vw,vh,pad,ratioValue(),state.crop,state.frameScale);
      Object.assign(view,viewForCrop(state.crop,state.cropFrame,w,h,vw,vh,pad));
      state.frameKey = key;
    }
    layout = cropViewportLayout(w,h,vw,vh,pad,view,state.cropFrame);
    Object.assign(view,{zoom:layout.zoom,panX:layout.panX,panY:layout.panY});
    applyLayout($('image-space'),layout);
    state.cropLayout = layout;
    state.crop = sourceCrop(state.cropFrame,layout,w,h,ratioValue());
    rect = {x:0,y:0};
    renderCrop();
  } else {
    rect = state.crop;
    layout = placeView($('image-space'),$('stage'),rect.w,rect.h);
    if (!layout) return;
    updateDimensions();
  }
  Object.assign($('source-image').style,{width:`${w*layout.scale}px`,height:`${h*layout.scale}px`,left:`${-rect.x*layout.scale}px`,top:`${-rect.y*layout.scale}px`});
}
new ResizeObserver(fitStage).observe($('stage'));

async function imageFormat(file) {
  const data = new Uint8Array(await file.slice(0, 40).arrayBuffer());
  const ascii = (a, b) => String.fromCharCode(...data.slice(a, b));
  if (data[0]===255 && data[1]===216 && data[2]===255) return 'jpeg';
  if (ascii(1,4)==='PNG' && data[0]===137) return 'png';
  if (ascii(0,4)==='RIFF' && ascii(8,12)==='WEBP') return 'webp';
  if (ascii(4,8)==='ftyp' && (ascii(8,12)==='avif' || ascii(16,40).includes('avif'))) return 'avif';
  return null;
}
async function loadImage(file) {
  if (!file) return;
  const loadId = ++state.loadId;
  showError();
  let url;
  try {
    if (file.size > 32 * 1048576) throw new Error('This file is larger than 32 MiB. Please choose a smaller image.');
    const sourceFormat = await imageFormat(file);
    if (!sourceFormat) throw new Error('Choose a JPEG, PNG, WebP or AVIF image. HEIC, SVG, GIF and RAW are not supported.');
    url = URL.createObjectURL(file);
    const image = new Image(); image.src = url;
    try { await image.decode(); } catch { throw new Error('This image could not be opened. It may be damaged or unsupported by your browser. Try a PNG or JPEG.'); }
    if (loadId !== state.loadId) { URL.revokeObjectURL(url); return; }
    const w = image.naturalWidth, h = image.naturalHeight;
    if (w < 100 || h < 100) throw new Error('Please choose an image at least 100 × 100 pixels.');
    if (w * h > 40_000_000 || Math.max(w, h) > 16384) throw new Error('This image exceeds 40 megapixels or 16,384 pixels per edge. Resize it first to reduce browser memory use.');
    if (!state.image) idleScroll = scrollY;
    invalidate();
    if (state.url) URL.revokeObjectURL(state.url);
    Object.assign(state, { image, file, url, sourceFormat, crop: { x: 0, y: 0, w, h }, cropFrame:null, cropLayout:null, frameKey:null, frameScale:1, ratio: reducedRatio(w, h), cropActive: false, adjustingOnCanvas: false, requestedWidth: null });
    resetView(false); $('comparison-slider').value = '50'; syncComparison();
    $('aspect-tools').open = false;
    $('editor-app').dataset.state = 'editing'; $('workspace').hidden = false;
    document.body.classList.add('is-editing');
    document.querySelector('.skip-link').href = '#editor-heading';
    setOptimizationOpen(!compactViewport.matches);
    $('idle-screen').hidden = true; $('idle-guide').hidden = true;
    for (const button of document.querySelectorAll('[data-ratio]')) button.setAttribute('aria-pressed', 'false');
    resetPlatformPreset();
    $('source-image').src = url;
    $('upload-image').hidden = true; $('image-space').hidden = false; $('remove-image').hidden = false;
    $('image-controls').disabled = false; $('encode-controls').disabled = false;
    $('image-name').textContent = file.name;
    $('image-meta').textContent = `Original: ${w.toLocaleString()} × ${h.toLocaleString()} px · ${displayRatio(w,h)} · ${bytes(file.size)}`;
    $('replace-image').textContent = 'Replace'; updateFormat(); updateRatioLabel(); updatePreviewMode(); fitStage();
    announce(`Loaded ${file.name}. Original framing preserved.`);
    $('editor-heading').focus({ preventScroll: true });
    return true;
  } catch (error) {
    if (url) URL.revokeObjectURL(url);
    if (loadId === state.loadId) showError(error.message);
  } finally {
    if (loadId === state.loadId) $('file-input').value = '';
  }
}
for (const id of ['upload-image', 'replace-image']) $(id).addEventListener('click', () => $('file-input').click());
$('file-input').addEventListener('change', (event) => loadImage(event.target.files[0]));
// Prevent the browser from navigating away if a file is dropped outside the canvas.
window.addEventListener('dragover', (event) => { if (event.dataTransfer.types.includes('Files')) event.preventDefault(); });
window.addEventListener('drop', (event) => { if (event.dataTransfer.types.includes('Files')) event.preventDefault(); });
for (const dropZone of [$('stage'), $('idle-screen')]) {
let dragDepth = 0;
dropZone.addEventListener('dragenter', (event) => { event.preventDefault(); dragDepth++; dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragover', (event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; });
dropZone.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; dropZone.classList.remove('drag-over'); } });
dropZone.addEventListener('drop', (event) => {
  event.preventDefault(); dragDepth = 0; dropZone.classList.remove('drag-over');
  if (event.dataTransfer.files.length !== 1) showError('Please drop one image at a time.');
  else loadImage(event.dataTransfer.files[0]);
});
}
$('remove-image').addEventListener('click', () => {
  state.loadId++; invalidate(); URL.revokeObjectURL(state.url);
  Object.assign(state, { image: null, file: null, url: null, sourceFormat:null, crop: null, requestedWidth: null, cropActive: false, adjustingOnCanvas: false });
  $('workspace').hidden = true; $('idle-screen').hidden = false; $('idle-guide').hidden = false;
  $('editor-app').dataset.state = 'idle'; $('aspect-tools').open = false;
  document.body.classList.remove('is-editing', 'crop-tools-open', 'optimization-open', 'is-adjusting');
  document.querySelector('.skip-link').href = '#page-title';
  $('source-image').removeAttribute('src'); $('upload-image').hidden = false; $('image-space').hidden = true;
  $('image-controls').disabled = true; $('encode-controls').disabled = true; $('remove-image').hidden = true;
  $('image-name').textContent = 'No image selected'; $('image-meta').textContent = 'Original dimensions and aspect ratio will appear here.';
  $('crop-meta').textContent = ''; $('output-width').value = ''; $('output-height').textContent = '—';
  $('replace-image').textContent = 'Choose image'; showError(); announce('Editor closed.');
  $('upload-image').focus({ preventScroll: true });
  window.scrollTo(0, idleScroll);
});
document.querySelectorAll('[data-ratio]').forEach((button) => button.addEventListener('click', () => setRatio(...button.dataset.ratio.split(':').map(Number))));
function resetPlatformPreset() { $('platform-label').textContent = 'Browse platforms'; $('platform-picker').open = false; }
document.querySelectorAll('[data-platform-ratio]').forEach((button) => button.addEventListener('click',()=>{
  const [w,h] = button.dataset.platformRatio.split(':').map(Number);
  setRatio(Math.round(w*100),Math.round(h*100),true);
  $('platform-label').textContent = `${button.dataset.platform} · ${w}:${h}`;
  $('platform-picker').open = false;
  updateRatioLabel(`${w}:${h}`);
  document.querySelectorAll('[data-ratio]').forEach((b)=>b.setAttribute('aria-pressed',String(b.dataset.ratio===`${w}:${h}`)));
}));
$('custom-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const w = Number($('ratio-width').value), h = Number($('ratio-height').value);
  if (w / h > 100 || w / h < .01) { showError('Choose a ratio between 1:100 and 100:1.'); return; }
  showError(); setRatio(w, h);
});
function cropChanged() { invalidate(false); fitStage(); updateRatioLabel($('frame-ratio').textContent); }
function currentFrameBounds() {
  const stage = $('stage');
  return frameBounds(state.cropLayout,stage.clientWidth,stage.clientHeight,paddingFor(stage));
}
function transformFrame(change) {
  const bounds = currentFrameBounds(), frame = state.cropFrame;
  const next = change({...frame,x:frame.x-bounds.x,y:frame.y-bounds.y},bounds);
  state.cropFrame = {...next,x:next.x+bounds.x,y:next.y+bounds.y}; cropChanged();
}
$('crop-scale').addEventListener('input', () => {
  const stage = $('stage');
  const max = initialFrame(state.image.naturalWidth,state.image.naturalHeight,stage.clientWidth,stage.clientHeight,paddingFor(stage),ratioValue());
  const target = max.w*Number($('crop-scale').value)/100;
  transformFrame((frame,bounds)=>scaleCrop(frame,target/frame.w,bounds.w,bounds.h,ratioValue()));
});
let cropWheelDelta = 0, cropWheelTime = 0;
$('crop-scale').addEventListener('wheel',(event)=>{
  const slider = $('crop-scale');
  if (!cropEditing() || slider.matches(':disabled') || event.ctrlKey || event.metaKey || !event.deltaY) return;
  event.preventDefault(); event.stopPropagation();
  if (event.timeStamp-cropWheelTime>200 || Math.sign(event.deltaY)!==Math.sign(cropWheelDelta)) cropWheelDelta = 0;
  cropWheelTime = event.timeStamp;
  cropWheelDelta += event.deltaY*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? 100 : 1);
  const steps = Math.trunc(cropWheelDelta/40);
  if (!steps) return;
  cropWheelDelta -= steps*40;
  const previous = slider.value;
  if (steps>0) slider.stepDown(steps); else slider.stepUp(-steps);
  if (slider.value!==previous) slider.dispatchEvent(new Event('input',{bubbles:true}));
},{passive:false});
$('center-crop').addEventListener('click',()=>transformFrame((frame,bounds)=>({...frame,x:(bounds.w-frame.w)/2,y:(bounds.h-frame.h)/2})));
$('reset-crop').addEventListener('click',()=>{
  state.crop = fitCrop(state.image.naturalWidth,state.image.naturalHeight,ratioValue());
  state.frameKey = null; state.frameScale = 1; cropChanged();
});
$('grid-mode').addEventListener('change', () => { $('crop-grid').dataset.guide = $('grid-mode').value; });
$('output-width').addEventListener('change', () => {
  if (!$('output-width').value || !Number.isFinite(Number($('output-width').value))) { updateDimensions(true); return; }
  state.requestedWidth = Math.max(1, Number($('output-width').value)); invalidate(); updateDimensions(true);
});
$('crop-box').addEventListener('pointerdown', (event) => {
  if (!cropEditing() || !event.isPrimary || event.button!==0 || !event.target.closest('[data-corner],[data-move]')) return;
  event.preventDefault(); event.stopPropagation(); $('crop-box').focus({preventScroll:true}); $('crop-box').setPointerCapture(event.pointerId);
  const bounds = currentFrameBounds(), frame = state.cropFrame;
  drag = {id:event.pointerId,x:event.clientX,y:event.clientY,frame:{...frame,x:frame.x-bounds.x,y:frame.y-bounds.y},bounds,corner:event.target.closest('[data-corner]')?.dataset.corner};
});
$('crop-box').addEventListener('pointermove',(event)=>{
  if (!drag || drag.id!==event.pointerId) return;
  const dx = event.clientX-drag.x, dy = event.clientY-drag.y, {bounds,frame} = drag;
  const next = drag.corner ? resizeCrop(frame,drag.corner,dx,dy,bounds.w,bounds.h,ratioValue()) : moveCrop(frame,dx,dy,bounds.w,bounds.h);
  state.cropFrame = {...next,x:next.x+bounds.x,y:next.y+bounds.y}; cropChanged();
});
for (const name of ['pointerup','pointercancel','lostpointercapture']) $('crop-box').addEventListener(name,()=>{drag=null;});
$('crop-box').addEventListener('keydown',(event)=>{
  if (!cropEditing()) return;
  const step = event.shiftKey ? 10 : 1;
  const directions = {ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]};
  if (directions[event.key]) transformFrame((frame,bounds)=>moveCrop(frame,...directions[event.key],bounds.w,bounds.h));
  else if (['+','=','-','_'].includes(event.key)) transformFrame((frame,bounds)=>scaleCrop(frame,['+','='].includes(event.key) ? 1.05 : .95,bounds.w,bounds.h,ratioValue()));
  else return;
  event.preventDefault();
});

function updateFormat() {
  const png = $('format').value === 'png';
  $('quality').disabled = png; $('effort').disabled = png;
  $('quality-value').textContent = png ? 'Lossless' : $('quality').value;
  const effort = ['Fast','Balanced','Thorough'][Number($('effort').value)];
  $('effort-value').textContent = png ? 'Not used' : effort;
  $('effort').setAttribute('aria-valuetext',png ? 'Not used for PNG' : effort);
  $('jpeg-background').hidden = $('format').value !== 'jpeg';
  $('format-note').textContent = png ? 'PNG uses the browser’s lossless encoder. Quality and effort do not apply.' : $('format').value === 'avif' ? 'AVIF can take longer. Thorough effort is best for smaller images.' : '';
  $('format-note').hidden = !$('format-note').textContent;
}
for (const id of ['format', 'quality', 'effort', 'background']) $(id).addEventListener(['quality','effort'].includes(id) ? 'input' : 'change', () => { invalidate(); updateFormat(); });

function renderOutput(background) {
  const { width, height } = size(), canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not create an image canvas. Try a smaller output size.');
  if (background) { context.fillStyle = background; context.fillRect(0, 0, width, height); }
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  const { x, y, w, h } = state.crop;
  context.drawImage(state.image, x, y, w, h, 0, 0, width, height);
  return canvas;
}
const pngBlob = (canvas) => new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not export this image. Try a smaller output width.')), 'image/png'));
const nativeBlob = (canvas,format) => new Promise((resolve,reject) => canvas.toBlob((blob)=>blob ? resolve(blob) : reject(new Error('Could not export this image. Try a smaller output width.')),`image/${format}`,.9));
async function sourceBlob(canvas,format,revision,owner = 'optimization') {
  if (format==='png') return pngBlob(canvas);
  if (format==='avif') return encode(canvas,format,revision,{quality:90,effort:1},owner);
  const blob = await nativeBlob(canvas,format);
  // Unsupported browser encoders may silently return PNG.
  return blob.type===`image/${format}` ? blob : encode(canvas,format,revision,{quality:90,effort:1},owner);
}
async function referenceForFrame(canvas,revision,outputFormat) {
  const {naturalWidth:w,naturalHeight:h} = state.image, crop = state.crop;
  const originalFrame = canvas.width===w && canvas.height===h && crop.x===0 && crop.y===0 && Math.abs(crop.w-w)<.00001 && Math.abs(crop.h-h)<.00001;
  const format = state.sourceFormat, type = formatLabel(format);
  if (originalFrame) return {blob:state.file,label:`Original ${type}`};
  $('encode-progress-text').textContent = `Preparing the same-frame ${type} reference…`;
  // Preserve source transparency when the chosen output format flattens it.
  const referenceCanvas = outputFormat==='jpeg' && format!=='jpeg' ? renderOutput() : canvas;
  const blob = await sourceBlob(referenceCanvas,format,revision);
  const kind = state.cropActive ? 'Cropped' : 'Resized';
  return {blob,label:`${kind} ${type}${format==='png' ? '' : ' (quality 90)'}`};
}
function formatLabel(format) { return {png:'PNG',jpeg:'JPEG',webp:'WebP',avif:'AVIF'}[format] || 'Original'; }
function sourceExtension() { return state.sourceFormat==='jpeg' ? (/\.jpeg$/i.test(state.file.name) ? 'jpeg' : 'jpg') : state.sourceFormat; }
function download(blob, name) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
$('download-crop').addEventListener('click', async () => {
  if (!state.image || state.busy || state.exportingCrop) { announce('Wait for the current export, or cancel it first.'); return; }
  const revision = state.revision, filename = outputName(sourceExtension()), format = state.sourceFormat;
  const exportId = ++cropExportId;
  state.exportingCrop = true; $('download-crop').disabled = true; $('optimize').disabled = true;
  $('crop-progress').hidden = false; showError();
  try {
    await new Promise((resolve)=>requestAnimationFrame(resolve));
    if (revision!==state.revision || exportId!==cropExportId) return;
    const canvas = renderOutput(format==='jpeg' ? '#ffffff' : undefined);
    const blob = await sourceBlob(canvas,format,revision,'crop');
    if (revision===state.revision && exportId===cropExportId) {
      state.cropExportBytes = blob.size; updateDimensions();
      download(blob,filename); announce(`Downloaded ${filename} · ${bytes(blob.size)}.`);
    }
  } catch (error) { if (revision===state.revision && exportId===cropExportId) showError(error.message); }
  finally { if (exportId===cropExportId) stopCropExport(); }
});
$('cancel-crop-export').addEventListener('click',()=>{stopCropExport();announce('Crop export cancelled.');});
function encode(canvas, format, revision, settings = {quality:Number($('quality').value),effort:Number($('effort').value)}, owner = 'optimization') {
  const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.buffer;
  const worker = new Worker(new URL('./encoder-worker.js', import.meta.url), { type: 'module' });
  if (owner==='crop') state.cropWorker = worker; else state.worker = worker;
  return new Promise((resolve, reject) => {
    function release() {
      worker.terminate();
      if (state.cropWorker===worker) state.cropWorker = null;
      if (state.worker===worker) state.worker = null;
    }
    worker.onmessage = ({ data }) => {
      release();
      if (revision !== state.revision) return;
      if (data.error) reject(new Error(data.error)); else resolve(new Blob([data.buffer], { type: `image/${format}` }));
    };
    worker.onerror = () => { release(); reject(new Error('The image encoder could not start. Try a smaller output or another format.')); };
    worker.postMessage({ pixels, width: canvas.width, height: canvas.height, format, ...settings }, [pixels]);
  });
}
$('optimize').addEventListener('click', async () => {
  if (!state.image || state.busy || state.exportingCrop) return;
  invalidate(); showError();
  const revision = state.revision, format = $('format').value;
  const filename = outputName(format === 'jpeg' ? 'jpg' : format);
  state.busy = true; $('optimize').disabled = true; $('encode-progress').hidden = false;
  $('encode-progress-text').textContent = `Encoding ${format.toUpperCase()} locally…`;
  // Let the browser paint progress before drawing a large image.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  if (revision !== state.revision) return;
  try {
    const canvas = renderOutput(format === 'jpeg' ? $('background').value : undefined);
    const reference = await referenceForFrame(canvas,revision,format);
    if (revision !== state.revision) return;
    $('encode-progress-text').textContent = `Encoding ${format.toUpperCase()} locally…`;
    const optimized = format === 'png' ? await pngBlob(canvas) : await encode(canvas, format, revision);
    if (revision !== state.revision) return;
    state.result = { blob: optimized, filename, width: canvas.width, height: canvas.height };
    updateDimensions();
    $('download-optimized').disabled = false;
    const change = (1 - optimized.size / reference.blob.size) * 100;
    const sizes = `${formatLabel(state.sourceFormat)} ${bytes(reference.blob.size)} → ${formatLabel(format)} ${bytes(optimized.size)}:`;
    const difference = `${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'smaller' : 'larger'}`;
    const sizeText = document.createElement('span'), savingText = document.createElement('strong');
    sizeText.textContent = sizes; savingText.textContent = difference;
    $('encode-result').replaceChildren(sizeText,document.createTextNode(' '),savingText);
    const summary = `${sizes} ${difference}`;
    $('encode-result').classList.toggle('saving', change > 0);
    state.previewURLs = [URL.createObjectURL(reference.blob), URL.createObjectURL(optimized)];
    $('before-image').alt = `Before optimization · ${reference.label}`;
    $('after-image').alt = `After optimization · ${formatLabel(format)}`;
    $('before-image').src = state.previewURLs[0]; $('after-image').src = state.previewURLs[1];
    try { await Promise.all([$('before-image').decode(), $('after-image').decode()]); }
    catch {
      if (revision === state.revision) { $('comparison-empty').textContent = 'This browser cannot preview the encoded format. Your download is available.'; announce(`${format.toUpperCase()} encoded. Preview is unavailable in this browser.`); }
      return;
    }
    if (revision !== state.revision) return;
    $('comparison-empty').hidden = true; $('comparison-images').hidden = false;
    $('comparison-slider').disabled = false;
    state.previewReady = true;
    state.adjustingOnCanvas = false;
    $('aspect-tools').open = false; updateRatioLabel($('frame-ratio').textContent); updatePreviewMode();
    fitComparison(); announce(`Your ${format.toUpperCase()} is ready. ${summary}.`);
  } catch (error) { if (revision === state.revision) showError(error.message || 'Encoding failed. Try a smaller output width.'); }
  finally { if (revision === state.revision) stopEncoding(); }
});
$('cancel-encode').addEventListener('click', () => { invalidate(); announce('Encoding cancelled. Your crop is unchanged.'); });
$('download-optimized').addEventListener('click', () => { if (state.result) { download(state.result.blob, state.result.filename); announce(`Downloaded ${state.result.filename}.`); } });
let comparisonLayout = null, comparisonFrame = 0;
function paintComparison() {
  comparisonFrame = 0;
  const value = Number($('comparison-slider').value);
  $('comparison-controls').style.setProperty('--split',`${value}%`);
  if (!comparisonLayout) return;
  const {layout,pad,w} = comparisonLayout, splitX = pad.left+w*value/100;
  $('after-image').style.setProperty('--image-split',`${clamp((splitX-layout.left)/layout.w*100,0,100)}%`);
}
function fitComparison() {
  if (!state.result || !state.previewReady || $('comparison-mount').hidden) return;
  const container = $('comparison-viewport');
  const layout = placeView($('comparison-images'),container,state.result.width,state.result.height);
  if (!layout) return;
  const pad = paddingFor(container), w = container.clientWidth-pad.left-pad.right, h = container.clientHeight-pad.top-pad.bottom;
  Object.assign($('comparison-controls').style,{left:`${pad.left}px`,top:`${pad.top}px`,width:`${w}px`,height:`${h}px`});
  comparisonLayout = {layout,pad,w}; paintComparison();
}
new ResizeObserver(fitComparison).observe($('comparison-viewport'));
function syncComparison() {
  $('comparison-slider').setAttribute('aria-valuetext',`${$('comparison-slider').value}% across the preview`);
  if (!comparisonFrame) comparisonFrame = requestAnimationFrame(paintComparison);
}
$('comparison-slider').addEventListener('input',syncComparison);

function paddingFor(element) {
  const style = getComputedStyle(element);
  return {left:parseFloat(style.paddingLeft),right:parseFloat(style.paddingRight),top:parseFloat(style.paddingTop),bottom:parseFloat(style.paddingBottom)};
}
function placeView(element,container,width,height) {
  const layout = viewportLayout(width,height,container.clientWidth,container.clientHeight,paddingFor(container),view);
  if (!layout) return null;
  view.panX = layout.panX; view.panY = layout.panY;
  applyLayout(element,layout);
  return layout;
}
function applyLayout(element,layout) {
  Object.assign(element.style,{width:`${layout.w}px`,height:`${layout.h}px`,left:`${layout.left}px`,top:`${layout.top}px`});
  displayedScale = layout.scale;
  if (document.activeElement!==$('view-zoom')) syncZoomField();
  $('stage').classList.toggle('can-pan',layout.maxPanX>0 || layout.maxPanY>0);
  return layout;
}
function renderView() { if ($('stage').classList.contains('is-comparing')) fitComparison(); else fitStage(); }
function syncZoomField() { $('view-zoom').value = `${Math.round(displayedScale*1000)/10}%`; }
$('view-zoom').addEventListener('focus',()=>{
  cancelZoomEdit = false; zoomDirty = false; $('view-zoom').select();
});
$('view-zoom').addEventListener('click',()=>$('view-zoom').select());
$('view-zoom').addEventListener('input',()=>{ zoomDirty = true; });
$('view-zoom').addEventListener('keydown',(event)=>{
  if (event.isComposing) return;
  if (event.key==='Enter' || event.key==='Escape') {
    event.preventDefault();
    cancelZoomEdit = event.key==='Escape';
    $('view-zoom').blur();
  }
});
$('view-zoom').addEventListener('blur',()=>{
  const text = $('view-zoom').value.trim().replace(/%$/,'').trim().replace(',','.');
  const percent = Number(text);
  if (zoomDirty && !cancelZoomEdit && /^\d*\.?\d+$/.test(text) && Number.isFinite(percent) && percent>0 && state.image) {
    zoomView(clamp(percent,1,1600)/100/displayedScale);
  }
  cancelZoomEdit = false; zoomDirty = false; syncZoomField();
});
function resetView(redraw = true) { Object.assign(view,{zoom:1,panX:0,panY:0}); if (redraw && state.image) renderView(); }
function zoomView(factor,point) {
  if (!state.image) return;
  const container = $('stage').classList.contains('is-comparing') ? $('comparison-viewport') : $('stage');
  const bounds = container.getBoundingClientRect(), pad = paddingFor(container);
  const center = {x:bounds.left+pad.left+(container.clientWidth-pad.left-pad.right)/2,y:bounds.top+pad.top+(container.clientHeight-pad.top-pad.bottom)/2};
  const fit = displayedScale/view.zoom;
  const minimum = cropEditing() && state.cropFrame
    ? Math.max(state.cropFrame.w/state.image.naturalWidth,state.cropFrame.h/state.image.naturalHeight) : .01;
  Object.assign(view,zoomAround(view,view.zoom*factor,point||center,center,{min:minimum/fit,max:Math.max(16,minimum)/fit}));
  if (cropEditing()) cropChanged(); else renderView();
}
$('stage').addEventListener('wheel',(event)=>{
  if (!state.image || event.ctrlKey || event.metaKey || !event.deltaY) return;
  event.preventDefault();
  const delta = event.deltaY*(event.deltaMode===1 ? 16 : event.deltaMode===2 ? $('stage').clientHeight : 1);
  zoomView(Math.exp(-clamp(delta,-240,240)*.0015),{x:event.clientX,y:event.clientY});
},{passive:false});
$('zoom-in').addEventListener('click',()=>zoomView(1.25));
$('zoom-out').addEventListener('click',()=>zoomView(.8));
$('reset-view').addEventListener('click',()=>{
  if (cropEditing()) {
    // Fit the image while keeping the user's frame in the same canvas position.
    Object.assign(view,{zoom:1,panX:0,panY:0}); cropChanged();
  } else resetView();
});
let panDrag = null;
$('stage').addEventListener('pointerdown',(event)=>{
  if (!state.image || !event.isPrimary || event.button!==0 || event.target.closest('#crop-box, input, button')) return;
  if (!$('stage').classList.contains('can-pan')) return;
  event.preventDefault(); $('stage').setPointerCapture(event.pointerId);
  panDrag = {id:event.pointerId,x:event.clientX,y:event.clientY,panX:view.panX,panY:view.panY};
  $('stage').classList.add('is-panning');
});
$('stage').addEventListener('pointermove',(event)=>{
  if (!panDrag || event.pointerId!==panDrag.id) return;
  view.panX = panDrag.panX+event.clientX-panDrag.x; view.panY = panDrag.panY+event.clientY-panDrag.y;
  if (cropEditing()) cropChanged(); else renderView();
});
for (const name of ['pointerup','pointercancel','lostpointercapture']) $('stage').addEventListener(name,()=>{panDrag = null;$('stage').classList.remove('is-panning');});
const chromeObserver = new ResizeObserver(()=>{
  $('workspace').style.setProperty('--toolbar-height',`${document.querySelector('.canvas-toolbar').offsetHeight}px`);
  $('workspace').style.setProperty('--footer-height',`${document.querySelector('.canvas-footer').offsetHeight}px`);
  renderView();
});
chromeObserver.observe(document.querySelector('.canvas-toolbar'));
chromeObserver.observe(document.querySelector('.canvas-footer'));
function outputName(extension) {
  return state.cropActive ? downloadName(state.file.name, ...state.ratio, extension)
    : `${state.file.name.replace(/\.[^.]+$/, '') || 'image'}.${extension}`;
}
const exampleFiles = {
  optimization: 'seagulls-wallpaper.png', cropping: 'fish-wallpaper.jpg', both: 'cat-wallpaper.jpg',
};
let exampleRequest = 0;
document.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', async () => {
  const request = ++exampleRequest, startingLoad = state.loadId;
  document.querySelectorAll('[data-example]').forEach((b) => { b.disabled = true; });
  showError(); announce('Opening the example image…');
  try {
    const filename = exampleFiles[button.dataset.example];
    const response = await fetch(`/assets/images/thoughts/image-optimization-aspect-ratio-editor/${filename}`);
    if (!response.ok) throw new Error('The example could not be loaded. Please try again or choose your own image.');
    const blob = await response.blob();
    if (request !== exampleRequest || state.loadId !== startingLoad) return;
    const loaded = await loadImage(new File([blob], filename, { type: blob.type }));
    if (!loaded || request !== exampleRequest) return;
    $('format').value = 'webp'; $('quality').value = '80'; $('effort').value = '1'; updateFormat();
    if (button.dataset.example === 'cropping') setOptimizationOpen(false);
    if (button.dataset.example === 'optimization') setOptimizationOpen(true);
    if (button.dataset.example === 'optimization') $('optimize').click();
    else {
      $('aspect-tools').open = true;
      announce(button.dataset.example === 'both' ? 'Choose an aspect ratio, then optimize your crop.' : 'Choose an aspect ratio to start cropping. Your original framing is preserved until then.');
      $('aspect-tools').querySelector('summary').focus({ preventScroll: true });
    }
  } catch (error) { if (request === exampleRequest && state.loadId === startingLoad) showError(error.message); }
  finally { if (request === exampleRequest) document.querySelectorAll('[data-example]').forEach((b) => { b.disabled = false; }); }
}));
updateFormat();

for (const theme of ['light','dark']) $(`theme-${theme}`).addEventListener('click',()=>{
  $('workspace').dataset.theme = theme;
  for (const value of ['light','dark']) $(`theme-${value}`).setAttribute('aria-pressed',String(value===theme));
});
