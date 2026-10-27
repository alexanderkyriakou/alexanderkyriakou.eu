import {getArtData} from './display.js';
// Original editor/ThumbnailGenerator.as mapping, ordered by edat.ETYPE_*.
const thumbnailSymbols=['player','mine','gold','door_regular','door_locked','switch_locked','door_trap','switch_trap','oneway','exit_door','exit_switch','chaingun','laser','zap','chaser','floorguard','launchpad','bounceblock','rocket','turret','thwomp'].map(name=>'asset_thumbnail_gfx_'+name);
const numeric=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
const mix=(a,b,t)=>Number(a)+(Number(b)-Number(a))*t;
function interpolate(a,b,t){
 const partsB=b.match(numeric)||[];let i=0;
 if((a.match(numeric)||[]).length!==partsB.length)throw Error('Incompatible morph path');
 return a.replace(numeric,x=>String(mix(x,partsB[i++],t)));
}
function color(values,t){
 if(!values)return 'none';const[a,b]=values;if(a===b||a==='none')return a;
 if(/^#[\da-f]{6}$/i.test(a)&&/^#[\da-f]{6}$/i.test(b))return '#'+[1,3,5].map(i=>Math.round(mix(parseInt(a.slice(i,i+2),16),parseInt(b.slice(i,i+2),16),t)).toString(16).padStart(2,'0')).join('');
 return a;
}
export class Renderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=new Map();this.morphCache=new Map();this.tileLayer=null;this.level=null;this.debug=false;this.samples=[];this.pathCache=new Map();this.rootScale=1;}
 async prepare(){
  const a=getArtData(),ids=new Set();
  const seen=new Set();const visit=id=>{
   if(seen.has(id))return;seen.add(id);
   if(a.shapes[id]){if(a.shapes[id].missing)throw Error(`Missing shape ${id}`);if(!a.shapes[id].paths)ids.add(id);}
   else if(a.sprites[id])for(const f of a.sprites[id].frames)for(const e of f)visit(e.id);
   else if(!a.morphs[id])throw Error(`Unsupported visual resource ${id}`);
  };
  for(const[name,id]of Object.entries(a.symbols))if(name.startsWith('asset_gfx_')||name.startsWith('asset_thumbnail_gfx_'))visit(id);
  await Promise.all([...ids].map(async id=>{const img=new Image();img.src=new URL(`../assets/shapes/${id}.svg`,import.meta.url).href;await img.decode();this.images.set(id,img);}));
 }
 resize(){
  const rect=this.canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  const width=Math.max(1,Math.round(rect.width*dpr)),height=Math.max(1,Math.round(rect.height*dpr));
  if(this.canvas.width!==width||this.canvas.height!==height){this.canvas.width=width;this.canvas.height=height;this.tileLayer=null;}
 }
 symbol(ctx,id,frame=0,time=0,ratio=0,depth=0){
  if(depth>16)throw Error('Cyclic art resource');const a=getArtData();
  if(a.shapes[id]){
   const shape=a.shapes[id];
   if(shape.paths){
    let paths=this.pathCache.get(id);if(!paths){paths=shape.paths.map(p=>({p,path:new Path2D(p.d)}));this.pathCache.set(id,paths);}
    for(const{p,path}of paths){
     if(p.fill&&p.fill!=='none'){ctx.save();ctx.globalAlpha*=Number(p['fill-opacity']??1);ctx.fillStyle=p.fill;ctx.fill(path,p['fill-rule']||'nonzero');ctx.restore();}
     if(p.stroke&&p.stroke!=='none'){
      const matrix=ctx.getTransform(),scale=Math.sqrt(Math.abs(matrix.a*matrix.d-matrix.b*matrix.c));
      ctx.save();ctx.strokeStyle=p.stroke;ctx.globalAlpha*=Number(p['stroke-opacity']??1);ctx.lineWidth=Number(p['stroke-width']||1)*(p['vector-effect']==='non-scaling-stroke'?this.rootScale/scale:1);ctx.lineCap=p['stroke-linecap']||'butt';ctx.lineJoin=p['stroke-linejoin']||'miter';ctx.stroke(path);ctx.restore();
     }
    }
   }else{
    const img=this.images.get(Number(id));if(!img)throw Error(`Shape ${id} not loaded`);
    const[x0,x1,y0,y1]=shape.bounds;if(x1>x0&&y1>y0)ctx.drawImage(img,x0,y0,x1-x0,y1-y0);
   }
  }else if(a.sprites[id]){
   const sprite=a.sprites[id],f=sprite.frames[((frame%sprite.frames.length)+sprite.frames.length)%sprite.frames.length];
   for(const e of f){ctx.save();ctx.transform(...e.matrix);if(e.color)ctx.globalAlpha*=Math.max(0,Math.min(1,e.color[3]+(e.colorAdd?.[3]||0)/255));this.symbol(ctx,e.id,time,time,e.ratio||0,depth+1);ctx.restore();}
  }else if(a.morphs[id]){
   const t=ratio/65535,key=id+':'+ratio;let paths=this.morphCache.get(key);
   if(!paths){paths=a.morphs[id].map(p=>({p,path:new Path2D(interpolate(...p.d,t))}));if(this.morphCache.size>256)this.morphCache.clear();this.morphCache.set(key,paths);}
   for(const{p,path}of paths){if(p.fill?.[0]!=='none'){ctx.fillStyle=color(p.fill,t);ctx.fill(path,p['fill-rule']?.[0]||'nonzero');}if(p.stroke&&p.stroke[0]!=='none'){ctx.strokeStyle=color(p.stroke,t);ctx.lineWidth=mix(...(p['stroke-width']||['1','1']),t);ctx.stroke(path);}}
  }else throw Error(`Unknown vector resource ${id}`);
 }
 display(ctx,d,time){
  if(!d.visible)return;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rotation*Math.PI/180);ctx.scale(d.scaleX,d.scaleY);
  if(d.assetId!==undefined)this.symbol(ctx,d.assetId,d.currentFrame-1,d.age||0);
  for(const l of d.lines||[]){ctx.strokeStyle='#'+l.color.toString(16).padStart(6,'0');ctx.lineWidth=l.lineWidth;ctx.beginPath();ctx.moveTo(...l.from);ctx.lineTo(...l.to);ctx.stroke();}
  for(const child of d.children||[])this.display(ctx,child,time);ctx.restore();
 }
 // Static counterpart of the original ThumbnailGenerator.Generate: no Session,
 // clock, entity constructors, audio events, or gameplay RNG calls.
 drawPreview(level){
  this.resize();const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
  c.resetTransform();c.fillStyle='#cbcad0';c.fillRect(0,0,w,h);
  const scale=Math.min(w/792,h/600);this.rootScale=scale;
  c.translate((w-792*scale)/2,(h-600*scale)/2);c.scale(scale,scale);
  const a=getArtData();
  for(let row=0;row<25;row++)for(let col=0;col<33;col++){
   const tile=row===0||row===24||col===0||col===32?1:level.tiles[(row-1)*31+col-1];
   c.save();c.translate((col+.5)*24,(row+.5)*24);this.symbol(c,a.symbols.asset_gfx_tiles,tile);c.restore();
  }
  for(const entity of level.entities){
   const id=a.symbols[thumbnailSymbols[entity[0]]];
   if(id===undefined)throw Error(`Missing thumbnail for entity ${entity[0]}`);
   const frame=entity.length===4?entity[3]:0;
   c.save();c.translate(entity[1]*6,entity[2]*6);this.symbol(c,id,frame);c.restore();
  }
 }
 draw(session){
  const start=performance.now();this.resize();const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
  c.resetTransform();c.fillStyle='#cbcad0';c.fillRect(0,0,w,h);const scale=Math.min(w/792,h/600);this.rootScale=scale;c.translate((w-792*scale)/2,(h-600*scale)/2);c.scale(scale,scale);
  if(this.level!==session.level||!this.tileLayer){
   this.level=session.level;this.tileLayer=document.createElement('canvas');this.tileLayer.width=w;this.tileLayer.height=h;
   const t=this.tileLayer.getContext('2d');t.translate((w-792*scale)/2,(h-600*scale)/2);t.scale(scale,scale);
   const tiles=session.sim.GFX_GetTileIDs(),id=getArtData().symbols.asset_gfx_tiles;
   for(let i=0;i<tiles.length;i++){t.save();t.translate((i%33)*24+12,Math.floor(i/33)*24+12);this.symbol(t,id,tiles[i],0);t.restore();}
  }
  this.display(c,session.particleBack,session.tick);
  for(const d of session.display)this.display(c,d,session.tick);
  this.display(c,session.particleFront,session.tick);
  c.save();c.resetTransform();c.drawImage(this.tileLayer,0,0);c.restore();
  if(this.debug){const p=session.player;c.strokeStyle='#d33030';c.lineWidth=.8;c.beginPath();c.arc(p.pos.x,p.pos.y,p.r,0,Math.PI*2);c.stroke();}
  this.samples.push(performance.now()-start);if(this.samples.length>600)this.samples.shift();
 }
}
