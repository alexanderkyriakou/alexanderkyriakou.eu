// Native display records consumed by Canvas 2D. Converted data contains no bytecode.
let soundSink=()=>{};
export const setSoundSink=fn=>{soundSink=fn;};
export const playSound=(...args)=>soundSink(...args);
let art={sprites:{},symbols:{},shapes:{},morphs:{}};
export const setArtData=value=>{art=value;};
export const getArtData=()=>art;
export class ColorTransform { constructor(){this.color=null;} }
export class SoundTransform { constructor(volume=1,pan=0){this.volume=volume;this.pan=pan;} }
export class Sprite {
 constructor(){this.x=0;this.y=0;this.scaleX=1;this.scaleY=1;this.rotation=0;this.visible=true;this.children=[];this.transform={colorTransform:new ColorTransform()};this.soundTransform=new SoundTransform();
  this.lines=[];let lineWidth=1,color=0,point=[0,0];
  this.graphics={clear:()=>{this.lines=[];},lineStyle:(w,c)=>{lineWidth=w||1;color=c;},moveTo:(x,y)=>{point=[x,y];},lineTo:(x,y)=>{this.lines.push({from:point,to:[x,y],lineWidth,color});point=[x,y];}};
 }
 get numChildren(){return this.children.length;}
 addChild(c){c.parent=this;this.children.push(c);return c;}
 removeChild(c){this.children=this.children.filter(child=>child!==c);c.parent=null;return c;}
}
export class MovieClip extends Sprite {
 constructor(name){super();this.assetName=name;this.assetId=art.symbols[name];this.currentFrame=1;this.playing=true;this.segment=null;this.age=0;
  return new Proxy(this,{get:(target,key,receiver)=>{
   if(Reflect.has(target,key))return Reflect.get(target,key,receiver);
   const list=art.sprites[target.assetId]?.frames[target.currentFrame-1];
   const named=list?.find(e=>e.name===key);
   return named?{x:named.matrix[4],y:named.matrix[5]}:undefined;
  }});
 }
 goto(frame,play){
  const data=art.sprites[this.assetId];
  if(typeof frame==='string'){
   if(!data){this.currentFrame=1;this.playing=false;return;}
   const index=data.labels[frame];if(index===undefined)throw Error(`Unknown animation ${this.assetName}:${frame}`);
   this.currentFrame=index+1;this.segment=frame;
  }else {this.currentFrame=Math.max(1,Math.min(data?.frames.length||1,Math.trunc(frame)));this.segment=null;this.age=0;}
  this.playing=play;this.applyFrame();
 }
 gotoAndStop(frame){this.goto(frame,false);}
 gotoAndPlay(frame){this.goto(frame,true);}
 applyFrame(depth=0){
  if(depth>8)throw Error('Animation control cycle');
  const d=art.sprites[this.assetId];if(!d)return;
  for(const event of d.audio?.[this.currentFrame-1]||[])soundSink(event.id,{...event,volume:this.soundTransform.volume});
  const control=d.controls?.[this.currentFrame-1];
  if(control?.unsupported)throw Error(`Unsupported frame control ${this.assetName}: ${control.unsupported}`);
  if(control?.visible!==undefined){this.visible=control.visible;if(!this.visible)this.parent?.removeChild(this);}
  if(control?.stop)this.playing=false;
  if(control?.goto!==undefined){
   this.currentFrame=typeof control.goto==='string'?d.labels[control.goto]+1:control.goto;
   this.playing=control.play;this.applyFrame(depth+1);
  }
 }
 advance(){
  this.age++;
  if(!this.playing)return;
  const d=art.sprites[this.assetId];if(!d)return;
  this.currentFrame=this.currentFrame%d.frames.length+1;this.applyFrame();
 }
}
