import {sim_loader, sim_globals, ParticleManager_Classic} from './generated/engine.js';
import {SoundManager, resetGuard, Sprite} from './compat.js';

export class Session {
  constructor(level, {startingTicks=5400, scoreImmediately=true}={}) {
    resetGuard();
    this.level=level; this.tick=0; this.time=startingTicks;this.startingTicks=startingTicks;this.gold=0;this.scoreImmediately=scoreImmediately;this.won=false;this.dead=false;this.postGameTicks=0;this.inputs=[];
    this.buttons={jump:false,left:false,right:false};
    const keys={IsKeyDown:code=>code===90?this.buttons.jump:code===37?this.buttons.left:code===39?this.buttons.right:false};
    this.sim=sim_loader.LoadLevel_EditorState([90,37,39],[0],keys,null,1,{tileIDs:level.tiles,entities:level.entities});
    this.particleBack=new Sprite();this.particleFront=new Sprite();const particles=new ParticleManager_Classic(this.particleBack,this.particleFront);
    this.sound=new SoundManager();this.sim.HACKY_SetAV({GetParticleManager:()=>particles},this.sound);
    this.player=this.sim.playerList[0];
    this.graphics=[];this.display=[];
    for(const entity of this.sim.GFX_GetEntityList()){
      const component=entity.GenerateGraphicComponent();if(component){this.graphics.push(component);component.RegisterGraphics(this.display);}
    }
    const playerGraphic=this.player.GenerateGraphicComponent();this.graphics.push(playerGraphic);playerGraphic.RegisterGraphics(this.display);
    this.updateGraphics();
    this.sim.App_EnableAllPlayers();this.updateGraphics();
  }
  updateGraphics(){for(const graphic of this.graphics)graphic.UpdateState();}
  step(buttons={}) {
    // App_MultiPurpose.tickPostGame keeps simulating after the result is latched:
    // celebration/ragdoll constraints and effects still need their normal ticks.
    const wasDone=this.won||this.dead;
    this.buttons={jump:!!buttons.jump,left:!!buttons.left,right:!!buttons.right};
    this.inputs.push((this.buttons.jump?1:0)|(this.buttons.left?2:0)|(this.buttons.right?4:0));
    resetGuard();this.sim.Tick(null);this.tick++;
    this.won=this.sim.APP_IsGameDone()&&this.sim.APP_DidPlayerWin();
    this.dead=this.player.IsDead();
    if(wasDone)this.postGameTicks++;
    this.updateGraphics();
    for(const b of[this.particleBack,this.particleFront])for(const d of [...b.children])d.advance();
    this.sound.Tick();this.player.ninja_gfx.sndMC.advance();this.player.ninja_gfx.sndLoopMC.advance();
    for(const display of this.display)display.advance?.();
    if(!this.sim.APP_IsGameDone()){
      this.time=Math.max(0,this.time-1);
      if(this.time===0)this.sim.APP_Event_TimeUp();
      else {const gold=this.sim.APP_GetNumGoldCollectedDuringTick(0);this.gold+=gold;if(this.scoreImmediately)this.time+=gold*120;}
    }
  }
  suicide() { this.sim.APP_Event_Suicide(0); }
  get score() { return this.time+(this.scoreImmediately?0:this.gold*2*sim_globals.sim_rate); }
  snapshot() {
    const p=this.player;
    return {tick:this.tick,position:{x:p.pos.x,y:p.pos.y},velocity:{x:p.vel.x,y:p.vel.y},state:p.curState,postGameTicks:this.postGameTicks,inAir:p.IN_AIR,nearWall:p.NEAR_WALL,floorNormal:{x:p.floorN.x,y:p.floorN.y},wallNormal:{x:p.wallN.x,y:p.wallN.y},time:this.time,gold:this.gold,won:this.won,dead:this.dead,
      entities:this.sim.GFX_GetEntityList().map(e=>({id:e.GetUID(),type:e.constructor.name,scalars:Object.fromEntries(Object.entries(e).filter(([k,v])=>typeof v==='number'||typeof v==='boolean')),vectors:Object.fromEntries(Object.entries(e).filter(([k,v])=>v&&typeof v.x==='number'&&typeof v.y==='number').map(([k,v])=>[k,{x:v.x,y:v.y}]))}))};
  }
}
