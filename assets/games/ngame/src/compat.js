// Small native data/API adapters for translated source. No Flash VM or plugin.
export const int = value => Number(value) | 0;
export const uint = value => Number(value) >>> 0;
export const asVector = (length = 0, value = null) => Array.from({length}, () => value);
export const diagnostics = new Map();
export const trace = (...args) => {const message=args.join(' ');diagnostics.set(message,(diagnostics.get(message)||0)+1);};
let remaining=1_000_000;
export const resetGuard=()=>{remaining=1_000_000;};
export const guard=()=>{if(--remaining<0)throw Error('Simulation iteration budget exceeded; report this level and tick.');};
export class ByteArray {
  constructor(bytes = []) { this.data = Array.from(bytes); this.position = 0; }
  get length() { return this.data.length; }
  set length(value) {
    if (!Number.isSafeInteger(value) || value < 0 || value > 16_777_216) throw Error('Invalid byte array length');
    const old = this.data.length; this.data.length = value;
    if (value > old) this.data.fill(0, old);
  }
  get bytesAvailable() { return this.length - this.position; }
  readUnsignedByte() { if(this.position < 0 || this.position >= this.length) throw Error('Unexpected end of byte data'); return this.data[this.position++]; }
  readByte() { const x=this.readUnsignedByte(); return x>127?x-256:x; }
  readShort() { const x=this.readUnsignedByte()*256+this.readUnsignedByte(); return x>32767?x-65536:x; }
  readInt() { return (this.readUnsignedByte()*16777216+this.readUnsignedByte()*65536+this.readUnsignedByte()*256+this.readUnsignedByte())|0; }
  writeByte(value) { if(this.position>=this.length)this.length=this.position+1; this.data[this.position++]=value&255; }
  writeShort(value) { this.writeByte(value>>8); this.writeByte(value); }
  writeInt(value) { this.writeByte(value>>24); this.writeByte(value>>16);this.writeByte(value>>8);this.writeByte(value); }
  readBytes(target, offset=0, length=this.bytesAvailable) { const old=target.position;target.position=offset;for(let i=0;i<length;i++)target.writeByte(this.readUnsignedByte());target.position=old; }
  writeBytes(source, offset=0, length=source.length-offset) { for(let i=offset;i<offset+length;i++)this.writeByte(source.data[i]); }
}
// Interface marker; particles use translated ParticleManager_Classic.
export class ParticleManager {}
import {playSound} from './display.js';
export class SoundManager {
 constructor(){this.goldTriggered=false;this.ragdoll=new MovieClip('asset_sfx_ragdollMC');}
 Tick(){this.goldTriggered=false;this.ragdoll.advance();}
 PlaySound_Gold(){if(!this.goldTriggered){playSound(524,{volume:.25});this.goldTriggered=true;}}
 PlaySound_Ragdoll(label){this.ragdoll.gotoAndPlay(label);}
}

export {MovieClip, Sprite, ColorTransform, SoundTransform} from "./display.js";
import {MovieClip} from "./display.js";
export class asset_gfx_bounceblock extends MovieClip { constructor() { super("asset_gfx_bounceblock"); } }
export class asset_gfx_door_locked extends MovieClip { constructor() { super("asset_gfx_door_locked"); } }
export class asset_gfx_door_locked_switch extends MovieClip { constructor() { super("asset_gfx_door_locked_switch"); } }
export class asset_gfx_door_regular extends MovieClip { constructor() { super("asset_gfx_door_regular"); } }
export class asset_gfx_door_trap extends MovieClip { constructor() { super("asset_gfx_door_trap"); } }
export class asset_gfx_door_trap_switch extends MovieClip { constructor() { super("asset_gfx_door_trap_switch"); } }
export class asset_gfx_drone_chaingun extends MovieClip { constructor() { super("asset_gfx_drone_chaingun"); } }
export class asset_gfx_drone_chaingun_eye extends MovieClip { constructor() { super("asset_gfx_drone_chaingun_eye"); } }
export class asset_gfx_drone_chaser extends MovieClip { constructor() { super("asset_gfx_drone_chaser"); } }
export class asset_gfx_drone_eye extends MovieClip { constructor() { super("asset_gfx_drone_eye"); } }
export class asset_gfx_drone_laser extends MovieClip { constructor() { super("asset_gfx_drone_laser"); } }
export class asset_gfx_drone_zap extends MovieClip { constructor() { super("asset_gfx_drone_zap"); } }
export class asset_gfx_exitdoor extends MovieClip { constructor() { super("asset_gfx_exitdoor"); } }
export class asset_gfx_exitswitch extends MovieClip { constructor() { super("asset_gfx_exitswitch"); } }
export class asset_gfx_floorguard extends MovieClip { constructor() { super("asset_gfx_floorguard"); } }
export class asset_gfx_gold extends MovieClip { constructor() { super("asset_gfx_gold"); } }
export class asset_gfx_laser_blast extends MovieClip { constructor() { super("asset_gfx_laser_blast"); } }
export class asset_gfx_launchpad extends MovieClip { constructor() { super("asset_gfx_launchpad"); } }
export class asset_gfx_mine extends MovieClip { constructor() { super("asset_gfx_mine"); } }
export class asset_gfx_ninja extends MovieClip { constructor() { super("asset_gfx_ninja"); } }
export class asset_gfx_oneway extends MovieClip { constructor() { super("asset_gfx_oneway"); } }
export class asset_gfx_ragdoll_arm extends MovieClip { constructor() { super("asset_gfx_ragdoll_arm"); } }
export class asset_gfx_ragdoll_body extends MovieClip { constructor() { super("asset_gfx_ragdoll_body"); } }
export class asset_gfx_ragdoll_leg extends MovieClip { constructor() { super("asset_gfx_ragdoll_leg"); } }
export class asset_gfx_rocket extends MovieClip { constructor() { super("asset_gfx_rocket"); } }
export class asset_gfx_rocket_base extends MovieClip { constructor() { super("asset_gfx_rocket_base"); } }
export class asset_gfx_thwomp extends MovieClip { constructor() { super("asset_gfx_thwomp"); } }
export class asset_gfx_turret extends MovieClip { constructor() { super("asset_gfx_turret"); } }
export class asset_gfx_turret_crosshair extends MovieClip { constructor() { super("asset_gfx_turret_crosshair"); } }
export class asset_sfx_playerLoopMC extends MovieClip { constructor() { super("asset_sfx_playerLoopMC"); } }
export class asset_sfx_playerMC extends MovieClip { constructor() { super("asset_sfx_playerMC"); } }
export class asset_gfx_fx_blood0 extends MovieClip {constructor(){super("asset_gfx_fx_blood0");}}
export class asset_gfx_fx_blood1 extends MovieClip {constructor(){super("asset_gfx_fx_blood1");}}
export class asset_gfx_fx_chain_bullet extends MovieClip {constructor(){super("asset_gfx_fx_chain_bullet");}}
export class asset_gfx_fx_chain_debris0 extends MovieClip {constructor(){super("asset_gfx_fx_chain_debris0");}}
export class asset_gfx_fx_chain_debris1 extends MovieClip {constructor(){super("asset_gfx_fx_chain_debris1");}}
export class asset_gfx_fx_chain_debris2 extends MovieClip {constructor(){super("asset_gfx_fx_chain_debris2");}}
export class asset_gfx_fx_chain_flash0 extends MovieClip {constructor(){super("asset_gfx_fx_chain_flash0");}}
export class asset_gfx_fx_chain_flash1 extends MovieClip {constructor(){super("asset_gfx_fx_chain_flash1");}}
export class asset_gfx_fx_dust0 extends MovieClip {constructor(){super("asset_gfx_fx_dust0");}}
export class asset_gfx_fx_dust1 extends MovieClip {constructor(){super("asset_gfx_fx_dust1");}}
export class asset_gfx_fx_fireball0 extends MovieClip {constructor(){super("asset_gfx_fx_fireball0");}}
export class asset_gfx_fx_fireball1 extends MovieClip {constructor(){super("asset_gfx_fx_fireball1");}}
export class asset_gfx_fx_fireball2 extends MovieClip {constructor(){super("asset_gfx_fx_fireball2");}}
export class asset_gfx_fx_fireburst0 extends MovieClip {constructor(){super("asset_gfx_fx_fireburst0");}}
export class asset_gfx_fx_fireburst1 extends MovieClip {constructor(){super("asset_gfx_fx_fireburst1");}}
export class asset_gfx_fx_laser_charge0 extends MovieClip {constructor(){super("asset_gfx_fx_laser_charge0");}}
export class asset_gfx_fx_laser_charge1 extends MovieClip {constructor(){super("asset_gfx_fx_laser_charge1");}}
export class asset_gfx_fx_laser_charge2 extends MovieClip {constructor(){super("asset_gfx_fx_laser_charge2");}}
export class asset_gfx_fx_laser_spark0 extends MovieClip {constructor(){super("asset_gfx_fx_laser_spark0");}}
export class asset_gfx_fx_laser_spark1 extends MovieClip {constructor(){super("asset_gfx_fx_laser_spark1");}}
export class asset_gfx_fx_laser_spark2 extends MovieClip {constructor(){super("asset_gfx_fx_laser_spark2");}}
export class asset_gfx_fx_rocket_smoke0 extends MovieClip {constructor(){super("asset_gfx_fx_rocket_smoke0");}}
export class asset_gfx_fx_rocket_smoke1 extends MovieClip {constructor(){super("asset_gfx_fx_rocket_smoke1");}}
export class asset_gfx_fx_rocket_smoke2 extends MovieClip {constructor(){super("asset_gfx_fx_rocket_smoke2");}}
export class asset_gfx_fx_turret_bullet extends MovieClip {constructor(){super("asset_gfx_fx_turret_bullet");}}
export class asset_gfx_fx_turret_debris0 extends MovieClip {constructor(){super("asset_gfx_fx_turret_debris0");}}
export class asset_gfx_fx_zap0 extends MovieClip {constructor(){super("asset_gfx_fx_zap0");}}
export class asset_gfx_fx_zap1 extends MovieClip {constructor(){super("asset_gfx_fx_zap1");}}
export class asset_gfx_fx_zap2 extends MovieClip {constructor(){super("asset_gfx_fx_zap2");}}
export class asset_gfx_fx_zapv0 extends MovieClip {constructor(){super("asset_gfx_fx_zapv0");}}
export class asset_gfx_fx_zapv1 extends MovieClip {constructor(){super("asset_gfx_fx_zapv1");}}
export class asset_gfx_fx_zapv2 extends MovieClip {constructor(){super("asset_gfx_fx_zapv2");}}
