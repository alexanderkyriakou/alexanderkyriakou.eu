import {setSoundSink} from './display.js';
export class AudioPlayer {
 constructor(){this.volume=.3;this.enabled=false;this.active=new Map();this.failures=0;setSoundSink((id,event={})=>this.play(id,event));}
 enable(){this.enabled=true;}
 stop(){for(const voices of this.active.values())for(const a of voices)a.pause();this.active.clear();}
 play(id,{stop=false,volume=1,noMultiple=false}={}){
  // This browser edition intentionally plays only the gold pickup sound.
  if(Number(id)!==524||!this.enabled||this.volume===0)return;
  const old=this.active.get(id)||[];
  if(stop){for(const a of old)a.pause();this.active.delete(id);return;}
  if(noMultiple&&old.some(a=>!a.paused&&!a.ended))return;
  const audio=new Audio(new URL(`../assets/audio/${id}.mp3`,import.meta.url));audio.volume=Math.min(1,Math.max(0,volume*this.volume));
  const alive=old.filter(a=>!a.ended&&!a.paused);if(alive.length>=4)alive.shift().pause();alive.push(audio);this.active.set(id,alive);
  audio.play().catch(()=>{this.failures++;});
 }
}
