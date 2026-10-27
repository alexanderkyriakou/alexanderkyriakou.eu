export class Clock {
 constructor(step,onPause){this.step=step;this.onPause=onPause;this.previous=null;this.accumulator=0;this.running=false;this.tickMs=1000/60;}
 resume(){this.running=true;this.previous=null;this.accumulator=0;}
 pause(reason){this.running=false;this.previous=null;this.accumulator=0;this.onPause?.(reason);}
 frame(now){
  if(!this.running)return;
  if(this.previous===null){this.previous=now;return;}
  const elapsed=now-this.previous;this.previous=now;
  if(elapsed>250||elapsed<0){this.pause('Paused after a browser stall. Press P to resume.');return;}
  this.accumulator+=elapsed;
  while(this.accumulator+1e-7>=this.tickMs&&this.running){this.accumulator-=this.tickMs;this.step();}
 }
}
