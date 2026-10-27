// Generated from vendor/actionscript by tools/translate.py. Do not edit.
import { asVector, int, uint, ByteArray, trace, guard, SoundManager, ParticleManager, asset_gfx_fx_blood0, asset_gfx_fx_blood1, asset_gfx_fx_chain_bullet, asset_gfx_fx_chain_debris0, asset_gfx_fx_chain_debris1, asset_gfx_fx_chain_debris2, asset_gfx_fx_chain_flash0, asset_gfx_fx_chain_flash1, asset_gfx_fx_dust0, asset_gfx_fx_dust1, asset_gfx_fx_fireball0, asset_gfx_fx_fireball1, asset_gfx_fx_fireball2, asset_gfx_fx_fireburst0, asset_gfx_fx_fireburst1, asset_gfx_fx_laser_charge0, asset_gfx_fx_laser_charge1, asset_gfx_fx_laser_charge2, asset_gfx_fx_laser_spark0, asset_gfx_fx_laser_spark1, asset_gfx_fx_laser_spark2, asset_gfx_fx_rocket_smoke0, asset_gfx_fx_rocket_smoke1, asset_gfx_fx_rocket_smoke2, asset_gfx_fx_turret_bullet, asset_gfx_fx_turret_debris0, asset_gfx_fx_zap0, asset_gfx_fx_zap1, asset_gfx_fx_zap2, asset_gfx_fx_zapv0, asset_gfx_fx_zapv1, asset_gfx_fx_zapv2, MovieClip, Sprite, ColorTransform, SoundTransform, asset_gfx_bounceblock, asset_gfx_door_locked, asset_gfx_door_locked_switch, asset_gfx_door_regular, asset_gfx_door_trap, asset_gfx_door_trap_switch, asset_gfx_drone_chaingun, asset_gfx_drone_chaingun_eye, asset_gfx_drone_chaser, asset_gfx_drone_eye, asset_gfx_drone_laser, asset_gfx_drone_zap, asset_gfx_exitdoor, asset_gfx_exitswitch, asset_gfx_floorguard, asset_gfx_gold, asset_gfx_laser_blast, asset_gfx_launchpad, asset_gfx_mine, asset_gfx_ninja, asset_gfx_oneway, asset_gfx_ragdoll_arm, asset_gfx_ragdoll_body, asset_gfx_ragdoll_leg, asset_gfx_rocket, asset_gfx_rocket_base, asset_gfx_thwomp, asset_gfx_turret, asset_gfx_turret_crosshair, asset_sfx_playerLoopMC, asset_sfx_playerMC } from "../compat.js";
export class ParticleManager_Classic {
    static MAX_PARTICLE_SCALE = NaN;
    static FXTYPE_SKIDDUST = int(0);
    static FXTYPE_JUMPDUST = int(0);
    static FXTYPE_BLOODSPURT = int(0);
    static FXTYPE_RAGDUST = int(0);
    static FXTYPE_CHAINBULLET = int(0);
    static FXTYPE_CHAINDEBRIS = int(0);
    static FXTYPE_CHAINFLASH = int(0);
    static FXTYPE_LASERSPARK = int(0);
    static FXTYPE_LASERCHARGE = int(0);
    static FXTYPE_ZAP = int(0);
    static FXTYPE_ZAPV = int(0);
    static FXTYPE_TURRETBULLET = int(0);
    static FXTYPE_TURRETDEBRIS = int(0);
    static FXTYPE_FIREBURST = int(0);
    static FXTYPE_FIREBALL = int(0);
    static FXTYPE_ROCKETSMOKE = int(0);
    static NUM_FXTYPES = int(0);
    static BUFFER_BACK = int(0);
    static BUFFER_FRONT = int(0);
    static MAX_PARTICLES = int(0);
    static mcList = null;
    static bufferList = null;
    buffers = null;
    constructor(param1, param2) {
        this.buffers = asVector(2, null);
        this.buffers[ParticleManager_Classic.BUFFER_BACK] = param1;
        this.buffers[ParticleManager_Classic.BUFFER_FRONT] = param2;
    }
    DEBUG_GetChildCount() {
        return int(this.buffers[ParticleManager_Classic.BUFFER_BACK].numChildren + this.buffers[ParticleManager_Classic.BUFFER_FRONT].numChildren);
    }
    SpawnParticle_Random(param1, param2) {
        param1 = int(param1);
        if (Math.random() <= param2) {
            return this.SpawnParticle(param1);
        }
        return null;
    }
    SpawnParticle(param1) {
        param1 = int(param1);
        var _loc2_ = new ParticleManager_Classic.mcList[param1][Math.floor(Math.random() * ParticleManager_Classic.mcList[param1].length)]();
        this.buffers[ParticleManager_Classic.bufferList[param1]].addChild(_loc2_);
        return _loc2_;
    }
    SpawnParticle_Limit(param1) {
        param1 = int(param1);
        if (this.buffers[ParticleManager_Classic.bufferList[param1]].numChildren < ParticleManager_Classic.MAX_PARTICLES) {
            return this.SpawnParticle(param1);
        }
        return null;
    }
    Spawn_FloorDust(param1, param2, param3, param4, param5, param6) {
        var _loc7_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_SKIDDUST, 0.2);
        if (_loc7_ != null) {
            _loc7_.x = param1.x - param3.x * param2;
            _loc7_.y = param1.y - param3.y * param2;
            _loc7_.rotation = param4 - param5 * 8 + (Math.random() * 10 - 5);
            _loc7_.scaleX = Math.min(64, param5 * Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, 10 + param6 * 10) / 100);
            _loc7_.scaleY = 10 / 100;
        }
    }
    Spawn_WallDust(param1, param2, param3, param4) {
        var _loc5_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_SKIDDUST, 0.3);
        if (_loc5_ != null) {
            _loc5_.x = param1.x - param3.x * param2;
            _loc5_.y = param1.y - param3.y * param2 - (Math.random() * param2 * 2 - param2);
            _loc5_.rotation = 90 - param3.x * 8 + (Math.random() * 10 - 5);
            _loc5_.scaleX = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, 10 + param4 * 20) / 100;
            _loc5_.scaleY = 10 / 100;
        }
    }
    Spawn_JumpDust(param1, param2, param3) {
        var _loc6_ = null;
        var _loc4_ = int(1);
        var _loc5_ = int(0);
        while (_loc5_ <= 4) {
            guard();
            _loc6_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_JUMPDUST);
            _loc6_.x = param1;
            _loc6_.y = param2;
            _loc6_.rotation = param3 - _loc4_ * 20 + (Math.random() * 20 - 10);
            _loc6_.scaleX = _loc4_ * (10 + Math.random() * 8) / 100;
            _loc6_.scaleY = (10 + Math.random() * 5) / 100;
            _loc4_ = int(_loc4_ * -1);
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
    }
    Spawn_LandDust(param1, param2, param3, param4) {
        var _loc7_ = null;
        var _loc5_ = int(1);
        var _loc6_ = int(0);
        while (_loc6_ <= 4) {
            guard();
            _loc7_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_JUMPDUST);
            _loc7_.x = param1;
            _loc7_.y = param2;
            _loc7_.rotation = param3 - _loc5_ * 40 + (Math.random() * 20 - 10);
            _loc7_.scaleX = _loc5_ * (5 + Math.random() * 5 + param4) / 100;
            _loc7_.scaleY = (15 + param4 * 2) / 100;
            _loc5_ = int(_loc5_ * -1);
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
    }
    Spawn_BloodSpurt(param1, param2, param3, param4, param5) {
        param5 = int(param5);
        var _loc7_ = null;
        var _loc6_ = int(0);
        while (_loc6_ <= param5) {
            guard();
            _loc7_ = this.SpawnParticle_Limit(ParticleManager_Classic.FXTYPE_BLOODSPURT);
            if (_loc7_ != null) {
                _loc7_.x = param1 - (Math.random() * 8 - 4);
                _loc7_.y = param2 - (Math.random() * 8 - 4);
                _loc7_.scaleX = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, Math.max(-ParticleManager_Classic.MAX_PARTICLE_SCALE, param3 * (6 + Math.random() * 3) - (Math.random() * 60 - 30))) / 100;
                _loc7_.scaleY = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, Math.max(-ParticleManager_Classic.MAX_PARTICLE_SCALE, param4 * (6 + Math.random() * 3) - (Math.random() * 60 - 30))) / 100;
            }
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
    }
    Spawn_RagBloodSpurt(param1, param2, param3, param4) {
        var _loc5_ = this.SpawnParticle_Limit(ParticleManager_Classic.FXTYPE_BLOODSPURT);
        if (_loc5_ != null) {
            _loc5_.x = param1 - (Math.random() * 8 - 4);
            _loc5_.y = param2 - (Math.random() * 8 - 4);
            _loc5_.scaleX = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, Math.max(-ParticleManager_Classic.MAX_PARTICLE_SCALE, param3 * (6 + Math.random() * 3) - (Math.random() * 40 - 20))) / 100;
            _loc5_.scaleY = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, Math.max(-ParticleManager_Classic.MAX_PARTICLE_SCALE, param4 * (6 + Math.random() * 3) - (Math.random() * 40 - 20))) / 100;
        }
    }
    Spawn_RagDust(param1, param2, param3, param4, param5) {
        var _loc6_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_RAGDUST, 0.2);
        if (_loc6_ != null) {
            param3 /= param5;
            param4 /= param5;
            _loc6_.x = param1.x - param3 * param2;
            _loc6_.y = param1.y - param4 * param2;
            _loc6_.rotation = Math.atan2(param4, param3) / Math.PI * 180 + (Math.random() * 20 - 10);
            _loc6_.scaleX = Math.min(ParticleManager_Classic.MAX_PARTICLE_SCALE, 20 + 2 * param5) / 100;
            _loc6_.scaleY = 10 / 100;
        }
    }
    Spawn_RocketSmoke(param1, param2) {
        var _loc3_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_ROCKETSMOKE, 0.2);
        if (_loc3_ != null) {
            _loc3_.x = param1.x;
            _loc3_.y = param1.y;
            _loc3_.rotation = param2 + 10 * (Math.random() * 2 - 1);
            _loc3_.scaleX = (20 + Math.random() * 20) / 100;
            _loc3_.scaleY = (20 + Math.random() * 20) / 100;
        }
    }
    Spawn_Explosion(param1) {
        var _loc2_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_FIREBURST);
        var _loc3_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_FIREBALL);
        var _loc4_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_FIREBALL);
        var _loc5_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_FIREBALL);
        var _loc6_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_FIREBALL);
        _loc2_.x = _loc3_.x = _loc4_.x = _loc5_.x = _loc6_.x = param1.x;
        _loc2_.y = _loc3_.y = _loc4_.y = _loc5_.y = _loc6_.y = param1.y;
        var _loc7_ = Math.random();
        var _loc8_ = Math.random();
        var _loc9_ = Math.random();
        var _loc10_ = Math.random();
        var _loc11_ = Math.random();
        _loc2_.scaleX = (15 + _loc7_ * 15) / 100;
        _loc2_.scaleY = (15 + _loc8_ * 15) / 100;
        _loc3_.scaleX = _loc4_.scaleX = (20 + _loc9_ * 20) / 100;
        _loc5_.scaleX = _loc6_.scaleX = (20 + _loc10_ * 30) / 100;
        _loc3_.scaleY = _loc6_.scaleY = (20 + _loc11_ * 20) / 100;
        _loc4_.scaleY = _loc5_.scaleY = (20 + _loc7_ * 10) / 100;
        _loc3_.rotation = 360 * _loc7_;
        _loc4_.rotation = 360 * _loc8_;
        _loc5_.rotation = 360 * _loc11_;
        _loc6_.rotation = 360 * _loc9_;
    }
    Spawn_TurretBullet(param1, param2) {
        var _loc3_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_TURRETBULLET);
        _loc3_.x = param1.x;
        _loc3_.y = param1.y;
        _loc3_.scaleX = (param2.x - param1.x) / 100;
        _loc3_.scaleY = (param2.y - param1.y) / 100;
        var _loc4_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_TURRETDEBRIS);
        var _loc5_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_TURRETDEBRIS);
        _loc4_.x = _loc5_.x = param2.x;
        _loc4_.y = _loc5_.y = param2.y;
        _loc4_.scaleX = _loc5_.scaleY = (40 + Math.random() * 20) / 100;
        _loc5_.scaleX = _loc4_.scaleY = (20 + Math.random() * 40) / 100;
        var _loc6_ = Math.atan2(param1.y - param2.y, param1.x - param2.x) / Math.PI * 180;
        _loc4_.rotation = _loc6_ + (5 + Math.random() * 15);
        _loc5_.rotation = _loc6_ - (5 + Math.random() * 15);
    }
    Spawn_LaserSpark(param1, param2, param3) {
        var _loc4_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_LASERSPARK, 0.75);
        if (_loc4_ != null) {
            _loc4_.x = param1.x;
            _loc4_.y = param1.y;
            _loc4_.scaleX = -param2 * (30 + 40 * (Math.random() * 2 - 1)) / 100;
            _loc4_.scaleY = -param3 * (30 + 40 * (Math.random() * 2 - 1)) / 100;
        }
    }
    Spawn_LaserCharge(param1) {
        var _loc2_ = this.SpawnParticle_Random(ParticleManager_Classic.FXTYPE_LASERCHARGE, 0.9);
        if (_loc2_ != null) {
            _loc2_.x = param1.x;
            _loc2_.y = param1.y;
            _loc2_.scaleX = (20 + Math.random() * 20) / 100;
            _loc2_.scaleY = (10 + Math.random() * 20) / 100;
            _loc2_.rotation = Math.random() * 360;
        }
    }
    Spawn_Zap(param1, param2, param3) {
        var _loc5_ = null;
        var _loc4_ = int(0);
        while (_loc4_ <= 4) {
            guard();
            _loc5_ = this.SpawnParticle_Limit(ParticleManager_Classic.FXTYPE_ZAP);
            if (_loc5_ != null) {
                _loc5_.x = param1;
                _loc5_.y = param2;
                _loc5_.scaleX = (30 + Math.random() * 30) / 100;
                _loc5_.scaleY = (30 + Math.random() * 20) / 100;
                _loc5_.rotation = param3 + 20 * (Math.random() * 2 - 1);
            }
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    Spawn_ZapThwompH(param1, param2, param3) {
        var _loc5_ = null;
        var _loc4_ = int(0);
        while (_loc4_ <= 4) {
            guard();
            _loc5_ = this.SpawnParticle_Limit(ParticleManager_Classic.FXTYPE_ZAP);
            if (_loc5_ != null) {
                _loc5_.x = param1.x + param2;
                _loc5_.y = param1.y - param3 + param3 * Math.random();
                _loc5_.scaleX = (4 * param2 + 20 * (Math.random() * 2 - 1)) / 100;
                _loc5_.scaleY = (60 + 60 * Math.random()) / 100;
            }
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    Spawn_ZapThwompV(param1, param2, param3) {
        var _loc5_ = null;
        var _loc4_ = int(0);
        while (_loc4_ <= 4) {
            guard();
            _loc5_ = this.SpawnParticle_Limit(ParticleManager_Classic.FXTYPE_ZAPV);
            if (_loc5_ != null) {
                _loc5_.y = param1.y + param3;
                _loc5_.x = param1.x - param2 + param2 * Math.random();
                _loc5_.scaleY = (4 * param3 + 20 * (Math.random() * 2 - 1)) / 100;
                _loc5_.scaleX = (60 + 60 * Math.random()) / 100;
            }
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    Spawn_ChainBullet(param1, param2) {
        var _loc3_ = Math.random() * 2 - 1;
        var _loc4_ = Math.random() * 2 - 1;
        var _loc5_ = Math.random() * 2 - 1;
        var _loc6_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_CHAINFLASH);
        var _loc7_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_CHAINBULLET);
        var _loc8_ = param1.To(param2);
        var _loc9_ = _loc8_.Len();
        var _loc10_ = Math.atan2(_loc8_.y, _loc8_.x) / Math.PI * 180;
        _loc7_.scaleX = _loc9_ / 100;
        _loc6_.x = _loc7_.x = param1.x;
        _loc6_.y = _loc7_.y = param1.y;
        _loc6_.scaleX = (30 + _loc3_ * 10) / 100;
        _loc6_.scaleY = (20 + _loc4_ * 20) / 100;
        _loc6_.rotation = _loc7_.rotation = _loc10_;
        var _loc11_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_CHAINDEBRIS);
        var _loc12_ = this.SpawnParticle(ParticleManager_Classic.FXTYPE_CHAINDEBRIS);
        _loc11_.x = _loc12_.x = param2.x;
        _loc11_.y = _loc12_.y = param2.y;
        _loc11_.scaleX = (30 + 15 * _loc4_) / 100;
        _loc12_.scaleX = (30 + 15 * _loc5_) / 100;
        _loc10_ -= 180;
        _loc11_.rotation = _loc10_ + 15 * _loc3_;
        _loc12_.rotation = _loc10_ + 15 * _loc4_;
    }
}
export class EntityGraphics_BounceBlock {
    mc = null;
    entity = null;
    pos = null;
    constructor(param1) {
        this.entity = param1;
        this.mc = new asset_gfx_bounceblock();
        this.mc.cacheAsBitmap = true;
        this.pos = new vec2();
    }
    RegisterGraphics(param1) {
        param1.push(this.mc);
    }
    UpdateState() {
        this.entity.GFX_UpdateState(this);
        this.mc.x = this.pos.x;
        this.mc.y = this.pos.y;
    }
}
export class EntityGraphics_Door_Locked {
    static ANIM_CLOSE = int(0);
    static ANIM_OPEN = int(0);
    mc_door = null;
    mc_switch = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3, param4, param5, param6) {
        this.entity = param1;
        this.mc_door = new asset_gfx_door_locked();
        this.mc_switch = new asset_gfx_door_locked_switch();
        this.mc_door.x = param2;
        this.mc_door.y = param3;
        this.mc_door.rotation = param4 / Math.PI * 180;
        this.mc_door.gotoAndStop("closed");
        this.mc_switch.x = param5;
        this.mc_switch.y = param6;
        this.mc_switch.gotoAndStop("closed");
        this.mc_switch.cacheAsBitmap = true;
        this.anim = int(EntityGraphics_Door_Locked.ANIM_CLOSE);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_door);
        param1.unshift(this.mc_switch);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Door_Locked.ANIM_OPEN) {
                this.mc_door.gotoAndPlay("open");
                this.mc_switch.gotoAndPlay("open");
            }
        }
    }
}
export class EntityGraphics_Door_Regular {
    static ANIM_CLOSE = int(0);
    static ANIM_OPEN = int(0);
    mc_door = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3, param4) {
        this.entity = param1;
        this.mc_door = new asset_gfx_door_regular();
        this.mc_door.x = param2;
        this.mc_door.y = param3;
        this.mc_door.rotation = param4 / Math.PI * 180;
        this.mc_door.gotoAndStop("closed");
        this.anim = int(EntityGraphics_Door_Regular.ANIM_CLOSE);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_door);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Door_Regular.ANIM_CLOSE) {
                this.mc_door.gotoAndPlay("close");
            }
            else if (this.anim == EntityGraphics_Door_Regular.ANIM_OPEN) {
                this.mc_door.gotoAndPlay("open");
            }
        }
    }
}
export class EntityGraphics_Door_Trap {
    static ANIM_CLOSE = int(0);
    static ANIM_OPEN = int(0);
    mc_door = null;
    mc_switch = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3, param4, param5, param6) {
        this.entity = param1;
        this.mc_door = new asset_gfx_door_trap();
        this.mc_switch = new asset_gfx_door_trap_switch();
        this.mc_door.x = param2;
        this.mc_door.y = param3;
        this.mc_door.rotation = param4 / Math.PI * 180;
        this.mc_door.gotoAndStop("opened");
        this.mc_switch.x = param5;
        this.mc_switch.y = param6;
        this.mc_switch.gotoAndStop("open");
        this.mc_switch.cacheAsBitmap = true;
        this.anim = int(EntityGraphics_Door_Trap.ANIM_OPEN);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_door);
        param1.unshift(this.mc_switch);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Door_Trap.ANIM_CLOSE) {
                this.mc_door.gotoAndPlay("close");
                this.mc_switch.gotoAndPlay("closed");
            }
        }
    }
}
export class EntityGraphics_Drone_Chaingun {
    static ANIM_MOVE = int(0);
    static ANIM_PREFIRE = int(0);
    static ANIM_FIRING = int(0);
    static ANIM_POSTFIRE = int(0);
    mc_body = null;
    mc_eye = null;
    entity = null;
    pos = null;
    orn = NaN;
    anim = int(0);
    constructor(param1) {
        this.entity = param1;
        this.mc_body = new asset_gfx_drone_chaingun();
        this.mc_eye = new asset_gfx_drone_chaingun_eye();
        this.mc_body.addChild(this.mc_eye);
        this.pos = new vec2();
        this.orn = 0;
        this.anim = int(EntityGraphics_Drone_Chaingun.ANIM_MOVE);
        this.mc_body.gotoAndStop("move");
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_body);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        this.mc_body.x = this.pos.x;
        this.mc_body.y = this.pos.y;
        this.mc_eye.rotation = this.orn / Math.PI * 180;
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Drone_Chaingun.ANIM_MOVE) {
                this.mc_body.gotoAndStop("move");
            }
            else if (this.anim == EntityGraphics_Drone_Chaingun.ANIM_PREFIRE) {
                this.mc_body.gotoAndPlay("prefire");
            }
            else if (this.anim == EntityGraphics_Drone_Chaingun.ANIM_POSTFIRE) {
                this.mc_body.gotoAndPlay("postfire");
            }
            else if (this.anim == EntityGraphics_Drone_Chaingun.ANIM_FIRING) {
                this.mc_body.gotoAndStop("fire");
            }
        }
    }
}
export class EntityGraphics_Drone_Chaser {
    static ANIM_IDLE = int(0);
    static ANIM_CHASE = int(0);
    mc_body = null;
    mc_eye = null;
    entity = null;
    pos = null;
    orn = NaN;
    anim = int(0);
    constructor(param1) {
        this.entity = param1;
        this.mc_body = new asset_gfx_drone_chaser();
        this.mc_eye = new asset_gfx_drone_eye();
        this.mc_body.cacheAsBitmap = true;
        this.pos = new vec2();
        this.orn = 0;
        this.anim = int(EntityGraphics_Drone_Chaser.ANIM_IDLE);
        this.mc_body.gotoAndStop("idle");
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_body);
        param1.push(this.mc_eye);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        this.mc_body.x = this.pos.x;
        this.mc_body.y = this.pos.y;
        this.mc_eye.x = this.pos.x;
        this.mc_eye.y = this.pos.y;
        this.mc_eye.rotation = this.orn / Math.PI * 180;
        if (this.anim == EntityGraphics_Drone_Chaser.ANIM_CHASE) {
            this.mc_body.gotoAndPlay("chase");
            this.anim = int(EntityGraphics_Drone_Chaser.ANIM_IDLE);
        }
        else if (this.anim == EntityGraphics_Drone_Chaser.ANIM_IDLE) {
            this.mc_body.gotoAndStop("idle");
        }
    }
}
export class EntityGraphics_Drone_Laser {
    static ANIM_MOVE = int(0);
    static ANIM_PREFIRE = int(0);
    static ANIM_FIRING = int(0);
    static ANIM_POSTFIRE = int(0);
    mc_body = null;
    mc_eye = null;
    mc_blast = null;
    mc_beam = null;
    entity = null;
    pos = null;
    orn = NaN;
    anim = int(0);
    blast_pos = null;
    blast_scale = NaN;
    constructor(param1) {
        this.entity = param1;
        this.mc_body = new asset_gfx_drone_laser();
        this.mc_eye = new asset_gfx_drone_eye();
        this.mc_blast = new asset_gfx_laser_blast();
        this.mc_beam = new Sprite();
        this.pos = new vec2();
        this.orn = 0;
        this.anim = int(EntityGraphics_Drone_Laser.ANIM_MOVE);
        this.mc_body.gotoAndStop("move");
        this.blast_pos = new vec2();
        this.blast_scale = 0;
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_beam);
        param1.push(this.mc_body);
        param1.push(this.mc_eye);
        param1.push(this.mc_blast);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        this.mc_body.x = this.pos.x;
        this.mc_body.y = this.pos.y;
        this.mc_eye.x = this.pos.x;
        this.mc_eye.y = this.pos.y;
        this.mc_eye.rotation = this.orn / Math.PI * 180;
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Drone_Laser.ANIM_MOVE) {
                this.mc_body.gotoAndStop("move");
            }
            else if (this.anim == EntityGraphics_Drone_Laser.ANIM_PREFIRE) {
                this.mc_body.gotoAndPlay("prefire");
                this.mc_beam.visible = true;
                this.mc_beam.graphics.clear();
                this.mc_beam.graphics.lineStyle(0, 13334137);
                this.mc_beam.graphics.moveTo(this.pos.x, this.pos.y);
                this.mc_beam.graphics.lineTo(this.blast_pos.x, this.blast_pos.y);
            }
            else if (this.anim == EntityGraphics_Drone_Laser.ANIM_POSTFIRE) {
                this.mc_body.gotoAndPlay("postfire");
                this.mc_beam.visible = false;
                this.mc_blast.visible = false;
                this.mc_blast.gotoAndStop(1);
            }
            else if (this.anim == EntityGraphics_Drone_Laser.ANIM_FIRING) {
                this.mc_body.gotoAndStop("firing");
                this.mc_beam.graphics.clear();
                this.mc_beam.graphics.lineStyle(3, 8921634);
                this.mc_beam.graphics.moveTo(this.pos.x, this.pos.y);
                this.mc_beam.graphics.lineTo(this.blast_pos.x, this.blast_pos.y);
                this.mc_blast.visible = true;
                this.mc_blast.gotoAndPlay(1);
                this.mc_blast.x = this.blast_pos.x;
                this.mc_blast.y = this.blast_pos.y;
                this.mc_blast.scaleX = this.mc_blast.scaleY = 0;
            }
        }
        if (this.anim == EntityGraphics_Drone_Laser.ANIM_FIRING) {
            this.mc_blast.scaleX = this.mc_blast.scaleY = this.blast_scale / 100;
        }
    }
}
export class EntityGraphics_Drone_Zap {
    mc_body = null;
    mc_eye = null;
    entity = null;
    pos = null;
    orn = NaN;
    constructor(param1) {
        this.entity = param1;
        this.mc_body = new asset_gfx_drone_zap();
        this.mc_eye = new asset_gfx_drone_eye();
        this.mc_body.cacheAsBitmap = true;
        this.pos = new vec2();
        this.orn = 0;
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_body);
        param1.push(this.mc_eye);
    }
    UpdateState() {
        this.entity.GFX_UpdateState(this);
        this.mc_body.x = this.pos.x;
        this.mc_body.y = this.pos.y;
        this.mc_eye.x = this.pos.x;
        this.mc_eye.y = this.pos.y;
        this.mc_eye.rotation = this.orn / Math.PI * 180;
    }
}
export class EntityGraphics_ExitDoor {
    static ANIM_CLOSED = int(0);
    static ANIM_OPEN = int(0);
    mc = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc = new asset_gfx_exitdoor();
        this.mc.x = param2;
        this.mc.y = param3;
        this.mc.gotoAndStop("closed");
        this.anim = int(EntityGraphics_ExitDoor.ANIM_CLOSED);
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_ExitDoor.ANIM_OPEN) {
                this.mc.gotoAndPlay("open");
            }
        }
    }
}
export class EntityGraphics_ExitSwitch {
    static ANIM_CLOSED = int(0);
    static ANIM_OPEN = int(0);
    mc = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc = new asset_gfx_exitswitch();
        this.mc.x = param2;
        this.mc.y = param3;
        this.mc.gotoAndStop("closed");
        this.anim = int(EntityGraphics_ExitSwitch.ANIM_CLOSED);
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_ExitSwitch.ANIM_OPEN) {
                this.mc.gotoAndStop("open");
            }
        }
    }
}
export class EntityGraphics_FloorGuard {
    static ANIM_IDLE = int(0);
    static ANIM_CHASE_L = int(0);
    static ANIM_CHASE_R = int(0);
    mc = null;
    entity = null;
    pos = null;
    anim = int(0);
    constructor(param1) {
        this.entity = param1;
        this.mc = new asset_gfx_floorguard();
        this.mc.cacheAsBitmap = true;
        this.pos = new vec2();
        this.anim = int(EntityGraphics_FloorGuard.ANIM_IDLE);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        this.mc.x = this.pos.x;
        this.mc.y = this.pos.y;
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_FloorGuard.ANIM_CHASE_L || this.anim == EntityGraphics_FloorGuard.ANIM_CHASE_R) {
                this.mc.gotoAndPlay("chase");
            }
            else if (this.anim == EntityGraphics_FloorGuard.ANIM_IDLE) {
                this.mc.gotoAndStop("idle");
            }
        }
    }
}
export class EntityGraphics_Gold {
    static ANIM_NOT_COLLECTED = int(0);
    static ANIM_COLLECTED = int(0);
    mc = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc = new asset_gfx_gold();
        this.mc.x = param2;
        this.mc.y = param3;
        this.mc.gotoAndStop("not_collected");
        this.mc.cacheAsBitmap = true;
        this.anim = int(EntityGraphics_Gold.ANIM_NOT_COLLECTED);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Gold.ANIM_COLLECTED) {
                this.mc.cacheAsBitmap = false;
                this.mc.gotoAndPlay("collected");
            }
        }
    }
}
export class EntityGraphics_Launchpad {
    static ANIM_IDLE = int(0);
    static ANIM_LAUNCH = int(0);
    mc = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3, param4) {
        this.entity = param1;
        this.mc = new asset_gfx_launchpad();
        this.mc.x = param2;
        this.mc.y = param3;
        this.mc.rotation = param4 / Math.PI * 180;
        this.mc.gotoAndStop("idle");
        this.mc.cacheAsBitmap = true;
        this.anim = int(EntityGraphics_Launchpad.ANIM_IDLE);
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Launchpad.ANIM_LAUNCH) {
                this.mc.gotoAndPlay("launch");
            }
        }
    }
}
export class EntityGraphics_Mine {
    static ANIM_UNEXPLODED = int(0);
    static ANIM_EXPLODED = int(0);
    mc = null;
    entity = null;
    anim = int(0);
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc = new asset_gfx_mine();
        this.mc.x = param2;
        this.mc.y = param3;
        this.mc.gotoAndStop("unexploded");
        this.mc.cacheAsBitmap = true;
        this.anim = int(EntityGraphics_Mine.ANIM_UNEXPLODED);
    }
    RegisterGraphics(param1) {
        param1.push(this.mc);
    }
    UpdateState() {
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim != _loc1_) {
            if (this.anim == EntityGraphics_Mine.ANIM_EXPLODED) {
                this.mc.cacheAsBitmap = false;
                this.mc.gotoAndPlay("exploded");
            }
        }
    }
}
export class EntityGraphics_Ninja {
    static ANIM_STANDING = int(0);
    static ANIM_RUNNING = int(0);
    static ANIM_SKIDDING = int(0);
    static ANIM_INAIR = int(0);
    static ANIM_WALLSLIDING = int(0);
    static ANIM_DEAD = int(0);
    static ANIM_CELEBRATING = int(0);
    static ANIM_OFF = int(0);
    static RAGDOLL_BODY = int(0);
    static RAGDOLL_ARM_R = int(0);
    static RAGDOLL_ARM_L = int(0);
    static RAGDOLL_LEG_R = int(0);
    static RAGDOLL_LEG_L = int(0);
    entity = null;
    sndLoopMC = null;
    sndMC = null;
    mc_sprite = null;
    ragdoll_mcList = null;
    ragdoll_posList = null;
    ragdoll_lenList = null;
    ragdoll_ornList = null;
    ragdoll_flipList = null;
    pos = null;
    vel = NaN;
    orn = NaN;
    anim = int(0);
    facing = int(0);
    run_anim_leftovers = NaN;
    scaling_factor = NaN;
    prev_frame = int(0);
    constructor(param1, param2) {
        param2 = uint(param2);
        this.sndLoopMC = new asset_sfx_playerLoopMC();
        this.sndMC = new asset_sfx_playerMC();
        this.entity = param1;
        this.mc_sprite = new asset_gfx_ninja();
        this.mc_sprite.gotoAndPlay("STAND");
        this.pos = new vec2();
        this.vel = 0;
        this.orn = 0;
        this.facing = int(1);
        this.anim = int(EntityGraphics_Ninja.ANIM_STANDING);
        this.run_anim_leftovers = 0;
        this.scaling_factor = 0.2;
        this.prev_frame = int(1);
        this.ragdoll_mcList = asVector(5, null);
        this.ragdoll_mcList[EntityGraphics_Ninja.RAGDOLL_BODY] = new asset_gfx_ragdoll_body();
        this.ragdoll_mcList[EntityGraphics_Ninja.RAGDOLL_ARM_R] = new asset_gfx_ragdoll_arm();
        this.ragdoll_mcList[EntityGraphics_Ninja.RAGDOLL_ARM_L] = new asset_gfx_ragdoll_arm();
        this.ragdoll_mcList[EntityGraphics_Ninja.RAGDOLL_LEG_R] = new asset_gfx_ragdoll_leg();
        this.ragdoll_mcList[EntityGraphics_Ninja.RAGDOLL_LEG_L] = new asset_gfx_ragdoll_leg();
        this.ragdoll_posList = asVector(5, null);
        this.ragdoll_posList[EntityGraphics_Ninja.RAGDOLL_BODY] = new vec2();
        this.ragdoll_posList[EntityGraphics_Ninja.RAGDOLL_ARM_R] = new vec2();
        this.ragdoll_posList[EntityGraphics_Ninja.RAGDOLL_ARM_L] = new vec2();
        this.ragdoll_posList[EntityGraphics_Ninja.RAGDOLL_LEG_R] = new vec2();
        this.ragdoll_posList[EntityGraphics_Ninja.RAGDOLL_LEG_L] = new vec2();
        this.ragdoll_lenList = asVector(5, 0);
        this.ragdoll_lenList[EntityGraphics_Ninja.RAGDOLL_BODY] = 0;
        this.ragdoll_lenList[EntityGraphics_Ninja.RAGDOLL_ARM_R] = 0;
        this.ragdoll_lenList[EntityGraphics_Ninja.RAGDOLL_ARM_L] = 0;
        this.ragdoll_lenList[EntityGraphics_Ninja.RAGDOLL_LEG_R] = 0;
        this.ragdoll_lenList[EntityGraphics_Ninja.RAGDOLL_LEG_L] = 0;
        this.ragdoll_ornList = asVector(5, 0);
        this.ragdoll_ornList[EntityGraphics_Ninja.RAGDOLL_BODY] = 0;
        this.ragdoll_ornList[EntityGraphics_Ninja.RAGDOLL_ARM_R] = 0;
        this.ragdoll_ornList[EntityGraphics_Ninja.RAGDOLL_ARM_L] = 0;
        this.ragdoll_ornList[EntityGraphics_Ninja.RAGDOLL_LEG_R] = 0;
        this.ragdoll_ornList[EntityGraphics_Ninja.RAGDOLL_LEG_L] = 0;
        this.ragdoll_flipList = asVector(5, 0);
        this.ragdoll_flipList[EntityGraphics_Ninja.RAGDOLL_BODY] = -1;
        this.ragdoll_flipList[EntityGraphics_Ninja.RAGDOLL_ARM_R] = 1;
        this.ragdoll_flipList[EntityGraphics_Ninja.RAGDOLL_ARM_L] = 1;
        this.ragdoll_flipList[EntityGraphics_Ninja.RAGDOLL_LEG_R] = -1;
        this.ragdoll_flipList[EntityGraphics_Ninja.RAGDOLL_LEG_L] = -1;
        var _loc3_ = new ColorTransform();
        _loc3_.color = param2;
        this.mc_sprite.transform.colorTransform = _loc3_;
        var _loc4_ = int(0);
        while (_loc4_ < this.ragdoll_mcList.length) {
            guard();
            this.ragdoll_mcList[_loc4_].transform.colorTransform = _loc3_;
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    HACKY_PlayOneshotSound(param1) {
        this.sndMC.gotoAndPlay(param1);
    }
    get hasValidPose() {
        if (!this.mc_sprite.shoulder) {
            return false;
        }
        if (!this.mc_sprite.pelvis) {
            return false;
        }
        if (!this.mc_sprite.handR) {
            return false;
        }
        if (!this.mc_sprite.handL) {
            return false;
        }
        if (!this.mc_sprite.footR) {
            return false;
        }
        if (!this.mc_sprite.footL) {
            return false;
        }
        return true;
    }
    NINJA_GetCurrentPose(param1, param2) {
        var _loc3_ = int(this.mc_sprite.currentFrame);
        param1[0] = new vec2(this.mc_sprite.shoulder.x, this.mc_sprite.shoulder.y);
        param1[1] = new vec2(this.mc_sprite.pelvis.x, this.mc_sprite.pelvis.y);
        param1[2] = new vec2(this.mc_sprite.handR.x, this.mc_sprite.handR.y);
        param1[3] = new vec2(this.mc_sprite.handL.x, this.mc_sprite.handL.y);
        param1[4] = new vec2(this.mc_sprite.footR.x, this.mc_sprite.footR.y);
        param1[5] = new vec2(this.mc_sprite.footL.x, this.mc_sprite.footL.y);
        this.mc_sprite.gotoAndStop(this.prev_frame);
        param2[0] = new vec2(param1[0].x - this.mc_sprite.shoulder.x, param1[0].y - this.mc_sprite.shoulder.y);
        param2[1] = new vec2(param1[1].x - this.mc_sprite.pelvis.x, param1[1].y - this.mc_sprite.pelvis.y);
        param2[2] = new vec2(param1[2].x - this.mc_sprite.handR.x, param1[2].y - this.mc_sprite.handR.y);
        param2[3] = new vec2(param1[3].x - this.mc_sprite.handL.x, param1[3].y - this.mc_sprite.handL.y);
        param2[4] = new vec2(param1[4].x - this.mc_sprite.footR.x, param1[4].y - this.mc_sprite.footR.y);
        param2[5] = new vec2(param1[5].x - this.mc_sprite.footL.x, param1[5].y - this.mc_sprite.footL.y);
        var _loc4_ = int(0);
        while (_loc4_ < 6) {
            guard();
            param1[_loc4_].Scale(this.scaling_factor);
            param2[_loc4_].Scale(this.scaling_factor);
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    RegisterGraphics(param1) {
        param1.push(this.mc_sprite);
        var _loc2_ = int(0);
        while (_loc2_ < this.ragdoll_mcList.length) {
            guard();
            param1.push(this.ragdoll_mcList[_loc2_]);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    Hide() {
        this.mc_sprite.visible = false;
        var _loc1_ = int(0);
        while (_loc1_ < this.ragdoll_mcList.length) {
            guard();
            this.ragdoll_mcList[_loc1_].visible = false;
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    UpdateState() {
        var _loc2_ = int(0);
        var _loc3_ = int(0);
        var _loc4_ = int(0);
        var _loc5_ = int(0);
        var _loc6_ = null;
        var _loc7_ = null;
        var _loc8_ = int(0);
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = int(0);
        var _loc13_ = NaN;
        var _loc14_ = int(0);
        var _loc15_ = int(0);
        var _loc16_ = NaN;
        var _loc17_ = int(0);
        var _loc18_ = NaN;
        var _loc19_ = int(0);
        var _loc20_ = int(0);
        var _loc1_ = int(this.anim);
        this.entity.GFX_UpdateState(this);
        if (this.anim == EntityGraphics_Ninja.ANIM_OFF) {
            this.mc_sprite.visible = false;
            _loc2_ = int(0);
            while (_loc2_ < this.ragdoll_mcList.length) {
                guard();
                this.ragdoll_mcList[_loc2_].visible = false;
                (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
            }
        }
        else if (this.anim == EntityGraphics_Ninja.ANIM_DEAD) {
            this.sndLoopMC.gotoAndPlay("wallslide_stop");
            this.sndLoopMC.gotoAndPlay("skid_stop");
            this.mc_sprite.visible = false;
            _loc3_ = int(0);
            while (_loc3_ < this.ragdoll_mcList.length) {
                guard();
                this.ragdoll_mcList[_loc3_].visible = true;
                this.ragdoll_mcList[_loc3_].x = this.ragdoll_posList[_loc3_].x;
                this.ragdoll_mcList[_loc3_].y = this.ragdoll_posList[_loc3_].y;
                this.ragdoll_mcList[_loc3_].scaleX = this.scaling_factor;
                this.ragdoll_mcList[_loc3_].scaleY = this.ragdoll_flipList[_loc3_] * this.facing * this.scaling_factor;
                this.ragdoll_mcList[_loc3_].rotation = this.ragdoll_ornList[_loc3_] / Math.PI * 180;
                this.ragdoll_mcList[_loc3_].gotoAndStop(1 + Math.floor(100 * this.ragdoll_lenList[_loc3_]));
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
        }
        else {
            this.prev_frame = int(this.mc_sprite.currentFrame);
            this.mc_sprite.visible = true;
            _loc4_ = int(0);
            while (_loc4_ < this.ragdoll_mcList.length) {
                guard();
                this.ragdoll_mcList[_loc4_].visible = false;
                (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
            }
            this.mc_sprite.x = this.pos.x;
            this.mc_sprite.y = this.pos.y;
            this.mc_sprite.scaleX = this.facing * this.scaling_factor;
            this.mc_sprite.scaleY = this.scaling_factor;
            this.mc_sprite.rotation = this.orn / Math.PI * 180;
            if (this.anim != _loc1_) {
                if (_loc1_ == EntityGraphics_Ninja.ANIM_WALLSLIDING) {
                    this.sndLoopMC.gotoAndPlay("wallslide_stop");
                }
                else if (_loc1_ == EntityGraphics_Ninja.ANIM_SKIDDING) {
                    this.sndLoopMC.gotoAndPlay("skid_stop");
                }
                if (this.anim == EntityGraphics_Ninja.ANIM_STANDING) {
                    this.mc_sprite.gotoAndPlay("STAND");
                }
                else if (this.anim == EntityGraphics_Ninja.ANIM_SKIDDING) {
                    this.mc_sprite.gotoAndStop("SKID");
                    this.sndLoopMC.soundTransform.volume = 0;
                    this.sndLoopMC.gotoAndPlay("skid_start");
                }
                else if (this.anim == EntityGraphics_Ninja.ANIM_WALLSLIDING) {
                    this.mc_sprite.gotoAndStop("WALLSLIDE");
                    this.sndLoopMC.soundTransform.volume = 0;
                    this.sndLoopMC.gotoAndPlay("wallslide_start");
                }
                else if (this.anim == EntityGraphics_Ninja.ANIM_RUNNING) {
                    this.mc_sprite.gotoAndStop("RUN");
                }
                else if (this.anim == EntityGraphics_Ninja.ANIM_CELEBRATING) {
                    _loc5_ = int(Math.floor(Math.random() * 999) % 9 + 1);
                    this.mc_sprite.gotoAndPlay("CELEBRATE_NEW" + _loc5_);
                }
            }
            if (this.anim == EntityGraphics_Ninja.ANIM_WALLSLIDING) {
                _loc6_ = new SoundTransform(Math.min(1, Math.abs(this.vel * 0.7)));
                this.sndLoopMC.soundTransform = _loc6_;
            }
            else if (this.anim == EntityGraphics_Ninja.ANIM_SKIDDING) {
                _loc7_ = new SoundTransform(Math.min(1, Math.abs(this.vel)));
                this.sndLoopMC.soundTransform = _loc7_;
            }
            if (this.anim == EntityGraphics_Ninja.ANIM_INAIR) {
                _loc8_ = int(94);
                _loc9_ = -1 * (40 / 60);
                _loc10_ = 2.5 * (40 / 60);
                _loc11_ = 0;
                if (this.vel < 0) {
                    if (this.vel < _loc9_) {
                        _loc11_ = -1;
                    }
                    else {
                        _loc11_ = -(this.vel / _loc9_);
                    }
                }
                else if (_loc10_ < this.vel) {
                    _loc11_ = 1;
                }
                else {
                    _loc11_ = Math.sqrt(this.vel / _loc10_);
                }
                _loc12_ = int(Math.floor(_loc11_ * 9));
                this.mc_sprite.gotoAndStop(_loc8_ + _loc12_);
            }
            else if (this.anim == EntityGraphics_Ninja.ANIM_RUNNING) {
                _loc13_ = this.vel;
                _loc14_ = int(13);
                _loc15_ = int(72);
                _loc16_ = 0.9;
                _loc17_ = int(this.mc_sprite.currentFrame - _loc14_);
                _loc18_ = _loc13_ / _loc16_;
                _loc18_ = _loc18_ + this.run_anim_leftovers;
                _loc19_ = int(Math.floor(_loc18_));
                this.run_anim_leftovers = _loc18_ - _loc19_;
                _loc20_ = int((_loc17_ + _loc19_) % _loc15_);
                this.mc_sprite.gotoAndStop(_loc14_ + _loc20_);
            }
        }
    }
}
export class EntityGraphics_OnewayPlatform {
    mc = null;
    constructor(param1, param2, param3) {
        this.mc = new asset_gfx_oneway();
        this.mc.x = param1;
        this.mc.y = param2;
        this.mc.rotation = param3 / Math.PI * 180;
        this.mc.cacheAsBitmap = true;
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc);
    }
    UpdateState() {
    }
}
export class EntityGraphics_Rocket {
    static ANIM_IDLE = int(0);
    static ANIM_FIRE = int(0);
    static ANIM_EXPLODE = int(0);
    mc_base = null;
    mc_rocket = null;
    entity = null;
    anim_base = int(0);
    pos_rocket = null;
    orn_rocket = NaN;
    is_rocket_active = false;
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc_base = new asset_gfx_rocket_base();
        this.mc_base.x = param2;
        this.mc_base.y = param3;
        this.mc_base.gotoAndStop("idle");
        this.anim_base = int(EntityGraphics_Rocket.ANIM_IDLE);
        this.mc_base.cacheAsBitmap = true;
        this.mc_rocket = new asset_gfx_rocket();
        this.mc_rocket.visible = false;
        this.pos_rocket = new vec2();
        this.orn_rocket = 0;
        this.is_rocket_active = false;
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc_base);
        param1.push(this.mc_rocket);
    }
    UpdateState() {
        var _loc1_ = int(this.anim_base);
        this.entity.GFX_UpdateState(this);
        if (this.anim_base != _loc1_) {
            if (this.anim_base == EntityGraphics_Rocket.ANIM_IDLE) {
                this.mc_base.gotoAndStop("idle");
            }
            else if (this.anim_base == EntityGraphics_Rocket.ANIM_FIRE) {
                this.mc_base.gotoAndPlay("fire");
            }
            else if (this.anim_base == EntityGraphics_Rocket.ANIM_EXPLODE) {
                this.mc_base.gotoAndPlay("explode");
            }
        }
        if (this.is_rocket_active) {
            this.mc_rocket.visible = true;
            this.mc_rocket.x = this.pos_rocket.x;
            this.mc_rocket.y = this.pos_rocket.y;
            this.mc_rocket.rotation = this.orn_rocket / Math.PI * 180;
        }
        else {
            this.mc_rocket.visible = false;
        }
    }
}
export class EntityGraphics_Thwomp {
    mc = null;
    entity = null;
    pos = null;
    constructor(param1, param2) {
        this.entity = param1;
        this.mc = new asset_gfx_thwomp();
        this.mc.rotation = param2 / Math.PI * 180;
        this.mc.cacheAsBitmap = true;
        this.pos = new vec2();
    }
    RegisterGraphics(param1) {
        param1.push(this.mc);
    }
    UpdateState() {
        this.entity.GFX_UpdateState(this);
        this.mc.x = this.pos.x;
        this.mc.y = this.pos.y;
    }
}
export class EntityGraphics_Turret {
    static ANIM_IDLE = int(0);
    static ANIM_PREFIRE = int(0);
    static ANIM_FIRING = int(0);
    static ANIM_POSTFIRE = int(0);
    static CROSSHAIR_OFF = int(0);
    static CROSSHAIR_FAR = int(0);
    static CROSSHAIR_MID = int(0);
    static CROSSHAIR_NEAR = int(0);
    static CROSSHAIR_PREFIRE = int(0);
    static CROSSHAIR_POSTFIRE = int(0);
    mc_base = null;
    mc_crosshair = null;
    entity = null;
    anim_base = int(0);
    pos_crosshair = null;
    anim_crosshair = int(0);
    constructor(param1, param2, param3) {
        this.entity = param1;
        this.mc_base = new asset_gfx_turret();
        this.mc_base.x = param2;
        this.mc_base.y = param3;
        this.mc_base.gotoAndStop("idle");
        this.anim_base = int(EntityGraphics_Turret.ANIM_IDLE);
        this.mc_base.cacheAsBitmap = true;
        this.mc_crosshair = new asset_gfx_turret_crosshair();
        this.mc_crosshair.gotoAndStop("aim_off");
        this.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_OFF);
        this.pos_crosshair = new vec2();
    }
    RegisterGraphics(param1) {
        param1.unshift(this.mc_base);
        param1.push(this.mc_crosshair);
    }
    UpdateState() {
        var _loc1_ = int(this.anim_base);
        var _loc2_ = int(this.anim_crosshair);
        this.entity.GFX_UpdateState(this);
        if (this.anim_base != _loc1_) {
            if (this.anim_base == EntityGraphics_Turret.ANIM_IDLE) {
                this.mc_base.gotoAndStop("idle");
            }
            else if (this.anim_base == EntityGraphics_Turret.ANIM_PREFIRE) {
                this.mc_base.gotoAndPlay("prefire");
            }
            else if (this.anim_base == EntityGraphics_Turret.ANIM_POSTFIRE) {
                this.mc_base.gotoAndPlay("postfire");
            }
            else if (this.anim_base == EntityGraphics_Turret.ANIM_FIRING) {
                this.mc_base.gotoAndPlay("firing");
            }
        }
        this.mc_crosshair.x = this.pos_crosshair.x;
        this.mc_crosshair.y = this.pos_crosshair.y;
        if (this.anim_crosshair != _loc2_) {
            if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_OFF) {
                this.mc_crosshair.gotoAndStop("aim_off");
            }
            else if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_FAR) {
                this.mc_crosshair.gotoAndStop("aim_far");
            }
            else if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_MID) {
                this.mc_crosshair.gotoAndStop("aim_mid");
            }
            else if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_NEAR) {
                this.mc_crosshair.gotoAndStop("aim_near");
            }
            else if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_PREFIRE) {
                this.mc_crosshair.gotoAndStop("prefire");
            }
            else if (this.anim_crosshair == EntityGraphics_Turret.CROSSHAIR_POSTFIRE) {
                this.mc_crosshair.gotoAndStop("postfire");
            }
        }
    }
}
export class Editor_State {
    tileIDs = null;
    entities = null;
    constructor() {
        var _loc1_ = int(edat.num_cols * edat.num_rows);
        this.tileIDs = asVector(_loc1_, 0);
        this.entities = asVector(0, null);
    }
    static Load_From_Bytes(param1) {
        var _loc5_ = int(0);
        var _loc6_ = int(0);
        var _loc7_ = int(0);
        var _loc8_ = int(0);
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = null;
        var _loc12_ = null;
        var _loc13_ = int(0);
        var _loc2_ = new Editor_State();
        param1.position = 0;
        param1.readUnsignedByte();
        param1.readUnsignedByte();
        param1.readUnsignedByte();
        param1.readUnsignedByte();
        if (param1.bytesAvailable < _loc2_.tileIDs.length) {
            trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
            return new Editor_State();
        }
        var _loc3_ = int(0);
        while (_loc3_ < _loc2_.tileIDs.length) {
            guard();
            _loc2_.tileIDs[_loc3_] = param1.readUnsignedByte();
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        var _loc4_ = uint(0);
        while (_loc4_ < edat.num_structtypes) {
            guard();
            if (param1.bytesAvailable < 2) {
                trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
                return new Editor_State();
            }
            _loc5_ = int(param1.readShort());
            _loc6_ = int(int(param1.position));
            _loc7_ = int(0);
            while (_loc7_ < _loc5_) {
                guard();
                _loc11_ = asVector(0, 0);
                _loc2_.entities.push(_loc11_);
                _loc11_.push(edat.MAP_STRUCT_TO_ETYPE[_loc4_]);
                _loc12_ = asVector(0, 0);
                if (_loc4_ == edat.STRUCTTYPE_EXIT) {
                    _loc2_.entities.push(_loc12_);
                    _loc12_.push(edat.ETYPE_EXIT_SWITCH);
                    if (param1.bytesAvailable < 4) {
                        trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
                        return new Editor_State();
                    }
                    _loc11_.push(param1.readUnsignedByte());
                    _loc11_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                }
                else if (_loc4_ == edat.STRUCTTYPE_DOOR_LOCKED) {
                    _loc2_.entities.push(_loc12_);
                    _loc12_.push(edat.ETYPE_SWITCH_LOCKED);
                    if (param1.bytesAvailable < 5) {
                        trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
                        return new Editor_State();
                    }
                    _loc11_.push(param1.readUnsignedByte());
                    _loc11_.push(param1.readUnsignedByte());
                    _loc11_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                }
                else if (_loc4_ == edat.STRUCTTYPE_DOOR_TRAP) {
                    _loc2_.entities.push(_loc12_);
                    _loc12_.push(edat.ETYPE_SWITCH_TRAP);
                    if (param1.bytesAvailable < 5) {
                        trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
                        return new Editor_State();
                    }
                    _loc11_.push(param1.readUnsignedByte());
                    _loc11_.push(param1.readUnsignedByte());
                    _loc11_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                    _loc12_.push(param1.readUnsignedByte());
                }
                else {
                    if (param1.bytesAvailable < edat.STRUCT_SIZE[_loc4_]) {
                        trace("WARNING! Someone passed Load_From_Bytes() a bunch of bullshit; we didn\'t load it.");
                        return new Editor_State();
                    }
                    _loc13_ = int(0);
                    while (_loc13_ < edat.STRUCT_SIZE[_loc4_]) {
                        guard();
                        _loc11_.push(param1.readUnsignedByte());
                        (_loc13_ = int(_loc13_ + 1), int(_loc13_ - 1));
                    }
                }
                (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
            }
            _loc8_ = int(int(param1.position));
            _loc9_ = int(_loc8_ - _loc6_);
            _loc10_ = int(_loc5_ * edat.STRUCT_SIZE[_loc4_]);
            if (_loc9_ != _loc10_) {
                trace("WARNING! Editor_State.Load_From_Bytes() read the wrong number of bytes: " + _loc9_ + " , " + _loc10_);
            }
            (_loc4_ = uint(_loc4_ + 1), uint(_loc4_ - 1));
        }
        return _loc2_;
    }
    static Save_To_Bytes(param1) {
        var _loc10_ = null;
        var _loc11_ = uint(0);
        var _loc12_ = int(0);
        var _loc13_ = null;
        var _loc14_ = int(0);
        var _loc15_ = null;
        var _loc16_ = int(0);
        var _loc17_ = int(0);
        var _loc2_ = new ByteArray();
        _loc2_.position = 0;
        _loc2_.writeByte(0);
        _loc2_.writeByte(0);
        _loc2_.writeByte(0);
        _loc2_.writeByte(0);
        var _loc3_ = int(0);
        while (_loc3_ < param1.tileIDs.length) {
            guard();
            _loc2_.writeByte(param1.tileIDs[_loc3_]);
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        var _loc4_ = asVector(edat.num_etypes, null);
        var _loc5_ = int(0);
        while (_loc5_ < _loc4_.length) {
            guard();
            _loc4_[_loc5_] = asVector(0, 0);
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        var _loc6_ = int(0);
        while (_loc6_ < param1.entities.length) {
            guard();
            _loc10_ = param1.entities[_loc6_];
            _loc11_ = uint(_loc10_[0]);
            _loc12_ = int(1);
            while (_loc12_ < _loc10_.length) {
                guard();
                _loc4_[_loc11_].push(_loc10_[_loc12_]);
                (_loc12_ = int(_loc12_ + 1), int(_loc12_ - 1));
            }
            if (_loc11_ == edat.ETYPE_EXIT_DOOR || _loc11_ == edat.ETYPE_DOOR_LOCKED || _loc11_ == edat.ETYPE_DOOR_TRAP) {
                if (_loc6_ == param1.entities.length - 1) {
                    trace("WARNING! Editor_State.Save_To_Bytes() found a door at the end of the elist, with no switch!");
                    break;
                }
                _loc13_ = param1.entities[_loc6_ + 1];
                _loc14_ = int(1);
                while (_loc14_ < _loc13_.length) {
                    guard();
                    _loc4_[_loc11_].push(_loc13_[_loc14_]);
                    (_loc14_ = int(_loc14_ + 1), int(_loc14_ - 1));
                }
                (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
            }
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
        var _loc7_ = asVector(edat.num_structtypes, null);
        var _loc8_ = int(0);
        while (_loc8_ < _loc7_.length) {
            guard();
            _loc7_[_loc8_] = _loc4_[edat.MAP_STRUCT_TO_ETYPE[_loc8_]];
            (_loc8_ = int(_loc8_ + 1), int(_loc8_ - 1));
        }
        var _loc9_ = int(0);
        while (_loc9_ < _loc7_.length) {
            guard();
            _loc15_ = _loc7_[_loc9_];
            if (_loc15_.length % edat.STRUCT_SIZE[_loc9_] != 0) {
                trace("WARNING! Editor_State.Save_To_Bytes() has a property list with incorrect stride/size; type: " + _loc9_ + ", bytes:" + _loc15_.length);
                _loc2_.writeShort(0);
                break;
            }
            _loc16_ = int(_loc15_.length / edat.STRUCT_SIZE[_loc9_]);
            _loc2_.writeShort(_loc16_);
            _loc17_ = int(0);
            while (_loc17_ < _loc15_.length) {
                guard();
                _loc2_.writeByte(_loc15_[_loc17_]);
                (_loc17_ = int(_loc17_ + 1), int(_loc17_ - 1));
            }
            if (_loc16_ * edat.STRUCT_SIZE[_loc9_] != _loc15_.length) {
                trace("WARNING! Editor_State.Save_To_Bytes() is going crazy: " + _loc16_ + "*" + edat.STRUCT_SIZE[_loc9_] + " != " + _loc15_.length + "?!");
                break;
            }
            (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
        }
        return _loc2_;
    }
    Clone() {
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc6_ = int(0);
        var _loc1_ = new Editor_State();
        var _loc2_ = int(0);
        while (_loc2_ < this.tileIDs.length) {
            guard();
            _loc1_.tileIDs[_loc2_] = this.tileIDs[_loc2_];
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        var _loc3_ = int(0);
        while (_loc3_ < this.entities.length) {
            guard();
            _loc4_ = this.entities[_loc3_];
            _loc5_ = asVector(_loc4_.length, 0);
            _loc6_ = int(0);
            while (_loc6_ < _loc4_.length) {
                guard();
                _loc5_[_loc6_] = _loc4_[_loc6_];
                (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
            }
            _loc1_.entities[_loc3_] = _loc5_;
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        return _loc1_;
    }
    GetDebugString() {
        var _loc6_ = null;
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = null;
        var _loc10_ = null;
        var _loc11_ = null;
        var _loc1_ = "Editor State Dump\n";
        var _loc2_ = "";
        var _loc3_ = int(0);
        while (_loc3_ < edat.num_rows) {
            guard();
            _loc6_ = "";
            _loc7_ = int(0);
            while (_loc7_ < edat.num_cols) {
                guard();
                _loc6_ += tiletypes.GetDebugCharFromID(this.tileIDs[_loc7_ + _loc3_ * edat.num_cols]);
                (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
            }
            _loc2_ += _loc6_;
            _loc2_ += "\n";
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        _loc1_ += "grid:\n";
        _loc1_ += _loc2_;
        var _loc4_ = "";
        var _loc5_ = int(0);
        while (_loc5_ < this.entities.length) {
            guard();
            _loc8_ = _loc5_.toString();
            while (_loc8_.length < 4) {
                guard();
                _loc8_ = "0" + _loc8_;
            }
            _loc9_ = _loc8_ + " : ";
            if (this.entities[_loc5_][0] < 10) {
                _loc9_ += "0" + this.entities[_loc5_][0].toString() + " ";
            }
            else {
                _loc9_ += this.entities[_loc5_][0].toString() + " ";
            }
            _loc10_ = this.entities[_loc5_][1].toString();
            while (_loc10_.length < 3) {
                guard();
                _loc10_ = "0" + _loc10_;
            }
            _loc11_ = this.entities[_loc5_][2].toString();
            while (_loc11_.length < 3) {
                guard();
                _loc11_ = "0" + _loc11_;
            }
            _loc9_ += _loc10_ + "," + _loc11_ + " ";
            if (this.entities[_loc5_].length > 3) {
                _loc9_ += this.entities[_loc5_][3].toString() + " ";
                if (this.entities[_loc5_].length > 4) {
                    _loc9_ += this.entities[_loc5_][4].toString() + " ";
                }
            }
            _loc4_ += _loc9_;
            _loc4_ = _loc4_ + "\n";
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        _loc1_ += "entities: " + this.entities.length + "\n";
        return _loc1_ + _loc4_;
    }
}
export class edat {
    static num_cols = int(0);
    static num_rows = int(0);
    static cell_size = int(0);
    static quantize_steps_per_cell = int(0);
    static quantize_step_size = int(0);
    static ETYPE_PLAYER = uint(0);
    static ETYPE_MINE = uint(0);
    static ETYPE_GOLD = uint(0);
    static ETYPE_DOOR_REGULAR = uint(0);
    static ETYPE_DOOR_LOCKED = uint(0);
    static ETYPE_SWITCH_LOCKED = uint(0);
    static ETYPE_DOOR_TRAP = uint(0);
    static ETYPE_SWITCH_TRAP = uint(0);
    static ETYPE_ONEWAY = uint(0);
    static ETYPE_EXIT_DOOR = uint(0);
    static ETYPE_EXIT_SWITCH = uint(0);
    static ETYPE_CHAINGUN = uint(0);
    static ETYPE_LASER = uint(0);
    static ETYPE_ZAP = uint(0);
    static ETYPE_CHASER = uint(0);
    static ETYPE_FLOORGUARD = uint(0);
    static ETYPE_LAUNCHPAD = uint(0);
    static ETYPE_BOUNCEBLOCK = uint(0);
    static ETYPE_ROCKET = uint(0);
    static ETYPE_TURRET = uint(0);
    static ETYPE_THWOMP = uint(0);
    static num_etypes = uint(0);
    static ETYPE_NULLFLAG = uint(0);
    static EPROP_TYPE = uint(0);
    static EPROP_X = uint(0);
    static EPROP_Y = uint(0);
    static EPROP_DIR = uint(0);
    static EPROP_MOVE = uint(0);
    static DIR_R = uint(0);
    static DIR_RD = uint(0);
    static DIR_D = uint(0);
    static DIR_LD = uint(0);
    static DIR_L = uint(0);
    static DIR_LU = uint(0);
    static DIR_U = uint(0);
    static DIR_RU = uint(0);
    static MOVE_SURFACE_CW = uint(0);
    static MOVE_SURFACE_CCW = uint(0);
    static MOVE_WANDER_CW = uint(0);
    static MOVE_WANDER_CCW = uint(0);
    static HELPER_MIRROR_MOVE = null;
    static MAP_TILETYPE_TO_TILEID = null;
    static MAP_ETYPE_TO_MC = null;
    static MAP_ETYPE_TO_MC_SELECTED = null;
    static HELPER_MAP_DIR_TO_VEC = null;
    static HELPER_MAP_ETYPE_TO_COLSHAPE = null;
    static STRUCTTYPE_PLAYER = uint(0);
    static STRUCTTYPE_MINE = uint(0);
    static STRUCTTYPE_GOLD = uint(0);
    static STRUCTTYPE_EXIT = uint(0);
    static STRUCTTYPE_DOOR_REGULAR = uint(0);
    static STRUCTTYPE_DOOR_LOCKED = uint(0);
    static STRUCTTYPE_DOOR_TRAP = uint(0);
    static STRUCTTYPE_LAUNCHPAD = uint(0);
    static STRUCTTYPE_ONEWAY = uint(0);
    static STRUCTTYPE_CHAINGUN = uint(0);
    static STRUCTTYPE_LASER = uint(0);
    static STRUCTTYPE_ZAP = uint(0);
    static STRUCTTYPE_CHASER = uint(0);
    static STRUCTTYPE_FLOORGUARD = uint(0);
    static STRUCTTYPE_BOUNCEBLOCK = uint(0);
    static STRUCTTYPE_ROCKET = uint(0);
    static STRUCTTYPE_TURRET = uint(0);
    static STRUCTTYPE_THWOMP = uint(0);
    static num_structtypes = uint(0);
    static STRUCT_SIZE = null;
    static MAP_STRUCT_TO_ETYPE = null;
    constructor() {
    }
    static GET_WORLDSPACE_POS(param1) {
        return new vec2(param1[edat.EPROP_X] * edat.quantize_step_size, param1[edat.EPROP_Y] * edat.quantize_step_size);
    }
    static MAP_DIR_TO_VEC(param1) {
        param1 = int(param1);
        return edat.HELPER_MAP_DIR_TO_VEC[param1].Clone();
    }
    static GET_COLLISION_SHAPE(param1) {
        return edat.HELPER_MAP_ETYPE_TO_COLSHAPE[param1[edat.EPROP_TYPE]].Clone();
    }
}
export class mathutils {
    static rnd_seed = uint(0);
    constructor() {
    }
    static SetRandomSeed(param1) {
        param1 = uint(param1);
        if (param1 == 0 || param1 > 2147483646) {
            trace("WARNING! Some idiot instanceof trying to seed the PRNG with an invalid value: " + param1);
            mathutils.rnd_seed = uint(1);
        }
        else {
            mathutils.rnd_seed = uint(param1);
        }
    }
    static GenerateNewRandomSeed() {
        var _loc1_ = uint(1 + uint(Math.random() * Number(2147483645)));
        mathutils.SetRandomSeed(_loc1_);
    }
    static GetRandomSeed() {
        return uint(mathutils.rnd_seed);
    }
    static Random() {
        return mathutils.gen() / 2147483647;
    }
    static gen() {
        return uint(mathutils.rnd_seed = uint(mathutils.rnd_seed * 16807 % 2147483647));
    }
    static DegToRad(param1) {
        return param1 * (Math.PI / 180);
    }
    static RadToDeg(param1) {
        return param1 * (180 / Math.PI);
    }
    static WrapAngle_Shortest(param1) {
        while (Math.PI < Math.abs(param1)) {
            guard();
            if (param1 < 0) {
                param1 += 2 * Math.PI;
            }
            else {
                param1 -= 2 * Math.PI;
            }
        }
        return param1;
    }
    static WrapAngle_Directed(param1, param2) {
        if (0 < param2) {
            return mathutils.WrapAngle_Pos(param1);
        }
        if (param2 < 0) {
            while (param1 > 0 || param1 < -Math.PI * 2) {
                guard();
                if (param1 > 0) {
                    param1 -= 2 * Math.PI;
                }
                else if (-2 * Math.PI > param1) {
                    param1 += 2 * Math.PI;
                }
            }
            return param1;
        }
        trace("WARNING! WrapAngle_Directed() was passed a null-dir!: " + param2);
        return 0;
    }
    static WrapAngle_Pos(param1) {
        while (param1 < 0 || param1 > Math.PI * 2) {
            guard();
            if (param1 < 0) {
                param1 += 2 * Math.PI;
            }
            else if (2 * Math.PI < param1) {
                param1 -= 2 * Math.PI;
            }
        }
        return param1;
    }
    static InterpolateOrn(param1, param2, param3, param4 = 0) {
        var _loc5_ = mathutils.WrapAngle_Pos(param1);
        var _loc6_ = mathutils.WrapAngle_Pos(param2);
        var _loc7_ = _loc6_ - _loc5_;
        if (param4 == 0) {
            _loc7_ = mathutils.WrapAngle_Shortest(_loc7_);
        }
        else {
            _loc7_ = mathutils.WrapAngle_Directed(_loc7_, param4);
        }
        _loc7_ *= param3;
        return _loc5_ + _loc7_;
    }
}
export class vec2 {
    x = NaN;
    y = NaN;
    constructor(param1 = 0, param2 = 0) {
        this.x = param1;
        this.y = param2;
    }
    static FromDir(param1) {
        return new vec2(Math.cos(param1), Math.sin(param1));
    }
    static VecTo(param1, param2) {
        return new vec2(param2.x - param1.x, param2.y - param1.y);
    }
    VecPerp(param1) {
        return new vec2(-param1.y, param1.x);
    }
    VecDot(param1, param2) {
        return param1.x * param2.x + param1.y * param2.y;
    }
    To(param1) {
        return new vec2(param1.x - this.x, param1.y - this.y);
    }
    Perp() {
        return new vec2(-this.y, this.x);
    }
    PerpDot(param1) {
        return -this.y * param1.x + this.x * param1.y;
    }
    Clone() {
        return new vec2(this.x, this.y);
    }
    Plus(param1) {
        return new vec2(this.x + param1.x, this.y + param1.y);
    }
    Minus(param1) {
        return new vec2(this.x - param1.x, this.y - param1.y);
    }
    Dot(param1) {
        return this.x * param1.x + this.y * param1.y;
    }
    Len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    LenSq() {
        return this.x * this.x + this.y * this.y;
    }
    ToString() {
        return "(" + this.x + "," + this.y + ")";
    }
    Copy(param1) {
        this.x = param1.x;
        this.y = param1.y;
    }
    Normalize() {
        var _loc1_ = Math.sqrt(this.x * this.x + this.y * this.y);
        if (_loc1_ != 0) {
            this.x /= _loc1_;
            this.y /= _loc1_;
        }
    }
    Scale(param1) {
        this.x *= param1;
        this.y *= param1;
    }
}
export class Simulator {
    static GRID_NUM_COLS = int(0);
    static GRID_NUM_ROWS = int(0);
    static GRID_CELL_SIZE = NaN;
    static GRID_CELL_HALFWIDTH = NaN;
    objList = null;
    tileIDs = null;
    segGrid = null;
    edgeGrid = null;
    objGrid = null;
    playerList = null;
    frame_num = uint(0);
    num_gold_collected_during_tick = null;
    STATEFLAG_won = false;
    HACKY_gfx = null;
    HACKY_sfx = null;
    constructor(param1, param2, param3, param4, param5, param6) {
        this.tileIDs = param1;
        this.segGrid = param2;
        this.edgeGrid = param3;
        this.objGrid = param4;
        this.objList = param5;
        this.playerList = param6;
        this.frame_num = uint(0);
        this.num_gold_collected_during_tick = asVector(param6.length, 0);
        this.STATEFLAG_won = false;
        this.HACKY_gfx = null;
        this.HACKY_sfx = null;
        mathutils.SetRandomSeed(1);
    }
    HACKY_SetAV(param1, param2) {
        this.HACKY_gfx = param1;
        this.HACKY_sfx = param2;
    }
    HACKY_GetParticleManager() {
        return this.HACKY_gfx.GetParticleManager();
    }
    HACKY_GetSoundManager() {
        return this.HACKY_sfx;
    }
    GFX_GetEntityList() {
        return this.objList;
    }
    GFX_GetPlayerList() {
        return this.playerList;
    }
    GFX_GetTileIDs() {
        return this.tileIDs;
    }
    Tick(param1) {
        var _loc10_ = int(0);
        var _loc11_ = int(0);
        var _loc12_ = int(0);
        var _loc2_ = int(0);
        while (_loc2_ < this.num_gold_collected_during_tick.length) {
            guard();
            this.num_gold_collected_during_tick[_loc2_] = 0;
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        var _loc3_ = int(0);
        while (_loc3_ < this.objList.length) {
            guard();
            this.objList[_loc3_].Move(this);
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        var _loc4_ = int(0);
        while (_loc4_ < this.objList.length) {
            guard();
            this.objList[_loc4_].Think(this);
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
        var _loc5_ = int(0);
        while (_loc5_ < this.playerList.length) {
            guard();
            this.playerList[_loc5_].Integrate();
            this.playerList[_loc5_].PreCollision();
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        var _loc6_ = int(4);
        var _loc7_ = int(0);
        while (_loc7_ < _loc6_) {
            guard();
            _loc10_ = int(0);
            while (_loc10_ < this.playerList.length) {
                guard();
                this.playerList[_loc10_].SolveInternalConstraints();
                (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
            }
            _loc11_ = int(0);
            while (_loc11_ < this.playerList.length) {
                guard();
                this.playerList[_loc11_].CollideVsObjects(this);
                (_loc11_ = int(_loc11_ + 1), int(_loc11_ - 1));
            }
            _loc12_ = int(0);
            while (_loc12_ < this.playerList.length) {
                guard();
                this.playerList[_loc12_].CollideVsTiles(this);
                (_loc12_ = int(_loc12_ + 1), int(_loc12_ - 1));
            }
            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
        }
        var _loc8_ = int(0);
        while (_loc8_ < this.playerList.length) {
            guard();
            this.playerList[_loc8_].PostCollision(this);
            (_loc8_ = int(_loc8_ + 1), int(_loc8_ - 1));
        }
        var _loc9_ = int(0);
        while (_loc9_ < this.playerList.length) {
            guard();
            this.playerList[_loc9_].Think(this, this.frame_num);
            (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
        }
        (this.frame_num = uint(this.frame_num + 1));
    }
    InternalEvent_KillPlayer(param1, param2, param3, param4, param5, param6) {
        param2 = int(param2);
        if (param1.SIM_Kill(param2, param3, param4, param5, param6)) {
        }
    }
    Event_Launchpad_HitPlayer(param1, param2, param3) {
        param1.SIM_Launch(param2, param3);
    }
    Event_Exit_HitPlayer(param1) {
        this.STATEFLAG_won = true;
        var _loc2_ = int(0);
        while (_loc2_ < this.playerList.length) {
            guard();
            this.playerList[_loc2_].SIM_Win();
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    Event_Gold_HitPlayer(param1) {
        if (!this.STATEFLAG_won) {
            ++this.num_gold_collected_during_tick[param1.GetIndex()];
            return true;
        }
        return false;
    }
    Event_PlayerWasKilled(param1, param2, param3, param4, param5, param6) {
        param2 = int(param2);
        this.InternalEvent_KillPlayer(param1, param2, param3, param4, param5, param6);
    }
    AreAllPlayersDead() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            if (!this.playerList[_loc1_].IsDead()) {
                return false;
            }
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
        return true;
    }
    APP_Event_TimeUp() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            this.InternalEvent_KillPlayer(this.playerList[_loc1_], sim_globals.ENEMYTYPE_TIME, 0, 0, 0, 0);
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    APP_Event_Suicide(param1) {
        param1 = int(param1);
        this.InternalEvent_KillPlayer(this.playerList[param1], sim_globals.ENEMYTYPE_SUICIDE, 0, 0, 0, 0);
    }
    APP_IsPlayerDead(param1) {
        param1 = int(param1);
        return this.playerList[param1].IsDead();
    }
    APP_IsGameDone() {
        return this.STATEFLAG_won || this.AreAllPlayersDead();
    }
    APP_DidPlayerWin() {
        if (!this.APP_IsGameDone()) {
            trace("WARNING! sim.APP_DidPlayerWin() was called, but APP_IsGameDone() wasn\'t consulted -- check it FIRST!");
            return false;
        }
        if (this.STATEFLAG_won) {
            return true;
        }
        return false;
    }
    APP_EnablePlayer(param1) {
        param1 = int(param1);
        this.playerList[param1].APP_Enable();
    }
    APP_DisablePlayer(param1) {
        param1 = int(param1);
        this.playerList[param1].APP_Disable();
    }
    App_EnableAllPlayers() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            this.playerList[_loc1_].APP_Enable();
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    App_DisableAllPlayers() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            this.playerList[_loc1_].APP_Disable();
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    APP_GetNumGoldCollectedDuringTick(param1) {
        param1 = int(param1);
        return int(this.num_gold_collected_during_tick[param1]);
    }
    APP_IsPlaybackFinished() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            if (!this.playerList[_loc1_].inputsource.IsReplayFinished()) {
                return false;
            }
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
        return true;
    }
    APP_GetReplayData(param1) {
        var _loc3_ = null;
        var _loc2_ = int(0);
        while (_loc2_ < this.playerList.length) {
            guard();
            _loc3_ = this.playerList[_loc2_].inputsource.DumpString();
            param1.push(_loc3_);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    APP_GetReplayBytes() {
        var _loc3_ = null;
        var _loc1_ = asVector(0, null);
        var _loc2_ = int(0);
        while (_loc2_ < this.playerList.length) {
            guard();
            _loc3_ = this.playerList[_loc2_].inputsource.DumpFrames();
            _loc1_.push(_loc3_);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        return _loc1_;
    }
    DEBUG_SetPlayerPosVel(param1, param2) {
        var _loc3_ = int(0);
        while (_loc3_ < this.playerList.length) {
            guard();
            this.playerList[_loc3_].DEBUG_SetPosVel(param1, param2);
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
    DEATHMATCH_RespawnPlayer(param1) {
        param1 = int(param1);
        if (this.playerList[param1].IsDead()) {
            this.playerList[param1].DEBUG_Respawn(this.playerList[param1].GetPos());
        }
    }
    DEATHMATCH_GibPlayer(param1, param2, param3, param4, param5) {
        param1 = int(param1);
        var _loc6_ = 0.8;
        if (!this.playerList[param1].IsDead()) {
            this.playerList[param1].SIM_Kill(sim_globals.ENEMYTYPE_MINE, 0, 0, 0, 0);
        }
    }
    DEBUG_ToggleRagdoll(param1) {
        var _loc3_ = null;
        var _loc4_ = NaN;
        var _loc5_ = null;
        var _loc6_ = NaN;
        var _loc7_ = null;
        var _loc2_ = int(0);
        while (_loc2_ < this.playerList.length) {
            guard();
            if (this.playerList[_loc2_].IsDead()) {
                this.playerList[_loc2_].DEBUG_Respawn(param1);
            }
            else {
                _loc3_ = this.playerList[_loc2_].GetPos();
                _loc4_ = this.playerList[_loc2_].GetRadius();
                _loc5_ = param1.To(_loc3_);
                _loc6_ = Math.min(10, _loc5_.Len());
                _loc5_.Normalize();
                _loc7_ = _loc5_.Clone();
                _loc7_.Scale(_loc6_);
                this.playerList[_loc2_].SIM_Kill(sim_globals.ENEMYTYPE_DEBUG, _loc3_.x - _loc5_.x * _loc4_, _loc3_.y - _loc5_.y * _loc4_, _loc7_.x, _loc7_.y);
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    DEBUG_ToggleExploded() {
        var _loc1_ = int(0);
        while (_loc1_ < this.playerList.length) {
            guard();
            if (this.playerList[_loc1_].IsDead()) {
                if (this.playerList[_loc1_].DEBUG_GetRagdoll().DEBUG_IsExploded()) {
                    this.playerList[_loc1_].DEBUG_GetRagdoll().UnexplodeRagdoll();
                }
                else {
                    this.playerList[_loc1_].DEBUG_GetRagdoll().ExplodeRagdoll(this);
                }
            }
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    DEBUG_GrabRagdoll(param1, param2) {
        var _loc3_ = int(0);
        while (_loc3_ < this.playerList.length) {
            guard();
            if (this.playerList[_loc3_].IsDead()) {
                this.playerList[_loc3_].DEBUG_GetRagdoll().TESTING_SetPosVel(param1, param2);
            }
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
    DEBUG_Draw_Tiles(param1) {
        var _loc3_ = int(0);
        var _loc4_ = null;
        var _loc5_ = int(0);
        param1.SetStyle(0, 0, 100);
        param1.DrawAABB(0, Simulator.GRID_NUM_COLS * Simulator.GRID_CELL_SIZE, 0, Simulator.GRID_NUM_ROWS * Simulator.GRID_CELL_SIZE);
        param1.SetStyle(0, 11184810, 100);
        var _loc2_ = int(0);
        while (_loc2_ < Simulator.GRID_NUM_COLS) {
            guard();
            _loc3_ = int(0);
            while (_loc3_ < Simulator.GRID_NUM_ROWS) {
                guard();
                _loc4_ = this.segGrid.DEBUG_GetCellContentsFromGridspacePosition(_loc2_, _loc3_);
                _loc5_ = int(0);
                while (_loc5_ < _loc4_.length) {
                    guard();
                    _loc4_[_loc5_].DebugDraw_Simple(param1);
                    (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
                }
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    DEBUG_Draw_Edges(param1) {
        this.edgeGrid.Debug_Draw(param1);
    }
    DEBUG_Draw_objGrid(param1) {
        this.objGrid.Debug_Draw(param1);
    }
    DEBUG_Draw_Grid(param1) {
        var _loc3_ = int(0);
        param1.SetStyle(0, 11184810, 10);
        var _loc2_ = int(0);
        while (_loc2_ < Simulator.GRID_NUM_COLS) {
            guard();
            _loc3_ = int(0);
            while (_loc3_ < Simulator.GRID_NUM_ROWS) {
                guard();
                param1.DrawAABB(_loc2_ * Simulator.GRID_CELL_SIZE, (_loc2_ + 1) * Simulator.GRID_CELL_SIZE, _loc3_ * Simulator.GRID_CELL_SIZE, (_loc3_ + 1) * Simulator.GRID_CELL_SIZE);
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    DEBUG_Draw_Entities(param1) {
        var _loc4_ = null;
        var _loc2_ = int(0);
        while (_loc2_ < this.objList.length) {
            guard();
            _loc4_ = this.objList[_loc2_];
            param1.SetStyle(0, 0, 100);
            _loc4_.Debug_Draw(param1);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        var _loc3_ = int(0);
        while (_loc3_ < this.playerList.length) {
            guard();
            this.playerList[_loc3_].Draw(param1);
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
}
export class AABB {
    min = null;
    max = null;
    constructor(param1, param2, param3, param4) {
        this.min = new vec2(param1, param2);
        this.max = new vec2(param3, param4);
    }
}
export class Grid_Base {
    numcols = int(0);
    numrows = int(0);
    numcells = int(0);
    cellsize = NaN;
    constructor(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        this.numcols = int(param1);
        this.numrows = int(param2);
        this.cellsize = param3;
        this.numcells = int(this.numcols * this.numrows);
    }
    WorldspaceToGridspace(param1) {
        return int(Math.floor(param1 / this.cellsize));
    }
    GetCellIndexFromWorldspacePosition(param1, param2) {
        return int(this.GetCellIndexFromGridspacePosition(this.WorldspaceToGridspace(param1), this.WorldspaceToGridspace(param2)));
    }
    GetCellIndexFromGridspacePosition(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        if (param1 < 0 || param1 >= this.numcols || param2 < 0 || param2 >= this.numrows) {
            param1 = int(Math.max(0, Math.min(this.numcols - 1, param1)));
            param2 = int(Math.max(0, Math.min(this.numrows - 1, param2)));
        }
        return int(param2 * this.numcols + param1);
    }
    DEBUG_GetWorldspaceCellCenterPositionFromIndex(param1) {
        param1 = int(param1);
        var _loc2_ = int(0);
        var _loc3_ = int(0);
        if (param1 != -1) {
            _loc2_ = int(param1 % this.numcols);
            _loc3_ = int(Math.floor(param1 / this.numcols));
            return new vec2((_loc2_ + 0.5) * this.cellsize, (_loc3_ + 0.5) * this.cellsize);
        }
        return null;
    }
}
export class Grid_Edges extends Grid_Base {
    edges_tileX = null;
    edges_tileY = null;
    edges_doorX = null;
    edges_doorY = null;
    constructor(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        super(param1, param2, param3);
        this.edges_tileX = asVector(this.numcells, 0);
        this.edges_tileY = asVector(this.numcells, 0);
        this.edges_doorX = asVector(this.numcells, 0);
        this.edges_doorY = asVector(this.numcells, 0);
    }
    Clear() {
        var _loc1_ = int(0);
        while (_loc1_ < this.numcells) {
            guard();
            this.edges_tileX[_loc1_] = edgetypes.EMPTY;
            this.edges_tileY[_loc1_] = edgetypes.EMPTY;
            this.edges_doorX[_loc1_] = 0;
            this.edges_doorY[_loc1_] = 0;
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    Debug_Draw(param1) {
        var _loc3_ = int(0);
        var _loc4_ = NaN;
        var _loc5_ = int(0);
        var _loc6_ = null;
        var _loc2_ = int(0);
        while (_loc2_ < this.numcols) {
            guard();
            _loc3_ = int(0);
            while (_loc3_ < this.numrows) {
                guard();
                _loc4_ = this.cellsize * 0.5;
                _loc5_ = int(this.GetCellIndexFromGridspacePosition(_loc2_, _loc3_));
                _loc6_ = this.DEBUG_GetWorldspaceCellCenterPositionFromIndex(_loc5_);
                if (this.edges_tileX[_loc5_] != edgetypes.EMPTY) {
                    if (this.edges_tileX[_loc5_] == edgetypes.PARTIAL) {
                        param1.SetStyle(0, 11184810, 100);
                    }
                    else {
                        param1.SetStyle(0, 2236962, 100);
                    }
                    param1.DrawLine(_loc6_.x + _loc4_ - 2, _loc6_.y - _loc4_ + 2, _loc6_.x + _loc4_ - 2, _loc6_.y + _loc4_ - 2);
                }
                if (this.edges_tileY[_loc5_] != edgetypes.EMPTY) {
                    if (this.edges_tileY[_loc5_] == edgetypes.PARTIAL) {
                        param1.SetStyle(0, 11184810, 100);
                    }
                    else {
                        param1.SetStyle(0, 2236962, 100);
                    }
                    param1.DrawLine(_loc6_.x - _loc4_ + 2, _loc6_.y + _loc4_ - 2, _loc6_.x + _loc4_ - 2, _loc6_.y + _loc4_ - 2);
                }
                param1.SetStyle(0, 2263074, 100);
                if (this.edges_doorX[_loc5_] != 0) {
                    param1.DrawAABB(_loc6_.x + _loc4_ - 2, _loc6_.x + _loc4_ + 2, _loc6_.y - _loc4_ + 2, _loc6_.y + _loc4_ - 2);
                }
                if (this.edges_doorY[_loc5_] != 0) {
                    param1.DrawAABB(_loc6_.x - _loc4_ + 2, _loc6_.x + _loc4_ - 2, _loc6_.y + _loc4_ - 2, _loc6_.y + _loc4_ + 2);
                }
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    DOOR_GetCellIndexFromGridspacePosition(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        return int(this.GetCellIndexFromGridspacePosition(param1, param2));
    }
    GetGridCoordinateFromWorldspace_1D(param1) {
        return int(this.WorldspaceToGridspace(param1));
    }
    GetWorldspaceCoordinateFromGridEdge_1D(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        return int((param1 + Math.max(0, param2)) * this.cellsize);
    }
    IsSolid(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(this.GetIndexFromGridspaceAndOffset(param1, param2, param3, param4));
        if (param4 == 0) {
            return this.edges_tileX[_loc5_] == edgetypes.SOLID || this.edges_doorX[_loc5_] != 0;
        }
        return this.edges_tileY[_loc5_] == edgetypes.SOLID || this.edges_doorY[_loc5_] != 0;
    }
    IsSolid_IgnoreDoors(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(this.GetIndexFromGridspaceAndOffset(param1, param2, param3, param4));
        if (param4 == 0) {
            return this.edges_tileX[_loc5_] == edgetypes.SOLID;
        }
        return this.edges_tileY[_loc5_] == edgetypes.SOLID;
    }
    IsEmpty(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(this.GetIndexFromGridspaceAndOffset(param1, param2, param3, param4));
        if (param4 == 0) {
            return this.edges_tileX[_loc5_] == edgetypes.EMPTY && this.edges_doorX[_loc5_] == 0;
        }
        return this.edges_tileY[_loc5_] == edgetypes.EMPTY && this.edges_doorY[_loc5_] == 0;
    }
    ScanHorizontal(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc6_ = int(0);
        var _loc5_ = int(param4 - param3);
        if (_loc5_ != 0) {
            _loc6_ = int(_loc5_ / Math.abs(_loc5_));
            return this.ScanHorizontal_Directed(param1, param2, param3, param4, _loc6_);
        }
        return true;
    }
    ScanHorizontal_Directed(param1, param2, param3, param4, param5) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        param5 = int(param5);
        var _loc6_ = int(param3);
        while (_loc6_ != param4) {
            guard();
            if (!this.IsEmpty_Column(_loc6_, param1, param2, param5)) {
                return false;
            }
            _loc6_ = int(_loc6_ + param5);
            if (Math.abs(_loc6_) > 100) {
                trace("-infinite loop in ScanHorizontal: " + param1 + "-" + param2 + " .. " + param3 + "," + param5);
                return false;
            }
        }
        return true;
    }
    ScanVertical(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc6_ = int(0);
        var _loc5_ = int(param4 - param3);
        if (_loc5_ != 0) {
            _loc6_ = int(_loc5_ / Math.abs(_loc5_));
            return this.ScanVertical_Directed(param1, param2, param3, param4, _loc6_);
        }
        return true;
    }
    ScanVertical_Directed(param1, param2, param3, param4, param5) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        param5 = int(param5);
        var _loc6_ = int(param3);
        while (_loc6_ != param4) {
            guard();
            if (!this.IsEmpty_Row(_loc6_, param1, param2, param5)) {
                return false;
            }
            _loc6_ = int(_loc6_ + param5);
            if (Math.abs(_loc6_) > 100) {
                trace("-infinite loop in ScanVertical: " + param1 + "-" + param2 + " .. " + param3 + "," + param5);
                return false;
            }
        }
        return true;
    }
    SweepHorizontal(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(param3);
        while (this.IsEmpty_Column(_loc5_, param1, param2, param4)) {
            guard();
            _loc5_ = int(_loc5_ + param4);
            if (Math.abs(_loc5_) > 100) {
                trace("-infinite loop in SweepHorizontal: " + param1 + "-" + param2 + " .. " + param3 + "," + param4);
                return int(param3);
            }
        }
        return int(_loc5_);
    }
    SweepVertical(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(param3);
        while (this.IsEmpty_Row(_loc5_, param1, param2, param4)) {
            guard();
            _loc5_ = int(_loc5_ + param4);
            if (Math.abs(_loc5_) > 100) {
                trace("-infinite loop in SweepVertical: " + param1 + "-" + param2 + " .. " + param3 + "," + param4);
                return int(param3);
            }
        }
        return int(_loc5_);
    }
    IsEmpty_Column(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(param2);
        while (_loc5_ <= param3) {
            guard();
            if (!this.IsEmpty(param1, _loc5_, param4, 0)) {
                return false;
            }
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        return true;
    }
    IsEmpty_Row(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(param2);
        while (_loc5_ <= param3) {
            guard();
            if (!this.IsEmpty(_loc5_, param1, 0, param4)) {
                return false;
            }
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        return true;
    }
    GAME_LoadTileEdges(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        var _loc7_ = int(0);
        var _loc8_ = int(0);
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = int(0);
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc4_ = int(param1 * 2);
        var _loc5_ = int(param2 * 2);
        var _loc6_ = int(0);
        while (_loc6_ < 3) {
            guard();
            _loc7_ = int(0);
            while (_loc7_ < 2) {
                guard();
                _loc8_ = int(_loc4_ - 1 + _loc6_);
                _loc9_ = int(_loc5_ + _loc7_);
                _loc10_ = int(_loc4_ + _loc7_);
                _loc11_ = int(_loc5_ - 1 + _loc6_);
                _loc12_ = int(this.GetCellIndexFromGridspacePosition(_loc8_, _loc9_));
                _loc13_ = int(this.GetCellIndexFromGridspacePosition(_loc10_, _loc11_));
                _loc14_ = int(_loc6_ + _loc7_ * 3);
                this.LoadEdgeState_X(_loc12_, edgedefs.GetEdgeState_X(param3, _loc14_));
                this.LoadEdgeState_Y(_loc13_, edgedefs.GetEdgeState_Y(param3, _loc14_));
                (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
            }
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
    }
    DOOR_IncrementEdge(param1, param2) {
        param1 = int(param1);
        if (param1 < 0 || param1 >= this.numcells) {
            trace("WARNING! DOOR_IncrementEdge() was called with an invalid index: " + param1);
            return;
        }
        if (param2) {
            this.edges_doorX[param1] += 1;
        }
        else {
            this.edges_doorY[param1] += 1;
        }
    }
    DOOR_DecrementEdge(param1, param2) {
        param1 = int(param1);
        if (param1 < 0 || param1 >= this.numcells) {
            trace("WARNING! DOOR_DecrementEdge() was called with an invalid index: " + param1);
            return;
        }
        if (param2) {
            if (this.edges_doorX[param1] <= 0) {
                trace("WARNING! DOOR_DecrementEdge() was called on an empty edge! " + param1);
                return;
            }
            this.edges_doorX[param1] = this.edges_doorX[param1] - 1;
        }
        else {
            if (this.edges_doorY[param1] <= 0) {
                trace("WARNING! DOOR_DecrementEdge() was called on an empty edge! " + param1);
                return;
            }
            this.edges_doorY[param1] = this.edges_doorY[param1] - 1;
        }
    }
    GetIndexFromGridspaceAndOffset(param1, param2, param3, param4) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        var _loc5_ = int(-1);
        if (param4 == 0) {
            if (param3 == -1) {
                _loc5_ = int(this.GetCellIndexFromGridspacePosition(param1 - 1, param2));
            }
            else if (param3 == 1) {
                _loc5_ = int(this.GetCellIndexFromGridspacePosition(param1, param2));
            }
        }
        else if (param3 == 0) {
            if (param4 == -1) {
                _loc5_ = int(this.GetCellIndexFromGridspacePosition(param1, param2 - 1));
            }
            else if (param4 == 1) {
                _loc5_ = int(this.GetCellIndexFromGridspacePosition(param1, param2));
            }
        }
        return int(_loc5_);
    }
    LoadEdgeState_X(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        if (this.edges_tileX[param1] == edgetypes.SOLID && param2 == edgetypes.SOLID) {
            this.edges_tileX[param1] = edgetypes.EMPTY;
        }
        else {
            this.edges_tileX[param1] = Math.max(this.edges_tileX[param1], param2);
        }
    }
    LoadEdgeState_Y(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        if (this.edges_tileY[param1] == edgetypes.SOLID && param2 == edgetypes.SOLID) {
            this.edges_tileY[param1] = edgetypes.EMPTY;
        }
        else {
            this.edges_tileY[param1] = Math.max(this.edges_tileY[param1], param2);
        }
    }
    SetDoorState_X(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        this.edges_doorX[param1] = param2;
    }
    SetDoorState_Y(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        this.edges_doorY[param1] = param2;
    }
}
export class Grid_Entity extends Grid_Base {
    cells = null;
    constructor(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        super(param1, param2, param3);
        this.cells = asVector(this.numcells, null);
        var _loc4_ = int(0);
        while (_loc4_ < this.numcells) {
            guard();
            this.cells[_loc4_] = asVector(0, null);
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    Debug_Draw(param1) {
        var _loc3_ = int(0);
        var _loc4_ = null;
        param1.SetStyle(0, 2237064, 100);
        var _loc2_ = int(0);
        while (_loc2_ < this.numcols) {
            guard();
            _loc3_ = int(0);
            while (_loc3_ < this.numrows) {
                guard();
                _loc4_ = new vec2((0.5 + _loc2_) * this.cellsize, (0.5 + _loc3_) * this.cellsize);
                param1.DrawStringAtPosition("" + this.cells[this.GetCellIndexFromGridspacePosition(_loc2_, _loc3_)].length, _loc4_.x, _loc4_.y);
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    Clear() {
        var _loc2_ = null;
        var _loc1_ = int(0);
        while (_loc1_ < this.numcells) {
            guard();
            _loc2_ = this.cells[_loc1_];
            _loc2_.length = 0;
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    ENTITY_Move(param1, param2) {
        var _loc3_ = int(param2.GRID_GetGridIndex());
        var _loc4_ = int(this.GetCellIndexFromWorldspacePosition(param1.x, param1.y));
        if (_loc3_ != _loc4_) {
            if (_loc3_ == -1) {
                trace("WARNING! ENTITY_Move() was called with an entity that\'s not in the grid: " + param2.GetUID());
            }
            else {
                this.RemoveEntityFromCell(_loc3_, param2);
                this.InsertEntityIntoCell(_loc4_, param2);
                param2.GRID_SetGridIndex(_loc4_);
            }
        }
    }
    ENTITY_Remove(param1) {
        var _loc2_ = int(param1.GRID_GetGridIndex());
        if (_loc2_ == -1) {
            trace("WARNING! ENTITY_Remove() was called with an entity that\'s not in the grid: " + param1.GetUID());
        }
        else {
            this.RemoveEntityFromCell(_loc2_, param1);
            param1.GRID_SetGridIndex(-1);
        }
    }
    ENTITY_Add(param1, param2) {
        var _loc4_ = int(0);
        var _loc3_ = int(param2.GRID_GetGridIndex());
        if (_loc3_ != -1) {
            trace("WARNING! ENTITY_Add() was called with an entity that\'s already in the grid: " + param2.GetUID() + "," + _loc3_);
        }
        else {
            _loc4_ = int(this.GetCellIndexFromWorldspacePosition(param1.x, param1.y));
            this.InsertEntityIntoCell(_loc4_, param2);
            param2.GRID_SetGridIndex(_loc4_);
        }
    }
    RemoveEntityFromCell(param1, param2) {
        param1 = int(param1);
        var _loc3_ = this.cells[param1];
        var _loc4_ = int(_loc3_.indexOf(param2));
        if (_loc4_ == -1) {
            trace("WARNING! RemoveEntityFromCell() found an out-of-sync cell index: " + param1);
        }
        else {
            _loc3_.splice(_loc4_, 1);
        }
    }
    InsertEntityIntoCell(param1, param2) {
        param1 = int(param1);
        var _loc3_ = this.cells[param1];
        _loc3_.push(param2);
    }
    GatherCellContentsInNeighbourhood(param1, param2) {
        var _loc6_ = int(0);
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = int(0);
        param2.length = 0;
        var _loc3_ = int(this.WorldspaceToGridspace(param1.x));
        var _loc4_ = int(this.WorldspaceToGridspace(param1.y));
        var _loc5_ = int(-1);
        while (_loc5_ < 2) {
            guard();
            _loc6_ = int(-1);
            while (_loc6_ < 2) {
                guard();
                _loc7_ = int(this.GetCellIndexFromGridspacePosition(_loc3_ + _loc5_, _loc4_ + _loc6_));
                _loc8_ = this.cells[_loc7_];
                _loc9_ = int(0);
                while (_loc9_ < _loc8_.length) {
                    guard();
                    param2.push(_loc8_[_loc9_]);
                    (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
                }
                (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
            }
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
    }
}
export class Grid_Segment extends Grid_Base {
    cells = null;
    TEMP_ray_pos = null;
    TEMP_ray_vec = null;
    TEMP_temp_p = null;
    TEMP_temp_n = null;
    constructor(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        super(param1, param2, param3);
        this.cells = asVector(this.numcells, null);
        var _loc4_ = int(0);
        while (_loc4_ < this.numcells) {
            guard();
            this.cells[_loc4_] = asVector(0, null);
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
        this.TEMP_ray_pos = new vec2();
        this.TEMP_ray_vec = new vec2();
        this.TEMP_temp_p = new vec2();
        this.TEMP_temp_n = new vec2();
    }
    DEBUG_Draw(param1) {
        var _loc3_ = int(0);
        var _loc2_ = int(0);
        while (_loc2_ < this.cells.length) {
            guard();
            _loc3_ = int(0);
            while (_loc3_ < this.cells[_loc2_].length) {
                guard();
                this.cells[_loc2_][_loc3_].DebugDraw(param1);
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    GetRaycastDistance(param1, param2, param3, param4, param5, param6) {
        var _loc17_ = NaN;
        var _loc7_ = int(this.WorldspaceToGridspace(param1));
        var _loc8_ = int(this.WorldspaceToGridspace(param2));
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = 999999;
        var _loc12_ = 999999;
        var _loc13_ = 0;
        var _loc14_ = 0;
        if (param3 < 0) {
            _loc9_ = int(-1);
            _loc11_ = (_loc7_ * this.cellsize - param1) / param3;
            _loc13_ = this.cellsize / -param3;
        }
        else if (param3 > 0) {
            _loc9_ = int(1);
            _loc11_ = ((_loc7_ + 1) * this.cellsize - param1) / param3;
            _loc13_ = this.cellsize / param3;
        }
        if (param4 < 0) {
            _loc10_ = int(-1);
            _loc12_ = (_loc8_ * this.cellsize - param2) / param4;
            _loc14_ = this.cellsize / -param4;
        }
        else if (param4 > 0) {
            _loc10_ = int(1);
            _loc12_ = ((_loc8_ + 1) * this.cellsize - param2) / param4;
            _loc14_ = this.cellsize / param4;
        }
        if (_loc9_ == 0 && _loc10_ == 0) {
            trace("WARNING! some jackass called GetRaycastDistance() with a null ray vector: " + param3 + "," + param4);
            return -1;
        }
        var _loc15_ = 2000;
        this.TEMP_ray_pos.x = param1;
        this.TEMP_ray_pos.y = param2;
        this.TEMP_ray_vec.x = _loc15_ * param3;
        this.TEMP_ray_vec.y = _loc15_ * param4;
        var _loc16_ = 2;
        while (true) {
            guard();
            _loc17_ = this.IntersectRayVsCellContents(_loc7_, _loc8_, this.TEMP_ray_pos, this.TEMP_ray_vec, param5, param6);
            if (_loc17_ == -1) {
                break;
            }
            if (_loc17_ != 2) {
                _loc16_ = _loc17_;
                return _loc16_ * _loc15_;
            }
            if (_loc11_ < _loc12_) {
                _loc11_ += _loc13_;
                _loc7_ = int(_loc7_ + _loc9_);
                if (_loc7_ < 0 || _loc7_ >= this.numcols) {
                    trace("WARNING! GetRaycastDistance() has a ray that missed everything in U");
                    return -1;
                }
            }
            else {
                _loc12_ += _loc14_;
                _loc8_ = int(_loc8_ + _loc10_);
                if (_loc8_ < 0 || _loc8_ >= this.numrows) {
                    trace("WARNING! GetRaycastDistance() has a ray that missed everything in V");
                    return -1;
                }
            }
        }
        trace("WARNING! GetRaycastDistance() was passed an invalid ray (start position overlaps seg geometry)");
        return -1;
    }
    RaycastVsPlayer(param1, param2, param3, param4, param5) {
        var _loc9_ = NaN;
        var _loc6_ = param2.x - param1.x;
        var _loc7_ = param2.y - param1.y;
        var _loc8_ = Math.sqrt(_loc6_ * _loc6_ + _loc7_ * _loc7_);
        if (_loc8_ < param3) {
            return true;
        }
        _loc6_ /= _loc8_;
        _loc7_ /= _loc8_;
        _loc8_ -= param3;
        _loc9_ = this.GetRaycastDistance(param1.x, param1.y, _loc6_, _loc7_, param4, param5);
        if (_loc8_ < _loc9_) {
            return true;
        }
        if (_loc9_ == -1) {
            param4.x = 0;
            param4.y = 0;
            param5.x = 1;
            param5.y = 0;
            trace("WARNING! RaycastVsPlayer() has a problem ray");
        }
        return false;
    }
    IntersectRayVsCellContents(param1, param2, param3, param4, param5, param6) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc11_ = null;
        var _loc12_ = NaN;
        var _loc7_ = 2;
        this.TEMP_temp_p.x = 0;
        this.TEMP_temp_p.y = 0;
        this.TEMP_temp_n.x = 0;
        this.TEMP_temp_n.y = 0;
        var _loc8_ = int(this.GetCellIndexFromGridspacePosition(param1, param2));
        var _loc9_ = this.cells[_loc8_];
        var _loc10_ = int(0);
        while (_loc10_ < _loc9_.length) {
            guard();
            _loc11_ = _loc9_[_loc10_];
            _loc12_ = _loc11_.IntersectWithRay(param3, param4, 0, this.TEMP_temp_p, this.TEMP_temp_n);
            if (_loc12_ == -1) {
                return -1;
            }
            if (_loc12_ < _loc7_) {
                _loc7_ = _loc12_;
                param5.Copy(this.TEMP_temp_p);
                param6.Copy(this.TEMP_temp_n);
            }
            (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
        }
        return _loc7_;
    }
    DEBUG_GetCellContentsFromGridspacePosition(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(this.GetCellIndexFromGridspacePosition(param1, param2));
        return this.cells[_loc3_];
    }
    Clear() {
        var _loc2_ = null;
        var _loc1_ = int(0);
        while (_loc1_ < this.numcells) {
            guard();
            _loc2_ = this.cells[_loc1_];
            _loc2_.length = 0;
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    AddSegToCell(param1, param2, param3) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc4_ = int(this.GetCellIndexFromGridspacePosition(param1, param2));
        if (_loc4_ < 0) {
            trace("WARNING! AddSegToCell() was passed invalid cell coords: " + param1 + "," + param2);
            return;
        }
        this.cells[_loc4_].push(param3);
    }
    DOOR_AddSegment(param1, param2) {
        param1 = int(param1);
        if (param1 < 0 || param1 >= this.numcells) {
            trace("WARNING! DOOR_AddSegment() was called with an invalid index: " + param1);
            return;
        }
        var _loc3_ = this.cells[param1];
        var _loc4_ = int(_loc3_.indexOf(param2));
        if (_loc4_ != -1) {
            trace("WARNING! DOOR_AddSegment() was passed an already-in-grid seg: " + param1);
            return;
        }
        this.cells[param1].push(param2);
    }
    DOOR_RemoveSegment(param1, param2) {
        param1 = int(param1);
        if (param1 < 0 || param1 >= this.numcells) {
            trace("WARNING! DOOR_RemoveSegment() was called with an invalid index: " + param1);
            return;
        }
        var _loc3_ = this.cells[param1];
        var _loc4_ = int(_loc3_.indexOf(param2));
        if (_loc4_ == -1) {
            trace("WARNING! DOOR_RemoveSegment() couldn\'t find a seg: " + param1);
            return;
        }
        _loc3_.splice(_loc4_, 1);
    }
    DOOR_GetCellIndexFromGridspacePosition(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        return int(this.GetCellIndexFromGridspacePosition(param1, param2));
    }
    GatherCellContentsFromWorldspaceRegion(param1, param2, param3, param4, param5) {
        var _loc11_ = int(0);
        var _loc12_ = int(0);
        var _loc13_ = null;
        var _loc14_ = int(0);
        var _loc6_ = int(this.WorldspaceToGridspace(param1));
        var _loc7_ = int(this.WorldspaceToGridspace(param3));
        var _loc8_ = int(this.WorldspaceToGridspace(param2));
        var _loc9_ = int(this.WorldspaceToGridspace(param4));
        param5.length = 0;
        var _loc10_ = int(_loc8_);
        while (_loc10_ <= _loc9_) {
            guard();
            _loc11_ = int(_loc6_);
            while (_loc11_ <= _loc7_) {
                guard();
                _loc12_ = int(this.GetCellIndexFromGridspacePosition(_loc11_, _loc10_));
                if (_loc12_ < 0) {
                    trace("WARNING! GatherCellContentsFromWorldspaceRegion() was passed an invalid region: " + _loc6_ + "," + _loc8_ + " .. " + _loc7_ + "," + _loc9_);
                }
                _loc13_ = this.cells[_loc12_];
                _loc14_ = int(0);
                while (_loc14_ < _loc13_.length) {
                    guard();
                    param5.push(_loc13_[_loc14_]);
                    (_loc14_ = int(_loc14_ + 1), int(_loc14_ - 1));
                }
                (_loc11_ = int(_loc11_ + 1), int(_loc11_ - 1));
            }
            (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
        }
    }
}
export class Segment_Circular {
    static zero_vec = null;
    static cp = null;
    static ray_point = null;
    p0 = null;
    p1 = null;
    pC = null;
    aabb = null;
    constructor(param1, param2, param3, param4, param5, param6) {
        this.p0 = new vec2(param3, param4);
        this.p1 = new vec2(param5, param6);
        this.pC = new vec2(param1, param2);
        this.aabb = new AABB(Math.min(this.p0.x, this.p1.x), Math.min(this.p0.y, this.p1.y), Math.max(this.p0.x, this.p1.x), Math.max(this.p0.y, this.p1.y));
    }
    GetAABB() {
        return this.aabb;
    }
    GetClosestPoint(param1, param2) {
        var _loc17_ = NaN;
        var _loc18_ = NaN;
        var _loc3_ = this.p0.x - this.pC.x;
        var _loc4_ = this.p0.y - this.pC.y;
        var _loc5_ = this.p1.x - this.pC.x;
        var _loc6_ = this.p1.y - this.pC.y;
        var _loc7_ = param1.x - this.pC.x;
        var _loc8_ = param1.y - this.pC.y;
        var _loc9_ = _loc7_ * -_loc4_ + _loc8_ * _loc3_;
        var _loc10_ = _loc7_ * -_loc6_ + _loc8_ * _loc5_;
        var _loc11_ = this.p1.x - this.p0.x;
        var _loc12_ = this.p1.y - this.p0.y;
        var _loc13_ = _loc11_ * -_loc4_ + _loc12_ * _loc3_;
        var _loc14_ = _loc11_ * -_loc6_ + _loc12_ * _loc5_;
        var _loc15_ = _loc9_ * _loc13_ <= 0;
        var _loc16_ = _loc10_ * _loc14_ >= 0;
        if (_loc15_) {
            if (_loc16_) {
                if (_loc7_ * _loc11_ + _loc8_ * _loc12_ <= 0) {
                    param2.Copy(this.p0);
                }
                else {
                    param2.Copy(this.p1);
                }
            }
            else {
                param2.Copy(this.p0);
            }
        }
        else if (_loc16_) {
            param2.Copy(this.p1);
        }
        else {
            _loc17_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
            _loc18_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
            _loc7_ /= _loc18_;
            _loc8_ /= _loc18_;
            _loc7_ *= _loc17_;
            _loc8_ *= _loc17_;
            param2.x = this.pC.x + _loc7_;
            param2.y = this.pC.y + _loc8_;
        }
    }
    GetClosestPoint_IsBackfacing(param1, param2) {
        var _loc20_ = NaN;
        var _loc21_ = NaN;
        var _loc22_ = NaN;
        var _loc23_ = NaN;
        var _loc3_ = this.p0.x - this.pC.x;
        var _loc4_ = this.p0.y - this.pC.y;
        var _loc5_ = this.p1.x - this.pC.x;
        var _loc6_ = this.p1.y - this.pC.y;
        var _loc7_ = param1.x - this.pC.x;
        var _loc8_ = param1.y - this.pC.y;
        var _loc9_ = _loc7_ * -_loc4_ + _loc8_ * _loc3_;
        var _loc10_ = _loc7_ * -_loc6_ + _loc8_ * _loc5_;
        var _loc11_ = this.p1.x - this.p0.x;
        var _loc12_ = this.p1.y - this.p0.y;
        var _loc13_ = _loc11_ * -_loc4_ + _loc12_ * _loc3_;
        var _loc14_ = _loc11_ * -_loc6_ + _loc12_ * _loc5_;
        var _loc15_ = _loc9_ * _loc13_ <= 0;
        var _loc16_ = _loc10_ * _loc14_ >= 0;
        var _loc17_ = int(-1);
        if (_loc15_) {
            if (_loc16_) {
                if (_loc7_ * _loc11_ + _loc8_ * _loc12_ <= 0) {
                    param2.Copy(this.p0);
                    _loc17_ = int(0);
                }
                else {
                    param2.Copy(this.p1);
                    _loc17_ = int(1);
                }
            }
            else {
                param2.Copy(this.p0);
                _loc17_ = int(0);
            }
        }
        else if (_loc16_) {
            param2.Copy(this.p1);
            _loc17_ = int(1);
        }
        else {
            _loc20_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
            _loc21_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
            _loc7_ /= _loc21_;
            _loc8_ /= _loc21_;
            _loc7_ *= _loc20_;
            _loc8_ *= _loc20_;
            param2.x = this.pC.x + _loc7_;
            param2.y = this.pC.y + _loc8_;
        }
        var _loc18_ = param2.x - param1.x;
        var _loc19_ = param2.y - param1.y;
        if (_loc17_ < 0) {
            return _loc18_ * -_loc12_ + _loc19_ * _loc11_ > 0;
        }
        _loc22_ = _loc3_;
        _loc23_ = _loc4_;
        if (_loc17_ == 1) {
            _loc22_ = _loc5_;
            _loc23_ = _loc6_;
        }
        if (_loc22_ * -_loc12_ + _loc23_ * _loc11_ < 0) {
            _loc22_ *= -1;
            _loc23_ *= -1;
        }
        return _loc18_ * _loc22_ + _loc19_ * _loc23_ > 0;
    }
    IntersectWithRay(param1, param2, param3, param4, param5) {
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc16_ = NaN;
        var _loc17_ = NaN;
        var _loc18_ = NaN;
        var _loc6_ = colutils.TimeOfIntersection_Circle_vs_Circle(param1, param2, this.p0, Segment_Circular.zero_vec, param3);
        var _loc7_ = colutils.TimeOfIntersection_Circle_vs_Circle(param1, param2, this.p1, Segment_Circular.zero_vec, param3);
        var _loc8_ = 2;
        this.GetClosestPoint(param1, Segment_Circular.cp);
        var _loc9_ = param1.x - Segment_Circular.cp.x;
        var _loc10_ = param1.y - Segment_Circular.cp.y;
        var _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
        if (_loc11_ <= param3) {
            _loc8_ = -1;
        }
        else {
            _loc8_ = colutils.TimeOfIntersection_Circle_vs_Arc(param1, param2, this.pC, this.p0, this.p1, param3);
        }
        var _loc12_ = Math.min(_loc6_, _loc7_, _loc8_);
        if (_loc12_ <= 1 && _loc12_ >= 0) {
            Segment_Circular.ray_point.x = param1.x + _loc12_ * param2.x;
            Segment_Circular.ray_point.y = param1.y + _loc12_ * param2.y;
            if (param3 > 0) {
                this.GetClosestPoint(Segment_Circular.ray_point, Segment_Circular.cp);
                _loc13_ = Segment_Circular.ray_point.x - Segment_Circular.cp.x;
                _loc14_ = Segment_Circular.ray_point.y - Segment_Circular.cp.y;
                _loc15_ = Math.sqrt(_loc13_ * _loc13_ + _loc14_ * _loc14_);
                _loc13_ /= _loc15_;
                _loc14_ /= _loc15_;
                param4.x = Segment_Circular.cp.x;
                param4.y = Segment_Circular.cp.y;
                param5.x = _loc13_;
                param5.y = _loc14_;
            }
            else {
                _loc16_ = Segment_Circular.ray_point.x - this.pC.x;
                _loc17_ = Segment_Circular.ray_point.y - this.pC.y;
                _loc18_ = Math.sqrt(_loc16_ * _loc16_ + _loc17_ * _loc17_);
                _loc16_ /= _loc18_;
                _loc17_ /= _loc18_;
                if (_loc16_ * param2.x + _loc17_ * param2.y > 0) {
                    _loc16_ *= -1;
                    _loc17_ *= -1;
                }
                param4.Copy(Segment_Circular.ray_point);
                param5.x = _loc16_;
                param5.y = _loc17_;
            }
        }
        return _loc12_;
    }
    DebugDraw(param1) {
        param1.SetStyle(0, 0, 100);
        this.DebugDraw_NoStyle(param1);
    }
    DebugDraw_Simple(param1) {
        param1.DrawCircularArc_Convex(this.pC.x, this.pC.y, this.p0.x, this.p0.y, this.p1.x, this.p1.y, this.pC.To(this.p0).Len());
    }
    DebugDraw_NoStyle(param1) {
        param1.DrawCircularArc_Convex(this.pC.x, this.pC.y, this.p0.x, this.p0.y, this.p1.x, this.p1.y, this.pC.To(this.p0).Len());
        param1.DrawSquare(this.p0.x, this.p0.y, 2);
        param1.DrawSquare(this.p1.x, this.p1.y, 2);
        param1.DrawPlus(this.pC.x, this.pC.y, 2);
        var _loc2_ = this.pC.To(this.p0).Len();
        var _loc3_ = this.p0.To(this.p1);
        var _loc4_ = _loc3_.Perp();
        _loc4_.Normalize();
        _loc3_.Scale(0.5);
        var _loc5_ = this.pC.To(this.p0.Plus(_loc3_));
        _loc5_.Normalize();
        _loc5_.Scale(_loc2_);
        param1.DrawLine(this.pC.x + _loc5_.x, this.pC.y + _loc5_.y, this.pC.x + _loc5_.x + 4 * _loc4_.x, this.pC.y + _loc5_.y + 4 * _loc4_.y);
    }
}
export class Segment_Linear {
    static zero_vec = null;
    static cp = null;
    static ray_point = null;
    p0 = null;
    p1 = null;
    aabb = null;
    constructor(param1, param2, param3, param4) {
        this.p0 = new vec2(param1, param2);
        this.p1 = new vec2(param3, param4);
        this.aabb = new AABB(Math.min(this.p0.x, this.p1.x), Math.min(this.p0.y, this.p1.y), Math.max(this.p0.x, this.p1.x), Math.max(this.p0.y, this.p1.y));
    }
    GetAABB() {
        return this.aabb;
    }
    GetClosestPoint(param1, param2) {
        var _loc9_ = NaN;
        var _loc3_ = this.p1.x - this.p0.x;
        var _loc4_ = this.p1.y - this.p0.y;
        var _loc5_ = param1.x - this.p0.x;
        var _loc6_ = param1.y - this.p0.y;
        var _loc7_ = _loc3_ * _loc5_ + _loc4_ * _loc6_;
        var _loc8_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
        if (_loc7_ <= 0) {
            param2.Copy(this.p0);
        }
        else if (_loc7_ >= _loc8_) {
            param2.Copy(this.p1);
        }
        else {
            _loc9_ = _loc7_ / _loc8_;
            param2.x = this.p0.x + _loc9_ * _loc3_;
            param2.y = this.p0.y + _loc9_ * _loc4_;
        }
    }
    GetClosestPoint_IsBackfacing(param1, param2) {
        var _loc9_ = NaN;
        var _loc3_ = this.p1.x - this.p0.x;
        var _loc4_ = this.p1.y - this.p0.y;
        var _loc5_ = param1.x - this.p0.x;
        var _loc6_ = param1.y - this.p0.y;
        var _loc7_ = _loc3_ * _loc5_ + _loc4_ * _loc6_;
        var _loc8_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
        if (_loc7_ <= 0) {
            param2.Copy(this.p0);
        }
        else if (_loc7_ >= _loc8_) {
            param2.Copy(this.p1);
        }
        else {
            _loc9_ = _loc7_ / _loc8_;
            param2.x = this.p0.x + _loc9_ * _loc3_;
            param2.y = this.p0.y + _loc9_ * _loc4_;
        }
        return _loc5_ * -_loc4_ + _loc6_ * _loc3_ < 0;
    }
    IntersectWithRay(param1, param2, param3, param4, param5) {
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc6_ = colutils.TimeOfIntersection_Circle_vs_Circle(param1, param2, this.p0, Segment_Linear.zero_vec, param3);
        var _loc7_ = colutils.TimeOfIntersection_Circle_vs_Circle(param1, param2, this.p1, Segment_Linear.zero_vec, param3);
        var _loc8_ = colutils.TimeOfIntersection_Point_vs_Lineseg(param1, param2, this.p0, this.p1, param3);
        var _loc9_ = Math.min(_loc6_, _loc7_, _loc8_);
        if (_loc9_ <= 1 && _loc9_ >= 0) {
            Segment_Linear.ray_point.x = param1.x + _loc9_ * param2.x;
            Segment_Linear.ray_point.y = param1.y + _loc9_ * param2.y;
            if (param3 > 0) {
                Segment_Linear.cp.x = 0;
                Segment_Linear.cp.y = 0;
                this.GetClosestPoint(Segment_Linear.ray_point, Segment_Linear.cp);
                _loc10_ = Segment_Linear.ray_point.x - Segment_Linear.cp.x;
                _loc11_ = Segment_Linear.ray_point.y - Segment_Linear.cp.y;
                _loc12_ = Math.sqrt(_loc10_ * _loc10_ + _loc11_ * _loc11_);
                _loc10_ /= _loc12_;
                _loc11_ /= _loc12_;
                param4.x = Segment_Linear.cp.x;
                param4.y = Segment_Linear.cp.y;
                param5.x = _loc10_;
                param5.y = _loc11_;
            }
            else {
                _loc13_ = -(this.p1.y - this.p0.y);
                _loc14_ = this.p1.x - this.p0.x;
                _loc15_ = Math.sqrt(_loc13_ * _loc13_ + _loc14_ * _loc14_);
                _loc13_ /= _loc15_;
                _loc14_ /= _loc15_;
                if (_loc13_ * param2.x + _loc14_ * param2.y > 0) {
                    _loc13_ *= -1;
                    _loc14_ *= -1;
                }
                param4.Copy(Segment_Linear.ray_point);
                param5.x = _loc13_;
                param5.y = _loc14_;
            }
        }
        return _loc9_;
    }
    DebugDraw(param1) {
        param1.SetStyle(0, 0, 100);
        this.DebugDraw_NoStyle(param1);
    }
    DebugDraw_Simple(param1) {
        param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
    }
    DebugDraw_NoStyle(param1) {
        param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        param1.DrawSquare(this.p0.x, this.p0.y, 2);
        param1.DrawSquare(this.p1.x, this.p1.y, 2);
        var _loc2_ = this.p0.To(this.p1);
        var _loc3_ = _loc2_.Perp();
        _loc3_.Normalize();
        param1.DrawLine(this.p0.x + 0.5 * _loc2_.x, this.p0.y + 0.5 * _loc2_.y, this.p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x, this.p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y);
    }
}
export class Segment_Linear_DoubleSided extends Segment_Linear {
    constructor(param1, param2, param3, param4) {
        super(param1, param2, param3, param4);
    }
    GetClosestPoint_IsBackfacing(param1, param2) {
        super.GetClosestPoint_IsBackfacing(param1, param2);
        return false;
    }
    DebugDraw_NoStyle(param1) {
        param1.DrawLine(this.p0.x, this.p0.y, this.p1.x, this.p1.y);
        param1.DrawSquare(this.p0.x, this.p0.y, 2);
        param1.DrawSquare(this.p1.x, this.p1.y, 2);
        var _loc2_ = this.p0.To(this.p1);
        var _loc3_ = _loc2_.Perp();
        _loc3_.Normalize();
        param1.DrawLine(this.p0.x + 0.5 * _loc2_.x, this.p0.y + 0.5 * _loc2_.y, this.p0.x + 0.5 * _loc2_.x + 4 * _loc3_.x, this.p0.y + 0.5 * _loc2_.y + 4 * _loc3_.y);
        param1.DrawLine(this.p0.x + 0.5 * _loc2_.x, this.p0.y + 0.5 * _loc2_.y, this.p0.x + 0.5 * _loc2_.x - 4 * _loc3_.x, this.p0.y + 0.5 * _loc2_.y - 4 * _loc3_.y);
    }
}
export class colutils {
    static cp = null;
    static segList = null;
    constructor() {
    }
    static GetSingleClosestPoint_Signed(param1, param2, param3, param4) {
        var _loc8_ = false;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc5_ = int(0);
        var _loc6_ = 99999999;
        param1.GatherCellContentsFromWorldspaceRegion(param2.x - param3, param2.y - param3, param2.x + param3, param2.y + param3, colutils.segList);
        var _loc7_ = int(0);
        while (_loc7_ < colutils.segList.length) {
            guard();
            _loc8_ = colutils.segList[_loc7_].GetClosestPoint_IsBackfacing(param2, colutils.cp);
            _loc9_ = colutils.cp.x - param2.x;
            _loc10_ = colutils.cp.y - param2.y;
            _loc11_ = _loc9_ * _loc9_ + _loc10_ * _loc10_;
            if (!_loc8_) {
                _loc11_ -= 0.1;
            }
            if (_loc11_ < _loc6_) {
                param4.Copy(colutils.cp);
                _loc6_ = _loc11_;
                if (_loc8_) {
                    _loc5_ = int(-1);
                }
                else {
                    _loc5_ = int(1);
                }
            }
            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
        }
        return int(_loc5_);
    }
    static Penetration_Square_vs_Point(param1, param2, param3, param4) {
        var _loc5_ = NaN;
        var _loc8_ = NaN;
        _loc5_ = param3.x - param1.x;
        var _loc6_ = param3.y - param1.y;
        var _loc7_ = param2 - Math.abs(_loc6_);
        if (0 < _loc7_) {
            _loc8_ = param2 - Math.abs(_loc5_);
            if (0 < _loc8_) {
                if (_loc7_ <= _loc8_) {
                    param4.x = 0;
                    param4.y = 1;
                    if (_loc6_ <= 0) {
                        param4.y = -1;
                    }
                    return _loc7_;
                }
                param4.y = 0;
                param4.x = 1;
                if (_loc5_ <= 0) {
                    param4.x = -1;
                }
                return _loc8_;
            }
        }
        return 0;
    }
    static Overlap_Circle_Vs_Segment(param1, param2, param3, param4, param5) {
        var _loc6_ = param1.x - param3.x;
        var _loc7_ = param1.y - param3.y;
        var _loc8_ = (param4.x - param3.x) / param5;
        var _loc9_ = (param4.y - param3.y) / param5;
        var _loc10_ = _loc6_ * _loc8_ + _loc7_ * _loc9_;
        if (_loc10_ <= 0) {
            colutils.cp.Copy(param3);
        }
        else if (_loc10_ >= param5) {
            colutils.cp.Copy(param4);
        }
        else {
            colutils.cp.x = param3.x + _loc10_ * _loc8_;
            colutils.cp.y = param3.y + _loc10_ * _loc9_;
        }
        var _loc11_ = param1.x - colutils.cp.x;
        var _loc12_ = param1.y - colutils.cp.y;
        var _loc13_ = _loc11_ * _loc11_ + _loc12_ * _loc12_;
        if (_loc13_ < param2 * param2) {
            return true;
        }
        return false;
    }
    static Overlap_Circle_Vs_Circle(param1, param2, param3, param4) {
        var _loc5_ = param3.x - param1.x;
        var _loc6_ = param3.y - param1.y;
        var _loc7_ = _loc5_ * _loc5_ + _loc6_ * _loc6_;
        var _loc8_ = param2 + param4;
        if (_loc7_ < _loc8_ * _loc8_) {
            return true;
        }
        return false;
    }
    static TimeOfIntersection_Circle_vs_Circle(param1, param2, param3, param4, param5) {
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc16_ = NaN;
        var _loc17_ = NaN;
        var _loc6_ = param2.x - param4.x;
        var _loc7_ = param2.y - param4.y;
        var _loc8_ = param1.x - param3.x;
        var _loc9_ = param1.y - param3.y;
        var _loc10_ = _loc6_ * _loc6_ + _loc7_ * _loc7_;
        var _loc11_ = 2 * (_loc8_ * _loc6_ + _loc9_ * _loc7_);
        var _loc12_ = _loc8_ * _loc8_ + _loc9_ * _loc9_ - param5 * param5;
        var _loc13_ = 0.0001;
        if (_loc12_ <= 0) {
            return -1;
        }
        if (Math.abs(_loc10_) < _loc13_) {
            return 2;
        }
        if (_loc11_ >= 0) {
            return 2;
        }
        _loc14_ = _loc11_ * _loc11_ - 4 * _loc10_ * _loc12_;
        if (_loc14_ < 0) {
            return 2;
        }
        _loc15_ = -0.5 * (_loc11_ - Math.sqrt(_loc14_));
        _loc16_ = _loc15_ / _loc10_;
        _loc17_ = _loc12_ / _loc15_;
        return Math.min(_loc16_, _loc17_);
    }
    static TimeOfIntersection_Point_vs_Lineseg(param1, param2, param3, param4, param5) {
        var _loc18_ = NaN;
        var _loc19_ = NaN;
        var _loc20_ = NaN;
        var _loc6_ = param4.x - param3.x;
        var _loc7_ = param4.y - param3.y;
        var _loc8_ = Math.sqrt(_loc6_ * _loc6_ + _loc7_ * _loc7_);
        _loc6_ /= _loc8_;
        _loc7_ /= _loc8_;
        var _loc9_ = -_loc7_;
        var _loc10_ = _loc6_;
        var _loc11_ = param1.x - param3.x;
        var _loc12_ = param1.y - param3.y;
        var _loc13_ = _loc9_ * _loc11_ + _loc10_ * _loc12_;
        var _loc14_ = _loc9_ * param2.x + _loc10_ * param2.y;
        var _loc15_ = _loc6_ * _loc11_ + _loc7_ * _loc12_;
        var _loc16_ = Math.abs(_loc13_);
        var _loc17_ = _loc16_ - param5;
        if (_loc17_ < 0) {
            if (_loc15_ < 0 || _loc15_ > _loc8_) {
                return 2;
            }
            return -1;
        }
        if (_loc13_ * _loc14_ >= 0) {
            return 2;
        }
        _loc18_ = _loc17_ / Math.abs(_loc14_);
        _loc19_ = _loc6_ * param2.x + _loc7_ * param2.y;
        _loc20_ = _loc15_ + _loc18_ * _loc19_;
        if (_loc20_ < 0 || _loc20_ > _loc8_) {
            return 2;
        }
        return _loc18_;
    }
    static TimeOfIntersection_Circle_vs_Arc(param1, param2, param3, param4, param5, param6) {
        var _loc7_ = param4.x - param3.x;
        var _loc8_ = param4.y - param3.y;
        var _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
        var _loc10_ = colutils.TimeOfIntersection_Circle_vs_Arc_HELPER(param1, param2, param3, param4, param5, _loc9_ + param6);
        var _loc11_ = colutils.TimeOfIntersection_Circle_vs_Arc_HELPER(param1, param2, param3, param4, param5, _loc9_ - param6);
        return Math.min(_loc10_, _loc11_);
    }
    static TimeOfIntersection_Circle_vs_Arc_HELPER(param1, param2, param3, param4, param5, param6) {
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc16_ = NaN;
        var _loc17_ = NaN;
        var _loc18_ = NaN;
        var _loc19_ = NaN;
        var _loc20_ = NaN;
        var _loc21_ = NaN;
        var _loc22_ = NaN;
        var _loc23_ = NaN;
        var _loc24_ = NaN;
        var _loc25_ = NaN;
        var _loc26_ = NaN;
        var _loc27_ = NaN;
        var _loc28_ = NaN;
        var _loc29_ = NaN;
        var _loc30_ = NaN;
        var _loc31_ = NaN;
        var _loc32_ = NaN;
        var _loc7_ = param1.x - param3.x;
        var _loc8_ = param1.y - param3.y;
        var _loc9_ = param2.Dot(param2);
        var _loc10_ = 2 * (_loc7_ * param2.x + _loc8_ * param2.y);
        var _loc11_ = _loc7_ * _loc7_ + _loc8_ * _loc8_ - param6 * param6;
        var _loc12_ = 0.0001;
        if (Math.abs(_loc9_) < _loc12_) {
            return 2;
        }
        _loc13_ = _loc10_ * _loc10_ - 4 * _loc9_ * _loc11_;
        if (_loc13_ < 0) {
            return 2;
        }
        _loc14_ = -0.5 * (_loc10_ - Math.sqrt(_loc13_));
        _loc15_ = _loc14_ / _loc9_;
        _loc16_ = _loc11_ / _loc14_;
        _loc17_ = param4.x - param3.x;
        _loc18_ = param4.y - param3.y;
        _loc19_ = param5.x - param3.x;
        _loc20_ = param5.y - param3.y;
        _loc21_ = param5.x - param4.x;
        _loc22_ = param5.y - param4.y;
        _loc23_ = _loc21_ * -_loc18_ + _loc22_ * _loc17_;
        _loc24_ = _loc21_ * -_loc20_ + _loc22_ * _loc19_;
        if (_loc15_ < 0) {
            _loc15_ = 2;
        }
        if (_loc16_ < 0) {
            _loc16_ = 2;
        }
        if (_loc15_ <= 1) {
            _loc25_ = param1.x + _loc15_ * param2.x - param3.x;
            _loc26_ = param1.y + _loc15_ * param2.y - param3.y;
            _loc27_ = _loc25_ * -_loc18_ + _loc26_ * _loc17_;
            _loc28_ = _loc25_ * -_loc20_ + _loc26_ * _loc19_;
            if (_loc27_ * _loc23_ <= 0 || _loc28_ * _loc24_ >= 0) {
                _loc15_ = 2;
            }
        }
        if (_loc16_ <= 1) {
            _loc29_ = param1.x + _loc16_ * param2.x - param3.x;
            _loc30_ = param1.y + _loc16_ * param2.y - param3.y;
            _loc31_ = _loc29_ * -_loc18_ + _loc30_ * _loc17_;
            _loc32_ = _loc29_ * -_loc20_ + _loc30_ * _loc19_;
            if (_loc31_ * _loc23_ <= 0 || _loc32_ * _loc24_ >= 0) {
                _loc16_ = 2;
            }
        }
        return Math.min(_loc15_, _loc16_);
    }
}
export class Entity_Base {
    UID = int(0);
    grid_index = int(0);
    constructor() {
        this.UID = int(-1);
        this.grid_index = int(-1);
    }
    GAME_SetUID(param1) {
        param1 = uint(param1);
        this.UID = int(param1);
    }
    GetUID() {
        return uint(this.UID);
    }
    GRID_GetGridIndex() {
        return int(this.grid_index);
    }
    GRID_SetGridIndex(param1) {
        param1 = int(param1);
        this.grid_index = int(param1);
    }
    CollideVsCircle_Physical(param1, param2, param3, param4, param5) {
        return false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        return false;
    }
    Think(param1) {
    }
    Move(param1) {
    }
    GenerateGraphicComponent() {
        return null;
    }
    Debug_Draw(param1) {
    }
}
export class Entity_BounceBlock extends Entity_Base {
    pos = null;
    vel = null;
    anchor = null;
    r = NaN;
    stiff = NaN;
    damp = NaN;
    mass = NaN;
    isSleeping = false;
    n = null;
    constructor(param1, param2, param3) {
        super();
        this.pos = new vec2(param2, param3);
        this.vel = new vec2(0, 0);
        this.anchor = new vec2(param2, param3);
        this.r = 0.8 * 12;
        this.stiff = 0.05 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.damp = 0.99;
        if (sim_globals.sim_rate == 60) {
            this.damp = 0.98;
        }
        this.mass = 0.2;
        this.isSleeping = true;
        param1.ENTITY_Add(this.pos, this);
        this.n = new vec2();
    }
    CollideVsCircle_Physical(param1, param2, param3, param4, param5) {
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        this.n.x = 0;
        this.n.y = 0;
        _loc6_ = colutils.Penetration_Square_vs_Point(this.pos, this.r + param5, param2, this.n);
        if (_loc6_ != 0) {
            _loc7_ = (1 - this.mass) * _loc6_;
            this.pos.x -= _loc7_ * this.n.x;
            this.vel.x -= _loc7_ * this.n.x;
            this.pos.y -= _loc7_ * this.n.y;
            this.vel.y -= _loc7_ * this.n.y;
            param1.isHardCollision = false;
            param1.nx = this.n.x;
            param1.ny = this.n.y;
            param1.pen = this.mass * _loc6_;
            return true;
        }
        return false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        if (param2 != null) {
            this.n.x = 0;
            this.n.y = 0;
            _loc9_ = colutils.Penetration_Square_vs_Point(this.pos, param8 + this.r + param7, param4, this.n);
            if (_loc9_ != 0) {
                param3.vec_x = this.n.x;
                param3.vec_y = this.n.y;
                return true;
            }
        }
        return false;
    }
    Think(param1) {
        var _loc2_ = NaN;
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        if (!this.isSleeping) {
            _loc2_ = this.anchor.x - this.pos.x;
            _loc3_ = this.anchor.y - this.pos.y;
            _loc4_ = _loc2_ * _loc2_ + _loc3_ * _loc3_;
            if (this.vel.LenSq() < 0.05 && _loc4_ < 0.05) {
                this.pos.Copy(this.anchor);
                this.vel.x = 0;
                this.vel.y = 0;
                this.isSleeping = true;
            }
        }
    }
    Move(param1) {
        this.vel.Scale(this.damp);
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        var _loc2_ = this.anchor.x - this.pos.x;
        var _loc3_ = this.anchor.y - this.pos.y;
        _loc2_ *= this.stiff;
        _loc3_ *= this.stiff;
        this.pos.x += _loc2_;
        this.pos.y += _loc3_;
        this.vel.x += _loc2_;
        this.vel.y += _loc3_;
        param1.objGrid.ENTITY_Move(this.pos, this);
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_BounceBlock(this);
    }
    GFX_UpdateState(param1) {
        param1.pos.x = this.pos.x;
        param1.pos.y = this.pos.y;
    }
    Debug_Draw(param1) {
        if (this.isSleeping) {
            param1.SetStyle(0, 0, 30);
        }
        else {
            param1.SetStyle(0, 0, 100);
        }
        param1.DrawSquare(this.pos.x, this.pos.y, this.r);
    }
}
export class Entity_Door_Base extends Entity_Base {
    trigger_pos = null;
    trigger_r = NaN;
    seg_grid = null;
    seg = null;
    seg_index = int(0);
    edge_grid = null;
    edge_indices = null;
    isHorizontal = false;
    isOpen = false;
    constructor(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11) {
        param3 = int(param3);
        super();
        this.trigger_pos = new vec2(param8, param9);
        this.trigger_r = param10;
        this.seg_grid = param2;
        this.edge_grid = param5;
        this.seg = param4;
        this.seg_index = int(param3);
        this.edge_indices = asVector(param6.length, 0);
        var _loc12_ = int(0);
        while (_loc12_ < this.edge_indices.length) {
            guard();
            this.edge_indices[_loc12_] = param6[_loc12_];
            (_loc12_ = int(_loc12_ + 1), int(_loc12_ - 1));
        }
        this.isHorizontal = param7;
        this.isOpen = param11;
        if (!this.isOpen) {
            this.AddDoorToWorld();
        }
        param1.ENTITY_Add(this.trigger_pos, this);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        if (param2 != null) {
            if (colutils.Overlap_Circle_Vs_Circle(this.trigger_pos, this.trigger_r, param4, param7)) {
                this.OnCollision(param1);
            }
        }
        return false;
    }
    OnCollision(param1) {
    }
    IsDoorOpen() {
        return this.isOpen;
    }
    ChangeDoorState(param1) {
        if (this.isOpen == param1) {
            trace("WARNING! ChangeDoorState() was called with the existing state as new! " + param1);
            return;
        }
        this.isOpen = param1;
        if (this.isOpen) {
            this.RemoveDoorFromWorld();
        }
        else {
            this.AddDoorToWorld();
        }
    }
    RemoveDoorFromWorld() {
        this.seg_grid.DOOR_RemoveSegment(this.seg_index, this.seg);
        var _loc1_ = int(0);
        while (_loc1_ < this.edge_indices.length) {
            guard();
            this.edge_grid.DOOR_DecrementEdge(this.edge_indices[_loc1_], this.isHorizontal);
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    AddDoorToWorld() {
        this.seg_grid.DOOR_AddSegment(this.seg_index, this.seg);
        var _loc1_ = int(0);
        while (_loc1_ < this.edge_indices.length) {
            guard();
            this.edge_grid.DOOR_IncrementEdge(this.edge_indices[_loc1_], this.isHorizontal);
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    GetDoorPos() {
        var _loc1_ = this.seg.GetAABB();
        return new vec2(0.5 * (_loc1_.min.x + _loc1_.max.x), 0.5 * (_loc1_.min.y + _loc1_.max.y));
    }
    GetDoorOrn() {
        if (this.isHorizontal) {
            return 0;
        }
        return Math.PI / 2;
    }
    Debug_Draw_Base(param1, param2) {
        var _loc3_ = null;
        var _loc4_ = null;
        if (param2) {
            param1.SetStyle(0, 8921736, 30);
            param1.DrawCircle(this.trigger_pos.x, this.trigger_pos.y, this.trigger_r);
            _loc3_ = this.seg.GetAABB();
            _loc4_ = new vec2(0.5 * (_loc3_.max.x + _loc3_.min.x), 0.5 * (_loc3_.max.y + _loc3_.min.y));
            param1.DrawLine(this.trigger_pos.x, this.trigger_pos.y, _loc4_.x, _loc4_.y);
        }
        if (!this.isOpen) {
            param1.SetStyle(0, 0, 100);
            this.seg.DebugDraw_NoStyle(param1);
        }
    }
}
export class Entity_Door_Locked extends Entity_Door_Base {
    constructor(param1, param2, param3, param4, param5, param6, param7, param8, param9) {
        param3 = int(param3);
        var _loc10_ = 12 * (5 / 12);
        super(param1, param2, param3, param4, param5, param6, param7, param8, param9, _loc10_, false);
    }
    OnCollision(param1) {
        param1.objGrid.ENTITY_Remove(this);
        this.ChangeDoorState(true);
    }
    GenerateGraphicComponent() {
        var _loc1_ = this.GetDoorPos();
        return new EntityGraphics_Door_Locked(this, _loc1_.x, _loc1_.y, this.GetDoorOrn(), this.trigger_pos.x, this.trigger_pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.IsDoorOpen()) {
            param1.anim = int(EntityGraphics_Door_Locked.ANIM_OPEN);
        }
        else {
            param1.anim = int(EntityGraphics_Door_Locked.ANIM_CLOSE);
        }
    }
    Debug_Draw(param1) {
        this.Debug_Draw_Base(param1, !this.IsDoorOpen());
        param1.SetStyle(4, 2237064, 10);
        this.seg.DebugDraw_NoStyle(param1);
    }
}
export class Entity_Door_Regular extends Entity_Door_Base {
    static close_threshold = int(0);
    close_timer = int(0);
    constructor(param1, param2, param3, param4, param5, param6, param7, param8, param9) {
        param3 = int(param3);
        var _loc10_ = 12 * (5 / 6);
        super(param1, param2, param3, param4, param5, param6, param7, param8, param9, _loc10_, false);
    }
    OnCollision(param1) {
        this.close_timer = int(0);
        if (!this.IsDoorOpen()) {
            this.ChangeDoorState(true);
        }
    }
    Think(param1) {
        if (this.IsDoorOpen()) {
            (this.close_timer = int(this.close_timer + 1));
            if (Entity_Door_Regular.close_threshold < this.close_timer) {
                this.ChangeDoorState(false);
            }
        }
    }
    GenerateGraphicComponent() {
        var _loc1_ = this.GetDoorPos();
        return new EntityGraphics_Door_Regular(this, _loc1_.x, _loc1_.y, this.GetDoorOrn());
    }
    GFX_UpdateState(param1) {
        if (this.IsDoorOpen()) {
            param1.anim = int(EntityGraphics_Door_Regular.ANIM_OPEN);
        }
        else {
            param1.anim = int(EntityGraphics_Door_Regular.ANIM_CLOSE);
        }
    }
    Debug_Draw(param1) {
        this.Debug_Draw_Base(param1, true);
        param1.SetStyle(4, 2263074, 10);
        this.seg.DebugDraw_NoStyle(param1);
    }
}
export class Entity_Door_Trap extends Entity_Door_Base {
    constructor(param1, param2, param3, param4, param5, param6, param7, param8, param9) {
        param3 = int(param3);
        var _loc10_ = 12 * (5 / 12);
        super(param1, param2, param3, param4, param5, param6, param7, param8, param9, _loc10_, true);
    }
    OnCollision(param1) {
        param1.objGrid.ENTITY_Remove(this);
        this.ChangeDoorState(false);
    }
    GenerateGraphicComponent() {
        var _loc1_ = this.GetDoorPos();
        return new EntityGraphics_Door_Trap(this, _loc1_.x, _loc1_.y, this.GetDoorOrn(), this.trigger_pos.x, this.trigger_pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.IsDoorOpen()) {
            param1.anim = int(EntityGraphics_Door_Trap.ANIM_OPEN);
        }
        else {
            param1.anim = int(EntityGraphics_Door_Trap.ANIM_CLOSE);
        }
    }
    Debug_Draw(param1) {
        this.Debug_Draw_Base(param1, this.IsDoorOpen());
        param1.SetStyle(4, 8921634, 10);
        this.seg.DebugDraw_NoStyle(param1);
    }
}
export class Entity_Drone_Base extends Entity_Base {
    static DIR_R = uint(0);
    static DIR_D = uint(0);
    static DIR_L = uint(0);
    static DIR_U = uint(0);
    static DIR_TO_VEC2 = null;
    static DIR_TO_RAD = null;
    static ROT_0 = uint(0);
    static ROT_90 = uint(0);
    static ROT_180 = uint(0);
    static ROT_270 = uint(0);
    static MOVETYPE_SURFACE_CW = uint(0);
    static MOVETYPE_SURFACE_CCW = uint(0);
    static MOVETYPE_WANDER_CW = uint(0);
    static MOVETYPE_WANDER_CCW = uint(0);
    static MOVELIST = null;
    pos = null;
    speed = NaN;
    r = NaN;
    gfxorn = NaN;
    step_size = NaN;
    next_goal = null;
    facing_DIR = uint(0);
    move_TYPE = uint(0);
    constructor(param1, param2, param3, param4, param5, param6) {
        param5 = uint(param5);
        param6 = uint(param6);
        super();
        this.pos = new vec2(param2, param3);
        this.r = 12 * (3 / 4);
        this.speed = param4;
        this.step_size = 24;
        this.next_goal = this.pos.Clone();
        this.facing_DIR = uint(param5);
        this.move_TYPE = uint(param6);
        this.gfxorn = Entity_Drone_Base.DIR_TO_RAD[this.facing_DIR];
        param1.ENTITY_Add(this.pos, this);
    }
    Move(param1) {
        this.Move_Forward(param1.edgeGrid, param1.segGrid, param1.objGrid, param1.playerList);
        var _loc2_ = Entity_Drone_Base.DIR_TO_RAD[this.facing_DIR];
        var _loc3_ = mathutils.WrapAngle_Shortest(_loc2_ - this.gfxorn);
        this.gfxorn = mathutils.WrapAngle_Pos(this.gfxorn + 0.3 * _loc3_);
    }
    Move_Forward(param1, param2, param3, param4) {
        var _loc16_ = NaN;
        var _loc17_ = null;
        var _loc5_ = Entity_Drone_Base.DIR_TO_VEC2[this.facing_DIR];
        var _loc6_ = _loc5_.x * this.speed;
        var _loc7_ = _loc5_.y * this.speed;
        var _loc8_ = this.pos.x + _loc6_;
        var _loc9_ = this.pos.y + _loc7_;
        var _loc10_ = this.next_goal.x - this.pos.x;
        var _loc11_ = this.next_goal.y - this.pos.y;
        var _loc12_ = this.next_goal.x - _loc8_;
        var _loc13_ = this.next_goal.y - _loc9_;
        var _loc14_ = Math.sqrt(_loc10_ * _loc10_ + _loc11_ * _loc11_);
        var _loc15_ = _loc10_ * _loc12_ + _loc11_ * _loc13_;
        if (_loc14_ < 0.000001 || _loc15_ < 0) {
            this.pos.Copy(this.next_goal);
            if (this.ChooseNextDirAndGoal(param1, param4)) {
                _loc16_ = Math.max(0, this.speed - _loc14_);
                _loc17_ = Entity_Drone_Base.DIR_TO_VEC2[this.facing_DIR];
                this.pos.x += _loc17_.x * _loc16_;
                this.pos.y += _loc17_.y * _loc16_;
            }
        }
        else {
            this.pos.x += _loc6_;
            this.pos.y += _loc7_;
        }
        param3.ENTITY_Move(this.pos, this);
    }
    ChooseNextDirAndGoal(param1, param2) {
        var _loc4_ = uint(0);
        var _loc3_ = int(0);
        while (_loc3_ < 4) {
            guard();
            _loc4_ = uint((this.facing_DIR + Entity_Drone_Base.MOVELIST[this.move_TYPE][_loc3_]) % 4);
            if (this.ChooseNextDirAndGoal_HELPER_TestDir(param1, _loc4_, this.next_goal)) {
                this.facing_DIR = uint(_loc4_);
                return true;
            }
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        return false;
    }
    ChooseNextDirAndGoal_HELPER_TestDir(param1, param2, param3) {
        param2 = uint(param2);
        var _loc7_ = int(0);
        var _loc8_ = int(0);
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = int(0);
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc4_ = Entity_Drone_Base.DIR_TO_VEC2[param2];
        var _loc5_ = this.pos.x + _loc4_.x * this.step_size;
        var _loc6_ = this.pos.y + _loc4_.y * this.step_size;
        if (_loc4_.y == 0) {
            _loc7_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.x + _loc4_.x * this.r));
            _loc8_ = int(param1.GetGridCoordinateFromWorldspace_1D(_loc5_ + _loc4_.x * this.r));
            _loc9_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.y - this.r));
            _loc10_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.y + this.r));
            if (!param1.ScanHorizontal_Directed(_loc9_, _loc10_, _loc7_, _loc8_, _loc4_.x)) {
                return false;
            }
        }
        else {
            if (_loc4_.x != 0) {
                trace("WARNING! ChooseNextDirAndGoal_HELPER_TestDir() has a non-axis-aligned search vector: " + _loc4_.ToString());
                return false;
            }
            _loc11_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.y + _loc4_.y * this.r));
            _loc12_ = int(param1.GetGridCoordinateFromWorldspace_1D(_loc6_ + _loc4_.y * this.r));
            _loc13_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.x - this.r));
            _loc14_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.x + this.r));
            if (!param1.ScanVertical_Directed(_loc13_, _loc14_, _loc11_, _loc12_, _loc4_.y)) {
                return false;
            }
        }
        param3.x = _loc5_;
        param3.y = _loc6_;
        return true;
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r);
        var _loc2_ = new vec2(Math.cos(this.gfxorn), Math.sin(this.gfxorn));
        param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + _loc2_.x * 8, this.pos.y + _loc2_.y * 8);
    }
}
export class Entity_Drone_Shooter_Base extends Entity_Drone_Base {
    static zero_vec = null;
    static FIRING_STATE_IDLE = int(0);
    static FIRING_STATE_PREFIRING = int(0);
    static FIRING_STATE_FIRING = int(0);
    static FIRING_STATE_POSTFIRING = int(0);
    prefire_delay = int(0);
    postfire_delay = int(0);
    firing_timer = int(0);
    CUR_FIRING_STATE = int(0);
    targetIndex = int(0);
    constructor(param1, param2, param3, param4, param5, param6, param7, param8) {
        param5 = uint(param5);
        param6 = uint(param6);
        param7 = int(param7);
        param8 = int(param8);
        super(param1, param2, param3, param4, param5, param6);
        this.CUR_FIRING_STATE = int(Entity_Drone_Shooter_Base.FIRING_STATE_IDLE);
        this.firing_timer = int(0);
        this.prefire_delay = int(param7);
        this.postfire_delay = int(param8);
        this.targetIndex = int(-1);
    }
    Move(param1) {
        if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_IDLE) {
            super.Move(param1);
        }
    }
    GetFiringState() {
        return int(this.CUR_FIRING_STATE);
    }
    Think(param1) {
        var _loc2_ = int(0);
        var _loc3_ = int(0);
        if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_IDLE) {
            _loc2_ = int(entity_helpers.TryToAquireTarget(this.pos, param1.playerList, param1.segGrid));
            if (0 <= _loc2_) {
                this.Internal_StartPrefiring(param1, _loc2_, param1.playerList[_loc2_].GetPos());
                return;
            }
        }
        else {
            if (this.targetIndex < 0) {
                trace("WARNING! Entity_Drone_Shooter_Base.Think() isn\'t idle, but has an invalid target index!: " + this.targetIndex);
                return;
            }
            if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING) {
                if (param1.playerList[this.targetIndex].IsDead()) {
                    this.Internal_StartPostfiring(param1);
                }
                else {
                    this.Update_Prefiring(param1, param1.playerList[this.targetIndex].GetPos());
                    (this.firing_timer = int(this.firing_timer + 1));
                    if (this.prefire_delay <= this.firing_timer) {
                        this.Internal_StartFiring(param1, param1.playerList[this.targetIndex].GetPos(), param1.playerList[this.targetIndex].GetVel());
                    }
                }
            }
            else if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_FIRING) {
                if (this.Update_Firing(param1)) {
                    this.Internal_StartPostfiring(param1);
                }
            }
            else if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING) {
                (this.firing_timer = int(this.firing_timer + 1));
                if (this.postfire_delay <= this.firing_timer) {
                    _loc3_ = int(0);
                    while (_loc3_ < param1.playerList.length) {
                        guard();
                        if (!param1.playerList[_loc3_].IsDead()) {
                            if (param1.segGrid.RaycastVsPlayer(this.pos, param1.playerList[_loc3_].GetPos(), param1.playerList[_loc3_].GetRadius(), Entity_Drone_Shooter_Base.zero_vec, Entity_Drone_Shooter_Base.zero_vec)) {
                                this.Internal_StartPrefiring(param1, _loc3_, param1.playerList[_loc3_].GetPos());
                                return;
                            }
                        }
                        (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
                    }
                    this.Internal_StartIdling();
                }
            }
        }
    }
    Internal_StartPrefiring(param1, param2, param3) {
        param2 = int(param2);
        this.firing_timer = int(0);
        this.CUR_FIRING_STATE = int(Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING);
        this.targetIndex = int(param2);
        this.Start_Prefiring(param1, param3);
    }
    Internal_StartFiring(param1, param2, param3) {
        this.CUR_FIRING_STATE = int(Entity_Drone_Shooter_Base.FIRING_STATE_FIRING);
        this.Start_Firing(param1, param2, param3);
    }
    Internal_StartPostfiring(param1) {
        this.firing_timer = int(0);
        this.CUR_FIRING_STATE = int(Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING);
        this.Start_Postfiring(param1);
    }
    Internal_StartIdling() {
        this.CUR_FIRING_STATE = int(Entity_Drone_Shooter_Base.FIRING_STATE_IDLE);
        this.targetIndex = int(-1);
    }
    Start_Prefiring(param1, param2) {
    }
    Update_Prefiring(param1, param2) {
    }
    Start_Firing(param1, param2, param3) {
    }
    Update_Firing(param1) {
        return true;
    }
    Start_Postfiring(param1) {
    }
    Debug_Draw(param1) {
        var _loc2_ = NaN;
        var _loc3_ = NaN;
        super.Debug_Draw(param1);
        param1.SetStyle(0, 0, 100);
        if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING) {
            _loc2_ = Number(this.firing_timer) / Number(this.prefire_delay);
            param1.DrawSquare(this.pos.x, this.pos.y, this.r * _loc2_);
        }
        else if (this.CUR_FIRING_STATE == Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING) {
            _loc3_ = 1 - Number(this.firing_timer) / Number(this.postfire_delay);
            param1.DrawSquare(this.pos.x, this.pos.y, this.r * _loc3_);
        }
    }
}
export class Entity_Drone_Chaingun extends Entity_Drone_Shooter_Base {
    static chaingun_maxbullets = int(0);
    static chaingun_spread = NaN;
    chaingun_rate = 6 * (sim_globals.sim_rate / 40);
    chaingun_count = int(0);
    chaingun_timer = int(0);
    chaingun_dir = null;
    chaingun_sweep = null;
    chaingun_HACKY_hitmode = int(0);
    chaingun_hit_pos = null;
    chaingun_hit_n = null;
    constructor(param1, param2, param3, param4, param5) {
        param4 = uint(param4);
        param5 = uint(param5);
        var _loc6_ = 12 * (1 / 14) * 0.75 * (40 / sim_globals.sim_rate);
        var _loc7_ = int(35 * (sim_globals.sim_rate / 40));
        var _loc8_ = int(60 * (sim_globals.sim_rate / 40));
        super(param1, param2, param3, _loc6_, param4, param5, _loc7_, _loc8_);
        this.chaingun_count = int(0);
        this.chaingun_timer = int(0);
        this.chaingun_dir = new vec2();
        this.chaingun_sweep = new vec2();
        this.chaingun_HACKY_hitmode = int(0);
        this.chaingun_hit_pos = new vec2();
        this.chaingun_hit_n = new vec2();
    }
    Start_Prefiring(param1, param2) {
    }
    Update_Prefiring(param1, param2) {
        var _loc3_ = param2.x - this.pos.x;
        var _loc4_ = param2.y - this.pos.y;
        var _loc5_ = mathutils.WrapAngle_Shortest(Math.atan2(_loc4_, _loc3_) - this.gfxorn);
        this.gfxorn += 0.2 * _loc5_;
    }
    Start_Firing(param1, param2, param3) {
        var _loc7_ = NaN;
        this.chaingun_count = int(0);
        this.chaingun_timer = int(0);
        this.chaingun_HACKY_hitmode = int(0);
        var _loc4_ = param2.x - this.pos.x;
        var _loc5_ = param2.y - this.pos.y;
        var _loc6_ = Math.sqrt(_loc4_ * _loc4_ + _loc5_ * _loc5_);
        if (_loc6_ == 0) {
            _loc6_ = param3.Len();
            if (_loc6_ == 0) {
                this.chaingun_dir.x = 1;
                this.chaingun_dir.y = 0;
                this.chaingun_sweep.x = 0;
                this.chaingun_sweep.y = 0;
            }
            else {
                this.chaingun_dir.x = param3.x / _loc6_;
                this.chaingun_dir.y = param3.y / _loc6_;
                this.chaingun_sweep.x = 0;
                this.chaingun_sweep.y = 0;
            }
        }
        else {
            this.chaingun_dir.x = _loc4_ / _loc6_;
            this.chaingun_dir.y = _loc5_ / _loc6_;
            _loc7_ = -this.chaingun_dir.y * param3.x + this.chaingun_dir.x * param3.y;
            if (_loc7_ < 0) {
                this.chaingun_sweep.x = this.chaingun_dir.y;
                this.chaingun_sweep.y = -this.chaingun_dir.x;
            }
            else {
                this.chaingun_sweep.x = -this.chaingun_dir.y;
                this.chaingun_sweep.y = this.chaingun_dir.x;
            }
        }
    }
    Update_Firing(param1) {
        var _loc2_ = NaN;
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        var _loc5_ = NaN;
        var _loc6_ = NaN;
        var _loc7_ = int(0);
        var _loc8_ = NaN;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        (this.chaingun_timer = int(this.chaingun_timer + 1));
        if (this.chaingun_rate <= this.chaingun_timer) {
            this.chaingun_timer = int(0);
            if (Entity_Drone_Chaingun.chaingun_maxbullets < this.chaingun_count) {
                return true;
            }
            (this.chaingun_count = int(this.chaingun_count + 1));
            _loc2_ = (this.chaingun_count / Entity_Drone_Chaingun.chaingun_maxbullets - 0.5) * Entity_Drone_Chaingun.chaingun_spread;
            _loc3_ = this.chaingun_dir.x + _loc2_ * this.chaingun_sweep.x;
            _loc4_ = this.chaingun_dir.y + _loc2_ * this.chaingun_sweep.y;
            _loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
            _loc3_ /= _loc5_;
            _loc4_ /= _loc5_;
            this.gfxorn = Math.atan2(_loc4_, _loc3_);
            _loc6_ = param1.segGrid.GetRaycastDistance(this.pos.x, this.pos.y, _loc3_, _loc4_, this.chaingun_hit_pos, this.chaingun_hit_n);
            param1.HACKY_GetParticleManager().Spawn_ChainBullet(this.pos, this.chaingun_hit_pos);
            _loc7_ = int(0);
            while (_loc7_ < param1.playerList.length) {
                guard();
                if (!param1.playerList[_loc7_].IsDead()) {
                    if (colutils.Overlap_Circle_Vs_Segment(param1.playerList[_loc7_].GetPos(), param1.playerList[_loc7_].GetRadius(), this.pos, this.chaingun_hit_pos, _loc6_)) {
                        _loc8_ = param1.playerList[_loc7_].GetPos().x - this.pos.x;
                        _loc9_ = param1.playerList[_loc7_].GetPos().y - this.pos.y;
                        _loc10_ = _loc3_ * _loc8_ + _loc4_ * _loc9_;
                        this.chaingun_hit_pos.x = this.pos.x + _loc10_ * _loc3_;
                        this.chaingun_hit_pos.y = this.pos.y + _loc10_ * _loc4_;
                        param1.Event_PlayerWasKilled(param1.playerList[_loc7_], sim_globals.ENEMYTYPE_CHAINGUN, this.chaingun_hit_pos.x, this.chaingun_hit_pos.y, _loc3_ * 5, _loc4_ * 5);
                    }
                }
                (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
            }
            this.chaingun_HACKY_hitmode = int(1);
        }
        return false;
    }
    Start_Postfiring(param1) {
        if (this.chaingun_HACKY_hitmode < 2) {
            this.chaingun_HACKY_hitmode = int(0);
        }
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Drone_Chaingun(this);
    }
    GFX_UpdateState(param1) {
        param1.pos.x = this.pos.x;
        param1.pos.y = this.pos.y;
        param1.orn = this.gfxorn;
        var _loc2_ = int(this.GetFiringState());
        if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_IDLE) {
            param1.anim = int(EntityGraphics_Drone_Chaingun.ANIM_MOVE);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING) {
            param1.anim = int(EntityGraphics_Drone_Chaingun.ANIM_PREFIRE);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING) {
            param1.anim = int(EntityGraphics_Drone_Chaingun.ANIM_POSTFIRE);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_FIRING) {
            param1.anim = int(EntityGraphics_Drone_Chaingun.ANIM_FIRING);
        }
    }
    Debug_Draw(param1) {
        super.Debug_Draw(param1);
        param1.SetStyle(4, 8947848, 50);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r / 2);
        if (this.chaingun_HACKY_hitmode == 1) {
            param1.SetStyle(0, 8947848, 100 * (1 - Number(this.chaingun_timer) / Number(this.chaingun_rate)));
            param1.DrawLine(this.pos.x, this.pos.y, this.chaingun_hit_pos.x, this.chaingun_hit_pos.y);
            param1.DrawLine(this.chaingun_hit_pos.x, this.chaingun_hit_pos.y, this.chaingun_hit_pos.x + 4 * this.chaingun_hit_n.x, this.chaingun_hit_pos.y + 4 * this.chaingun_hit_n.y);
        }
    }
}
export class Entity_Drone_Zap extends Entity_Drone_Base {
    constructor(param1, param2, param3, param4, param5) {
        param4 = uint(param4);
        param5 = uint(param5);
        var _loc6_ = 12 * (1 / 14) * 2 * (40 / sim_globals.sim_rate);
        super(param1, param2, param3, _loc6_, param4, param5);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
            _loc9_ = param4.x - this.pos.x;
            _loc10_ = param4.y - this.pos.y;
            _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
            _loc9_ /= _loc11_;
            _loc10_ /= _loc11_;
            param1.HACKY_GetParticleManager().Spawn_Zap(this.pos.x + _loc9_ * this.r, this.pos.y + _loc10_ * this.r, Math.atan2(_loc10_, _loc9_) / Math.PI * 180);
            if (param2 == null) {
                param3.vec_x = _loc9_ * 12;
                param3.vec_y = _loc10_ * 12 - 4;
                return true;
            }
            param1.Event_PlayerWasKilled(param2, sim_globals.ENEMYTYPE_ZAP, param4.x - _loc9_ * param7, param4.y - _loc10_ * param7, _loc9_ * 12, _loc10_ * 12 - 4);
        }
        return false;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Drone_Zap(this);
    }
    GFX_UpdateState(param1) {
        var _loc2_ = param1;
        _loc2_.pos.x = this.pos.x;
        _loc2_.pos.y = this.pos.y;
        _loc2_.orn = this.gfxorn;
    }
    Debug_Draw(param1) {
        super.Debug_Draw(param1);
        param1.SetStyle(4, 8947967, 50);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r / 2);
    }
}
export class Entity_Drone_Chaser extends Entity_Drone_Zap {
    isChasing = false;
    speed_regular = NaN;
    speed_chasing = NaN;
    old_chase_DIR = int(0);
    gfx_startedChasing = false;
    constructor(param1, param2, param3, param4, param5) {
        param4 = uint(param4);
        param5 = uint(param5);
        super(param1, param2, param3, param4, param5);
        this.isChasing = false;
        this.speed_regular = this.speed;
        this.speed_chasing = this.speed_regular * 2;
        this.gfx_startedChasing = false;
        this.old_chase_DIR = int(-1);
    }
    Think(param1) {
    }
    StartChasing(param1) {
        param1 = uint(param1);
        this.facing_DIR = uint(param1);
        this.speed = this.speed_chasing;
        this.isChasing = true;
        this.gfx_startedChasing = true;
    }
    StopChasing(param1) {
        param1 = uint(param1);
        this.old_chase_DIR = int(this.facing_DIR);
        this.facing_DIR = uint(param1);
        this.speed = this.speed_regular;
        this.isChasing = false;
    }
    ChooseNextDirAndGoal(param1, param2) {
        var _loc5_ = uint(0);
        var _loc6_ = null;
        var _loc7_ = int(0);
        var _loc8_ = uint(0);
        var _loc9_ = null;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = false;
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc15_ = int(0);
        var _loc16_ = int(0);
        var _loc17_ = int(0);
        var _loc18_ = int(0);
        var _loc19_ = int(0);
        var _loc20_ = int(0);
        var _loc21_ = int(0);
        if (this.isChasing) {
            if (this.ChooseNextDirAndGoal_HELPER_TestDir(param1, this.facing_DIR, this.next_goal)) {
                return true;
            }
            _loc5_ = uint((this.facing_DIR - Entity_Drone_Base.MOVELIST[this.move_TYPE][0] + 4) % 4);
            this.StopChasing(_loc5_);
        }
        var _loc3_ = uint(this.facing_DIR);
        if (this.old_chase_DIR != -1) {
            _loc3_ = uint(uint(this.old_chase_DIR));
            this.old_chase_DIR = int(-1);
        }
        var _loc4_ = int(0);
        for (; _loc4_ < param2.length; (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1))) {
            guard();
            if (!param2[_loc4_].IsDead()) {
                _loc6_ = param2[_loc4_].GetPos();
                _loc7_ = int(-1);
                while (_loc7_ <= 1) {
                    guard();
                    _loc8_ = uint(uint(int((_loc3_ + _loc7_ + 4) % 4)));
                    _loc9_ = Entity_Drone_Base.DIR_TO_VEC2[_loc8_];
                    _loc10_ = _loc6_.x - this.pos.x;
                    _loc11_ = _loc6_.y - this.pos.y;
                    if (_loc9_.x * _loc10_ + _loc9_.y * _loc11_ > 0) {
                        if (Math.abs(-_loc9_.y * _loc10_ + _loc9_.x * _loc11_) <= 12) {
                            _loc12_ = true;
                            _loc13_ = int(1);
                            if (_loc8_ % 2 == 1) {
                                _loc12_ = false;
                            }
                            if (_loc8_ >= 2) {
                                _loc13_ = int(-1);
                            }
                            if (_loc12_) {
                                _loc14_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.x));
                                _loc15_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.y));
                                _loc16_ = int(param1.SweepHorizontal(_loc15_, _loc15_, _loc14_, _loc13_));
                                _loc17_ = int(param1.GetGridCoordinateFromWorldspace_1D(_loc6_.x));
                                if (_loc17_ < Math.min(_loc14_, _loc16_) || _loc17_ > Math.max(_loc14_, _loc16_)) {
                                    (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
                                    continue;
                                }
                            }
                            else {
                                _loc18_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.y));
                                _loc19_ = int(param1.GetGridCoordinateFromWorldspace_1D(this.pos.x));
                                _loc20_ = int(param1.SweepVertical(_loc19_, _loc19_, _loc18_, _loc13_));
                                _loc21_ = int(param1.GetGridCoordinateFromWorldspace_1D(_loc6_.y));
                                if (_loc21_ < Math.min(_loc18_, _loc20_) || _loc21_ > Math.max(_loc18_, _loc20_)) {
                                    (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
                                    continue;
                                }
                            }
                            if (this.ChooseNextDirAndGoal_HELPER_TestDir(param1, _loc8_, this.next_goal)) {
                                this.StartChasing(_loc8_);
                                return true;
                            }
                        }
                    }
                    (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
                }
            }
        }
        return super.ChooseNextDirAndGoal(param1, param2);
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Drone_Chaser(this);
    }
    GFX_UpdateState(param1) {
        var _loc2_ = param1;
        _loc2_.pos.x = this.pos.x;
        _loc2_.pos.y = this.pos.y;
        _loc2_.orn = this.gfxorn;
        if (this.gfx_startedChasing) {
            this.gfx_startedChasing = false;
            _loc2_.anim = int(EntityGraphics_Drone_Chaser.ANIM_CHASE);
        }
        else {
            _loc2_.anim = int(EntityGraphics_Drone_Chaser.ANIM_IDLE);
        }
    }
    Debug_Draw(param1) {
        super.Debug_Draw(param1);
        var _loc2_ = this.pos.x + Math.SQRT1_2 * this.r;
        var _loc3_ = this.pos.y - Math.SQRT1_2 * this.r;
        if (this.isChasing) {
            param1.SetStyle(2, 0, 100);
        }
        else {
            param1.SetStyle(0, 0, 100);
        }
        param1.DrawLine(_loc2_, _loc3_, _loc2_, _loc3_ - 8);
    }
}
export class Entity_Drone_Laser extends Entity_Drone_Shooter_Base {
    laser_duration = int(80);
    laser_timer = int(0);
    laser_dir = null;
    laser_hit_pos = null;
    laser_hit_n = null;
    constructor(param1, param2, param3, param4, param5) {
        param4 = uint(param4);
        param5 = uint(param5);
        var _loc6_ = 12 * (1 / 14) * 0.5 * (40 / sim_globals.sim_rate);
        var _loc7_ = int(30 * (sim_globals.sim_rate / 40));
        var _loc8_ = int(40 * (sim_globals.sim_rate / 40));
        super(param1, param2, param3, _loc6_, param4, param5, _loc7_, _loc8_);
        this.laser_timer = int(0);
        this.laser_dir = new vec2(0, 0);
        this.laser_hit_pos = new vec2();
        this.laser_hit_n = new vec2();
    }
    Start_Prefiring(param1, param2) {
        this.laser_dir.x = param2.x - this.pos.x;
        this.laser_dir.y = param2.y - this.pos.y;
        this.laser_dir.Normalize();
        var _loc3_ = param1.segGrid.GetRaycastDistance(this.pos.x, this.pos.y, this.laser_dir.x, this.laser_dir.y, this.laser_hit_pos, this.laser_hit_n);
    }
    Update_Prefiring(param1, param2) {
        var _loc3_ = param1.segGrid.GetRaycastDistance(this.pos.x, this.pos.y, this.laser_dir.x, this.laser_dir.y, this.laser_hit_pos, this.laser_hit_n);
        param1.HACKY_GetParticleManager().Spawn_LaserCharge(this.pos);
    }
    Start_Firing(param1, param2, param3) {
        this.laser_timer = int(0);
    }
    Update_Firing(param1) {
        var _loc4_ = NaN;
        var _loc5_ = NaN;
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc2_ = param1.segGrid.GetRaycastDistance(this.pos.x, this.pos.y, this.laser_dir.x, this.laser_dir.y, this.laser_hit_pos, this.laser_hit_n);
        param1.HACKY_GetParticleManager().Spawn_LaserCharge(this.pos);
        var _loc3_ = int(0);
        while (_loc3_ < param1.playerList.length) {
            guard();
            if (!param1.playerList[_loc3_].IsDead()) {
                if (colutils.Overlap_Circle_Vs_Segment(param1.playerList[_loc3_].GetPos(), param1.playerList[_loc3_].GetRadius(), this.pos, this.laser_hit_pos, _loc2_)) {
                    _loc4_ = param1.playerList[_loc3_].GetPos().x - this.pos.x;
                    _loc5_ = param1.playerList[_loc3_].GetPos().y - this.pos.y;
                    _loc6_ = this.laser_dir.x * _loc4_ + this.laser_dir.y * _loc5_;
                    _loc7_ = this.pos.x + _loc6_ * this.laser_dir.x;
                    _loc8_ = this.pos.y + _loc6_ * this.laser_dir.y;
                    param1.Event_PlayerWasKilled(param1.playerList[_loc3_], sim_globals.ENEMYTYPE_LASER, _loc7_, _loc8_, this.laser_dir.x * 6, this.laser_dir.y * 6);
                }
            }
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        (this.laser_timer = int(this.laser_timer + 1));
        if (this.laser_duration <= this.laser_timer) {
            return true;
        }
        return false;
    }
    Start_Postfiring(param1) {
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Drone_Laser(this);
    }
    GFX_UpdateState(param1) {
        param1.pos.x = this.pos.x;
        param1.pos.y = this.pos.y;
        param1.orn = this.gfxorn;
        var _loc2_ = int(this.GetFiringState());
        if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_IDLE) {
            param1.anim = int(EntityGraphics_Drone_Laser.ANIM_MOVE);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING) {
            param1.anim = int(EntityGraphics_Drone_Laser.ANIM_PREFIRE);
            param1.blast_pos.x = this.laser_hit_pos.x;
            param1.blast_pos.y = this.laser_hit_pos.y;
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING) {
            param1.anim = int(EntityGraphics_Drone_Laser.ANIM_POSTFIRE);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_FIRING) {
            param1.anim = int(EntityGraphics_Drone_Laser.ANIM_FIRING);
            param1.blast_scale = 30 + 200 * (this.laser_timer / this.laser_duration);
        }
    }
    Debug_Draw(param1) {
        super.Debug_Draw(param1);
        param1.SetStyle(4, 8921634, 50);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r / 2);
        var _loc2_ = int(this.GetFiringState());
        if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING) {
            param1.SetStyle(0, 8921634, 20);
            param1.DrawLine(this.pos.x, this.pos.y, this.laser_hit_pos.x, this.laser_hit_pos.y);
            param1.DrawLine(this.laser_hit_pos.x, this.laser_hit_pos.y, this.laser_hit_pos.x + this.laser_hit_n.x * 4, this.laser_hit_pos.y + this.laser_hit_n.y * 4);
        }
        else if (_loc2_ == Entity_Drone_Shooter_Base.FIRING_STATE_FIRING) {
            param1.SetStyle(2, 8921634, 80);
            param1.DrawLine(this.pos.x, this.pos.y, this.laser_hit_pos.x, this.laser_hit_pos.y);
            param1.DrawLine(this.laser_hit_pos.x, this.laser_hit_pos.y, this.laser_hit_pos.x + this.laser_hit_n.x * 4, this.laser_hit_pos.y + this.laser_hit_n.y * 4);
        }
    }
}
export class Entity_ExitDoor extends Entity_Base {
    pos = null;
    r = NaN;
    isOpen = false;
    constructor(param1, param2) {
        super();
        this.pos = new vec2(param1, param2);
        this.r = 12;
        this.isOpen = false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        if (param2 != null) {
            if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
                param1.Event_Exit_HitPlayer(param2);
            }
        }
        return false;
    }
    SWITCH_OpenTheExit(param1) {
        this.isOpen = true;
        param1.ENTITY_Add(this.pos, this);
    }
    SWITCH_IsOpen() {
        return this.isOpen;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_ExitDoor(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.isOpen) {
            param1.anim = int(EntityGraphics_ExitDoor.ANIM_OPEN);
        }
        else {
            param1.anim = int(EntityGraphics_ExitDoor.ANIM_CLOSED);
        }
    }
    Debug_Draw(param1) {
        if (this.isOpen) {
            param1.SetStyle(0, 0, 100);
            param1.DrawSquare(this.pos.x, this.pos.y, this.r);
            param1.DrawSquare(this.pos.x, this.pos.y, this.r - 2);
        }
        else {
            param1.SetStyle(0, 0, 30);
            param1.DrawCross(this.pos.x, this.pos.y, this.r);
            param1.DrawSquare(this.pos.x, this.pos.y, this.r);
        }
    }
}
export class Entity_ExitSwitch extends Entity_Base {
    pos = null;
    r = NaN;
    door = null;
    constructor(param1, param2, param3, param4) {
        super();
        this.pos = new vec2(param2, param3);
        this.r = 12 * 0.5;
        this.door = param4;
        param1.ENTITY_Add(this.pos, this);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        if (param2 != null) {
            if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
                this.door.SWITCH_OpenTheExit(param1.objGrid);
                param1.objGrid.ENTITY_Remove(this);
            }
        }
        return false;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_ExitSwitch(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.door.SWITCH_IsOpen()) {
            param1.anim = int(EntityGraphics_ExitSwitch.ANIM_OPEN);
        }
        else {
            param1.anim = int(EntityGraphics_ExitSwitch.ANIM_CLOSED);
        }
    }
    Debug_Draw(param1) {
        if (this.door.SWITCH_IsOpen()) {
            param1.SetStyle(0, 0, 10);
        }
        else {
            param1.SetStyle(0, 0, 100);
        }
        param1.DrawSquare(this.pos.x, this.pos.y, this.r);
        param1.DrawCross(this.pos.x, this.pos.y, this.r);
    }
}
export class Entity_FloorGuard extends Entity_Base {
    pos = null;
    speed = NaN;
    r = NaN;
    CUR_STATE = int(0);
    margin = NaN;
    constructor(param1, param2, param3) {
        super();
        this.pos = new vec2(param2, param3);
        this.r = 12 * 0.5;
        this.speed = 12 * (3 / 7) * (40 / sim_globals.sim_rate);
        this.CUR_STATE = int(0);
        this.margin = 0;
        param1.ENTITY_Add(this.pos, this);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
            _loc9_ = param4.x - this.pos.x;
            _loc10_ = param4.y - this.pos.y;
            _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
            _loc9_ /= _loc11_;
            _loc10_ /= _loc11_;
            param1.HACKY_GetParticleManager().Spawn_Zap(this.pos.x + _loc9_ * this.r, this.pos.y + _loc10_ * this.r, Math.atan2(_loc10_, _loc9_) / Math.PI * 180);
            if (param2 == null) {
                param3.vec_x = _loc9_ * 10;
                param3.vec_y = _loc10_ * 10;
                return true;
            }
            param1.Event_PlayerWasKilled(param2, sim_globals.ENEMYTYPE_FLOORGUARD, param4.x - _loc9_ * param7, param4.y - _loc10_ * param7, _loc9_ * 10, _loc10_ * 10);
        }
        return false;
    }
    Think(param1) {
        var _loc2_ = null;
        var _loc3_ = int(0);
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        var _loc8_ = int(0);
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = int(0);
        if (this.CUR_STATE == 0) {
            _loc2_ = param1.edgeGrid;
            _loc3_ = int(0);
            while (_loc3_ < param1.playerList.length) {
                guard();
                _loc4_ = param1.playerList[_loc3_];
                if (!_loc4_.IsDead()) {
                    _loc5_ = _loc4_.GetPos();
                    _loc6_ = this.pos.y + this.r;
                    _loc7_ = _loc6_ - 24;
                    if (_loc5_.y >= _loc7_ && _loc5_.y <= _loc6_) {
                        _loc8_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc5_.x));
                        _loc9_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x));
                        _loc10_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y));
                        _loc11_ = int(0);
                        if (_loc2_.ScanHorizontal(_loc10_, _loc10_, _loc9_, _loc8_)) {
                            _loc11_ = int(1);
                            if (_loc5_.x < this.pos.x) {
                                _loc11_ = int(-1);
                            }
                        }
                        if (_loc11_ != 0) {
                            this.CUR_STATE = int(_loc11_);
                            break;
                        }
                    }
                }
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
        }
    }
    Move(param1) {
        var _loc8_ = int(0);
        if (this.CUR_STATE == 0) {
            return;
        }
        var _loc2_ = param1.edgeGrid;
        var _loc3_ = this.r + this.margin;
        var _loc4_ = this.pos.x + this.CUR_STATE * this.speed;
        var _loc5_ = this.CUR_STATE * _loc3_;
        var _loc6_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x + _loc5_));
        var _loc7_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc4_ + _loc5_));
        if (_loc6_ != _loc7_) {
            _loc8_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y));
            if (!_loc2_.IsEmpty(_loc6_, _loc8_, this.CUR_STATE, 0) || !_loc2_.IsSolid_IgnoreDoors(_loc7_, _loc8_, 0, 1)) {
                _loc4_ = _loc2_.GetWorldspaceCoordinateFromGridEdge_1D(_loc6_, this.CUR_STATE) - this.CUR_STATE * (_loc3_ + 0.01);
                this.CUR_STATE = int(0);
            }
        }
        this.pos.x = _loc4_;
        param1.objGrid.ENTITY_Move(this.pos, this);
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_FloorGuard(this);
    }
    GFX_UpdateState(param1) {
        param1.pos.x = this.pos.x;
        param1.pos.y = this.pos.y;
        if (this.CUR_STATE == 0) {
            param1.anim = int(EntityGraphics_FloorGuard.ANIM_IDLE);
        }
        else if (this.CUR_STATE == -1) {
            param1.anim = int(EntityGraphics_FloorGuard.ANIM_CHASE_L);
        }
        else {
            param1.anim = int(EntityGraphics_FloorGuard.ANIM_CHASE_R);
        }
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r);
        if (this.CUR_STATE != 0) {
            param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + this.CUR_STATE * 8, this.pos.y);
        }
    }
}
export class Entity_Gold extends Entity_Base {
    pos = null;
    r = NaN;
    isCollected = false;
    constructor(param1, param2, param3) {
        super();
        this.pos = new vec2(param2, param3);
        this.r = 12 * 0.5;
        this.isCollected = false;
        param1.ENTITY_Add(this.pos, this);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        if (param2 != null) {
            if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
                if (param1.Event_Gold_HitPlayer(param2)) {
                    this.isCollected = true;
                    param1.objGrid.ENTITY_Remove(this);
                    param1.HACKY_GetSoundManager().PlaySound_Gold();
                }
            }
        }
        return false;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Gold(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.isCollected) {
            param1.anim = int(EntityGraphics_Gold.ANIM_COLLECTED);
        }
        else {
            param1.anim = int(EntityGraphics_Gold.ANIM_NOT_COLLECTED);
        }
    }
    Debug_Draw(param1) {
        if (this.isCollected) {
            param1.SetStyle(0, 0, 10);
        }
        else {
            param1.SetStyle(0, 0, 100);
        }
        param1.DrawSquare(this.pos.x, this.pos.y, this.r / 2);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r);
    }
}
export class Entity_Launchpad extends Entity_Base {
    pos = null;
    n = null;
    r = NaN;
    strength = NaN;
    pow = NaN;
    gfx_triggerEvent = false;
    constructor(param1, param2, param3, param4, param5) {
        super();
        this.pos = new vec2(param2, param3);
        this.n = new vec2(param4, param5);
        this.r = 12 * 0.5;
        this.strength = 12 * (3 / 7);
        param1.ENTITY_Add(this.pos, this);
        this.gfx_triggerEvent = false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
            _loc9_ = this.pos.x - (param4.x - this.n.x * param7);
            _loc10_ = this.pos.y - (param4.y - this.n.y * param7);
            param8 = 0.1;
            if (-param8 <= this.n.x * _loc9_ + this.n.y * _loc10_) {
                _loc11_ = 1;
                if (this.n.y < 0) {
                    _loc11_ += Math.abs(this.n.y);
                }
                if (param2 == null) {
                    param3.vec_x = this.n.x * 12;
                    param3.vec_y = this.n.y * 12;
                    this.gfx_triggerEvent = true;
                    return true;
                }
                param1.Event_Launchpad_HitPlayer(param2, this.n.x * this.strength, this.n.y * this.strength * _loc11_);
                this.gfx_triggerEvent = true;
            }
        }
        return false;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Launchpad(this, this.pos.x, this.pos.y, Math.atan2(this.n.y, this.n.x));
    }
    GFX_UpdateState(param1) {
        if (this.gfx_triggerEvent) {
            param1.anim = int(EntityGraphics_Launchpad.ANIM_LAUNCH);
            this.gfx_triggerEvent = false;
        }
        else {
            param1.anim = int(EntityGraphics_Launchpad.ANIM_IDLE);
        }
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawBox(this.pos.x, this.pos.y, -this.n.y * this.r, this.n.x * this.r, this.n.x * 2, this.n.y * 2);
        param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + this.n.x * 6, this.pos.y + this.n.y * 6);
    }
}
export class Entity_Mine extends Entity_Base {
    pos = null;
    r = NaN;
    isExploded = false;
    constructor(param1, param2, param3) {
        super();
        this.pos = new vec2(param2, param3);
        this.r = 12 * (1 / 3);
        this.isExploded = false;
        param1.ENTITY_Add(this.pos, this);
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        if (colutils.Overlap_Circle_Vs_Circle(this.pos, this.r, param4, param7)) {
            param1.HACKY_GetParticleManager().Spawn_Explosion(this.pos);
            this.isExploded = true;
            param1.objGrid.ENTITY_Remove(this);
            _loc9_ = param4.x - this.pos.x;
            _loc10_ = param4.y - this.pos.y;
            _loc11_ = Math.sqrt(_loc9_ * _loc9_ + _loc10_ * _loc10_);
            _loc9_ /= _loc11_;
            _loc10_ /= _loc11_;
            if (param2 == null) {
                param3.vec_x = _loc9_ * 16;
                param3.vec_y = _loc10_ * 16;
                return true;
            }
            param1.Event_PlayerWasKilled(param2, sim_globals.ENEMYTYPE_MINE, param4.x - _loc9_ * param7, param4.y - _loc10_ * param7, _loc9_ * 16, _loc10_ * 16);
        }
        return false;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Mine(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.isExploded) {
            param1.anim = int(EntityGraphics_Mine.ANIM_EXPLODED);
        }
        else {
            param1.anim = int(EntityGraphics_Mine.ANIM_UNEXPLODED);
        }
    }
    Debug_Draw(param1) {
        if (this.isExploded) {
            param1.SetStyle(0, 0, 30);
        }
        else {
            param1.SetStyle(0, 0, 100);
        }
        param1.DrawCross(this.pos.x, this.pos.y, this.r);
        param1.DrawCircle(this.pos.x, this.pos.y, this.r);
    }
}
export class Entity_OnewayPlatform extends Entity_Base {
    pos = null;
    n = null;
    r = NaN;
    constructor(param1, param2, param3, param4, param5) {
        super();
        this.pos = new vec2(param2, param3);
        this.n = new vec2(param4, param5);
        this.r = 12;
        param1.ENTITY_Add(this.pos, this);
    }
    CollideVsCircle_Physical(param1, param2, param3, param4, param5) {
        var _loc6_ = NaN;
        _loc6_ = this.CalculatePenetration(param2, param3, param4, param5, 0);
        if (_loc6_ >= 0) {
            param1.isHardCollision = true;
            param1.nx = this.n.x;
            param1.ny = this.n.y;
            param1.pen = _loc6_;
            return true;
        }
        return false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        if (param2 != null) {
            _loc9_ = this.CalculatePenetration(param4, param5, param6, param7, param8);
            if (_loc9_ >= 0) {
                param3.vec_x = this.n.x;
                param3.vec_y = this.n.y;
                return true;
            }
        }
        return false;
    }
    CalculatePenetration(param1, param2, param3, param4, param5) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc6_ = param1.x - this.pos.x;
        var _loc7_ = param1.y - this.pos.y;
        var _loc8_ = this.r + param4 - Math.abs(-this.n.y * _loc6_ + this.n.x * _loc7_);
        if (0 < _loc8_) {
            _loc9_ = param4 + param5 - Math.abs(this.n.x * _loc6_ + this.n.y * _loc7_);
            if (0 < _loc9_) {
                _loc10_ = this.n.x * param2.x + this.n.y * param2.y;
                if (_loc10_ <= 0) {
                    _loc11_ = param3.x - this.pos.x;
                    _loc12_ = param3.y - this.pos.y;
                    _loc13_ = param4 - (this.n.x * _loc11_ + this.n.y * _loc12_);
                    if (_loc13_ <= 1.1) {
                        _loc14_ = param4 - (this.n.x * _loc6_ + this.n.y * _loc7_);
                        if (_loc14_ < 0) {
                            trace("WARNING! Entity_OnewayPlatform.CalculatePenetration() found conflicting penetration: " + _loc8_ + "," + _loc9_ + "," + _loc14_);
                            return -1;
                        }
                        return _loc14_;
                    }
                }
            }
        }
        return -1;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_OnewayPlatform(this.pos.x, this.pos.y, Math.atan2(this.n.y, this.n.x));
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawLine(this.pos.x - -this.n.y * this.r, this.pos.y - this.n.x * this.r, this.pos.x + -this.n.y * this.r, this.pos.y + this.n.x * this.r);
        param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + this.n.x * 4, this.pos.y + this.n.y * 4);
    }
}
export class Entity_Rocket extends Entity_Base {
    static STATE_IDLE = int(0);
    static STATE_PREFIRE = int(0);
    static STATE_HOMING = int(0);
    maxspeed = NaN;
    accel_start = NaN;
    accel_rate = NaN;
    turn_rate = NaN;
    prefire_delay = NaN;
    prediction_scale = NaN;
    gfx_PREV_STATE = int(0);
    pos = null;
    rocket_pos = null;
    rocket_dir = null;
    rocket_speed = NaN;
    rocket_accel = NaN;
    shot_timer = NaN;
    CUR_STATE = int(0);
    targetIndex = int(0);
    nearSegs = null;
    old_pos = null;
    rocket_vel = null;
    hit_pos = null;
    hit_n = null;
    constructor(param1, param2, param3) {
        super();
        this.accel_start = 0.1 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.maxspeed = 12 * (2 / 7) * (40 / sim_globals.sim_rate);
        this.accel_rate = Math.pow(1.1, 40 / sim_globals.sim_rate);
        this.turn_rate = 0.1 * (40 / sim_globals.sim_rate);
        this.prefire_delay = 10 * (sim_globals.sim_rate / 40);
        this.prediction_scale = sim_globals.sim_rate / 40;
        this.pos = new vec2(param2, param3);
        this.rocket_pos = new vec2(param2, param3);
        this.rocket_dir = new vec2(1, 0);
        this.rocket_speed = 0;
        this.rocket_accel = this.accel_start;
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Rocket.STATE_IDLE);
        this.targetIndex = int(-1);
        this.gfx_PREV_STATE = int(this.CUR_STATE);
        this.nearSegs = asVector(0, null);
        this.old_pos = new vec2();
        this.rocket_vel = new vec2();
        this.hit_pos = new vec2();
        this.hit_n = new vec2();
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        if (this.CUR_STATE != Entity_Rocket.STATE_HOMING) {
            trace("WARNING! rocket.CollideVsPlayer() was called with a rocket that\'s not active.. this should be impossible, the rocket shouldn\'t be in the grid?! " + this.CUR_STATE);
            return false;
        }
        if (colutils.Overlap_Circle_Vs_Circle(this.rocket_pos, 0, param4, param7)) {
            this.Event_Explode(param1);
            _loc9_ = param4.x - this.rocket_pos.x;
            _loc10_ = param4.y - this.rocket_pos.y;
            if (param2 == null) {
                param3.vec_x = _loc9_ * 4;
                param3.vec_y = _loc10_ * 4;
                return true;
            }
            param1.Event_PlayerWasKilled(param2, sim_globals.ENEMYTYPE_ROCKET, this.rocket_pos.x, this.rocket_pos.y, _loc9_, _loc10_);
        }
        return false;
    }
    Think(param1) {
        var _loc2_ = int(0);
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        var _loc5_ = NaN;
        var _loc6_ = NaN;
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc16_ = NaN;
        var _loc17_ = NaN;
        var _loc18_ = NaN;
        var _loc19_ = NaN;
        var _loc20_ = NaN;
        var _loc21_ = NaN;
        var _loc22_ = NaN;
        var _loc23_ = NaN;
        var _loc24_ = NaN;
        this.gfx_PREV_STATE = int(this.CUR_STATE);
        if (this.CUR_STATE == Entity_Rocket.STATE_IDLE) {
            _loc2_ = int(entity_helpers.TryToAquireTarget(this.pos, param1.playerList, param1.segGrid));
            if (0 <= _loc2_) {
                this.shot_timer = 0;
                this.CUR_STATE = int(Entity_Rocket.STATE_PREFIRE);
                this.targetIndex = int(_loc2_);
            }
        }
        else if (this.CUR_STATE == Entity_Rocket.STATE_PREFIRE) {
            if (param1.playerList[this.targetIndex].IsDead()) {
                this.CUR_STATE = int(Entity_Rocket.STATE_IDLE);
            }
            else {
                ++this.shot_timer;
                if (this.prefire_delay <= this.shot_timer) {
                    this.rocket_pos.Copy(this.pos);
                    this.rocket_accel = this.accel_start;
                    this.rocket_speed = 0;
                    _loc3_ = param1.playerList[this.targetIndex].GetPos().x - this.pos.x;
                    _loc4_ = param1.playerList[this.targetIndex].GetPos().y - this.pos.y;
                    _loc5_ = _loc3_ * _loc3_ + _loc4_ * _loc4_;
                    if (_loc5_ != 0) {
                        _loc3_ /= Math.sqrt(_loc5_);
                        _loc4_ /= Math.sqrt(_loc5_);
                        this.rocket_dir.x = _loc3_;
                        this.rocket_dir.y = _loc4_;
                    }
                    else {
                        trace("WARNING! rocket.Think() found a player coincident with the rocket about to be launched!: " + _loc3_ + "," + _loc4_);
                        this.rocket_dir.x = 1;
                        this.rocket_dir.y = 0;
                    }
                    param1.objGrid.ENTITY_Add(this.rocket_pos, this);
                    this.CUR_STATE = int(Entity_Rocket.STATE_HOMING);
                }
            }
        }
        else if (this.CUR_STATE == Entity_Rocket.STATE_HOMING) {
            if (this.rocket_speed < this.maxspeed) {
                this.rocket_accel *= this.accel_rate;
                this.rocket_speed += this.rocket_accel;
            }
            else {
                this.rocket_speed = this.maxspeed;
            }
            this.old_pos.Copy(this.rocket_pos);
            this.rocket_vel.x = this.rocket_speed * this.rocket_dir.x;
            this.rocket_vel.y = this.rocket_speed * this.rocket_dir.y;
            this.rocket_pos.x += this.rocket_vel.x;
            this.rocket_pos.y += this.rocket_vel.y;
            param1.objGrid.ENTITY_Move(this.rocket_pos, this);
            param1.segGrid.GatherCellContentsFromWorldspaceRegion(Math.min(this.old_pos.x, this.rocket_pos.x), Math.min(this.old_pos.y, this.rocket_pos.y), Math.max(this.old_pos.x, this.rocket_pos.x), Math.max(this.old_pos.y, this.rocket_pos.y), this.nearSegs);
            this.hit_pos.x = 0;
            this.hit_pos.y = 0;
            this.hit_n.x = 0;
            this.hit_n.y = 0;
            _loc6_ = 2;
            _loc7_ = int(0);
            while (_loc7_ < this.nearSegs.length) {
                guard();
                _loc8_ = this.nearSegs[_loc7_];
                _loc9_ = _loc8_.IntersectWithRay(this.old_pos, this.rocket_vel, 0, this.hit_pos, this.hit_n);
                if (_loc9_ == -1) {
                    this.Event_Explode(param1);
                    return;
                }
                if (_loc9_ < _loc6_) {
                    _loc6_ = _loc9_;
                }
                (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
            }
            if (_loc6_ < 2) {
                this.Event_Explode(param1);
                return;
            }
            if (!param1.playerList[this.targetIndex].IsDead()) {
                _loc10_ = this.rocket_vel.x * this.prediction_scale;
                _loc11_ = this.rocket_vel.y * this.prediction_scale;
                _loc12_ = param1.playerList[this.targetIndex].GetVel().x * this.prediction_scale;
                _loc13_ = param1.playerList[this.targetIndex].GetVel().y * this.prediction_scale;
                _loc14_ = this.rocket_pos.x + _loc10_;
                _loc15_ = this.rocket_pos.y + _loc11_;
                _loc16_ = param1.playerList[this.targetIndex].GetPos().x + _loc12_;
                _loc17_ = param1.playerList[this.targetIndex].GetPos().y + _loc13_;
                _loc18_ = _loc16_ - _loc14_;
                _loc19_ = _loc17_ - _loc15_;
                _loc20_ = _loc18_ * _loc18_ + _loc19_ * _loc19_;
                if (_loc20_ == 0) {
                    return;
                }
                _loc18_ /= Math.sqrt(_loc20_);
                _loc19_ /= Math.sqrt(_loc20_);
                _loc21_ = -this.rocket_dir.y;
                _loc22_ = this.rocket_dir.x;
                _loc23_ = _loc21_ * _loc18_ + _loc22_ * _loc19_;
                this.rocket_dir.x += this.turn_rate * _loc23_ * _loc21_;
                this.rocket_dir.y += this.turn_rate * _loc23_ * _loc22_;
                _loc24_ = this.rocket_dir.Len();
                if (_loc24_ == 0) {
                    this.rocket_dir.x = 0;
                    this.rocket_dir.y = 0;
                }
                else {
                    this.rocket_dir.Scale(1 / _loc24_);
                }
            }
            param1.HACKY_GetParticleManager().Spawn_RocketSmoke(this.rocket_pos, Math.atan2(this.rocket_dir.y, this.rocket_dir.x) / Math.PI * 180);
        }
    }
    Event_Explode(param1) {
        param1.objGrid.ENTITY_Remove(this);
        this.CUR_STATE = int(Entity_Rocket.STATE_IDLE);
        this.targetIndex = int(-1);
        param1.HACKY_GetParticleManager().Spawn_Explosion(this.rocket_pos);
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Rocket(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        if (this.gfx_PREV_STATE == Entity_Rocket.STATE_PREFIRE && this.CUR_STATE == Entity_Rocket.STATE_HOMING) {
            param1.anim_base = int(EntityGraphics_Rocket.ANIM_FIRE);
        }
        else if (this.gfx_PREV_STATE == Entity_Rocket.STATE_HOMING && this.CUR_STATE != Entity_Rocket.STATE_HOMING) {
            param1.is_rocket_active = false;
            param1.anim_base = int(EntityGraphics_Rocket.ANIM_EXPLODE);
        }
        else if (this.CUR_STATE == Entity_Rocket.STATE_PREFIRE || this.CUR_STATE == Entity_Rocket.STATE_IDLE) {
            param1.is_rocket_active = false;
            param1.anim_base = int(EntityGraphics_Rocket.ANIM_IDLE);
        }
        if (this.CUR_STATE == Entity_Rocket.STATE_HOMING) {
            param1.is_rocket_active = true;
            param1.pos_rocket.x = this.rocket_pos.x;
            param1.pos_rocket.y = this.rocket_pos.y;
            param1.orn_rocket = Math.atan2(this.rocket_dir.y, this.rocket_dir.x);
        }
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawCircle(this.pos.x, this.pos.y, 4);
        if (this.CUR_STATE == Entity_Rocket.STATE_PREFIRE) {
            param1.DrawSquare(this.pos.x, this.pos.y, 4);
        }
        else {
            param1.DrawSquare(this.pos.x, this.pos.y, 2);
            if (this.CUR_STATE == Entity_Rocket.STATE_HOMING) {
                param1.DrawLine(this.rocket_pos.x, this.rocket_pos.y, this.rocket_pos.x - 4 * this.rocket_dir.x, this.rocket_pos.y - 4 * this.rocket_dir.y);
            }
        }
    }
}
export class Entity_Thwomp extends Entity_Base {
    pos = null;
    anchor = null;
    r = NaN;
    fallspeed = NaN;
    raisespeed = NaN;
    CUR_STATE = int(0);
    falldir = int(0);
    isHorizontal = false;
    n = null;
    constructor(param1, param2, param3, param4, param5) {
        param4 = int(param4);
        super();
        this.pos = new vec2(param2, param3);
        this.anchor = new vec2(param2, param3);
        this.r = 12 * (3 / 4);
        this.fallspeed = 12 * (5 / 14) * (40 / sim_globals.sim_rate);
        this.raisespeed = 12 * (1 / 7) * (40 / sim_globals.sim_rate);
        this.CUR_STATE = int(0);
        this.falldir = int(param4);
        this.isHorizontal = param5;
        param1.ENTITY_Add(this.pos, this);
        this.n = new vec2();
    }
    CollideVsCircle_Physical(param1, param2, param3, param4, param5) {
        this.n.x = 0;
        this.n.y = 0;
        var _loc6_ = colutils.Penetration_Square_vs_Point(this.pos, this.r + param5, param2, this.n);
        if (_loc6_ != 0) {
            param1.isHardCollision = false;
            param1.nx = this.n.x;
            param1.ny = this.n.y;
            param1.pen = _loc6_;
            return true;
        }
        return false;
    }
    CollideVsCircle_Logical(param1, param2, param3, param4, param5, param6, param7, param8) {
        param8 = 0.1;
        this.n.x = 0;
        this.n.y = 0;
        var _loc9_ = colutils.Penetration_Square_vs_Point(this.pos, param8 + this.r + param7, param4, this.n);
        if (_loc9_ != 0) {
            if (this.isHorizontal && this.n.x * this.falldir > 0 || !this.isHorizontal && this.n.y * this.falldir > 0) {
                if (this.isHorizontal) {
                    param1.HACKY_GetParticleManager().Spawn_ZapThwompH(this.pos, this.r * this.falldir, this.r);
                }
                else {
                    param1.HACKY_GetParticleManager().Spawn_ZapThwompV(this.pos, this.r, this.r * this.falldir);
                }
                if (param2 == null) {
                    param3.vec_x = this.n.x * 8;
                    param3.vec_y = this.n.y * 8 - 4;
                    return true;
                }
                param1.Event_PlayerWasKilled(param2, sim_globals.ENEMYTYPE_THWOMP, param4.x - this.n.x * param7, param4.y - this.n.y * param7, this.n.x * 8, this.n.y * 8 - 4);
            }
            else if (param2 != null) {
                param3.vec_x = this.n.x;
                param3.vec_y = this.n.y;
                return true;
            }
        }
        return false;
    }
    Think(param1) {
        var _loc2_ = null;
        var _loc3_ = int(0);
        var _loc4_ = null;
        var _loc5_ = null;
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc9_ = NaN;
        var _loc10_ = int(0);
        var _loc11_ = int(0);
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc15_ = int(0);
        var _loc16_ = int(0);
        var _loc17_ = int(0);
        var _loc18_ = int(0);
        var _loc19_ = int(0);
        if (this.CUR_STATE == 0) {
            _loc2_ = param1.edgeGrid;
            _loc3_ = int(0);
            while (_loc3_ < param1.playerList.length) {
                guard();
                _loc4_ = param1.playerList[_loc3_];
                if (!_loc4_.IsDead()) {
                    _loc5_ = _loc4_.GetPos();
                    _loc6_ = _loc4_.GetRadius();
                    _loc7_ = _loc5_.x - this.pos.x;
                    _loc8_ = _loc5_.y - this.pos.y;
                    _loc9_ = 2 * (this.r + _loc6_);
                    if (this.isHorizontal) {
                        if (Math.abs(_loc8_) < _loc9_) {
                            _loc10_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x - this.falldir * this.r));
                            _loc11_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y - this.r));
                            _loc12_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y + this.r));
                            _loc13_ = int(_loc2_.SweepHorizontal(_loc11_, _loc12_, _loc10_, this.falldir));
                            _loc14_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc5_.x));
                            if (!(_loc14_ < Math.min(_loc10_, _loc13_) || _loc14_ > Math.max(_loc10_, _loc13_))) {
                                this.CUR_STATE = int(1);
                                break;
                            }
                        }
                    }
                    else if (Math.abs(_loc7_) < _loc9_) {
                        _loc15_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y - this.falldir * this.r));
                        _loc16_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x - this.r));
                        _loc17_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x + this.r));
                        _loc18_ = int(_loc2_.SweepVertical(_loc16_, _loc17_, _loc15_, this.falldir));
                        _loc19_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc5_.y));
                        if (!(_loc19_ < Math.min(_loc15_, _loc18_) || _loc19_ > Math.max(_loc15_, _loc18_))) {
                            this.CUR_STATE = int(1);
                            break;
                        }
                    }
                }
                (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
            }
        }
    }
    Move(param1) {
        var _loc6_ = NaN;
        var _loc7_ = int(0);
        var _loc8_ = int(0);
        var _loc9_ = int(0);
        var _loc10_ = int(0);
        var _loc11_ = NaN;
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc15_ = int(0);
        if (this.CUR_STATE == 0) {
            return;
        }
        var _loc2_ = param1.edgeGrid;
        var _loc3_ = int(this.falldir * this.CUR_STATE);
        var _loc4_ = _loc3_ * this.r;
        var _loc5_ = this.fallspeed;
        if (this.CUR_STATE == -1) {
            _loc5_ = this.raisespeed;
        }
        if (this.isHorizontal) {
            _loc6_ = this.pos.x + _loc3_ * _loc5_;
            if (this.CUR_STATE == -1) {
                if ((this.pos.x - this.anchor.x) * (_loc6_ - this.anchor.x) <= 0) {
                    _loc6_ = this.anchor.x;
                }
            }
            _loc7_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x + _loc4_));
            _loc8_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc6_ + _loc4_));
            if (_loc7_ != _loc8_) {
                _loc9_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y - this.r));
                _loc10_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y + this.r));
                if (!_loc2_.IsEmpty_Column(_loc7_, _loc9_, _loc10_, _loc3_)) {
                    if (this.CUR_STATE != -1) {
                        this.CUR_STATE = int(-1);
                    }
                    return;
                }
            }
            this.pos.x = _loc6_;
            param1.objGrid.ENTITY_Move(this.pos, this);
            if (this.CUR_STATE == -1 && this.pos.x == this.anchor.x) {
                this.CUR_STATE = int(0);
            }
        }
        else {
            _loc11_ = this.pos.y + _loc3_ * _loc5_;
            if (this.CUR_STATE == -1) {
                if ((this.pos.y - this.anchor.y) * (_loc11_ - this.anchor.y) <= 0) {
                    _loc11_ = this.anchor.y;
                }
            }
            _loc12_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.y + _loc4_));
            _loc13_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(_loc11_ + _loc4_));
            if (_loc12_ != _loc13_) {
                _loc14_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x - this.r));
                _loc15_ = int(_loc2_.GetGridCoordinateFromWorldspace_1D(this.pos.x + this.r));
                if (!_loc2_.IsEmpty_Row(_loc12_, _loc14_, _loc15_, _loc3_)) {
                    if (this.CUR_STATE != -1) {
                        this.CUR_STATE = int(-1);
                    }
                    return;
                }
            }
            this.pos.y = _loc11_;
            param1.objGrid.ENTITY_Move(this.pos, this);
            if (this.CUR_STATE == -1 && this.pos.y == this.anchor.y) {
                this.CUR_STATE = int(0);
            }
        }
    }
    GenerateGraphicComponent() {
        var _loc1_ = 0;
        if (this.isHorizontal) {
            if (this.falldir < 0) {
                _loc1_ = Math.PI;
            }
        }
        else if (this.falldir < 0) {
            _loc1_ = 1.5 * Math.PI;
        }
        else {
            _loc1_ = 0.5 * Math.PI;
        }
        return new EntityGraphics_Thwomp(this, _loc1_);
    }
    GFX_UpdateState(param1) {
        param1.pos.x = this.pos.x;
        param1.pos.y = this.pos.y;
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawSquare(this.pos.x, this.pos.y, this.r);
        var _loc2_ = int(-4);
        while (_loc2_ <= 4) {
            guard();
            if (this.isHorizontal) {
                param1.DrawLine(this.pos.x + this.falldir * this.r - 2, this.pos.y + _loc2_, this.pos.x + this.falldir * this.r + 2, this.pos.y + _loc2_);
            }
            else {
                param1.DrawLine(this.pos.x + _loc2_, this.pos.y + this.falldir * this.r - 2, this.pos.x + _loc2_, this.pos.y + this.falldir * this.r + 2);
            }
            _loc2_ = int(_loc2_ + 4);
        }
        if (this.CUR_STATE != 0) {
            if (this.isHorizontal) {
                param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + this.falldir * this.CUR_STATE * 8, this.pos.y);
            }
            else {
                param1.DrawLine(this.pos.x, this.pos.y, this.pos.x, this.pos.y + this.falldir * this.CUR_STATE * 8);
            }
        }
    }
}
export class Entity_Turret extends Entity_Base {
    static STATE_IDLE = int(0);
    static STATE_TARGETTING = int(0);
    static STATE_PREFIRE = int(0);
    static STATE_POSTFIRE = int(0);
    threshold2 = null;
    aimspeed = null;
    timerstep = null;
    prediction_scale = NaN;
    pos = null;
    aim_pos = null;
    aim_region = int(0);
    shot_timer = NaN;
    CUR_STATE = int(0);
    targetIndex = int(0);
    gfx_triggerEvent = false;
    HACKY_drawtimer = int(0);
    HACKY_hit_pos = null;
    HACKY_hit_n = null;
    timer_firetime = NaN;
    prefire_delay = NaN;
    postfire_delay = NaN;
    TEMP_hit_pos = null;
    TEMP_hit_n = null;
    constructor(param1, param2, param3) {
        super();
        this.timer_firetime = 60 * (sim_globals.sim_rate / 40);
        this.prefire_delay = 10 * (sim_globals.sim_rate / 40);
        this.postfire_delay = 10 * (sim_globals.sim_rate / 40);
        this.threshold2 = asVector(3, 0);
        this.threshold2[0] = 9216;
        this.threshold2[1] = 1764;
        this.threshold2[2] = 576;
        this.aimspeed = asVector(4, 0);
        this.aimspeed[0] = 0.03 * (40 / sim_globals.sim_rate);
        this.aimspeed[1] = 0.035 * (40 / sim_globals.sim_rate);
        this.aimspeed[2] = 0.05 * (40 / sim_globals.sim_rate);
        this.aimspeed[3] = 0.05 * (40 / sim_globals.sim_rate);
        this.timerstep = asVector(4, 0);
        this.timerstep[0] = 0;
        this.timerstep[1] = 0.5;
        this.timerstep[2] = 1.5;
        this.timerstep[3] = 3.5;
        this.prediction_scale = sim_globals.sim_rate / 40;
        this.pos = new vec2(param2, param3);
        this.aim_pos = new vec2(param2, param3);
        this.aim_region = int(0);
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Turret.STATE_IDLE);
        this.targetIndex = int(-1);
        this.gfx_triggerEvent = false;
        this.HACKY_drawtimer = int(0);
        this.HACKY_hit_pos = new vec2();
        this.HACKY_hit_n = new vec2();
        this.TEMP_hit_pos = new vec2();
        this.TEMP_hit_n = new vec2();
    }
    Think(param1) {
        var _loc2_ = int(0);
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        var _loc5_ = NaN;
        var _loc6_ = NaN;
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        this.TEMP_hit_pos.x = 0;
        this.TEMP_hit_pos.y = 0;
        this.TEMP_hit_n.x = 0;
        this.TEMP_hit_n.y = 0;
        if (this.CUR_STATE == Entity_Turret.STATE_IDLE) {
            _loc2_ = int(entity_helpers.TryToAquireTarget(this.pos, param1.playerList, param1.segGrid));
            if (0 <= _loc2_) {
                this.Event_StartTargetting(_loc2_);
            }
        }
        else {
            if (this.targetIndex < 0) {
                trace("WARNING! Turret.Think() isn\'t idle, but has an invalid target index!: " + this.targetIndex);
                return;
            }
            if (this.CUR_STATE == Entity_Turret.STATE_TARGETTING) {
                if (!this.IsCurrentTargetVisible(param1, this.TEMP_hit_pos, this.TEMP_hit_n)) {
                    this.Event_StartIdling();
                }
                else {
                    this.UpdateAim(param1.playerList[this.targetIndex].GetPos(), param1.playerList[this.targetIndex].GetVel());
                    if (this.timer_firetime < this.shot_timer) {
                        this.Event_StartFiring();
                    }
                }
            }
            else if (this.CUR_STATE == Entity_Turret.STATE_PREFIRE) {
                ++this.shot_timer;
                if (this.prefire_delay <= this.shot_timer) {
                    if (!param1.playerList[this.targetIndex].IsDead()) {
                        _loc3_ = this.aim_pos.x - this.pos.x;
                        _loc4_ = this.aim_pos.y - this.pos.y;
                        _loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
                        _loc3_ /= _loc5_;
                        _loc4_ /= _loc5_;
                        _loc6_ = param1.segGrid.GetRaycastDistance(this.pos.x, this.pos.y, _loc3_, _loc4_, this.HACKY_hit_pos, this.HACKY_hit_n);
                        _loc7_ = int(0);
                        while (_loc7_ < param1.playerList.length) {
                            guard();
                            if (!param1.playerList[_loc7_].IsDead()) {
                                _loc8_ = param1.playerList[_loc7_].GetPos();
                                _loc9_ = param1.playerList[_loc7_].GetRadius();
                                if (colutils.Overlap_Circle_Vs_Segment(_loc8_, _loc9_, this.pos, this.HACKY_hit_pos, _loc6_)) {
                                    _loc10_ = _loc8_.x - this.pos.x;
                                    _loc11_ = _loc8_.y - this.pos.y;
                                    _loc12_ = _loc3_ * _loc10_ + _loc4_ * _loc11_;
                                    this.HACKY_hit_pos.x = this.pos.x + _loc12_ * _loc3_;
                                    this.HACKY_hit_pos.y = this.pos.y + _loc12_ * _loc4_;
                                    this.HACKY_hit_n.x = 0;
                                    this.HACKY_hit_n.y = 0;
                                    param1.Event_PlayerWasKilled(param1.playerList[_loc7_], sim_globals.ENEMYTYPE_TURRET, this.HACKY_hit_pos.x, this.HACKY_hit_pos.y, _loc3_ * 8, _loc4_ * 8);
                                }
                                this.HACKY_drawtimer = int(10);
                            }
                            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
                        }
                        param1.HACKY_GetParticleManager().Spawn_TurretBullet(this.pos, this.HACKY_hit_pos);
                        this.gfx_triggerEvent = true;
                    }
                    this.Event_StopFiring();
                }
            }
            else if (this.CUR_STATE == Entity_Turret.STATE_POSTFIRE) {
                ++this.shot_timer;
                if (this.postfire_delay <= this.shot_timer) {
                    if (this.IsCurrentTargetVisible(param1, this.TEMP_hit_pos, this.TEMP_hit_n)) {
                        this.Event_ResumeTargetting();
                    }
                    else {
                        this.Event_StartIdling();
                    }
                }
            }
        }
    }
    Event_StartIdling() {
        this.CUR_STATE = int(Entity_Turret.STATE_IDLE);
        this.targetIndex = int(-1);
    }
    Event_StartTargetting(param1) {
        param1 = int(param1);
        this.aim_pos.Copy(this.pos);
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Turret.STATE_TARGETTING);
        this.targetIndex = int(param1);
    }
    Event_ResumeTargetting() {
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Turret.STATE_TARGETTING);
    }
    Event_StartFiring() {
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Turret.STATE_PREFIRE);
    }
    Event_StopFiring() {
        this.shot_timer = 0;
        this.CUR_STATE = int(Entity_Turret.STATE_POSTFIRE);
    }
    IsCurrentTargetVisible(param1, param2, param3) {
        var _loc4_ = param1.playerList[this.targetIndex];
        var _loc5_ = false;
        if (!_loc4_.IsDead()) {
            _loc5_ = param1.segGrid.RaycastVsPlayer(this.pos, _loc4_.GetPos(), _loc4_.GetRadius(), param2, param3);
        }
        return _loc5_;
    }
    UpdateAim(param1, param2) {
        var _loc3_ = param2.x * this.prediction_scale;
        var _loc4_ = param2.y * this.prediction_scale;
        var _loc5_ = param1.x + _loc3_;
        var _loc6_ = param1.y + _loc4_;
        var _loc7_ = _loc5_ - this.aim_pos.x;
        var _loc8_ = _loc6_ - this.aim_pos.y;
        var _loc9_ = _loc7_ * _loc7_ + _loc8_ * _loc8_;
        this.aim_region = int(0);
        var _loc10_ = int(0);
        while (_loc10_ < this.threshold2.length) {
            guard();
            if (_loc9_ > this.threshold2[_loc10_]) {
                break;
            }
            (this.aim_region = int(this.aim_region + 1));
            (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
        }
        this.shot_timer += this.timerstep[this.aim_region];
        var _loc11_ = this.aimspeed[this.aim_region];
        this.aim_pos.x += _loc11_ * _loc7_;
        this.aim_pos.y += _loc11_ * _loc8_;
    }
    GenerateGraphicComponent() {
        return new EntityGraphics_Turret(this, this.pos.x, this.pos.y);
    }
    GFX_UpdateState(param1) {
        param1.pos_crosshair.x = this.aim_pos.x;
        param1.pos_crosshair.y = this.aim_pos.y;
        if (this.gfx_triggerEvent) {
            param1.anim_base = int(EntityGraphics_Turret.ANIM_FIRING);
            this.gfx_triggerEvent = false;
        }
        else if (this.CUR_STATE == Entity_Turret.STATE_IDLE) {
            param1.anim_base = int(EntityGraphics_Turret.ANIM_IDLE);
            param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_OFF);
        }
        else if (this.CUR_STATE == Entity_Turret.STATE_PREFIRE) {
            param1.anim_base = int(EntityGraphics_Turret.ANIM_PREFIRE);
            param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_PREFIRE);
        }
        else if (this.CUR_STATE == Entity_Turret.STATE_POSTFIRE) {
            param1.anim_base = int(EntityGraphics_Turret.ANIM_POSTFIRE);
            param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_POSTFIRE);
        }
        else if (this.CUR_STATE == Entity_Turret.STATE_TARGETTING) {
            if (this.aim_region == 0) {
                param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_FAR);
            }
            else if (this.aim_region == 1) {
                param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_MID);
            }
            else if (this.aim_region == 2) {
                param1.anim_crosshair = int(EntityGraphics_Turret.CROSSHAIR_NEAR);
            }
        }
    }
    Debug_Draw(param1) {
        param1.SetStyle(0, 0, 100);
        param1.DrawCircle(this.pos.x, this.pos.y, 4);
        param1.DrawCross(this.pos.x, this.pos.y, 2);
        if (this.CUR_STATE != Entity_Turret.STATE_IDLE) {
            if (this.CUR_STATE == Entity_Turret.STATE_TARGETTING) {
                if (this.aim_region == 0) {
                    param1.SetStyle(0, 0, 50);
                    param1.DrawPlus(this.aim_pos.x, this.aim_pos.y, 2);
                }
                else if (this.aim_region == 1) {
                    param1.SetStyle(0, 0, 75);
                    param1.DrawPlus(this.aim_pos.x, this.aim_pos.y, 3);
                }
                else if (this.aim_region > 1) {
                    param1.SetStyle(0, 0, 100);
                    param1.DrawPlus(this.aim_pos.x, this.aim_pos.y, 4);
                }
            }
            else if (this.CUR_STATE == 2) {
                param1.DrawSquare(this.aim_pos.x, this.aim_pos.y, 4);
            }
            else if (this.CUR_STATE == 3) {
                param1.DrawCircle(this.aim_pos.x, this.aim_pos.y, 2);
            }
            param1.SetStyle(0, 0, 10);
            param1.DrawLine(this.pos.x, this.pos.y, this.aim_pos.x, this.aim_pos.y);
        }
        if (this.HACKY_drawtimer > 0) {
            param1.SetStyle(0, 0, 100 * (Number(this.HACKY_drawtimer) / 10));
            param1.DrawLine(this.pos.x, this.pos.y, this.HACKY_hit_pos.x, this.HACKY_hit_pos.y);
            param1.DrawLine(this.HACKY_hit_pos.x, this.HACKY_hit_pos.y, this.HACKY_hit_pos.x + 4 * this.HACKY_hit_n.x, this.HACKY_hit_pos.y + 4 * this.HACKY_hit_n.y);
            (this.HACKY_drawtimer = int(this.HACKY_drawtimer - 1));
        }
    }
}
export class collision_result_logical {
    vec_x = NaN;
    vec_y = NaN;
    constructor() {
        this.Clear();
    }
    Clear() {
        this.vec_x = 0;
        this.vec_y = 0;
    }
}
export class collision_result_physical {
    pen = NaN;
    nx = NaN;
    ny = NaN;
    isHardCollision = false;
    constructor() {
        this.Clear();
    }
    Clear() {
        this.pen = 0;
        this.nx = 0;
        this.ny = 0;
        this.isHardCollision = true;
    }
}
export class entity_helpers {
    static zero_vec = null;
    static potentialList = null;
    constructor() {
    }
    static TryToAquireTarget(param1, param2, param3) {
        var _loc5_ = uint(0);
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc9_ = int(0);
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        entity_helpers.potentialList.length = 0;
        var _loc4_ = int(0);
        while (_loc4_ < param2.length) {
            guard();
            if (!param2[_loc4_].IsDead()) {
                if (param3.RaycastVsPlayer(param1, param2[_loc4_].GetPos(), param2[_loc4_].GetRadius(), entity_helpers.zero_vec, entity_helpers.zero_vec)) {
                    entity_helpers.potentialList.push(_loc4_);
                }
            }
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
        if (entity_helpers.potentialList.length > 0) {
            _loc5_ = uint(0);
            _loc6_ = param2[entity_helpers.potentialList[0]].GetPos().x - param1.x;
            _loc7_ = param2[entity_helpers.potentialList[0]].GetPos().y - param1.y;
            _loc8_ = _loc6_ * _loc6_ + _loc7_ * _loc7_;
            _loc9_ = int(1);
            while (_loc9_ < entity_helpers.potentialList.length) {
                guard();
                _loc10_ = param2[entity_helpers.potentialList[_loc9_]].GetPos().x - param1.x;
                _loc11_ = param2[entity_helpers.potentialList[_loc9_]].GetPos().y - param1.y;
                _loc12_ = _loc10_ * _loc10_ + _loc11_ * _loc11_;
                if (_loc12_ < _loc8_) {
                    _loc5_ = uint(uint(_loc9_));
                }
                (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
            }
            return int(entity_helpers.potentialList[_loc5_]);
        }
        return int(-1);
    }
}
export class InputSource_Base {
    static bit_J = int(0);
    static bit_L = int(0);
    static bit_R = int(0);
    frames = null;
    current_J = false;
    current_L = false;
    current_R = false;
    constructor(param1) {
        this.frames = param1;
        this.current_J = false;
        this.current_L = false;
        this.current_R = false;
    }
    DumpFrames() {
        this.frames.position = this.frames.length - 1;
        while (this.frames.position >= 0) {
            guard();
            if (this.frames.readByte() != 0) {
                break;
            }
            this.frames.position -= 2;
        }
        var _loc1_ = uint(this.frames.position);
        var _loc2_ = new ByteArray();
        _loc2_.position = 0;
        this.frames.position = 0;
        var _loc3_ = int(0);
        while (_loc3_ <= _loc1_) {
            guard();
            _loc2_.writeByte(this.frames.readByte());
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
        return _loc2_;
    }
    DumpString() {
        var _loc1_ = sim_globals.BAtoString(this.frames);
        var _loc2_ = int(_loc1_.length - 1);
        while (_loc1_.charAt(_loc2_) == "0" && _loc2_ > 0) {
            guard();
            _loc2_--;
        }
        return _loc1_.substring(0, _loc2_);
    }
    IsReplayFinished() {
        return false;
    }
    Tick(param1) {
        param1 = uint(param1);
    }
    IsButtonDown_Jump() {
        return this.current_J;
    }
    IsButtonDown_Left() {
        return this.current_L;
    }
    IsButtonDown_Right() {
        return this.current_R;
    }
}
export class InputSource_Playback extends InputSource_Base {
    input = null;
    is_finished = false;
    constructor(param1) {
        super(param1);
        this.is_finished = false;
    }
    IsReplayFinished() {
        return this.is_finished;
    }
    Tick(param1) {
        param1 = uint(param1);
        var _loc2_ = int(0);
        if (param1 >= this.frames.length) {
            this.current_J = false;
            this.current_L = false;
            this.current_R = false;
            this.is_finished = true;
        }
        else {
            this.frames.position = param1;
            _loc2_ = int(this.frames.readByte());
            this.current_J = (_loc2_ & InputSource_Base.bit_J) > 0;
            this.current_L = (_loc2_ & InputSource_Base.bit_L) > 0;
            this.current_R = (_loc2_ & InputSource_Base.bit_R) > 0;
        }
    }
}
export class InputSource_Recorder extends InputSource_Base {
    input = null;
    keycode_J = uint(0);
    keycode_L = uint(0);
    keycode_R = uint(0);
    constructor(param1, param2, param3, param4) {
        param2 = uint(param2);
        param3 = uint(param3);
        param4 = uint(param4);
        var _loc5_ = new ByteArray();
        _loc5_.length = 4096;
        super(_loc5_);
        this.input = param1;
        this.keycode_J = uint(param2);
        this.keycode_L = uint(param3);
        this.keycode_R = uint(param4);
    }
    Tick(param1) {
        param1 = uint(param1);
        this.current_J = this.input.IsKeyDown(this.keycode_J);
        this.current_L = this.input.IsKeyDown(this.keycode_L);
        this.current_R = this.input.IsKeyDown(this.keycode_R);
        if (param1 >= this.frames.length) {
            this.frames.length = param1 * 2;
        }
        var _loc2_ = int(0);
        if (this.current_J) {
            _loc2_ = int(_loc2_ | InputSource_Base.bit_J);
        }
        if (this.current_L) {
            _loc2_ = int(_loc2_ | InputSource_Base.bit_L);
        }
        if (this.current_R) {
            _loc2_ = int(_loc2_ | InputSource_Base.bit_R);
        }
        this.frames.position = param1;
        this.frames.writeByte(_loc2_);
    }
}
export class Ninja {
    static PSTATE_STANDING = uint(0);
    static PSTATE_RUNNING = uint(0);
    static PSTATE_SKIDDING = uint(0);
    static PSTATE_JUMPING = uint(0);
    static PSTATE_FALLING = uint(0);
    static PSTATE_WALLSLIDING = uint(0);
    static PSTATE_DEAD = uint(0);
    static PSTATE_AWAITINGDEATH = uint(0);
    static PSTATE_CELEBRATING = uint(0);
    static PSTATE_DISABLED = uint(0);
    static PSTATE_TO_STRING = null;
    inputsource = null;
    pos = null;
    vel = null;
    oldpos = null;
    r = NaN;
    g = NaN;
    d = NaN;
    maxspeedAir = NaN;
    maxspeedGround = NaN;
    groundAccel = NaN;
    airAccel = NaN;
    normGrav = NaN;
    jumpGrav = NaN;
    normDrag = NaN;
    winDrag = NaN;
    wallFriction = NaN;
    skidFriction = NaN;
    standFriction = NaN;
    curState = uint(0);
    facingDir = int(0);
    max_jump_time = NaN;
    jumptimer = NaN;
    jumpAmt = NaN;
    jump_y_bias = NaN;
    terminal_vel = NaN;
    wasJdown = false;
    oldv = null;
    WAS_IN_AIR = false;
    IN_AIR = false;
    NEAR_WALL = false;
    wallN = null;
    floorN = null;
    fcount = int(0);
    fvec = null;
    impulse_scale = NaN;
    pID = int(0);
    raggy = null;
    ninja_gfx = null;
    crush_threshold = NaN;
    crush_vec = null;
    crush_dist = NaN;
    crush_flag = false;
    death_type = int(0);
    death_pos = null;
    death_force = null;
    TEMP_near_pos = null;
    objList = null;
    segList = null;
    seg_cp = null;
    wallList_X = null;
    wallList_Y = null;
    result_logical = null;
    result_physical = null;
    cp = null;
    tempV = null;
    tempP = null;
    public_pos = null;
    public_vel = null;
    gfxColor = uint(0);
    constructor(param1, param2, param3, param4, param5 = 0) {
        param1 = int(param1);
        param5 = uint(param5);
        this.pID = int(param1);
        this.inputsource = param2;
        this.gfxColor = uint(param5);
        this.pos = new vec2(param3, param4);
        this.vel = new vec2(0, 0);
        this.oldpos = new vec2(0, 0);
        this.r = 10;
        this.impulse_scale = 40 / sim_globals.sim_rate;
        this.maxspeedAir = this.r * 0.5 * (40 / sim_globals.sim_rate);
        this.maxspeedGround = this.r * 0.5 * (40 / sim_globals.sim_rate);
        this.groundAccel = 0.15 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.airAccel = 0.1 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.normGrav = 0.15 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.jumpGrav = 0.025 * (40 / sim_globals.sim_rate) * (40 / sim_globals.sim_rate);
        this.normDrag = Math.pow(0.99, 40 / sim_globals.sim_rate);
        this.winDrag = Math.pow(0.8, 40 / sim_globals.sim_rate);
        this.wallFriction = Math.pow(0.87, 40 / sim_globals.sim_rate);
        this.skidFriction = Math.pow(0.92, 40 / sim_globals.sim_rate);
        this.standFriction = Math.pow(0.8, 40 / sim_globals.sim_rate);
        this.g = this.normGrav;
        this.d = this.normDrag;
        this.curState = uint(Ninja.PSTATE_DISABLED);
        this.facingDir = int(1);
        this.jumpAmt = 1;
        this.jump_y_bias = 2;
        this.max_jump_time = 30 * (sim_globals.sim_rate / 40);
        this.terminal_vel = this.r * 0.9 * (40 / sim_globals.sim_rate);
        this.jumptimer = 0;
        this.wasJdown = false;
        this.WAS_IN_AIR = false;
        this.oldv = new vec2(0, 0);
        this.IN_AIR = false;
        this.NEAR_WALL = false;
        this.wallN = new vec2(0, 0);
        this.floorN = new vec2(0, -1);
        this.fcount = int(1);
        this.fvec = new vec2();
        this.raggy = new Ragdoll();
        this.ninja_gfx = null;
        this.crush_threshold = 0.05;
        this.crush_vec = new vec2();
        this.crush_dist = 0;
        this.crush_flag = false;
        this.death_type = int(sim_globals.DEATHTYPE_TIME);
        this.death_pos = new vec2();
        this.death_force = new vec2();
        this.TEMP_near_pos = new vec2();
        this.objList = asVector(0, null);
        this.segList = asVector(0, null);
        this.seg_cp = new vec2();
        this.wallList_X = asVector(0, 0);
        this.wallList_Y = asVector(0, 0);
        this.result_logical = new collision_result_logical();
        this.result_physical = new collision_result_physical();
        this.cp = new vec2();
        this.tempV = new vec2();
        this.tempP = new vec2();
        this.public_pos = new vec2();
        this.public_vel = new vec2();
    }
    DEBUG_SetPosVel(param1, param2) {
        if (this.curState == Ninja.PSTATE_DEAD) {
            this.raggy.TESTING_SetPosVel(param1, param2);
        }
        else {
            this.pos.Copy(param1);
            this.vel.Copy(param2);
        }
    }
    DEBUG_Respawn(param1) {
        this.curState = uint(Ninja.PSTATE_STANDING);
        this.pos.x = param1.x;
        this.pos.y = param1.y;
        this.vel.x = 0;
        this.vel.y = 0;
        this.g = this.normGrav;
        this.d = this.normDrag;
    }
    GetIndex() {
        return int(this.pID);
    }
    GetPos() {
        this.public_pos.Copy(this.pos);
        return this.public_pos;
    }
    GetVel() {
        this.public_vel.Copy(this.vel);
        return this.public_vel;
    }
    GetRadius() {
        return this.r;
    }
    IsDead() {
        return this.curState == Ninja.PSTATE_DEAD || this.curState == Ninja.PSTATE_DISABLED;
    }
    DEBUG_GetRagdoll() {
        return this.raggy;
    }
    APP_Enable() {
        this.curState = uint(Ninja.PSTATE_STANDING);
    }
    APP_Disable() {
        this.curState = uint(Ninja.PSTATE_DISABLED);
    }
    Integrate() {
        if (this.curState != Ninja.PSTATE_DISABLED) {
            if (this.curState == Ninja.PSTATE_DEAD) {
                this.raggy.Integrate(this.normGrav);
            }
            else {
                this.vel.x *= this.d;
                this.vel.y *= this.d;
                this.vel.y += this.g;
                this.pos.x += this.vel.x;
                this.pos.y += this.vel.y;
            }
        }
    }
    PreCollision() {
        if (this.curState != Ninja.PSTATE_DISABLED) {
            if (this.curState == Ninja.PSTATE_DEAD) {
                this.raggy.PreCollision();
            }
            else {
                this.oldv.x = this.vel.x;
                this.oldv.y = this.vel.y;
                this.fcount = int(0);
                this.fvec.x = 0;
                this.fvec.y = 0;
                this.crush_vec.x = 0;
                this.crush_vec.y = 0;
                this.crush_dist = 0;
                this.crush_flag = false;
            }
        }
    }
    SolveInternalConstraints() {
        if (this.curState == Ninja.PSTATE_DEAD) {
            this.raggy.SolveConstraints();
        }
    }
    PostCollision(param1) {
        var _loc2_ = NaN;
        var _loc3_ = int(0);
        var _loc4_ = NaN;
        var _loc5_ = int(0);
        var _loc6_ = null;
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc12_ = NaN;
        var _loc13_ = NaN;
        if (this.curState != Ninja.PSTATE_DISABLED) {
            if (this.curState == Ninja.PSTATE_DEAD) {
                this.raggy.PostCollision(param1);
            }
            else {
                this.oldpos.Copy(this.pos);
                _loc2_ = 0.1;
                this.wallList_X.length = 0;
                this.wallList_Y.length = 0;
                this.result_logical.Clear();
                param1.objGrid.GatherCellContentsInNeighbourhood(this.pos, this.objList);
                _loc3_ = int(0);
                while (_loc3_ < this.objList.length) {
                    guard();
                    _loc6_ = this.objList[_loc3_];
                    if (_loc6_.CollideVsCircle_Logical(param1, this, this.result_logical, this.pos, this.vel, this.oldpos, this.r, _loc2_)) {
                        if (this.result_logical.vec_y == 0) {
                            this.wallList_X.push(this.result_logical.vec_x);
                            this.wallList_Y.push(this.result_logical.vec_y);
                        }
                    }
                    (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
                }
                _loc4_ = this.r + _loc2_;
                param1.segGrid.GatherCellContentsFromWorldspaceRegion(this.pos.x - _loc4_, this.pos.y - _loc4_, this.pos.x + _loc4_, this.pos.y + _loc4_, this.segList);
                _loc5_ = int(0);
                while (_loc5_ < this.segList.length) {
                    guard();
                    this.segList[_loc5_].GetClosestPoint(this.pos, this.seg_cp);
                    _loc7_ = this.pos.x - this.seg_cp.x;
                    _loc8_ = this.pos.y - this.seg_cp.y;
                    _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
                    if (_loc8_ == 0 && _loc9_ <= _loc4_ && _loc9_ != 0) {
                        _loc7_ *= 1 / _loc9_;
                        _loc8_ *= 1 / _loc9_;
                        this.wallList_X.push(_loc7_);
                        this.wallList_Y.push(_loc8_);
                    }
                    (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
                }
                this.WAS_IN_AIR = this.IN_AIR;
                this.IN_AIR = true;
                this.NEAR_WALL = false;
                if (this.wallList_X.length > 0) {
                    this.NEAR_WALL = true;
                    this.wallN.x = this.wallList_X[0];
                    this.wallN.y = 0;
                }
                if (this.fcount > 0) {
                    this.IN_AIR = false;
                    _loc10_ = this.fvec.Len();
                    if (_loc10_ == 0) {
                        trace("WARNING! Ninja found a null floor vector: " + this.fvec.ToString());
                        this.floorN.x = 0;
                        this.floorN.y = -1;
                    }
                    else {
                        this.floorN.x = this.fvec.x / _loc10_;
                        this.floorN.y = this.fvec.y / _loc10_;
                    }
                    if (this.WAS_IN_AIR) {
                        _loc11_ = this.oldv.x * this.floorN.x + this.oldv.y * this.floorN.y;
                        _loc11_ = _loc11_ - 2 * Math.abs(this.floorN.y) * this.impulse_scale;
                        if (_loc11_ < -this.terminal_vel) {
                            this.vel.Copy(this.oldv);
                            param1.Event_PlayerWasKilled(this, sim_globals.ENEMYTYPE_FALL, this.pos.x, this.pos.y, 0, 0);
                        }
                    }
                }
                if (this.crush_flag) {
                    if (this.crush_dist > 0) {
                        _loc12_ = this.crush_vec.Len();
                        _loc13_ = _loc12_ / this.crush_dist;
                        if (_loc13_ < this.crush_threshold) {
                            param1.Event_PlayerWasKilled(this, sim_globals.ENEMYTYPE_CRUSH, this.pos.x, this.pos.y, 0, 0);
                        }
                    }
                }
            }
        }
    }
    RespondToCollision(param1, param2, param3, param4, param5) {
        var _loc6_ = NaN;
        this.pos.x += param3 * param1;
        this.pos.y += param3 * param2;
        if (param5) {
            this.crush_flag = true;
        }
        if (param4 || param5) {
            this.crush_vec.x += param3 * param1;
            this.crush_vec.y += param3 * param2;
            this.crush_dist += Math.abs(param3);
        }
        if (param4) {
            _loc6_ = this.vel.x * param1 + this.vel.y * param2;
            if (_loc6_ < 0) {
                this.vel.x -= _loc6_ * param1;
                this.vel.y -= _loc6_ * param2;
            }
        }
        else {
            this.vel.x += param3 * param1;
            this.vel.y += param3 * param2;
        }
        if (param2 < 0) {
            (this.fcount = int(this.fcount + 1));
            this.fvec.x += param1;
            this.fvec.y += param2;
        }
    }
    CollideVsObjects(param1) {
        var _loc2_ = int(0);
        var _loc3_ = null;
        var _loc4_ = false;
        if (this.curState == Ninja.PSTATE_DEAD) {
            this.raggy.CollideVsObjects(param1);
        }
        else {
            this.result_physical.Clear();
            param1.objGrid.GatherCellContentsInNeighbourhood(this.pos, this.objList);
            _loc2_ = int(0);
            while (_loc2_ < this.objList.length) {
                guard();
                _loc3_ = this.objList[_loc2_];
                if (_loc3_.CollideVsCircle_Physical(this.result_physical, this.pos, this.vel, this.oldpos, this.r)) {
                    _loc4_ = _loc3_ instanceof Entity_Thwomp;
                    this.RespondToCollision(this.result_physical.nx, this.result_physical.ny, this.result_physical.pen, this.result_physical.isHardCollision, _loc4_);
                }
                (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
            }
        }
    }
    CollideVsTiles(param1) {
        var _loc2_ = int(0);
        var _loc3_ = int(0);
        var _loc4_ = int(0);
        var _loc5_ = NaN;
        var _loc6_ = NaN;
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        if (this.curState == Ninja.PSTATE_DEAD) {
            this.raggy.CollideVsTiles(param1);
        }
        else {
            _loc2_ = int(32);
            _loc3_ = int(0);
            this.cp.x = 0;
            this.cp.y = 0;
            while (true) {
                guard();
                _loc4_ = int(colutils.GetSingleClosestPoint_Signed(param1.segGrid, this.pos, this.r, this.cp));
                if (_loc4_ == 0) {
                    break;
                }
                _loc5_ = this.pos.x - this.cp.x;
                _loc6_ = this.pos.y - this.cp.y;
                _loc7_ = Math.sqrt(_loc5_ * _loc5_ + _loc6_ * _loc6_);
                _loc8_ = this.r - _loc4_ * _loc7_;
                if (_loc8_ < 1e-7) {
                    break;
                }
                if (_loc7_ == 0) {
                    return;
                }
                _loc5_ /= _loc7_;
                _loc6_ /= _loc7_;
                this.RespondToCollision(_loc5_, _loc6_, _loc4_ * _loc8_, true, false);
                if ((_loc3_ = int(_loc3_ + 1)) >= _loc2_) {
                    trace("WARNING! collision loop hit max iterations: " + _loc8_);
                    break;
                }
            }
        }
    }
    Think(param1, param2) {
        param2 = uint(param2);
        var _loc10_ = null;
        var _loc11_ = null;
        var _loc12_ = false;
        var _loc13_ = NaN;
        var _loc14_ = NaN;
        var _loc15_ = NaN;
        var _loc16_ = NaN;
        var _loc17_ = NaN;
        var _loc18_ = NaN;
        var _loc19_ = NaN;
        var _loc20_ = NaN;
        var _loc21_ = NaN;
        var _loc22_ = NaN;
        var _loc23_ = NaN;
        var _loc24_ = NaN;
        var _loc25_ = NaN;
        var _loc26_ = NaN;
        var _loc27_ = NaN;
        var _loc28_ = NaN;
        var _loc29_ = NaN;
        var _loc30_ = NaN;
        var _loc31_ = NaN;
        var _loc32_ = NaN;
        var _loc33_ = NaN;
        var _loc34_ = NaN;
        var _loc35_ = NaN;
        var _loc36_ = NaN;
        var _loc37_ = NaN;
        var _loc38_ = NaN;
        var _loc39_ = NaN;
        var _loc40_ = NaN;
        var _loc41_ = NaN;
        this.inputsource.Tick(param2);
        var _loc3_ = this.inputsource.IsButtonDown_Right();
        var _loc4_ = this.inputsource.IsButtonDown_Left();
        var _loc5_ = this.inputsource.IsButtonDown_Jump();
        var _loc6_ = (_loc5_) && !this.wasJdown;
        this.wasJdown = _loc5_;
        if (this.curState == Ninja.PSTATE_DISABLED) {
            return;
        }
        if (this.curState == Ninja.PSTATE_DEAD) {
            return;
        }
        if (this.curState == Ninja.PSTATE_AWAITINGDEATH) {
            _loc10_ = null;
            _loc11_ = null;
            if (this.ninja_gfx != null && this.ninja_gfx.hasValidPose) {
                _loc10_ = asVector(6, null);
                _loc11_ = asVector(6, null);
                this.ninja_gfx.NINJA_GetCurrentPose(_loc10_, _loc11_);
            }
            this.raggy.ActivateRagdoll(this.pos, this.vel, this.death_pos, this.death_force, _loc10_, _loc11_);
            if (this.death_type == sim_globals.DEATHTYPE_EXPLOSIVE || this.death_type == sim_globals.DEATHTYPE_SUICIDE) {
                this.raggy.ExplodeRagdoll(param1);
            }
            param1.HACKY_GetParticleManager().Spawn_BloodSpurt(this.death_pos.x, this.death_pos.y, this.death_force.x, this.death_force.y, 3 + Math.floor(Math.random() * 4));
            _loc12_ = Math.random() < 0.5;
            if (this.death_type == sim_globals.DEATHTYPE_EXPLOSIVE) {
                if (_loc12_) {
                    this.ninja_gfx.HACKY_PlayOneshotSound("explode1");
                }
                else {
                    this.ninja_gfx.HACKY_PlayOneshotSound("explode2");
                }
            }
            else if (this.death_type == sim_globals.DEATHTYPE_FALL) {
                this.ninja_gfx.HACKY_PlayOneshotSound("fall");
            }
            else if (this.death_type == sim_globals.DEATHTYPE_LASER) {
                this.ninja_gfx.HACKY_PlayOneshotSound("laser");
            }
            else if (this.death_type == sim_globals.DEATHTYPE_ELECTRIC) {
                if (_loc12_) {
                    this.ninja_gfx.HACKY_PlayOneshotSound("zap1");
                }
                else {
                    this.ninja_gfx.HACKY_PlayOneshotSound("zap2");
                }
            }
            else if (_loc12_) {
                this.ninja_gfx.HACKY_PlayOneshotSound("shot1");
            }
            else {
                this.ninja_gfx.HACKY_PlayOneshotSound("shot2");
            }
            this.curState = uint(Ninja.PSTATE_DEAD);
            return;
        }
        if (this.curState == Ninja.PSTATE_CELEBRATING) {
            if (this.IN_AIR) {
                this.d = this.normDrag;
                if (this.WAS_IN_AIR) {
                }
            }
            else {
                this.d = this.winDrag;
                if (this.WAS_IN_AIR) {
                }
            }
            return;
        }
        this.tempV.x = 0;
        this.tempV.y = 0;
        this.tempP.x = 0;
        this.tempP.y = 0;
        var _loc7_ = this.vel.x;
        var _loc8_ = this.vel.y;
        var _loc9_ = 0;
        if (_loc4_) {
            _loc9_--;
        }
        if (_loc3_) {
            _loc9_ += 1;
        }
        if (this.IN_AIR) {
            this.tempV.Copy(this.vel);
            _loc13_ = _loc7_ + _loc9_ * this.airAccel;
            if (Math.abs(_loc13_) < this.maxspeedAir) {
                _loc7_ = _loc13_;
            }
            this.vel.x = _loc7_;
            if (this.curState < 3) {
                this.ACTION_Fall();
                return;
            }
            if (this.curState == Ninja.PSTATE_JUMPING) {
                ++this.jumptimer;
                if (!_loc5_ || this.jumptimer > this.max_jump_time) {
                    this.ACTION_Fall();
                    return;
                }
                return;
            }
            if (this.curState == Ninja.PSTATE_FALLING) {
            }
            if (this.NEAR_WALL) {
                if (_loc6_) {
                    _loc14_ = 0;
                    _loc15_ = 0;
                    if (this.curState == Ninja.PSTATE_WALLSLIDING && _loc9_ * this.wallN.x < 0) {
                        _loc14_ = 1;
                        _loc15_ = 0.5;
                    }
                    else {
                        _loc14_ = 1.5;
                        _loc15_ = 0.7;
                    }
                    param1.HACKY_GetParticleManager().Spawn_JumpDust(this.pos.x - this.wallN.x * this.r, this.pos.y - this.wallN.y * this.r, this.wallN.x * 90);
                    this.ACTION_Jump(this.wallN.x * _loc14_, this.wallN.y - _loc15_);
                    return;
                }
                if (this.curState == Ninja.PSTATE_WALLSLIDING) {
                    if (0 < _loc9_ * this.wallN.x) {
                        this.ACTION_Fall();
                        return;
                    }
                    _loc16_ = Math.abs(_loc8_);
                    _loc17_ = -this.wallFriction * _loc16_;
                    this.tempV.Copy(this.vel);
                    this.vel.y *= this.wallFriction;
                    param1.HACKY_GetParticleManager().Spawn_WallDust(this.pos, this.r, this.wallN, Math.min(4, _loc16_));
                    return;
                }
                if (0 < _loc8_ && _loc9_ * this.wallN.x < 0) {
                    this.ACTION_Wallslide();
                    return;
                }
            }
            else if (this.curState == Ninja.PSTATE_WALLSLIDING) {
                this.ACTION_Fall();
                return;
            }
        }
        else {
            this.tempV.Copy(this.vel);
            _loc18_ = _loc7_ + _loc9_ * this.groundAccel;
            if (Math.abs(_loc18_) < this.maxspeedGround) {
                _loc7_ = _loc18_;
            }
            this.vel.x = _loc7_;
            if (2 < this.curState) {
                param1.HACKY_GetParticleManager().Spawn_LandDust(this.pos.x - this.floorN.x * this.r, this.pos.y - this.floorN.y * this.r, 90 + Math.atan2(this.floorN.y, this.floorN.x) / Math.PI * 180, Math.abs(this.vel.x) + this.vel.y);
                this.ninja_gfx.HACKY_PlayOneshotSound("land");
                if (0 < _loc7_ * _loc9_) {
                    this.ACTION_Run(_loc9_);
                    return;
                }
                this.ACTION_Skid();
                return;
            }
            if (_loc6_) {
                param1.HACKY_GetParticleManager().Spawn_JumpDust(this.pos.x - this.floorN.x * this.r, this.pos.y - this.floorN.y * this.r, 90 + Math.atan2(this.floorN.y, this.floorN.x) / Math.PI * 180);
                if (_loc9_ * this.floorN.x < 0) {
                    this.ACTION_Jump(0, -0.7);
                    return;
                }
                this.ACTION_Jump(this.floorN.x, this.floorN.y);
                return;
            }
            if (this.curState != Ninja.PSTATE_RUNNING) {
                if (this.curState == Ninja.PSTATE_SKIDDING) {
                    _loc29_ = this.floorN.x;
                    _loc30_ = this.floorN.y;
                    _loc31_ = Math.abs(_loc7_ * -_loc30_ + _loc8_ * _loc29_);
                    _loc32_ = _loc7_ * _loc31_;
                    if (0 < _loc32_ * _loc9_) {
                        this.ACTION_Run(_loc9_);
                        return;
                    }
                    if (_loc31_ < 0.1 && this.floorN.x == 0) {
                        this.ACTION_Stand();
                        return;
                    }
                    _loc33_ = 1;
                    if (_loc32_ < 0) {
                        _loc33_ = -1;
                    }
                    _loc34_ = Math.atan2(this.floorN.x, -this.floorN.y) * (180 / Math.PI);
                    param1.HACKY_GetParticleManager().Spawn_FloorDust(this.pos, this.r, this.floorN, _loc34_, _loc33_, _loc31_);
                    this.tempV.Copy(this.vel);
                    if (_loc8_ < 0 && this.floorN.x != 0) {
                        _loc35_ = Math.abs(_loc7_ * this.skidFriction - _loc7_);
                        _loc36_ = Math.abs(_loc35_ * this.floorN.y);
                        _loc36_ = _loc36_ * (this.floorN.y * this.floorN.y);
                        _loc37_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
                        _loc38_ = _loc37_ - _loc36_;
                        _loc7_ /= _loc37_;
                        _loc8_ /= _loc37_;
                        _loc7_ *= _loc38_;
                        _loc8_ *= _loc38_;
                    }
                    else {
                        _loc7_ *= this.skidFriction;
                    }
                    this.vel.x = _loc7_;
                    this.vel.y = _loc8_;
                    return;
                }
                if (_loc9_ != 0) {
                    this.ACTION_Run(_loc9_);
                    return;
                }
                _loc39_ = this.floorN.x;
                _loc40_ = this.floorN.y;
                _loc41_ = Math.abs(_loc7_ * -_loc40_ + _loc8_ * _loc39_);
                if (0.1 <= _loc41_) {
                    this.ACTION_Skid();
                    return;
                }
                this.tempV.Copy(this.vel);
                _loc7_ *= this.standFriction;
                this.vel.x = _loc7_;
                this.vel.y = _loc8_;
                return;
            }
            _loc19_ = this.floorN.x;
            _loc20_ = this.floorN.y;
            _loc21_ = _loc7_ * -_loc20_ + _loc8_ * _loc19_;
            _loc22_ = Math.abs(_loc21_);
            _loc23_ = _loc7_ * _loc22_;
            if (_loc9_ * _loc23_ <= 0) {
                this.ACTION_Skid();
                return;
            }
            if (_loc9_ * _loc19_ < 0) {
                _loc24_ = -Math.abs(_loc19_);
                _loc25_ = _loc20_;
                if (_loc19_ < 0) {
                    _loc25_ = -_loc20_;
                }
                _loc26_ = Math.abs(_loc20_);
                _loc25_ *= 0.5 * _loc26_;
                _loc24_ *= 0.5 * _loc26_;
                _loc27_ = _loc7_ + _loc25_ * this.groundAccel;
                _loc28_ = _loc8_ + _loc24_ * this.groundAccel;
                if (Math.abs(_loc18_) < this.maxspeedGround) {
                    _loc7_ = _loc27_;
                    _loc8_ = _loc28_;
                }
                this.tempV.Copy(this.vel);
                this.vel.x = _loc7_;
                this.vel.y = _loc8_;
            }
        }
    }
    DEATHMATCH_IsInAir() {
        return this.IN_AIR;
    }
    DEATHMATCH_Jump(param1) {
        this.ACTION_Jump(0, param1);
    }
    ACTION_Jump(param1, param2) {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_JUMPING);
        this.g = this.jumpGrav;
        var _loc3_ = this.vel.x;
        var _loc4_ = this.vel.y;
        if (_loc3_ * param1 < 0) {
            this.vel.x = 0;
        }
        if (_loc4_ * param2 < 0) {
            this.vel.y = 0;
        }
        this.pos.x += param1 * this.jumpAmt * this.impulse_scale;
        this.pos.y += param2 * (this.jumpAmt + this.jump_y_bias) * this.impulse_scale;
        this.vel.x += param1 * this.jumpAmt * this.impulse_scale;
        this.vel.y += param2 * (this.jumpAmt + this.jump_y_bias) * this.impulse_scale;
        this.jumptimer = 0;
        this.ninja_gfx.HACKY_PlayOneshotSound("jump");
    }
    ACTION_Fall() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_FALLING);
    }
    ACTION_Wallslide() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_WALLSLIDING);
    }
    ACTION_Skid() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_SKIDDING);
    }
    ACTION_Run(param1) {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_RUNNING);
    }
    ACTION_Stand() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_STANDING);
    }
    ACTION_Die() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_AWAITINGDEATH);
    }
    ACTION_Win() {
        this.HELPER_ExitCurrentState();
        this.curState = uint(Ninja.PSTATE_CELEBRATING);
    }
    HELPER_ExitCurrentState() {
        if (this.curState == Ninja.PSTATE_DEAD) {
            trace("WARNING! HELPER_ExitCurrentState() was called on a dead player!: " + this.pID);
        }
        if (this.curState == Ninja.PSTATE_JUMPING) {
            this.g = this.normGrav;
        }
    }
    SIM_Launch(param1, param2) {
        if (this.curState == Ninja.PSTATE_AWAITINGDEATH) {
            return;
        }
        this.pos.x += param1 * this.impulse_scale;
        this.pos.y += param2 * this.impulse_scale;
        this.vel.x = param1 * this.impulse_scale;
        this.vel.y = param2 * this.impulse_scale;
        this.fcount = int(0);
        if (this.curState != Ninja.PSTATE_CELEBRATING) {
            this.ACTION_Fall();
        }
    }
    SIM_Kill(param1, param2, param3, param4, param5) {
        param1 = int(param1);
        if (this.curState == Ninja.PSTATE_AWAITINGDEATH || this.curState == Ninja.PSTATE_DISABLED) {
            return false;
        }
        this.death_pos.x = param2;
        this.death_pos.y = param3;
        this.death_force.x = param4;
        this.death_force.y = param5;
        this.death_type = int(sim_globals.ETYPE_TO_DTYPE[param1]);
        this.ACTION_Die();
        return true;
    }
    SIM_Win() {
        if (this.curState == Ninja.PSTATE_DISABLED || this.curState == Ninja.PSTATE_CELEBRATING || this.curState == Ninja.PSTATE_AWAITINGDEATH || this.curState == Ninja.PSTATE_DEAD) {
            return false;
        }
        this.ACTION_Win();
        return true;
    }
    GenerateGraphicComponent() {
        this.ninja_gfx = new EntityGraphics_Ninja(this, this.gfxColor);
        return this.ninja_gfx;
    }
    GFX_UpdateState(param1) {
        if (this.curState == Ninja.PSTATE_DISABLED) {
            param1.anim = int(EntityGraphics_Ninja.ANIM_OFF);
        }
        else if (this.curState == Ninja.PSTATE_DEAD) {
            param1.anim = int(EntityGraphics_Ninja.ANIM_DEAD);
            this.raggy.GFX_UpdateState(param1);
        }
        else {
            param1.pos.x = this.pos.x;
            param1.pos.y = this.pos.y;
            if (this.curState == Ninja.PSTATE_WALLSLIDING) {
                param1.anim = int(EntityGraphics_Ninja.ANIM_WALLSLIDING);
                param1.orn = 0;
                param1.facing = int(-this.wallN.x);
                param1.vel = this.vel.y;
            }
            else {
                if (this.IN_AIR) {
                    param1.anim = int(EntityGraphics_Ninja.ANIM_INAIR);
                    param1.vel = this.vel.y;
                    if (this.curState == Ninja.PSTATE_JUMPING) {
                        param1.orn = 0;
                    }
                    else {
                        param1.orn -= 0.1 * param1.orn;
                    }
                }
                else {
                    param1.orn = Math.atan2(this.floorN.y, this.floorN.x) + 0.5 * Math.PI;
                    if (this.curState == Ninja.PSTATE_RUNNING) {
                        param1.anim = int(EntityGraphics_Ninja.ANIM_RUNNING);
                        param1.vel = Math.abs(this.vel.x * -this.floorN.y + this.vel.y * this.floorN.x);
                    }
                    else if (this.curState == Ninja.PSTATE_SKIDDING) {
                        param1.anim = int(EntityGraphics_Ninja.ANIM_SKIDDING);
                        param1.vel = this.vel.x * -this.floorN.y + this.vel.y * this.floorN.x;
                    }
                    else if (this.curState == Ninja.PSTATE_STANDING) {
                        param1.anim = int(EntityGraphics_Ninja.ANIM_STANDING);
                    }
                    else if (this.curState == Ninja.PSTATE_CELEBRATING) {
                        param1.anim = int(EntityGraphics_Ninja.ANIM_CELEBRATING);
                    }
                }
                if (this.vel.x < -0.01) {
                    param1.facing = int(-1);
                }
                else if (this.vel.x > 0.01) {
                    param1.facing = int(1);
                }
            }
        }
    }
    Draw(param1) {
        var _loc2_ = null;
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        var _loc5_ = null;
        var _loc6_ = null;
        if (this.curState == Ninja.PSTATE_DEAD) {
            this.raggy.Draw(param1);
        }
        else {
            param1.SetStyle(0, 0, 20);
            param1.DrawCircle(this.oldpos.x, this.oldpos.y, this.r);
            param1.SetStyle(0, 0, 100);
            param1.DrawCircle(this.pos.x, this.pos.y, this.r);
            _loc2_ = Ninja.PSTATE_TO_STRING[this.curState];
            if (this.curState == Ninja.PSTATE_CELEBRATING) {
                if (this.IN_AIR) {
                    _loc2_ += " (in air)";
                }
                else {
                    _loc2_ += " (on ground)";
                }
            }
            param1.DrawStringAtPosition(_loc2_, this.pos.x + this.r, this.pos.y + this.r);
            if (!this.IN_AIR) {
                param1.SetStyle(0, 8921634, 100);
                _loc6_ = new vec2(this.pos.x - this.floorN.x * this.r, this.pos.y - this.floorN.y * this.r);
                param1.DrawSquare(_loc6_.x, _loc6_.y, 2);
                param1.DrawLine(_loc6_.x, _loc6_.y, _loc6_.x + this.floorN.x * 8, _loc6_.y + this.floorN.y * 8);
            }
            _loc3_ = 0;
            _loc4_ = 1;
            if (this.curState == Ninja.PSTATE_WALLSLIDING) {
                _loc3_ = 0;
                _loc4_ = -this.wallN.x;
            }
            else {
                if (this.curState == Ninja.PSTATE_JUMPING) {
                    _loc3_ = 0;
                }
                if (this.IN_AIR) {
                    _loc3_ -= 0.1 * _loc3_;
                }
                else {
                    _loc3_ = Math.atan2(this.floorN.y, this.floorN.x) + 0.5 * Math.PI;
                }
                if (this.vel.x < 0) {
                    _loc4_ = -1;
                }
                else {
                    _loc4_ = 1;
                }
            }
            _loc5_ = new vec2(Math.cos(_loc3_), Math.sin(_loc3_));
            _loc5_.Scale(this.r * _loc4_);
            param1.SetStyle(0, 0, 100);
            param1.DrawLine(this.pos.x, this.pos.y, this.pos.x + _loc5_.x, this.pos.y + _loc5_.y);
        }
    }
}
export class Ragdoll {
    static pRadius = null;
    static pDrag = null;
    static sWeight = null;
    static sMinRatio = null;
    static hacky_scale = NaN;
    static sMaxLen = null;
    static debugpose_pos = null;
    static debugpose_vel = null;
    static STATE_UNEXPLODED = int(0);
    static STATE_EXPLODED = int(0);
    cur_state = int(0);
    explosion_accumulator = 0;
    pList = null;
    sList = null;
    objList = null;
    result_logical = null;
    result_physical = null;
    cp = null;
    constructor() {
        this.cur_state = int(Ragdoll.STATE_UNEXPLODED);
        this.explosion_accumulator = 0;
        this.pList = asVector(2, null);
        this.pList[Ragdoll.STATE_UNEXPLODED] = asVector(6, null);
        this.pList[Ragdoll.STATE_UNEXPLODED][0] = new RagParticle(Ragdoll.pRadius[0], Ragdoll.pDrag[0]);
        this.pList[Ragdoll.STATE_UNEXPLODED][1] = new RagParticle(Ragdoll.pRadius[1], Ragdoll.pDrag[1]);
        this.pList[Ragdoll.STATE_UNEXPLODED][2] = new RagParticle(Ragdoll.pRadius[2], Ragdoll.pDrag[2]);
        this.pList[Ragdoll.STATE_UNEXPLODED][3] = new RagParticle(Ragdoll.pRadius[3], Ragdoll.pDrag[3]);
        this.pList[Ragdoll.STATE_UNEXPLODED][4] = new RagParticle(Ragdoll.pRadius[4], Ragdoll.pDrag[4]);
        this.pList[Ragdoll.STATE_UNEXPLODED][5] = new RagParticle(Ragdoll.pRadius[5], Ragdoll.pDrag[5]);
        this.pList[Ragdoll.STATE_EXPLODED] = asVector(10, null);
        this.pList[Ragdoll.STATE_EXPLODED][0] = new RagParticle(Ragdoll.pRadius[0], Ragdoll.pDrag[0]);
        this.pList[Ragdoll.STATE_EXPLODED][1] = new RagParticle(Ragdoll.pRadius[1], Ragdoll.pDrag[1]);
        this.pList[Ragdoll.STATE_EXPLODED][2] = new RagParticle(Ragdoll.pRadius[2], Ragdoll.pDrag[2]);
        this.pList[Ragdoll.STATE_EXPLODED][3] = new RagParticle(Ragdoll.pRadius[3], Ragdoll.pDrag[3]);
        this.pList[Ragdoll.STATE_EXPLODED][4] = new RagParticle(Ragdoll.pRadius[4], Ragdoll.pDrag[4]);
        this.pList[Ragdoll.STATE_EXPLODED][5] = new RagParticle(Ragdoll.pRadius[5], Ragdoll.pDrag[5]);
        this.pList[Ragdoll.STATE_EXPLODED][6] = new RagParticle(Ragdoll.pRadius[0], Ragdoll.pDrag[0]);
        this.pList[Ragdoll.STATE_EXPLODED][7] = new RagParticle(Ragdoll.pRadius[0], Ragdoll.pDrag[0]);
        this.pList[Ragdoll.STATE_EXPLODED][8] = new RagParticle(Ragdoll.pRadius[1], Ragdoll.pDrag[1]);
        this.pList[Ragdoll.STATE_EXPLODED][9] = new RagParticle(Ragdoll.pRadius[1], Ragdoll.pDrag[1]);
        this.sList = asVector(2, null);
        this.sList[Ragdoll.STATE_UNEXPLODED] = asVector(5, null);
        this.sList[Ragdoll.STATE_UNEXPLODED][0] = new RagStick(this.pList[Ragdoll.STATE_UNEXPLODED][1], this.pList[Ragdoll.STATE_UNEXPLODED][0], Ragdoll.sWeight[0], Ragdoll.sMinRatio[0], Ragdoll.sMaxLen[0]);
        this.sList[Ragdoll.STATE_UNEXPLODED][1] = new RagStick(this.pList[Ragdoll.STATE_UNEXPLODED][0], this.pList[Ragdoll.STATE_UNEXPLODED][2], Ragdoll.sWeight[1], Ragdoll.sMinRatio[1], Ragdoll.sMaxLen[1]);
        this.sList[Ragdoll.STATE_UNEXPLODED][2] = new RagStick(this.pList[Ragdoll.STATE_UNEXPLODED][0], this.pList[Ragdoll.STATE_UNEXPLODED][3], Ragdoll.sWeight[2], Ragdoll.sMinRatio[2], Ragdoll.sMaxLen[2]);
        this.sList[Ragdoll.STATE_UNEXPLODED][3] = new RagStick(this.pList[Ragdoll.STATE_UNEXPLODED][1], this.pList[Ragdoll.STATE_UNEXPLODED][4], Ragdoll.sWeight[3], Ragdoll.sMinRatio[3], Ragdoll.sMaxLen[3]);
        this.sList[Ragdoll.STATE_UNEXPLODED][4] = new RagStick(this.pList[Ragdoll.STATE_UNEXPLODED][1], this.pList[Ragdoll.STATE_UNEXPLODED][5], Ragdoll.sWeight[4], Ragdoll.sMinRatio[4], Ragdoll.sMaxLen[4]);
        this.sList[Ragdoll.STATE_EXPLODED] = asVector(5, null);
        this.sList[Ragdoll.STATE_EXPLODED][0] = new RagStick(this.pList[Ragdoll.STATE_EXPLODED][1], this.pList[Ragdoll.STATE_EXPLODED][0], Ragdoll.sWeight[0], Ragdoll.sMinRatio[0], Ragdoll.sMaxLen[0]);
        this.sList[Ragdoll.STATE_EXPLODED][1] = new RagStick(this.pList[Ragdoll.STATE_EXPLODED][6], this.pList[Ragdoll.STATE_EXPLODED][2], Ragdoll.sWeight[1], Ragdoll.sMinRatio[1], Ragdoll.sMaxLen[1]);
        this.sList[Ragdoll.STATE_EXPLODED][2] = new RagStick(this.pList[Ragdoll.STATE_EXPLODED][7], this.pList[Ragdoll.STATE_EXPLODED][3], Ragdoll.sWeight[2], Ragdoll.sMinRatio[2], Ragdoll.sMaxLen[2]);
        this.sList[Ragdoll.STATE_EXPLODED][3] = new RagStick(this.pList[Ragdoll.STATE_EXPLODED][8], this.pList[Ragdoll.STATE_EXPLODED][4], Ragdoll.sWeight[3], Ragdoll.sMinRatio[3], Ragdoll.sMaxLen[3]);
        this.sList[Ragdoll.STATE_EXPLODED][4] = new RagStick(this.pList[Ragdoll.STATE_EXPLODED][9], this.pList[Ragdoll.STATE_EXPLODED][5], Ragdoll.sWeight[4], Ragdoll.sMinRatio[4], Ragdoll.sMaxLen[4]);
        this.objList = asVector(0, null);
        this.result_logical = new collision_result_logical();
        this.result_physical = new collision_result_physical();
        this.cp = new vec2();
    }
    ActivateRagdoll(param1, param2, param3, param4, param5, param6) {
        var _loc7_ = null;
        var _loc8_ = null;
        this.cur_state = int(Ragdoll.STATE_UNEXPLODED);
        this.explosion_accumulator = 0;
        if (param5 != null && param6 != null) {
            _loc7_ = param5;
            _loc8_ = param6;
        }
        else {
            trace("WARNING! ragdoll wasn\'t passed in a pose.. this should never happen.");
            _loc7_ = Ragdoll.debugpose_pos;
            _loc8_ = Ragdoll.debugpose_vel;
        }
        this.pList[Ragdoll.STATE_UNEXPLODED][0].SetState(param1.x + _loc7_[0].x, param1.y + _loc7_[0].y, param2.x + _loc8_[0].x, param2.y + _loc8_[0].y);
        this.pList[Ragdoll.STATE_UNEXPLODED][1].SetState(param1.x + _loc7_[1].x, param1.y + _loc7_[1].y, param2.x + _loc8_[1].x, param2.y + _loc8_[1].y);
        this.pList[Ragdoll.STATE_UNEXPLODED][2].SetState(param1.x + _loc7_[2].x, param1.y + _loc7_[2].y, param2.x + _loc8_[2].x, param2.y + _loc8_[2].y);
        this.pList[Ragdoll.STATE_UNEXPLODED][3].SetState(param1.x + _loc7_[3].x, param1.y + _loc7_[3].y, param2.x + _loc8_[3].x, param2.y + _loc8_[3].y);
        this.pList[Ragdoll.STATE_UNEXPLODED][4].SetState(param1.x + _loc7_[4].x, param1.y + _loc7_[4].y, param2.x + _loc8_[4].x, param2.y + _loc8_[4].y);
        this.pList[Ragdoll.STATE_UNEXPLODED][5].SetState(param1.x + _loc7_[5].x, param1.y + _loc7_[5].y, param2.x + _loc8_[5].x, param2.y + _loc8_[5].y);
        this.ShoveRagdoll(param3, param4);
    }
    ShoveRagdoll(param1, param2) {
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc11_ = NaN;
        var _loc3_ = 12;
        var _loc4_ = 0.5;
        var _loc5_ = 1.5;
        var _loc6_ = int(0);
        while (_loc6_ < this.pList[Ragdoll.STATE_UNEXPLODED].length) {
            guard();
            _loc7_ = this.pList[Ragdoll.STATE_UNEXPLODED][_loc6_].pos.x - param1.x;
            _loc8_ = this.pList[Ragdoll.STATE_UNEXPLODED][_loc6_].pos.y - param1.y;
            _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
            _loc10_ = Math.min(1, _loc9_ / _loc3_);
            _loc11_ = _loc4_ + (1 - _loc10_) * _loc5_;
            this.pList[Ragdoll.STATE_UNEXPLODED][_loc6_].vel.x += param2.x * _loc11_;
            this.pList[Ragdoll.STATE_UNEXPLODED][_loc6_].vel.y += param2.y * _loc11_;
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
    }
    ShoveParticle() {
    }
    DEBUG_IsExploded() {
        return this.cur_state == Ragdoll.STATE_EXPLODED;
    }
    ExplodeRagdoll(param1) {
        var _loc2_ = int(0);
        if (this.cur_state != Ragdoll.STATE_EXPLODED) {
            this.cur_state = int(Ragdoll.STATE_EXPLODED);
            this.InitUnexplodedParticles();
            _loc2_ = int(6);
            while (_loc2_ < 10) {
                guard();
                param1.HACKY_GetParticleManager().Spawn_BloodSpurt(this.pList[Ragdoll.STATE_EXPLODED][_loc2_].pos.x, this.pList[Ragdoll.STATE_EXPLODED][_loc2_].pos.y, Math.random() * 8 - 4, Math.random() * 8 - 4, 3);
                (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
            }
        }
    }
    UnexplodeRagdoll() {
        var _loc1_ = int(0);
        if (this.cur_state != Ragdoll.STATE_UNEXPLODED) {
            this.cur_state = int(Ragdoll.STATE_UNEXPLODED);
            _loc1_ = int(0);
            while (_loc1_ < 6) {
                guard();
                this.pList[Ragdoll.STATE_UNEXPLODED][_loc1_].CopyState(this.pList[Ragdoll.STATE_EXPLODED][_loc1_]);
                (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
            }
        }
    }
    InitUnexplodedParticles() {
        this.pList[Ragdoll.STATE_EXPLODED][0].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][0]);
        this.pList[Ragdoll.STATE_EXPLODED][1].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][1]);
        this.pList[Ragdoll.STATE_EXPLODED][2].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][2]);
        this.pList[Ragdoll.STATE_EXPLODED][3].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][3]);
        this.pList[Ragdoll.STATE_EXPLODED][4].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][4]);
        this.pList[Ragdoll.STATE_EXPLODED][5].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][5]);
        this.pList[Ragdoll.STATE_EXPLODED][6].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][0]);
        this.pList[Ragdoll.STATE_EXPLODED][7].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][0]);
        this.pList[Ragdoll.STATE_EXPLODED][8].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][1]);
        this.pList[Ragdoll.STATE_EXPLODED][9].CopyState(this.pList[Ragdoll.STATE_UNEXPLODED][1]);
        this.pList[Ragdoll.STATE_EXPLODED][6].vel.x += 2;
        this.pList[Ragdoll.STATE_EXPLODED][7].vel.y += 4;
        this.pList[Ragdoll.STATE_EXPLODED][8].vel.y -= 6;
        this.pList[Ragdoll.STATE_EXPLODED][9].vel.x -= 8;
    }
    Integrate(param1) {
        var _loc2_ = int(0);
        while (_loc2_ < this.pList[this.cur_state].length) {
            guard();
            this.pList[this.cur_state][_loc2_].PreIntegrate(param1);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    PreCollision() {
    }
    SolveConstraints() {
        var _loc1_ = int(0);
        while (_loc1_ < this.sList[this.cur_state].length) {
            guard();
            this.sList[this.cur_state][_loc1_].Solve();
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    PostCollision(param1) {
        var _loc5_ = null;
        var _loc6_ = int(0);
        var _loc7_ = null;
        var _loc2_ = int(0);
        while (_loc2_ < this.pList[this.cur_state].length) {
            guard();
            this.pList[this.cur_state][_loc2_].PostIntegrate();
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        var _loc3_ = 0.1;
        this.result_logical.Clear();
        var _loc4_ = int(0);
        while (_loc4_ < this.pList[this.cur_state].length) {
            guard();
            _loc5_ = this.pList[this.cur_state][_loc4_];
            param1.objGrid.GatherCellContentsInNeighbourhood(_loc5_.pos, this.objList);
            _loc6_ = int(0);
            while (_loc6_ < this.objList.length) {
                guard();
                _loc7_ = this.objList[_loc6_];
                if (_loc7_.CollideVsCircle_Logical(param1, null, this.result_logical, _loc5_.pos, _loc5_.vel, _loc5_.pos, _loc5_.r, _loc3_)) {
                    _loc5_.vel.x += this.result_logical.vec_x;
                    _loc5_.vel.y += this.result_logical.vec_y;
                    if (_loc7_ instanceof Entity_Mine) {
                        if (this.cur_state == Ragdoll.STATE_UNEXPLODED) {
                            this.explosion_accumulator += mathutils.Random() * 0.6;
                            if (Math.random() < this.explosion_accumulator) {
                                this.ExplodeRagdoll(param1);
                            }
                        }
                    }
                    else if (_loc7_ instanceof Entity_Drone_Zap || _loc7_ instanceof Entity_FloorGuard || _loc7_ instanceof Entity_Thwomp) {
                        if (Math.random() < 0.5) {
                            param1.HACKY_GetSoundManager().PlaySound_Ragdoll("zap1");
                        }
                        else {
                            param1.HACKY_GetSoundManager().PlaySound_Ragdoll("zap2");
                        }
                    }
                }
                (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
            }
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
    }
    CollideVsObjects(param1) {
        var _loc3_ = null;
        var _loc4_ = int(0);
        var _loc5_ = null;
        this.result_physical.Clear();
        var _loc2_ = int(0);
        while (_loc2_ < this.pList[this.cur_state].length) {
            guard();
            _loc3_ = this.pList[this.cur_state][_loc2_];
            param1.objGrid.GatherCellContentsInNeighbourhood(_loc3_.solver_pos, this.objList);
            _loc4_ = int(0);
            while (_loc4_ < this.objList.length) {
                guard();
                _loc5_ = this.objList[_loc4_];
                if (_loc5_.CollideVsCircle_Physical(this.result_physical, _loc3_.solver_pos, _loc3_.vel, _loc3_.pos, _loc3_.r)) {
                    this.RespondToCollision(param1, _loc3_, this.result_physical.nx, this.result_physical.ny, this.result_physical.pen);
                }
                (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    CollideVsTiles(param1) {
        var _loc3_ = null;
        var _loc4_ = int(0);
        var _loc5_ = int(0);
        var _loc6_ = int(0);
        var _loc7_ = NaN;
        var _loc8_ = NaN;
        var _loc9_ = NaN;
        var _loc10_ = NaN;
        var _loc2_ = int(0);
        while (_loc2_ < this.pList[this.cur_state].length) {
            guard();
            _loc3_ = this.pList[this.cur_state][_loc2_];
            _loc4_ = int(32);
            _loc5_ = int(0);
            this.cp.x = 0;
            this.cp.y = 0;
            while (true) {
                guard();
                _loc6_ = int(colutils.GetSingleClosestPoint_Signed(param1.segGrid, _loc3_.solver_pos, _loc3_.r * 4, this.cp));
                if (_loc6_ != 0) {
                    _loc7_ = _loc3_.solver_pos.x - this.cp.x;
                    _loc8_ = _loc3_.solver_pos.y - this.cp.y;
                    _loc9_ = Math.sqrt(_loc7_ * _loc7_ + _loc8_ * _loc8_);
                    _loc10_ = _loc3_.r - _loc6_ * _loc9_;
                    if (_loc10_ >= 1e-7) {
                        if (_loc9_ == 0) {
                            return;
                        }
                        _loc7_ /= _loc9_;
                        _loc8_ /= _loc9_;
                        this.RespondToCollision(param1, _loc3_, _loc7_, _loc8_, _loc6_ * _loc10_);
                        if ((_loc5_ = int(_loc5_ + 1)) >= _loc4_) {
                            trace("WARNING! ragdoll collision loop hit max iterations: " + _loc10_ + " [" + _loc2_ + "]");
                            break;
                        }
                        continue;
                    }
                }
                break;
            }
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    RespondToCollision(param1, param2, param3, param4, param5) {
        var _loc13_ = NaN;
        param2.solver_pos.x += param5 * param3;
        param2.solver_pos.y += param5 * param4;
        var _loc6_ = 0;
        var _loc7_ = 0.05;
        var _loc8_ = 0;
        var _loc9_ = param2.solver_pos.x - param2.pos.x;
        var _loc10_ = param2.solver_pos.y - param2.pos.y;
        var _loc11_ = _loc9_ * param3 + _loc10_ * param4;
        var _loc12_ = _loc9_ * -param4 + _loc10_ * param3;
        if (_loc11_ < 0) {
            _loc6_ = 2;
            _loc7_ = 0.15;
            _loc8_ = 1;
            if (_loc11_ < -3) {
                param1.HACKY_GetParticleManager().Spawn_RagBloodSpurt(param2.solver_pos.x, param2.solver_pos.y, -_loc11_ * param3, -_loc11_ * param4);
                _loc13_ = Math.random();
                if (_loc13_ < 0.33) {
                    param1.HACKY_GetSoundManager().PlaySound_Ragdoll("hard1");
                }
                else if (_loc13_ < 0.66) {
                    param1.HACKY_GetSoundManager().PlaySound_Ragdoll("hard2");
                }
                else {
                    param1.HACKY_GetSoundManager().PlaySound_Ragdoll("hard3");
                }
            }
            else {
                if (0.7 < _loc12_ * _loc12_) {
                    param1.HACKY_GetParticleManager().Spawn_RagDust(param2.solver_pos, param2.r, _loc12_ * -param4, _loc12_ * param3, _loc12_ * _loc12_);
                }
                if (_loc11_ < -2) {
                    if (Math.random() < 0.5) {
                        param1.HACKY_GetSoundManager().PlaySound_Ragdoll("med1");
                    }
                    else {
                        param1.HACKY_GetSoundManager().PlaySound_Ragdoll("med2");
                    }
                }
                else if (_loc11_ < -1.2) {
                    if (Math.random() < 0.5) {
                        param1.HACKY_GetSoundManager().PlaySound_Ragdoll("soft1");
                    }
                    else {
                        param1.HACKY_GetSoundManager().PlaySound_Ragdoll("soft2");
                    }
                }
            }
        }
        param2.pos.x += _loc8_ * param5 * param3 + _loc6_ * _loc11_ * param3 + _loc7_ * _loc12_ * -param4;
        param2.pos.y += _loc8_ * param5 * param4 + _loc6_ * _loc11_ * param4 + _loc7_ * _loc12_ * param3;
    }
    GFX_UpdateState(param1) {
        var _loc3_ = NaN;
        var _loc4_ = NaN;
        var _loc5_ = NaN;
        var _loc2_ = int(0);
        while (_loc2_ < this.sList[this.cur_state].length) {
            guard();
            _loc3_ = this.sList[this.cur_state][_loc2_].p1.pos.x - this.sList[this.cur_state][_loc2_].p0.pos.x;
            _loc4_ = this.sList[this.cur_state][_loc2_].p1.pos.y - this.sList[this.cur_state][_loc2_].p0.pos.y;
            _loc5_ = Math.sqrt(_loc3_ * _loc3_ + _loc4_ * _loc4_);
            param1.ragdoll_posList[_loc2_].Copy(this.sList[this.cur_state][_loc2_].p0.pos);
            param1.ragdoll_ornList[_loc2_] = Math.atan2(_loc4_, _loc3_);
            param1.ragdoll_lenList[_loc2_] = Math.max(0, Math.min(1, _loc5_ / this.sList[this.cur_state][_loc2_].maxlen));
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
    }
    TESTING_SetPosVel(param1, param2) {
        this.pList[this.cur_state][0].pos.Copy(param1);
        this.pList[this.cur_state][0].vel.Copy(param2);
    }
    Draw(param1) {
        var _loc4_ = null;
        var _loc5_ = null;
        param1.SetStyle(0, 0, 100);
        var _loc2_ = int(0);
        while (_loc2_ < this.pList[this.cur_state].length) {
            guard();
            param1.DrawCircle(this.pList[this.cur_state][_loc2_].pos.x, this.pList[this.cur_state][_loc2_].pos.y, this.pList[this.cur_state][_loc2_].r);
            (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
        }
        var _loc3_ = int(0);
        while (_loc3_ < this.sList[this.cur_state].length) {
            guard();
            _loc4_ = this.sList[this.cur_state][_loc3_].p0.pos;
            _loc5_ = this.sList[this.cur_state][_loc3_].p1.pos;
            param1.DrawLine(_loc4_.x, _loc4_.y, _loc5_.x, _loc5_.y);
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
}
export class RagParticle {
    pos = null;
    vel = null;
    solver_pos = null;
    r = NaN;
    d = NaN;
    constructor(param1, param2) {
        this.pos = new vec2();
        this.vel = new vec2();
        this.solver_pos = new vec2();
        this.r = param1;
        this.d = param2;
    }
    PreIntegrate(param1) {
        this.vel.x *= this.d;
        this.vel.y *= this.d;
        this.vel.y += param1;
        this.solver_pos.x = this.pos.x + this.vel.x;
        this.solver_pos.y = this.pos.y + this.vel.y;
    }
    PostIntegrate() {
        this.vel.x = this.solver_pos.x - this.pos.x;
        this.vel.y = this.solver_pos.y - this.pos.y;
        this.pos.x = this.solver_pos.x;
        this.pos.y = this.solver_pos.y;
    }
    SetState(param1, param2, param3, param4) {
        this.pos.x = param1;
        this.pos.y = param2;
        this.vel.x = param3;
        this.vel.y = param4;
    }
    CopyState(param1) {
        this.pos.Copy(param1.pos);
        this.vel.Copy(param1.vel);
    }
}
export class RagStick {
    p0 = null;
    p1 = null;
    w0 = NaN;
    w1 = NaN;
    minlen = NaN;
    maxlen = NaN;
    constructor(param1, param2, param3, param4, param5) {
        this.p0 = param1;
        this.p1 = param2;
        this.w0 = param3;
        this.w1 = 1 - this.w0;
        this.minlen = param5 * param4;
        this.maxlen = param5;
    }
    Solve() {
        var _loc1_ = this.p1.solver_pos.x - this.p0.solver_pos.x;
        var _loc2_ = this.p1.solver_pos.y - this.p0.solver_pos.y;
        var _loc3_ = Math.sqrt(_loc1_ * _loc1_ + _loc2_ * _loc2_);
        if (this.minlen <= _loc3_ && _loc3_ <= this.maxlen) {
            return;
        }
        var _loc4_ = Math.max(this.minlen, Math.min(this.maxlen, _loc3_));
        var _loc5_ = _loc3_ - _loc4_;
        var _loc6_ = 1;
        var _loc7_ = 0;
        if (_loc3_ != 0) {
            _loc6_ = _loc1_ / _loc3_;
            _loc7_ = _loc2_ / _loc3_;
        }
        this.p0.solver_pos.x -= this.w0 * -_loc5_ * _loc6_;
        this.p0.solver_pos.y -= this.w0 * -_loc5_ * _loc7_;
        this.p1.solver_pos.x += this.w1 * -_loc5_ * _loc6_;
        this.p1.solver_pos.y += this.w1 * -_loc5_ * _loc7_;
    }
}
export class sim_globals {
    static HORRIBLY_HACKY_DOES_STRING_TO_BA_ERROR_EXIST = false;
    static sim_rate = NaN;
    static DEATHTYPE_SUICIDE = int(0);
    static DEATHTYPE_FALL = int(0);
    static DEATHTYPE_CRUSH = int(0);
    static DEATHTYPE_TIME = int(0);
    static DEATHTYPE_EXPLOSIVE = int(0);
    static DEATHTYPE_LASER = int(0);
    static DEATHTYPE_ELECTRIC = int(0);
    static DEATHTYPE_BULLET = int(0);
    static ENEMYTYPE_SUICIDE = int(0);
    static ENEMYTYPE_FALL = int(0);
    static ENEMYTYPE_CRUSH = int(0);
    static ENEMYTYPE_TIME = int(0);
    static ENEMYTYPE_ZAP = int(0);
    static ENEMYTYPE_CHAINGUN = int(0);
    static ENEMYTYPE_LASER = int(0);
    static ENEMYTYPE_TURRET = int(0);
    static ENEMYTYPE_ROCKET = int(0);
    static ENEMYTYPE_FLOORGUARD = int(0);
    static ENEMYTYPE_THWOMP = int(0);
    static ENEMYTYPE_MINE = int(0);
    static ENEMYTYPE_DEBUG = int(0);
    static ETYPE_TO_STRING = null;
    static ETYPE_TO_DTYPE = null;
    constructor() {
    }
    static BAtoString(param1) {
        var _loc3_ = uint(0);
        if (param1 == null) {
            return "";
        }
        var _loc2_ = "";
        param1.position = 0;
        while (param1.bytesAvailable) {
            guard();
            _loc3_ = uint(uint(param1.readByte()));
            _loc2_ += ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"][_loc3_ % 16];
            _loc3_ = uint(_loc3_ >> 4);
            _loc2_ += ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"][_loc3_ % 16];
        }
        param1.position = 0;
        return _loc2_;
    }
    static StringtoBA(param1) {
        var _loc4_ = uint(0);
        sim_globals.HORRIBLY_HACKY_DOES_STRING_TO_BA_ERROR_EXIST = false;
        var _loc2_ = new ByteArray();
        var _loc3_ = int(0);
        while (_loc3_ < param1.length) {
            guard();
            _loc4_ = uint(sim_globals.BAS_hint(param1.charAt(_loc3_)) + (sim_globals.BAS_hint(param1.charAt(_loc3_ + 1)) << 4));
            _loc2_.writeByte(_loc4_);
            _loc3_ = int(_loc3_ + 2);
        }
        _loc2_.position = 0;
        return _loc2_;
    }
    static BAS_hint(param1) {
        switch (param1) {
            case "0":
                return uint(0);
            case "1":
                return uint(1);
            case "2":
                return uint(2);
            case "3":
                return uint(3);
            case "4":
                return uint(4);
            case "5":
                return uint(5);
            case "6":
                return uint(6);
            case "7":
                return uint(7);
            case "8":
                return uint(8);
            case "9":
                return uint(9);
            case "a":
                return uint(10);
            case "b":
                return uint(11);
            case "c":
                return uint(12);
            case "d":
                return uint(13);
            case "e":
                return uint(14);
            case "f":
                return uint(15);
            default:
                trace("invalid character");
                sim_globals.HORRIBLY_HACKY_DOES_STRING_TO_BA_ERROR_EXIST = true;
                return uint(16);
        }
    }
}
export class sim_loader {
    static last_str_loaded = null;
    static OLDDATA_SEPERATION_CHAR_LEVEL = null;
    static OLDDATA_SEPERATION_CHAR_OBJECT = null;
    static OLDDATA_SEPERATION_CHAR_OBJTYPE = null;
    static OLDDATA_SEPERATION_CHAR_OBJPARAM = null;
    static OLDDATA_CHAR_PAD = int(0);
    static OLDDATA_OBJTYPE_GOLD = int(0);
    static OLDDATA_OBJTYPE_BOUNCEBLOCK = int(0);
    static OLDDATA_OBJTYPE_LAUNCHPAD = int(0);
    static OLDDATA_OBJTYPE_TURRET = int(0);
    static OLDDATA_OBJTYPE_FLOORGUARD = int(0);
    static OLDDATA_OBJTYPE_PLAYER = int(0);
    static OLDDATA_OBJTYPE_DRONE = int(0);
    static OLDDATA_OBJTYPE_ONEWAYPLATFORM = int(0);
    static OLDDATA_OBJTYPE_THWOMP = int(0);
    static OLDDATA_OBJTYPE_TESTDOOR = int(0);
    static OLDDATA_OBJTYPE_HOMINGLAUNCHER = int(0);
    static OLDDATA_OBJTYPE_EXIT = int(0);
    static OLDDATA_OBJTYPE_MINE = int(0);
    constructor() {
    }
    static LoadLevel_OldData(param1, param2, param3, param4, param5) {
        param4 = int(param4);
        var _loc15_ = null;
        mathutils.GenerateNewRandomSeed();
        sim_loader.last_str_loaded = param5;
        var _loc6_ = asVector(Simulator.GRID_NUM_COLS * Simulator.GRID_NUM_ROWS, 0);
        var _loc7_ = new Grid_Segment(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc8_ = new Grid_Edges(Simulator.GRID_NUM_COLS * 2, Simulator.GRID_NUM_ROWS * 2, Simulator.GRID_CELL_SIZE * 0.5);
        var _loc9_ = new Grid_Entity(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc10_ = asVector(0, null);
        var _loc11_ = asVector(0, null);
        var _loc12_ = param5.split(sim_loader.OLDDATA_SEPERATION_CHAR_LEVEL);
        if (_loc12_.length > 0) {
            sim_loader.LoadLevel_OldData_Tiles(_loc12_[0], _loc6_, _loc7_, _loc8_, Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        if (_loc12_.length > 1) {
            sim_loader.LoadLevel_OldData_Entities(_loc12_[1], _loc7_, _loc8_, _loc9_, _loc10_, _loc11_, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        if (_loc11_.length == 0) {
            trace("WARNING! no player was loaded, default player created");
            _loc11_.push(new vec2(32, 32));
        }
        while (_loc11_.length < param4) {
            guard();
            trace("WARNING! forcing ninja creation");
            _loc11_.push(_loc11_[0].Clone());
        }
        while (_loc11_.length > param4) {
            guard();
            _loc11_.pop();
        }
        if (param4 == 2) {
            _loc11_[0].x -= 4;
            _loc11_[1].x += 4;
        }
        var _loc13_ = asVector(_loc11_.length, null);
        var _loc14_ = int(0);
        while (_loc14_ < _loc11_.length) {
            guard();
            _loc15_ = new InputSource_Recorder(param2, param1[_loc14_ * 3 % param1.length], param1[(_loc14_ * 3 + 1) % param1.length], param1[(_loc14_ * 3 + 2) % param1.length]);
            _loc13_[_loc14_] = new Ninja(_loc14_, _loc15_, _loc11_[_loc14_].x, _loc11_[_loc14_].y);
            (_loc14_ = int(_loc14_ + 1), int(_loc14_ - 1));
        }
        return new Simulator(_loc6_, _loc7_, _loc8_, _loc9_, _loc10_, _loc13_);
    }
    static LoadLevel_OldData_ARCADE_REPLAY(param1, param2, param3) {
        sim_loader.last_str_loaded = param3;
        var _loc4_ = asVector(Simulator.GRID_NUM_COLS * Simulator.GRID_NUM_ROWS, 0);
        var _loc5_ = new Grid_Segment(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc6_ = new Grid_Edges(Simulator.GRID_NUM_COLS * 2, Simulator.GRID_NUM_ROWS * 2, Simulator.GRID_CELL_SIZE * 0.5);
        var _loc7_ = new Grid_Entity(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc8_ = asVector(0, null);
        var _loc9_ = asVector(0, null);
        var _loc10_ = param3.split(sim_loader.OLDDATA_SEPERATION_CHAR_LEVEL);
        if (_loc10_.length > 0) {
            sim_loader.LoadLevel_OldData_Tiles(_loc10_[0], _loc4_, _loc5_, _loc6_, Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        if (_loc10_.length > 1) {
            sim_loader.LoadLevel_OldData_Entities(_loc10_[1], _loc5_, _loc6_, _loc7_, _loc8_, _loc9_, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        if (_loc9_.length == 0) {
            trace("WARNING! no player was loaded, default player created");
            _loc9_.push(new vec2(32, 32));
        }
        while (_loc9_.length < 2) {
            guard();
            _loc9_.push(_loc9_[0].Clone());
        }
        _loc9_[0].x -= 4;
        _loc9_[1].x += 4;
        var _loc11_ = asVector(_loc9_.length, null);
        var _loc12_ = new InputSource_Playback(sim_globals.StringtoBA(param1));
        _loc11_[0] = new Ninja(0, _loc12_, _loc9_[0].x, _loc9_[0].y);
        var _loc13_ = new InputSource_Playback(sim_globals.StringtoBA(param2));
        _loc11_[1] = new Ninja(1, _loc13_, _loc9_[1].x, _loc9_[1].y);
        return new Simulator(_loc4_, _loc5_, _loc6_, _loc7_, _loc8_, _loc11_);
    }
    static LoadLevel_OldData_HOLIDAY_REPLAY(param1, param2) {
        sim_loader.last_str_loaded = param2;
        var _loc3_ = asVector(Simulator.GRID_NUM_COLS * Simulator.GRID_NUM_ROWS, 0);
        var _loc4_ = new Grid_Segment(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc5_ = new Grid_Edges(Simulator.GRID_NUM_COLS * 2, Simulator.GRID_NUM_ROWS * 2, Simulator.GRID_CELL_SIZE * 0.5);
        var _loc6_ = new Grid_Entity(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc7_ = asVector(0, null);
        var _loc8_ = asVector(0, null);
        var _loc9_ = param2.split(sim_loader.OLDDATA_SEPERATION_CHAR_LEVEL);
        if (_loc9_.length > 0) {
            sim_loader.LoadLevel_OldData_Tiles(_loc9_[0], _loc3_, _loc4_, _loc5_, Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        if (_loc9_.length > 1) {
            sim_loader.LoadLevel_OldData_Entities(_loc9_[1], _loc4_, _loc5_, _loc6_, _loc7_, _loc8_, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        }
        var _loc10_ = new InputSource_Playback(sim_globals.StringtoBA(param1));
        var _loc11_ = asVector(1, null);
        _loc11_[0] = new Ninja(0, _loc10_, _loc8_[0].x, _loc8_[0].y);
        return new Simulator(_loc3_, _loc4_, _loc5_, _loc6_, _loc7_, _loc11_);
    }
    static LoadLevel_OldData_Entities(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc11_ = null;
        var _loc12_ = int(0);
        var _loc13_ = null;
        var _loc14_ = null;
        var _loc15_ = int(0);
        param4.Clear();
        param5.length = 0;
        param6.length = 0;
        if (param1.length == 0) {
            return;
        }
        var _loc9_ = param1.split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJECT);
        var _loc10_ = int(0);
        while (_loc10_ < _loc9_.length) {
            guard();
            _loc11_ = _loc9_[_loc10_].split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJTYPE);
            _loc12_ = int(Number(_loc11_[0]));
            _loc13_ = _loc11_[1].split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJPARAM);
            _loc14_ = asVector(_loc13_.length, 0);
            _loc15_ = int(0);
            while (_loc15_ < _loc13_.length) {
                guard();
                _loc14_[_loc15_] = Number(_loc13_[_loc15_]);
                (_loc15_ = int(_loc15_ + 1), int(_loc15_ - 1));
            }
            sim_loader.LoadLevel_OldData_CreateEntity(_loc12_, _loc14_, param2, param3, param4, param5, param6, param7, param8);
            (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
        }
    }
    static LoadLevel_OldData_CreateEntity(param1, param2, param3, param4, param5, param6, param7, param8, param9) {
        param1 = int(param1);
        var _loc12_ = null;
        var _loc13_ = null;
        var _loc14_ = null;
        var _loc15_ = int(0);
        var _loc16_ = int(0);
        var _loc17_ = false;
        var _loc18_ = int(0);
        var _loc19_ = null;
        var _loc20_ = null;
        var _loc21_ = null;
        var _loc22_ = null;
        var _loc23_ = null;
        var _loc24_ = int(0);
        var _loc25_ = null;
        var _loc26_ = null;
        var _loc10_ = asVector(0, null);
        if (param1 == sim_loader.OLDDATA_OBJTYPE_BOUNCEBLOCK) {
            if (param2.length == 2) {
                _loc10_.push(new Entity_BounceBlock(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_GOLD) {
            if (param2.length == 2) {
                _loc10_.push(new Entity_Gold(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_LAUNCHPAD) {
            if (param2.length == 4) {
                _loc10_.push(new Entity_Launchpad(param5, param2[0], param2[1], param2[2], param2[3]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_MINE) {
            if (param2.length == 2) {
                _loc10_.push(new Entity_Mine(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_ONEWAYPLATFORM) {
            if (param2.length == 3) {
                _loc12_ = sim_loader.HELPER_OldData_UnpackDirEnum(param2[2]);
                if (_loc12_ != null) {
                    _loc10_.push(new Entity_OnewayPlatform(param5, param2[0] + param9 * _loc12_.x, param2[1] + param9 * _loc12_.y, _loc12_.x, _loc12_.y));
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_DRONE) {
            if (param2.length == 6) {
                if (Boolean(param2[3])) {
                    _loc10_.push(new Entity_Drone_Chaser(param5, param2[0], param2[1], param2[5], Math.min(3, param2[2])));
                }
                else if (param2[4] == 0) {
                    _loc10_.push(new Entity_Drone_Zap(param5, param2[0], param2[1], param2[5], Math.min(3, param2[2])));
                }
                else if (param2[4] == 1) {
                    _loc10_.push(new Entity_Drone_Laser(param5, param2[0], param2[1], param2[5], Math.min(3, param2[2])));
                }
                else if (param2[4] == 2) {
                    _loc10_.push(new Entity_Drone_Chaingun(param5, param2[0], param2[1], param2[5], Math.min(3, param2[2])));
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_EXIT) {
            if (param2.length == 4) {
                _loc13_ = new Entity_ExitDoor(param2[0], param2[1]);
                _loc14_ = new Entity_ExitSwitch(param5, param2[2], param2[3], _loc13_);
                _loc10_.push(_loc13_);
                _loc10_.push(_loc14_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_FLOORGUARD) {
            if (param2.length == 3) {
                _loc10_.push(new Entity_FloorGuard(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_HOMINGLAUNCHER) {
            if (param2.length == 2) {
                _loc10_.push(new Entity_Rocket(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_TESTDOOR) {
            if (param2.length == 9) {
                _loc15_ = int(param2[4] + param2[7]);
                _loc16_ = int(param2[5] + param2[8]);
                _loc17_ = param2[2] != 1;
                _loc18_ = int(param3.DOOR_GetCellIndexFromGridspacePosition(_loc15_, _loc16_));
                _loc19_ = asVector(2, 0);
                if (!_loc17_) {
                    _loc19_[0] = param4.DOOR_GetCellIndexFromGridspacePosition(_loc15_ * 2, _loc16_ * 2 + 1);
                    _loc19_[1] = param4.DOOR_GetCellIndexFromGridspacePosition(_loc15_ * 2 + 1, _loc16_ * 2 + 1);
                }
                else {
                    _loc19_[0] = param4.DOOR_GetCellIndexFromGridspacePosition(_loc15_ * 2 + 1, _loc16_ * 2);
                    _loc19_[1] = param4.DOOR_GetCellIndexFromGridspacePosition(_loc15_ * 2 + 1, _loc16_ * 2 + 1);
                }
                _loc20_ = param3.DEBUG_GetWorldspaceCellCenterPositionFromIndex(_loc18_);
                _loc21_ = new vec2(0, 0);
                _loc22_ = new vec2(0, 0);
                if (_loc17_) {
                    _loc21_.x = _loc20_.x + 12;
                    _loc21_.y = _loc20_.y + 12;
                    _loc22_.x = _loc20_.x + 12;
                    _loc22_.y = _loc20_.y - 12;
                }
                else {
                    _loc21_.x = _loc20_.x - 12;
                    _loc21_.y = _loc20_.y + 12;
                    _loc22_.x = _loc20_.x + 12;
                    _loc22_.y = _loc20_.y + 12;
                }
                _loc23_ = new Segment_Linear_DoubleSided(_loc21_.x, _loc21_.y, _loc22_.x, _loc22_.y);
                _loc24_ = int(0);
                if (Boolean(param2[3])) {
                    _loc24_ = int(2);
                }
                else if (Boolean(param2[6])) {
                    _loc24_ = int(1);
                }
                _loc25_ = new vec2(0, 0);
                if (_loc24_ == 0) {
                    _loc25_.x = 0.5 * (_loc21_.x + _loc22_.x);
                    _loc25_.y = 0.5 * (_loc21_.y + _loc22_.y);
                }
                else {
                    _loc25_.x = param2[0];
                    _loc25_.y = param2[1];
                }
                if (_loc24_ == 0) {
                    _loc10_.push(new Entity_Door_Regular(param5, param3, _loc18_, _loc23_, param4, _loc19_, _loc17_, _loc25_.x, _loc25_.y));
                }
                else if (_loc24_ == 1) {
                    _loc10_.push(new Entity_Door_Locked(param5, param3, _loc18_, _loc23_, param4, _loc19_, _loc17_, _loc25_.x, _loc25_.y));
                }
                else if (_loc24_ == 2) {
                    _loc10_.push(new Entity_Door_Trap(param5, param3, _loc18_, _loc23_, param4, _loc19_, _loc17_, _loc25_.x, _loc25_.y));
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_THWOMP) {
            if (param2.length == 3) {
                _loc26_ = sim_loader.HELPER_OldData_UnpackDirEnum(param2[2]);
                if (_loc26_ != null) {
                    if (_loc26_.y == 0) {
                        _loc10_.push(new Entity_Thwomp(param5, param2[0], param2[1], _loc26_.x, true));
                    }
                    else {
                        _loc10_.push(new Entity_Thwomp(param5, param2[0], param2[1], _loc26_.y, false));
                    }
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_TURRET) {
            if (param2.length == 2) {
                _loc10_.push(new Entity_Turret(param5, param2[0], param2[1]));
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_PLAYER) {
            if (param2.length == 2) {
                param7.push(new vec2(param2[0], param2[1]));
            }
        }
        var _loc11_ = int(0);
        while (_loc11_ < _loc10_.length) {
            guard();
            sim_loader.Helper_RegisterEntity(param6, _loc10_[_loc11_]);
            (_loc11_ = int(_loc11_ + 1), int(_loc11_ - 1));
        }
    }
    static Helper_RegisterEntity(param1, param2) {
        param2.GAME_SetUID(param1.length);
        param1.push(param2);
    }
    static HELPER_OldData_UnpackDirEnum(param1) {
        if (param1 == 0) {
            return new vec2(1, 0);
        }
        if (param1 == 1) {
            return new vec2(0, 1);
        }
        if (param1 == 2) {
            return new vec2(-1, 0);
        }
        if (param1 == 3) {
            return new vec2(0, -1);
        }
        return null;
    }
    static LoadLevel_OldData_Tiles(param1, param2, param3, param4, param5, param6, param7, param8) {
        param5 = int(param5);
        param6 = int(param6);
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = null;
        var _loc15_ = int(0);
        var _loc16_ = int(0);
        var _loc17_ = int(0);
        param3.Clear();
        param4.Clear();
        sim_loader.LoadLevel_InitTileIDGridWithBoundaryEdges(param2, param5, param6);
        var _loc9_ = int(0);
        while (_loc9_ < param1.length) {
            guard();
            _loc12_ = int(1 + _loc9_ % (param6 - 2));
            _loc13_ = int(1 + Math.floor(_loc9_ / (param6 - 2)));
            _loc14_ = param1.charAt(_loc9_);
            _loc15_ = int(_loc14_.charCodeAt(0) - sim_loader.OLDDATA_CHAR_PAD);
            param2[_loc13_ + _loc12_ * param5] = tiletypes.GetTypeFromChar(_loc15_);
            (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
        }
        var _loc10_ = asVector(4, 0);
        var _loc11_ = int(0);
        while (_loc11_ < param2.length) {
            guard();
            _loc16_ = int(_loc11_ % param5);
            _loc17_ = int(Math.floor(_loc11_ / param5));
            if (_loc16_ == 0) {
                _loc10_[0] = tiletypes.EMPTY;
            }
            else {
                _loc10_[0] = param2[_loc16_ - 1 + _loc17_ * param5];
            }
            if (_loc16_ == param5 - 1) {
                _loc10_[2] = tiletypes.EMPTY;
            }
            else {
                _loc10_[2] = param2[_loc16_ + 1 + _loc17_ * param5];
            }
            if (_loc17_ == 0) {
                _loc10_[3] = tiletypes.EMPTY;
            }
            else {
                _loc10_[3] = param2[_loc16_ + (_loc17_ - 1) * param5];
            }
            if (_loc17_ == param6 - 1) {
                _loc10_[1] = tiletypes.EMPTY;
            }
            else {
                _loc10_[1] = param2[_loc16_ + (_loc17_ + 1) * param5];
            }
            sim_loader.LoadLevel_BuildTileSegs(param3, param7, param8, _loc16_, _loc17_, param2[_loc11_], _loc10_);
            sim_loader.LoadLevel_BuildTileEdges(param4, _loc16_, _loc17_, param2[_loc11_]);
            (_loc11_ = int(_loc11_ + 1), int(_loc11_ - 1));
        }
    }
    static LoadLevel_BuildTileSegs(param1, param2, param3, param4, param5, param6, param7) {
        param4 = int(param4);
        param5 = int(param5);
        param6 = int(param6);
        var _loc8_ = tiledefs.GenerateTileSegments_Filtered(param6, param7, param4 * param2 + param3, param5 * param2 + param3, param3);
        var _loc9_ = int(0);
        while (_loc9_ < _loc8_.length) {
            guard();
            param1.AddSegToCell(param4, param5, _loc8_[_loc9_]);
            (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
        }
    }
    static LoadLevel_BuildTileEdges(param1, param2, param3, param4) {
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        param1.GAME_LoadTileEdges(param2, param3, param4);
    }
    static LoadLevel_InitTileIDGridWithBoundaryEdges(param1, param2, param3) {
        param2 = int(param2);
        param3 = int(param3);
        var _loc4_ = int(param2 * param3);
        var _loc5_ = int(0);
        while (_loc5_ < _loc4_) {
            guard();
            param1[_loc5_] = tiletypes.EMPTY;
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
        var _loc6_ = int(1);
        while (_loc6_ < param2 - 1) {
            guard();
            param1[_loc6_] = tiletypes.EDGE_BOTTOM;
            param1[_loc6_ + (param3 - 1) * param2] = tiletypes.EDGE_TOP;
            (_loc6_ = int(_loc6_ + 1), int(_loc6_ - 1));
        }
        var _loc7_ = int(1);
        while (_loc7_ < param3 - 1) {
            guard();
            param1[_loc7_ * param2] = tiletypes.EDGE_RIGHT;
            param1[param2 - 1 + _loc7_ * param2] = tiletypes.EDGE_LEFT;
            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
        }
        param1[0] = tiletypes.EDGE_CORNER_UL;
        param1[param2 - 1] = tiletypes.EDGE_CORNER_UR;
        param1[(param3 - 1) * param2] = tiletypes.EDGE_CORNER_DL;
        param1[param3 * param2 - 1] = tiletypes.EDGE_CORNER_DR;
    }
    static LoadLevel_EditorState(param1, param2, param3, param4, param5, param6) {
        param5 = int(param5);
        var _loc15_ = null;
        mathutils.GenerateNewRandomSeed();
        var _loc7_ = asVector(Simulator.GRID_NUM_COLS * Simulator.GRID_NUM_ROWS, 0);
        var _loc8_ = new Grid_Segment(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc9_ = new Grid_Edges(Simulator.GRID_NUM_COLS * 2, Simulator.GRID_NUM_ROWS * 2, Simulator.GRID_CELL_SIZE * 0.5);
        var _loc10_ = new Grid_Entity(Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE);
        var _loc11_ = asVector(0, null);
        var _loc12_ = asVector(0, null);
        sim_loader.LoadLevel_EditorState_Tiles(param6.tileIDs, _loc7_, _loc8_, _loc9_, Simulator.GRID_NUM_COLS, Simulator.GRID_NUM_ROWS, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        sim_loader.LoadLevel_EditorState_Entities(param6.entities, _loc8_, _loc9_, _loc10_, _loc11_, _loc12_, Simulator.GRID_CELL_SIZE, Simulator.GRID_CELL_HALFWIDTH);
        if (_loc12_.length == 0) {
            trace("WARNING! no player was loaded, default player created");
            _loc12_.push(new vec2(32, 32));
        }
        while (_loc12_.length < param5) {
            guard();
            trace("WARNING! forcing ninja creation");
            _loc12_.push(_loc12_[0].Clone());
        }
        while (_loc12_.length > param5) {
            guard();
            _loc12_.pop();
        }
        if (_loc12_.length == 2) {
            _loc12_[0].x -= 4;
            _loc12_[1].x += 4;
        }
        var _loc13_ = asVector(_loc12_.length, null);
        var _loc14_ = int(0);
        while (_loc14_ < _loc12_.length) {
            guard();
            _loc15_ = null;
            if (param4 == null) {
                _loc15_ = new InputSource_Recorder(param3, param1[_loc14_ * 3 % param1.length], param1[(_loc14_ * 3 + 1) % param1.length], param1[(_loc14_ * 3 + 2) % param1.length]);
            }
            else {
                _loc15_ = new InputSource_Playback(param4);
            }
            _loc13_[_loc14_] = new Ninja(_loc14_, _loc15_, _loc12_[_loc14_].x, _loc12_[_loc14_].y, param2[_loc14_]);
            (_loc14_ = int(_loc14_ + 1), int(_loc14_ - 1));
        }
        return new Simulator(_loc7_, _loc8_, _loc9_, _loc10_, _loc11_, _loc13_);
    }
    static LoadLevel_EditorState_Tiles(param1, param2, param3, param4, param5, param6, param7, param8) {
        param5 = int(param5);
        param6 = int(param6);
        var _loc12_ = int(0);
        var _loc13_ = int(0);
        var _loc14_ = int(0);
        var _loc15_ = int(0);
        param3.Clear();
        param4.Clear();
        sim_loader.LoadLevel_InitTileIDGridWithBoundaryEdges(param2, param5, param6);
        var _loc9_ = int(0);
        while (_loc9_ < param1.length) {
            guard();
            _loc12_ = int(1 + _loc9_ % edat.num_cols);
            _loc13_ = int(1 + Math.floor(_loc9_ / edat.num_cols));
            param2[_loc12_ + _loc13_ * param5] = param1[_loc9_];
            (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1));
        }
        var _loc10_ = asVector(4, 0);
        var _loc11_ = int(0);
        while (_loc11_ < param2.length) {
            guard();
            _loc14_ = int(_loc11_ % param5);
            _loc15_ = int(Math.floor(_loc11_ / param5));
            if (_loc14_ == 0) {
                _loc10_[0] = tiletypes.EMPTY;
            }
            else {
                _loc10_[0] = param2[_loc14_ - 1 + _loc15_ * param5];
            }
            if (_loc14_ == param5 - 1) {
                _loc10_[2] = tiletypes.EMPTY;
            }
            else {
                _loc10_[2] = param2[_loc14_ + 1 + _loc15_ * param5];
            }
            if (_loc15_ == 0) {
                _loc10_[3] = tiletypes.EMPTY;
            }
            else {
                _loc10_[3] = param2[_loc14_ + (_loc15_ - 1) * param5];
            }
            if (_loc15_ == param6 - 1) {
                _loc10_[1] = tiletypes.EMPTY;
            }
            else {
                _loc10_[1] = param2[_loc14_ + (_loc15_ + 1) * param5];
            }
            sim_loader.LoadLevel_BuildTileSegs(param3, param7, param8, _loc14_, _loc15_, param2[_loc11_], _loc10_);
            sim_loader.LoadLevel_BuildTileEdges(param4, _loc14_, _loc15_, param2[_loc11_]);
            (_loc11_ = int(_loc11_ + 1), int(_loc11_ - 1));
        }
    }
    static LoadLevel_EditorState_Entities(param1, param2, param3, param4, param5, param6, param7, param8) {
        var _loc10_ = null;
        var _loc11_ = uint(0);
        var _loc12_ = NaN;
        var _loc13_ = NaN;
        var _loc14_ = uint(0);
        var _loc15_ = uint(0);
        var _loc16_ = null;
        var _loc17_ = null;
        var _loc18_ = null;
        var _loc19_ = null;
        var _loc20_ = NaN;
        var _loc21_ = NaN;
        var _loc22_ = int(0);
        var _loc23_ = false;
        var _loc24_ = null;
        var _loc25_ = null;
        var _loc26_ = null;
        var _loc27_ = null;
        var _loc28_ = null;
        var _loc29_ = null;
        var _loc30_ = null;
        var _loc31_ = null;
        var _loc32_ = null;
        var _loc33_ = NaN;
        var _loc34_ = NaN;
        var _loc35_ = null;
        var _loc36_ = null;
        var _loc37_ = null;
        var _loc38_ = null;
        var _loc39_ = NaN;
        var _loc40_ = NaN;
        var _loc41_ = null;
        var _loc42_ = null;
        var _loc43_ = null;
        var _loc44_ = null;
        var _loc45_ = null;
        var _loc46_ = null;
        var _loc47_ = null;
        var _loc48_ = null;
        var _loc49_ = null;
        var _loc50_ = null;
        var _loc51_ = null;
        var _loc52_ = NaN;
        var _loc53_ = false;
        var _loc54_ = null;
        var _loc55_ = null;
        var _loc56_ = null;
        param4.Clear();
        param5.length = 0;
        param6.length = 0;
        var _loc9_ = int(0);
        for (; _loc9_ < param1.length; (_loc9_ = int(_loc9_ + 1), int(_loc9_ - 1))) {
            guard();
            _loc10_ = param1[_loc9_];
            _loc11_ = uint(_loc10_[edat.EPROP_TYPE]);
            _loc12_ = _loc10_[edat.EPROP_X] * edat.quantize_step_size;
            _loc13_ = _loc10_[edat.EPROP_Y] * edat.quantize_step_size;
            _loc14_ = uint(0);
            _loc15_ = uint(0);
            if (_loc10_.length > 3) {
                _loc14_ = uint(_loc10_[edat.EPROP_DIR]);
                if (_loc10_.length > 4) {
                    _loc15_ = uint(_loc10_[edat.EPROP_MOVE]);
                }
            }
            if (_loc11_ == edat.ETYPE_BOUNCEBLOCK) {
                _loc16_ = new Entity_BounceBlock(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc16_);
            }
            else if (_loc11_ == edat.ETYPE_CHAINGUN) {
                _loc17_ = new Entity_Drone_Chaingun(param4, _loc12_, _loc13_, sim_loader.Helper_Editor_NewDirEnumToOldDirEnum(_loc14_), _loc15_);
                sim_loader.Helper_RegisterEntity(param5, _loc17_);
            }
            else if (_loc11_ == edat.ETYPE_CHASER) {
                _loc18_ = new Entity_Drone_Chaser(param4, _loc12_, _loc13_, sim_loader.Helper_Editor_NewDirEnumToOldDirEnum(_loc14_), _loc15_);
                sim_loader.Helper_RegisterEntity(param5, _loc18_);
            }
            else if (_loc11_ == edat.ETYPE_DOOR_LOCKED || _loc11_ == edat.ETYPE_DOOR_REGULAR || _loc11_ == edat.ETYPE_DOOR_TRAP) {
                _loc19_ = edat.MAP_DIR_TO_VEC(_loc14_);
                _loc20_ = Math.floor((_loc12_ - _loc19_.x * 12) / 24);
                _loc21_ = Math.floor((_loc13_ - _loc19_.y * 12) / 24);
                _loc22_ = int(param2.DOOR_GetCellIndexFromGridspacePosition(_loc20_, _loc21_));
                _loc23_ = _loc14_ == 0;
                _loc24_ = asVector(2, 0);
                if (!_loc23_) {
                    _loc24_[0] = param3.DOOR_GetCellIndexFromGridspacePosition(_loc20_ * 2, _loc21_ * 2 + 1);
                    _loc24_[1] = param3.DOOR_GetCellIndexFromGridspacePosition(_loc20_ * 2 + 1, _loc21_ * 2 + 1);
                }
                else {
                    _loc24_[0] = param3.DOOR_GetCellIndexFromGridspacePosition(_loc20_ * 2 + 1, _loc21_ * 2);
                    _loc24_[1] = param3.DOOR_GetCellIndexFromGridspacePosition(_loc20_ * 2 + 1, _loc21_ * 2 + 1);
                }
                _loc25_ = param2.DEBUG_GetWorldspaceCellCenterPositionFromIndex(_loc22_);
                _loc26_ = new vec2(_loc12_, _loc13_);
                _loc27_ = _loc19_.Perp();
                _loc27_.Scale(12);
                _loc28_ = _loc26_.Plus(_loc27_);
                _loc29_ = _loc26_.Minus(_loc27_);
                _loc30_ = new Segment_Linear_DoubleSided(_loc28_.x, _loc28_.y, _loc29_.x, _loc29_.y);
                if (_loc11_ == edat.ETYPE_DOOR_REGULAR) {
                    _loc31_ = new Entity_Door_Regular(param4, param2, _loc22_, _loc30_, param3, _loc24_, _loc23_, _loc12_, _loc13_);
                    sim_loader.Helper_RegisterEntity(param5, _loc31_);
                }
                else {
                    _loc32_ = param1[_loc9_ + 1];
                    _loc33_ = _loc32_[edat.EPROP_X] * edat.quantize_step_size;
                    _loc34_ = _loc32_[edat.EPROP_Y] * edat.quantize_step_size;
                    if (_loc11_ == edat.ETYPE_DOOR_LOCKED) {
                        _loc35_ = new Entity_Door_Locked(param4, param2, _loc22_, _loc30_, param3, _loc24_, _loc23_, _loc33_, _loc34_);
                        sim_loader.Helper_RegisterEntity(param5, _loc35_);
                    }
                    else if (_loc11_ == edat.ETYPE_DOOR_TRAP) {
                        _loc36_ = new Entity_Door_Trap(param4, param2, _loc22_, _loc30_, param3, _loc24_, _loc23_, _loc33_, _loc34_);
                        sim_loader.Helper_RegisterEntity(param5, _loc36_);
                    }
                }
            }
            else if (_loc11_ == edat.ETYPE_EXIT_DOOR) {
                _loc37_ = new Entity_ExitDoor(_loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc37_);
                _loc38_ = param1[_loc9_ + 1];
                _loc39_ = _loc38_[edat.EPROP_X] * edat.quantize_step_size;
                _loc40_ = _loc38_[edat.EPROP_Y] * edat.quantize_step_size;
                _loc41_ = new Entity_ExitSwitch(param4, _loc39_, _loc40_, _loc37_);
                sim_loader.Helper_RegisterEntity(param5, _loc41_);
            }
            else if (_loc11_ == edat.ETYPE_EXIT_SWITCH) {
                if (_loc9_ > 0) {
                    if (param1[_loc9_ - 1][edat.EPROP_TYPE] == edat.ETYPE_EXIT_DOOR) {
                        continue;
                    }
                }
                trace("WARNING! LoadLevel_EditorState_Entities() found an exit switch without preceeding exit door!: " + _loc9_);
            }
            else if (_loc11_ == edat.ETYPE_FLOORGUARD) {
                _loc42_ = new Entity_FloorGuard(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc42_);
            }
            else if (_loc11_ == edat.ETYPE_GOLD) {
                _loc43_ = new Entity_Gold(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc43_);
            }
            else if (_loc11_ == edat.ETYPE_LASER) {
                _loc44_ = new Entity_Drone_Laser(param4, _loc12_, _loc13_, sim_loader.Helper_Editor_NewDirEnumToOldDirEnum(_loc14_), _loc15_);
                sim_loader.Helper_RegisterEntity(param5, _loc44_);
            }
            else if (_loc11_ == edat.ETYPE_LAUNCHPAD) {
                _loc45_ = edat.MAP_DIR_TO_VEC(_loc14_);
                _loc46_ = new Entity_Launchpad(param4, _loc12_, _loc13_, _loc45_.x, _loc45_.y);
                sim_loader.Helper_RegisterEntity(param5, _loc46_);
            }
            else if (_loc11_ == edat.ETYPE_MINE) {
                _loc47_ = new Entity_Mine(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc47_);
            }
            else if (_loc11_ == edat.ETYPE_ONEWAY) {
                _loc48_ = edat.MAP_DIR_TO_VEC(_loc14_);
                _loc49_ = new Entity_OnewayPlatform(param4, _loc12_, _loc13_, _loc48_.x, _loc48_.y);
                sim_loader.Helper_RegisterEntity(param5, _loc49_);
            }
            else if (_loc11_ == edat.ETYPE_PLAYER) {
                param6.push(new vec2(_loc12_, _loc13_));
            }
            else if (_loc11_ == edat.ETYPE_ROCKET) {
                _loc50_ = new Entity_Rocket(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc50_);
            }
            else if (_loc11_ == edat.ETYPE_SWITCH_LOCKED) {
                if (_loc9_ > 0) {
                    if (param1[_loc9_ - 1][edat.EPROP_TYPE] == edat.ETYPE_DOOR_LOCKED) {
                        continue;
                    }
                }
                trace("WARNING! LoadLevel_EditorState_Entities() found a locked switch without preceeding locked door!: " + _loc9_);
            }
            else if (_loc11_ == edat.ETYPE_SWITCH_TRAP) {
                if (_loc9_ > 0) {
                    if (param1[_loc9_ - 1][edat.EPROP_TYPE] == edat.ETYPE_DOOR_TRAP) {
                        continue;
                    }
                }
                trace("WARNING! LoadLevel_EditorState_Entities() found a locked switch without preceeding trap door!: " + _loc9_);
            }
            else if (_loc11_ == edat.ETYPE_THWOMP) {
                _loc51_ = edat.MAP_DIR_TO_VEC(_loc14_);
                _loc52_ = 0;
                _loc53_ = false;
                if (_loc51_.y == 0) {
                    _loc52_ = _loc51_.x;
                    _loc53_ = true;
                }
                else {
                    _loc52_ = _loc51_.y;
                }
                _loc54_ = new Entity_Thwomp(param4, _loc12_, _loc13_, _loc52_, _loc53_);
                sim_loader.Helper_RegisterEntity(param5, _loc54_);
            }
            else if (_loc11_ == edat.ETYPE_TURRET) {
                _loc55_ = new Entity_Turret(param4, _loc12_, _loc13_);
                sim_loader.Helper_RegisterEntity(param5, _loc55_);
            }
            else if (_loc11_ == edat.ETYPE_ZAP) {
                _loc56_ = new Entity_Drone_Zap(param4, _loc12_, _loc13_, sim_loader.Helper_Editor_NewDirEnumToOldDirEnum(_loc14_), _loc15_);
                sim_loader.Helper_RegisterEntity(param5, _loc56_);
            }
        }
    }
    static BuildEditorState_OldData(param1) {
        var _loc2_ = new Editor_State();
        var _loc3_ = int(0);
        var _loc4_ = int(0);
        if (edat.num_cols != 31) {
            _loc3_ = int(5);
            _loc4_ = int(_loc3_ * edat.quantize_steps_per_cell);
        }
        var _loc5_ = param1.split(sim_loader.OLDDATA_SEPERATION_CHAR_LEVEL);
        if (_loc5_.length > 0) {
            sim_loader.BuildEditorState_OldData_Tiles(_loc5_[0], _loc2_.tileIDs, _loc3_);
        }
        if (_loc5_.length > 1) {
            sim_loader.BuildEditorState_OldData_Entities(_loc5_[1], _loc2_.entities, _loc4_);
        }
        return _loc2_;
    }
    static BuildEditorState_OldData_Tiles(param1, param2, param3 = 0) {
        param3 = int(param3);
        var _loc6_ = int(0);
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = int(0);
        if (param1.length != 31 * 23) {
            trace("WARNING! BuildEditorState_OldData_Tiles() was passed an invalid string: " + param1.length);
            return;
        }
        var _loc4_ = int(0);
        while (_loc4_ < param2.length) {
            guard();
            param2[_loc4_] = tiletypes.FULL;
            (_loc4_ = int(_loc4_ + 1), int(_loc4_ - 1));
        }
        var _loc5_ = int(0);
        while (_loc5_ < param1.length) {
            guard();
            _loc6_ = int(_loc5_ % edat.num_rows);
            _loc7_ = int(Math.floor(_loc5_ / edat.num_rows));
            _loc8_ = param1.charAt(_loc5_);
            _loc9_ = int(_loc8_.charCodeAt(0) - sim_loader.OLDDATA_CHAR_PAD);
            param2[_loc7_ + _loc6_ * edat.num_cols + param3] = tiletypes.GetTypeFromChar(_loc9_);
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
    }
    static BuildEditorState_OldData_Entities(param1, param2, param3 = 0) {
        param3 = int(param3);
        var _loc6_ = null;
        var _loc7_ = int(0);
        var _loc8_ = null;
        var _loc9_ = null;
        var _loc10_ = int(0);
        if (param1.length == 0) {
            return;
        }
        var _loc4_ = param1.split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJECT);
        var _loc5_ = int(0);
        while (_loc5_ < _loc4_.length) {
            guard();
            _loc6_ = _loc4_[_loc5_].split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJTYPE);
            _loc7_ = int(Number(_loc6_[0]));
            _loc8_ = _loc6_[1].split(sim_loader.OLDDATA_SEPERATION_CHAR_OBJPARAM);
            _loc9_ = asVector(_loc8_.length, 0);
            _loc10_ = int(0);
            while (_loc10_ < _loc8_.length) {
                guard();
                _loc9_[_loc10_] = Number(_loc8_[_loc10_]);
                (_loc10_ = int(_loc10_ + 1), int(_loc10_ - 1));
            }
            sim_loader.BuildEditorState_OldData_CreateEntity(_loc7_, _loc9_, param2, param3);
            (_loc5_ = int(_loc5_ + 1), int(_loc5_ - 1));
        }
    }
    static BuildEditorState_OldData_CreateEntity(param1, param2, param3, param4 = 0) {
        param1 = int(param1);
        param4 = int(param4);
        var _loc5_ = null;
        var _loc6_ = null;
        var _loc7_ = null;
        var _loc8_ = null;
        var _loc9_ = null;
        var _loc10_ = null;
        var _loc11_ = null;
        var _loc12_ = null;
        var _loc13_ = null;
        var _loc14_ = null;
        var _loc15_ = null;
        var _loc16_ = null;
        var _loc17_ = null;
        var _loc18_ = null;
        var _loc19_ = int(0);
        var _loc20_ = int(0);
        var _loc21_ = false;
        var _loc22_ = null;
        var _loc23_ = uint(0);
        var _loc24_ = null;
        var _loc25_ = null;
        var _loc26_ = null;
        var _loc27_ = null;
        var _loc28_ = null;
        var _loc29_ = null;
        var _loc30_ = null;
        var _loc31_ = null;
        if (param1 == sim_loader.OLDDATA_OBJTYPE_BOUNCEBLOCK) {
            if (param2.length == 2) {
                _loc5_ = asVector(3, 0);
                _loc5_[edat.EPROP_TYPE] = edat.ETYPE_BOUNCEBLOCK;
                _loc5_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc5_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc5_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_GOLD) {
            if (param2.length == 2) {
                _loc6_ = asVector(3, 0);
                _loc6_[edat.EPROP_TYPE] = edat.ETYPE_GOLD;
                _loc6_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc6_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc6_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_LAUNCHPAD) {
            if (param2.length == 4) {
                _loc7_ = asVector(4, 0);
                _loc7_[edat.EPROP_TYPE] = edat.ETYPE_LAUNCHPAD;
                _loc7_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc7_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                _loc7_[edat.EPROP_DIR] = sim_loader.Helper_Editor_VecToDirEnum(param2[2], param2[3]);
                param3.push(_loc7_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_MINE) {
            if (param2.length == 2) {
                _loc8_ = asVector(3, 0);
                _loc8_[edat.EPROP_TYPE] = edat.ETYPE_MINE;
                _loc8_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc8_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc8_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_ONEWAYPLATFORM) {
            if (param2.length == 3) {
                _loc9_ = sim_loader.HELPER_OldData_UnpackDirEnum(param2[2]);
                _loc10_ = asVector(4, 0);
                _loc10_[edat.EPROP_TYPE] = edat.ETYPE_ONEWAY;
                _loc10_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0] + 12 * _loc9_.x) + param4;
                _loc10_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1] + 12 * _loc9_.y);
                _loc10_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[2]);
                param3.push(_loc10_);
                if (sim_loader.Helper_Editor_VecToDirEnum(_loc9_.x, _loc9_.y) != sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[2])) {
                    trace("WARNING! BuildEditorState_OldData_Entities() found a problem with its dir-enum helpers: " + sim_loader.Helper_Editor_VecToDirEnum(_loc9_.x, _loc9_.y) + "," + sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[2]));
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_DRONE) {
            if (param2.length == 6) {
                if (Boolean(param2[3])) {
                    _loc11_ = asVector(5, 0);
                    _loc11_[edat.EPROP_TYPE] = edat.ETYPE_CHASER;
                    _loc11_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc11_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    _loc11_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[5]);
                    _loc11_[edat.EPROP_MOVE] = uint(Math.min(3, param2[2]));
                    param3.push(_loc11_);
                }
                else if (param2[4] == 0) {
                    _loc12_ = asVector(5, 0);
                    _loc12_[edat.EPROP_TYPE] = edat.ETYPE_ZAP;
                    _loc12_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc12_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    _loc12_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[5]);
                    _loc12_[edat.EPROP_MOVE] = uint(Math.min(3, param2[2]));
                    param3.push(_loc12_);
                }
                else if (param2[4] == 1) {
                    _loc13_ = asVector(5, 0);
                    _loc13_[edat.EPROP_TYPE] = edat.ETYPE_LASER;
                    _loc13_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc13_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    _loc13_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[5]);
                    _loc13_[edat.EPROP_MOVE] = uint(Math.min(3, param2[2]));
                    param3.push(_loc13_);
                }
                else if (param2[4] == 2) {
                    _loc14_ = asVector(5, 0);
                    _loc14_[edat.EPROP_TYPE] = edat.ETYPE_CHAINGUN;
                    _loc14_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc14_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    _loc14_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[5]);
                    _loc14_[edat.EPROP_MOVE] = uint(Math.min(3, param2[2]));
                    param3.push(_loc14_);
                }
            }
            else {
                trace("WARNING! BuildEditorState_OldData_CreateEntity() was passed an invalid set of params: " + param2.length);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_EXIT) {
            if (param2.length == 4) {
                _loc15_ = asVector(3, 0);
                _loc15_[edat.EPROP_TYPE] = edat.ETYPE_EXIT_DOOR;
                _loc15_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc15_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc15_);
                _loc16_ = asVector(3, 0);
                _loc16_[edat.EPROP_TYPE] = edat.ETYPE_EXIT_SWITCH;
                _loc16_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[2]) + param4;
                _loc16_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[3]);
                param3.push(_loc16_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_FLOORGUARD) {
            if (param2.length == 3) {
                _loc17_ = asVector(3, 0);
                _loc17_[edat.EPROP_TYPE] = edat.ETYPE_FLOORGUARD;
                _loc17_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc17_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc17_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_HOMINGLAUNCHER) {
            if (param2.length == 2) {
                _loc18_ = asVector(3, 0);
                _loc18_[edat.EPROP_TYPE] = edat.ETYPE_ROCKET;
                _loc18_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc18_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc18_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_TESTDOOR) {
            if (param2.length == 9) {
                _loc19_ = int(param2[4] + param2[7]);
                _loc20_ = int(param2[5] + param2[8]);
                _loc21_ = param2[2] != 1;
                _loc22_ = new vec2((0.5 + _loc19_) * 24, (0.5 + _loc20_) * 24);
                _loc23_ = uint(0);
                if (_loc21_) {
                    _loc22_.x += 12;
                }
                else {
                    _loc22_.y += 12;
                    _loc23_ = uint(2);
                }
                if (Boolean(param2[3])) {
                    _loc24_ = asVector(4, 0);
                    _loc24_[edat.EPROP_TYPE] = edat.ETYPE_DOOR_TRAP;
                    _loc24_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.x) + param4;
                    _loc24_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.y);
                    _loc24_[edat.EPROP_DIR] = _loc23_;
                    param3.push(_loc24_);
                    _loc25_ = asVector(3, 0);
                    _loc25_[edat.EPROP_TYPE] = edat.ETYPE_SWITCH_TRAP;
                    _loc25_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc25_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    param3.push(_loc25_);
                }
                else if (Boolean(param2[6])) {
                    _loc26_ = asVector(4, 0);
                    _loc26_[edat.EPROP_TYPE] = edat.ETYPE_DOOR_LOCKED;
                    _loc26_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.x) + param4;
                    _loc26_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.y);
                    _loc26_[edat.EPROP_DIR] = _loc23_;
                    param3.push(_loc26_);
                    _loc27_ = asVector(3, 0);
                    _loc27_[edat.EPROP_TYPE] = edat.ETYPE_SWITCH_LOCKED;
                    _loc27_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                    _loc27_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                    param3.push(_loc27_);
                }
                else {
                    _loc28_ = asVector(4, 0);
                    _loc28_[edat.EPROP_TYPE] = edat.ETYPE_DOOR_REGULAR;
                    _loc28_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.x) + param4;
                    _loc28_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(_loc22_.y);
                    _loc28_[edat.EPROP_DIR] = _loc23_;
                    param3.push(_loc28_);
                }
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_THWOMP) {
            if (param2.length == 3) {
                _loc29_ = asVector(4, 0);
                _loc29_[edat.EPROP_TYPE] = edat.ETYPE_THWOMP;
                _loc29_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc29_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                _loc29_[edat.EPROP_DIR] = sim_loader.Helper_Editor_OldDirEnumToNewDirEnum(param2[2]);
                param3.push(_loc29_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_TURRET) {
            if (param2.length == 2) {
                _loc30_ = asVector(3, 0);
                _loc30_[edat.EPROP_TYPE] = edat.ETYPE_TURRET;
                _loc30_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc30_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc30_);
            }
        }
        else if (param1 == sim_loader.OLDDATA_OBJTYPE_PLAYER) {
            if (param2.length == 2) {
                _loc31_ = asVector(3, 0);
                _loc31_[edat.EPROP_TYPE] = edat.ETYPE_PLAYER;
                _loc31_[edat.EPROP_X] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[0]) + param4;
                _loc31_[edat.EPROP_Y] = sim_loader.Helper_Editor_GetQuantizedPosition(param2[1]);
                param3.push(_loc31_);
            }
        }
    }
    static Helper_Editor_GetQuantizedPosition(param1) {
        return uint(Math.round(param1 / Number(edat.quantize_step_size)));
    }
    static Helper_Editor_OldDirEnumToNewDirEnum(param1) {
        return uint(uint(param1 * 2));
    }
    static Helper_Editor_NewDirEnumToOldDirEnum(param1) {
        param1 = uint(param1);
        return int(Math.floor(param1 / 2));
    }
    static Helper_Editor_VecToDirEnum(param1, param2) {
        if (param1 == 0) {
            if (param2 == 0) {
                trace("WARNING! Helper_Editor_VecToDirEnum() was passed an invalid dir!:" + param1 + "," + param2);
                return uint(0);
            }
            if (param2 < 1) {
                return uint(edat.DIR_U);
            }
            return uint(edat.DIR_D);
        }
        if (param2 == 0) {
            if (param1 == 0) {
                trace("WARNING! Helper_Editor_VecToDirEnum() was passed an invalid dir!:" + param1 + "," + param2);
                return uint(0);
            }
            if (param1 < 1) {
                return uint(edat.DIR_L);
            }
            return uint(edat.DIR_R);
        }
        if (param1 < 0) {
            if (param2 < 0) {
                return uint(edat.DIR_LU);
            }
            return uint(edat.DIR_LD);
        }
        if (param2 < 0) {
            return uint(edat.DIR_RU);
        }
        return uint(edat.DIR_RD);
    }
}
export class TileEdgeArchetype_Circular {
    x0 = NaN;
    y0 = NaN;
    x1 = NaN;
    y1 = NaN;
    x2 = NaN;
    y2 = NaN;
    constructor(param1, param2, param3, param4, param5, param6) {
        this.x0 = param1;
        this.y0 = param2;
        this.x1 = param3;
        this.y1 = param4;
        this.x2 = param5;
        this.y2 = param6;
    }
    GeneratePerpArchetype() {
        return new TileEdgeArchetype_Circular(-this.y0, this.x0, -this.y1, this.x1, -this.y2, this.x2);
    }
    GenerateCollisionSegment(param1, param2, param3) {
        return new Segment_Circular(param1 + this.x2 * param3, param2 + this.y2 * param3, param1 + this.x0 * param3, param2 + this.y0 * param3, param1 + this.x1 * param3, param2 + this.y1 * param3);
    }
}
export class TileEdgeArchetype_Linear {
    x0 = NaN;
    y0 = NaN;
    x1 = NaN;
    y1 = NaN;
    constructor(param1, param2, param3, param4) {
        this.x0 = param1;
        this.y0 = param2;
        this.x1 = param3;
        this.y1 = param4;
    }
    GeneratePerpArchetype() {
        return new TileEdgeArchetype_Linear(-this.y0, this.x0, -this.y1, this.x1);
    }
    GenerateCollisionSegment(param1, param2, param3) {
        return new Segment_Linear(param1 + this.x0 * param3, param2 + this.y0 * param3, param1 + this.x1 * param3, param2 + this.y1 * param3);
    }
}
export class edgedefs {
    static edgestates_X = null;
    static edgestates_Y = null;
    constructor() {
    }
    static GetEdgeState_X(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        return int(edgedefs.edgestates_X[param1 * 6 + param2]);
    }
    static GetEdgeState_Y(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        return int(edgedefs.edgestates_Y[param1 * 6 + param2]);
    }
    static HELPER_SetEdgeStates_X(param1, param2, param3, param4, param5, param6, param7) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        param5 = int(param5);
        param6 = int(param6);
        param7 = int(param7);
        var _loc8_ = int(param1 * 6);
        edgedefs.edgestates_X[_loc8_ + 0] = param2;
        edgedefs.edgestates_X[_loc8_ + 1] = param3;
        edgedefs.edgestates_X[_loc8_ + 2] = param4;
        edgedefs.edgestates_X[_loc8_ + 3] = param5;
        edgedefs.edgestates_X[_loc8_ + 4] = param6;
        edgedefs.edgestates_X[_loc8_ + 5] = param7;
    }
    static HELPER_SetEdgeStates_Y(param1, param2, param3, param4, param5, param6, param7) {
        param1 = int(param1);
        param2 = int(param2);
        param3 = int(param3);
        param4 = int(param4);
        param5 = int(param5);
        param6 = int(param6);
        param7 = int(param7);
        var _loc8_ = int(param1 * 6);
        edgedefs.edgestates_Y[_loc8_ + 0] = param2;
        edgedefs.edgestates_Y[_loc8_ + 1] = param3;
        edgedefs.edgestates_Y[_loc8_ + 2] = param4;
        edgedefs.edgestates_Y[_loc8_ + 3] = param5;
        edgedefs.edgestates_Y[_loc8_ + 4] = param6;
        edgedefs.edgestates_Y[_loc8_ + 5] = param7;
    }
    static HELPER_SetEdgeStates_Copy(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(param1 * 6);
        var _loc4_ = int(param2 * 6);
        edgedefs.edgestates_X[_loc4_ + 0] = edgedefs.edgestates_X[_loc3_ + 0];
        edgedefs.edgestates_X[_loc4_ + 1] = edgedefs.edgestates_X[_loc3_ + 1];
        edgedefs.edgestates_X[_loc4_ + 2] = edgedefs.edgestates_X[_loc3_ + 2];
        edgedefs.edgestates_X[_loc4_ + 3] = edgedefs.edgestates_X[_loc3_ + 3];
        edgedefs.edgestates_X[_loc4_ + 4] = edgedefs.edgestates_X[_loc3_ + 4];
        edgedefs.edgestates_X[_loc4_ + 5] = edgedefs.edgestates_X[_loc3_ + 5];
        edgedefs.edgestates_Y[_loc4_ + 0] = edgedefs.edgestates_Y[_loc3_ + 0];
        edgedefs.edgestates_Y[_loc4_ + 1] = edgedefs.edgestates_Y[_loc3_ + 1];
        edgedefs.edgestates_Y[_loc4_ + 2] = edgedefs.edgestates_Y[_loc3_ + 2];
        edgedefs.edgestates_Y[_loc4_ + 3] = edgedefs.edgestates_Y[_loc3_ + 3];
        edgedefs.edgestates_Y[_loc4_ + 4] = edgedefs.edgestates_Y[_loc3_ + 4];
        edgedefs.edgestates_Y[_loc4_ + 5] = edgedefs.edgestates_Y[_loc3_ + 5];
    }
    static HELPER_SetEdgeStates_Rotate90(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(param1 * 6);
        var _loc4_ = int(param2 * 6);
        edgedefs.edgestates_Y[_loc4_ + 0] = edgedefs.edgestates_X[_loc3_ + 3];
        edgedefs.edgestates_Y[_loc4_ + 1] = edgedefs.edgestates_X[_loc3_ + 4];
        edgedefs.edgestates_Y[_loc4_ + 2] = edgedefs.edgestates_X[_loc3_ + 5];
        edgedefs.edgestates_Y[_loc4_ + 3] = edgedefs.edgestates_X[_loc3_ + 0];
        edgedefs.edgestates_Y[_loc4_ + 4] = edgedefs.edgestates_X[_loc3_ + 1];
        edgedefs.edgestates_Y[_loc4_ + 5] = edgedefs.edgestates_X[_loc3_ + 2];
        edgedefs.edgestates_X[_loc4_ + 0] = edgedefs.edgestates_Y[_loc3_ + 2];
        edgedefs.edgestates_X[_loc4_ + 1] = edgedefs.edgestates_Y[_loc3_ + 1];
        edgedefs.edgestates_X[_loc4_ + 2] = edgedefs.edgestates_Y[_loc3_ + 0];
        edgedefs.edgestates_X[_loc4_ + 3] = edgedefs.edgestates_Y[_loc3_ + 5];
        edgedefs.edgestates_X[_loc4_ + 4] = edgedefs.edgestates_Y[_loc3_ + 4];
        edgedefs.edgestates_X[_loc4_ + 5] = edgedefs.edgestates_Y[_loc3_ + 3];
    }
    static HELPER_SetEdgeStates_Rotate180(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(param1 * 6);
        var _loc4_ = int(param2 * 6);
        edgedefs.edgestates_X[_loc4_ + 0] = edgedefs.edgestates_X[_loc3_ + 5];
        edgedefs.edgestates_X[_loc4_ + 1] = edgedefs.edgestates_X[_loc3_ + 4];
        edgedefs.edgestates_X[_loc4_ + 2] = edgedefs.edgestates_X[_loc3_ + 3];
        edgedefs.edgestates_X[_loc4_ + 3] = edgedefs.edgestates_X[_loc3_ + 2];
        edgedefs.edgestates_X[_loc4_ + 4] = edgedefs.edgestates_X[_loc3_ + 1];
        edgedefs.edgestates_X[_loc4_ + 5] = edgedefs.edgestates_X[_loc3_ + 0];
        edgedefs.edgestates_Y[_loc4_ + 0] = edgedefs.edgestates_Y[_loc3_ + 5];
        edgedefs.edgestates_Y[_loc4_ + 1] = edgedefs.edgestates_Y[_loc3_ + 4];
        edgedefs.edgestates_Y[_loc4_ + 2] = edgedefs.edgestates_Y[_loc3_ + 3];
        edgedefs.edgestates_Y[_loc4_ + 3] = edgedefs.edgestates_Y[_loc3_ + 2];
        edgedefs.edgestates_Y[_loc4_ + 4] = edgedefs.edgestates_Y[_loc3_ + 1];
        edgedefs.edgestates_Y[_loc4_ + 5] = edgedefs.edgestates_Y[_loc3_ + 0];
    }
    static HELPER_SetEdgeStates_Rotate270(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(param1 * 6);
        var _loc4_ = int(param2 * 6);
        edgedefs.edgestates_Y[_loc4_ + 0] = edgedefs.edgestates_X[_loc3_ + 2];
        edgedefs.edgestates_Y[_loc4_ + 1] = edgedefs.edgestates_X[_loc3_ + 1];
        edgedefs.edgestates_Y[_loc4_ + 2] = edgedefs.edgestates_X[_loc3_ + 0];
        edgedefs.edgestates_Y[_loc4_ + 3] = edgedefs.edgestates_X[_loc3_ + 5];
        edgedefs.edgestates_Y[_loc4_ + 4] = edgedefs.edgestates_X[_loc3_ + 4];
        edgedefs.edgestates_Y[_loc4_ + 5] = edgedefs.edgestates_X[_loc3_ + 3];
        edgedefs.edgestates_X[_loc4_ + 0] = edgedefs.edgestates_Y[_loc3_ + 3];
        edgedefs.edgestates_X[_loc4_ + 1] = edgedefs.edgestates_Y[_loc3_ + 4];
        edgedefs.edgestates_X[_loc4_ + 2] = edgedefs.edgestates_Y[_loc3_ + 5];
        edgedefs.edgestates_X[_loc4_ + 3] = edgedefs.edgestates_Y[_loc3_ + 0];
        edgedefs.edgestates_X[_loc4_ + 4] = edgedefs.edgestates_Y[_loc3_ + 1];
        edgedefs.edgestates_X[_loc4_ + 5] = edgedefs.edgestates_Y[_loc3_ + 2];
    }
}
export class edgetypes {
    static EMPTY = int(0);
    static PARTIAL = int(0);
    static SOLID = int(0);
    constructor() {
    }
}
export class tiledefs {
    static segdefs = null;
    static perpindex = null;
    static boundaryflags = null;
    static boundarydefs = null;
    constructor() {
    }
    static GenerateTileSegments_Filtered(param1, param2, param3, param4, param5) {
        param1 = int(param1);
        var _loc9_ = false;
        var _loc10_ = false;
        if (param1 < 0 || param1 >= tiletypes.num_tile_types) {
            trace("WARNING! GenerateTileSegments() was passed an invalid tiletype: " + param1);
            return null;
        }
        var _loc6_ = asVector(0, null);
        var _loc7_ = int(0);
        while (_loc7_ < 4) {
            guard();
            _loc9_ = tiledefs.boundaryflags[param1][_loc7_ * 2] && !tiledefs.boundaryflags[param2[_loc7_]][(_loc7_ * 2 + 4) % 8];
            _loc10_ = tiledefs.boundaryflags[param1][_loc7_ * 2 + 1] && !tiledefs.boundaryflags[param2[_loc7_]][(_loc7_ * 2 + 1 + 4) % 8];
            if (_loc9_) {
                if (_loc10_) {
                    _loc6_.push(tiledefs.boundarydefs[_loc7_ * 3 + 2].GenerateCollisionSegment(param3, param4, param5));
                }
                else {
                    _loc6_.push(tiledefs.boundarydefs[_loc7_ * 3].GenerateCollisionSegment(param3, param4, param5));
                }
            }
            else if (_loc10_) {
                _loc6_.push(tiledefs.boundarydefs[_loc7_ * 3 + 1].GenerateCollisionSegment(param3, param4, param5));
            }
            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
        }
        var _loc8_ = tiledefs.segdefs[param1];
        if (_loc8_ != null) {
            _loc6_.push(_loc8_.GenerateCollisionSegment(param3, param4, param5));
        }
        return _loc6_;
    }
    static GenerateTileSegments(param1, param2, param3, param4) {
        param1 = int(param1);
        var _loc9_ = false;
        var _loc10_ = false;
        if (param1 < 0 || param1 >= tiletypes.num_tile_types) {
            trace("WARNING! GenerateTileSegments() was passed an invalid tiletype: " + param1);
            return null;
        }
        var _loc5_ = asVector(0, null);
        var _loc6_ = tiledefs.boundaryflags[param1];
        var _loc7_ = int(0);
        while (_loc7_ < 4) {
            guard();
            _loc9_ = _loc6_[_loc7_ * 2];
            _loc10_ = _loc6_[_loc7_ * 2 + 1];
            if (_loc9_) {
                if (_loc10_) {
                    _loc5_.push(tiledefs.boundarydefs[_loc7_ * 3 + 2].GenerateCollisionSegment(param2, param3, param4));
                }
                else {
                    _loc5_.push(tiledefs.boundarydefs[_loc7_ * 3].GenerateCollisionSegment(param2, param3, param4));
                }
            }
            else if (_loc10_) {
                _loc5_.push(tiledefs.boundarydefs[_loc7_ * 3 + 1].GenerateCollisionSegment(param2, param3, param4));
            }
            (_loc7_ = int(_loc7_ + 1), int(_loc7_ - 1));
        }
        var _loc8_ = tiledefs.segdefs[param1];
        if (_loc8_ != null) {
            _loc5_.push(_loc8_.GenerateCollisionSegment(param2, param3, param4));
        }
        return _loc5_;
    }
    static HELPER_InitBoundaryFlags() {
        var _loc2_ = int(0);
        var _loc1_ = int(0);
        while (_loc1_ < tiletypes.num_tile_types) {
            guard();
            tiledefs.boundaryflags[_loc1_] = asVector(8, false);
            _loc2_ = int(0);
            while (_loc2_ < 8) {
                guard();
                tiledefs.boundaryflags[_loc1_][_loc2_] = false;
                (_loc2_ = int(_loc2_ + 1), int(_loc2_ - 1));
            }
            (_loc1_ = int(_loc1_ + 1), int(_loc1_ - 1));
        }
    }
    static HELPER_SetBoundaryFlags_Copy(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(0);
        while (_loc3_ < 8) {
            guard();
            tiledefs.boundaryflags[param2][_loc3_] = tiledefs.boundaryflags[param1][_loc3_];
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
    static HELPER_SetBoundaryFlags_Perp(param1, param2) {
        param1 = int(param1);
        param2 = int(param2);
        var _loc3_ = int(0);
        while (_loc3_ < 8) {
            guard();
            tiledefs.boundaryflags[param2][_loc3_] = tiledefs.boundaryflags[param1][tiledefs.perpindex[_loc3_]];
            (_loc3_ = int(_loc3_ + 1), int(_loc3_ - 1));
        }
    }
}
export class tiletypes {
    static EMPTY = int(0);
    static FULL = int(0);
    static HALF_TOP = int(0);
    static HALF_RIGHT = int(0);
    static HALF_BOTTOM = int(0);
    static HALF_LEFT = int(0);
    static MED_PP = int(0);
    static MED_NP = int(0);
    static MED_NN = int(0);
    static MED_PN = int(0);
    static CONVEX_PP = int(0);
    static CONVEX_NP = int(0);
    static CONVEX_NN = int(0);
    static CONVEX_PN = int(0);
    static CONCAVE_PP = int(0);
    static CONCAVE_NP = int(0);
    static CONCAVE_NN = int(0);
    static CONCAVE_PN = int(0);
    static SMALL_22_PP = int(0);
    static SMALL_22_NP = int(0);
    static SMALL_22_NN = int(0);
    static SMALL_22_PN = int(0);
    static LARGE_22_PP = int(0);
    static LARGE_22_NP = int(0);
    static LARGE_22_NN = int(0);
    static LARGE_22_PN = int(0);
    static SMALL_67_PP = int(0);
    static SMALL_67_NP = int(0);
    static SMALL_67_NN = int(0);
    static SMALL_67_PN = int(0);
    static LARGE_67_PP = int(0);
    static LARGE_67_NP = int(0);
    static LARGE_67_NN = int(0);
    static LARGE_67_PN = int(0);
    static EDGE_TOP = int(0);
    static EDGE_RIGHT = int(0);
    static EDGE_BOTTOM = int(0);
    static EDGE_LEFT = int(0);
    static EDGE_CORNER_UL = int(0);
    static EDGE_CORNER_UR = int(0);
    static EDGE_CORNER_DL = int(0);
    static EDGE_CORNER_DR = int(0);
    static num_tile_types = int(0);
    static num_ingame_tile_types = int(0);
    static MAP_OLD_TYPE_TO_NEW_TYPE = null;
    static MAP_NEW_TYPE_TO_CHAR = null;
    static hacky_debug_chars = null;
    static XFORM_INVERT = null;
    static XFORM_ROTCW = null;
    static XFORM_ROTCCW = null;
    static XFORM_FLIPH = null;
    static XFORM_FLIPV = null;
    constructor() {
    }
    static GetTypeFromChar(param1) {
        param1 = int(param1);
        return int(tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[param1]);
    }
    static GetDebugCharFromID(param1) {
        param1 = int(param1);
        return tiletypes.hacky_debug_chars.charAt(param1);
    }
}
ParticleManager_Classic.MAX_PARTICLE_SCALE = 64;
ParticleManager_Classic.FXTYPE_SKIDDUST = int(0);
ParticleManager_Classic.FXTYPE_JUMPDUST = int(1);
ParticleManager_Classic.FXTYPE_BLOODSPURT = int(2);
ParticleManager_Classic.FXTYPE_RAGDUST = int(3);
ParticleManager_Classic.FXTYPE_CHAINBULLET = int(4);
ParticleManager_Classic.FXTYPE_CHAINDEBRIS = int(5);
ParticleManager_Classic.FXTYPE_CHAINFLASH = int(6);
ParticleManager_Classic.FXTYPE_LASERSPARK = int(7);
ParticleManager_Classic.FXTYPE_LASERCHARGE = int(8);
ParticleManager_Classic.FXTYPE_ZAP = int(9);
ParticleManager_Classic.FXTYPE_ZAPV = int(10);
ParticleManager_Classic.FXTYPE_TURRETBULLET = int(11);
ParticleManager_Classic.FXTYPE_TURRETDEBRIS = int(12);
ParticleManager_Classic.FXTYPE_FIREBURST = int(13);
ParticleManager_Classic.FXTYPE_FIREBALL = int(14);
ParticleManager_Classic.FXTYPE_ROCKETSMOKE = int(15);
ParticleManager_Classic.NUM_FXTYPES = int(16);
ParticleManager_Classic.BUFFER_BACK = int(0);
ParticleManager_Classic.BUFFER_FRONT = int(1);
ParticleManager_Classic.MAX_PARTICLES = int(100);
ParticleManager_Classic.mcList = asVector(ParticleManager_Classic.NUM_FXTYPES, null);
ParticleManager_Classic.bufferList = asVector(ParticleManager_Classic.NUM_FXTYPES, 0);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_SKIDDUST] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_SKIDDUST][0] = asset_gfx_fx_dust0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_SKIDDUST][1] = asset_gfx_fx_dust1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_JUMPDUST] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_JUMPDUST][0] = asset_gfx_fx_dust0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_JUMPDUST][1] = asset_gfx_fx_dust1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_BLOODSPURT] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_BLOODSPURT][0] = asset_gfx_fx_blood0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_BLOODSPURT][1] = asset_gfx_fx_blood1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_RAGDUST] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_RAGDUST][0] = asset_gfx_fx_dust0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_RAGDUST][1] = asset_gfx_fx_dust1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINBULLET] = asVector(1, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINBULLET][0] = asset_gfx_fx_chain_bullet;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINDEBRIS] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINDEBRIS][0] = asset_gfx_fx_chain_debris0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINDEBRIS][1] = asset_gfx_fx_chain_debris1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINDEBRIS][2] = asset_gfx_fx_chain_debris2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINFLASH] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINFLASH][0] = asset_gfx_fx_chain_flash0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_CHAINFLASH][1] = asset_gfx_fx_chain_flash1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERSPARK] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERSPARK][0] = asset_gfx_fx_laser_spark0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERSPARK][1] = asset_gfx_fx_laser_spark1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERSPARK][2] = asset_gfx_fx_laser_spark2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERCHARGE] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERCHARGE][0] = asset_gfx_fx_laser_charge0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERCHARGE][1] = asset_gfx_fx_laser_charge1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_LASERCHARGE][2] = asset_gfx_fx_laser_charge2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAP] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAP][0] = asset_gfx_fx_zap0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAP][1] = asset_gfx_fx_zap1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAP][2] = asset_gfx_fx_zap2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAPV] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAPV][0] = asset_gfx_fx_zapv0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAPV][1] = asset_gfx_fx_zapv1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ZAPV][2] = asset_gfx_fx_zapv2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_TURRETBULLET] = asVector(1, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_TURRETBULLET][0] = asset_gfx_fx_turret_bullet;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_TURRETDEBRIS] = asVector(1, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_TURRETDEBRIS][0] = asset_gfx_fx_turret_debris0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBURST] = asVector(2, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBURST][0] = asset_gfx_fx_fireburst0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBURST][1] = asset_gfx_fx_fireburst1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBALL] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBALL][0] = asset_gfx_fx_fireball0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBALL][1] = asset_gfx_fx_fireball1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_FIREBALL][2] = asset_gfx_fx_fireball2;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ROCKETSMOKE] = asVector(3, null);
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ROCKETSMOKE][0] = asset_gfx_fx_rocket_smoke0;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ROCKETSMOKE][1] = asset_gfx_fx_rocket_smoke1;
ParticleManager_Classic.mcList[ParticleManager_Classic.FXTYPE_ROCKETSMOKE][2] = asset_gfx_fx_rocket_smoke2;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_SKIDDUST] = ParticleManager_Classic.BUFFER_BACK;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_JUMPDUST] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_BLOODSPURT] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_RAGDUST] = ParticleManager_Classic.BUFFER_BACK;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_CHAINBULLET] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_CHAINDEBRIS] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_CHAINFLASH] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_LASERSPARK] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_LASERCHARGE] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_ZAP] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_ZAPV] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_TURRETBULLET] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_TURRETDEBRIS] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_FIREBURST] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_FIREBALL] = ParticleManager_Classic.BUFFER_FRONT;
ParticleManager_Classic.bufferList[ParticleManager_Classic.FXTYPE_ROCKETSMOKE] = ParticleManager_Classic.BUFFER_FRONT;
EntityGraphics_Door_Locked.ANIM_CLOSE = int(0);
EntityGraphics_Door_Locked.ANIM_OPEN = int(1);
EntityGraphics_Door_Regular.ANIM_CLOSE = int(0);
EntityGraphics_Door_Regular.ANIM_OPEN = int(1);
EntityGraphics_Door_Trap.ANIM_CLOSE = int(0);
EntityGraphics_Door_Trap.ANIM_OPEN = int(1);
EntityGraphics_Drone_Chaingun.ANIM_MOVE = int(0);
EntityGraphics_Drone_Chaingun.ANIM_PREFIRE = int(1);
EntityGraphics_Drone_Chaingun.ANIM_FIRING = int(2);
EntityGraphics_Drone_Chaingun.ANIM_POSTFIRE = int(3);
EntityGraphics_Drone_Chaser.ANIM_IDLE = int(0);
EntityGraphics_Drone_Chaser.ANIM_CHASE = int(1);
EntityGraphics_Drone_Laser.ANIM_MOVE = int(0);
EntityGraphics_Drone_Laser.ANIM_PREFIRE = int(1);
EntityGraphics_Drone_Laser.ANIM_FIRING = int(2);
EntityGraphics_Drone_Laser.ANIM_POSTFIRE = int(3);
EntityGraphics_ExitDoor.ANIM_CLOSED = int(0);
EntityGraphics_ExitDoor.ANIM_OPEN = int(1);
EntityGraphics_ExitSwitch.ANIM_CLOSED = int(0);
EntityGraphics_ExitSwitch.ANIM_OPEN = int(1);
EntityGraphics_FloorGuard.ANIM_IDLE = int(0);
EntityGraphics_FloorGuard.ANIM_CHASE_L = int(-1);
EntityGraphics_FloorGuard.ANIM_CHASE_R = int(1);
EntityGraphics_Gold.ANIM_NOT_COLLECTED = int(0);
EntityGraphics_Gold.ANIM_COLLECTED = int(1);
EntityGraphics_Launchpad.ANIM_IDLE = int(0);
EntityGraphics_Launchpad.ANIM_LAUNCH = int(1);
EntityGraphics_Mine.ANIM_UNEXPLODED = int(0);
EntityGraphics_Mine.ANIM_EXPLODED = int(1);
EntityGraphics_Ninja.ANIM_STANDING = int(0);
EntityGraphics_Ninja.ANIM_RUNNING = int(1);
EntityGraphics_Ninja.ANIM_SKIDDING = int(2);
EntityGraphics_Ninja.ANIM_INAIR = int(3);
EntityGraphics_Ninja.ANIM_WALLSLIDING = int(4);
EntityGraphics_Ninja.ANIM_DEAD = int(5);
EntityGraphics_Ninja.ANIM_CELEBRATING = int(6);
EntityGraphics_Ninja.ANIM_OFF = int(7);
EntityGraphics_Ninja.RAGDOLL_BODY = int(0);
EntityGraphics_Ninja.RAGDOLL_ARM_R = int(1);
EntityGraphics_Ninja.RAGDOLL_ARM_L = int(2);
EntityGraphics_Ninja.RAGDOLL_LEG_R = int(3);
EntityGraphics_Ninja.RAGDOLL_LEG_L = int(4);
EntityGraphics_Rocket.ANIM_IDLE = int(0);
EntityGraphics_Rocket.ANIM_FIRE = int(1);
EntityGraphics_Rocket.ANIM_EXPLODE = int(2);
EntityGraphics_Turret.ANIM_IDLE = int(0);
EntityGraphics_Turret.ANIM_PREFIRE = int(1);
EntityGraphics_Turret.ANIM_FIRING = int(2);
EntityGraphics_Turret.ANIM_POSTFIRE = int(3);
EntityGraphics_Turret.CROSSHAIR_OFF = int(0);
EntityGraphics_Turret.CROSSHAIR_FAR = int(1);
EntityGraphics_Turret.CROSSHAIR_MID = int(2);
EntityGraphics_Turret.CROSSHAIR_NEAR = int(3);
EntityGraphics_Turret.CROSSHAIR_PREFIRE = int(4);
EntityGraphics_Turret.CROSSHAIR_POSTFIRE = int(5);
edat.num_cols = int(31);
edat.num_rows = int(23);
edat.cell_size = int(24);
edat.quantize_steps_per_cell = int(4);
edat.quantize_step_size = int(6);
edat.ETYPE_PLAYER = uint(0);
edat.ETYPE_MINE = uint(1);
edat.ETYPE_GOLD = uint(2);
edat.ETYPE_DOOR_REGULAR = uint(3);
edat.ETYPE_DOOR_LOCKED = uint(4);
edat.ETYPE_SWITCH_LOCKED = uint(5);
edat.ETYPE_DOOR_TRAP = uint(6);
edat.ETYPE_SWITCH_TRAP = uint(7);
edat.ETYPE_ONEWAY = uint(8);
edat.ETYPE_EXIT_DOOR = uint(9);
edat.ETYPE_EXIT_SWITCH = uint(10);
edat.ETYPE_CHAINGUN = uint(11);
edat.ETYPE_LASER = uint(12);
edat.ETYPE_ZAP = uint(13);
edat.ETYPE_CHASER = uint(14);
edat.ETYPE_FLOORGUARD = uint(15);
edat.ETYPE_LAUNCHPAD = uint(16);
edat.ETYPE_BOUNCEBLOCK = uint(17);
edat.ETYPE_ROCKET = uint(18);
edat.ETYPE_TURRET = uint(19);
edat.ETYPE_THWOMP = uint(20);
edat.num_etypes = uint(21);
edat.ETYPE_NULLFLAG = uint(999);
edat.EPROP_TYPE = uint(0);
edat.EPROP_X = uint(1);
edat.EPROP_Y = uint(2);
edat.EPROP_DIR = uint(3);
edat.EPROP_MOVE = uint(4);
edat.DIR_R = uint(0);
edat.DIR_RD = uint(1);
edat.DIR_D = uint(2);
edat.DIR_LD = uint(3);
edat.DIR_L = uint(4);
edat.DIR_LU = uint(5);
edat.DIR_U = uint(6);
edat.DIR_RU = uint(7);
edat.MOVE_SURFACE_CW = uint(0);
edat.MOVE_SURFACE_CCW = uint(1);
edat.MOVE_WANDER_CW = uint(2);
edat.MOVE_WANDER_CCW = uint(3);
edat.HELPER_MIRROR_MOVE = asVector(4, 0);
edat.MAP_TILETYPE_TO_TILEID = asVector(8, 0);
edat.MAP_ETYPE_TO_MC = asVector(edat.num_etypes, null);
edat.MAP_ETYPE_TO_MC_SELECTED = asVector(edat.num_etypes, null);
edat.HELPER_MAP_DIR_TO_VEC = asVector(8, null);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE = asVector(edat.num_etypes, null);
edat.STRUCTTYPE_PLAYER = uint(0);
edat.STRUCTTYPE_MINE = uint(1);
edat.STRUCTTYPE_GOLD = uint(2);
edat.STRUCTTYPE_EXIT = uint(3);
edat.STRUCTTYPE_DOOR_REGULAR = uint(4);
edat.STRUCTTYPE_DOOR_LOCKED = uint(5);
edat.STRUCTTYPE_DOOR_TRAP = uint(6);
edat.STRUCTTYPE_LAUNCHPAD = uint(7);
edat.STRUCTTYPE_ONEWAY = uint(8);
edat.STRUCTTYPE_CHAINGUN = uint(9);
edat.STRUCTTYPE_LASER = uint(10);
edat.STRUCTTYPE_ZAP = uint(11);
edat.STRUCTTYPE_CHASER = uint(12);
edat.STRUCTTYPE_FLOORGUARD = uint(13);
edat.STRUCTTYPE_BOUNCEBLOCK = uint(14);
edat.STRUCTTYPE_ROCKET = uint(15);
edat.STRUCTTYPE_TURRET = uint(16);
edat.STRUCTTYPE_THWOMP = uint(17);
edat.num_structtypes = uint(18);
edat.STRUCT_SIZE = asVector(edat.num_structtypes, 0);
edat.MAP_STRUCT_TO_ETYPE = asVector(edat.num_structtypes, 0);
edat.HELPER_MIRROR_MOVE[edat.MOVE_SURFACE_CW] = edat.MOVE_SURFACE_CCW;
edat.HELPER_MIRROR_MOVE[edat.MOVE_SURFACE_CCW] = edat.MOVE_SURFACE_CW;
edat.HELPER_MIRROR_MOVE[edat.MOVE_WANDER_CW] = edat.MOVE_WANDER_CCW;
edat.HELPER_MIRROR_MOVE[edat.MOVE_WANDER_CCW] = edat.MOVE_WANDER_CW;
edat.MAP_TILETYPE_TO_TILEID[0] = 6;
edat.MAP_TILETYPE_TO_TILEID[1] = 26;
edat.MAP_TILETYPE_TO_TILEID[2] = 18;
edat.MAP_TILETYPE_TO_TILEID[3] = 14;
edat.MAP_TILETYPE_TO_TILEID[4] = 2;
edat.MAP_TILETYPE_TO_TILEID[5] = 30;
edat.MAP_TILETYPE_TO_TILEID[6] = 22;
edat.MAP_TILETYPE_TO_TILEID[7] = 10;
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_R] = new vec2(1, 0);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_RD] = new vec2(1 / Math.SQRT2, 1 / Math.SQRT2);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_D] = new vec2(0, 1);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_LD] = new vec2(-1 / Math.SQRT2, 1 / Math.SQRT2);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_L] = new vec2(-1, 0);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_LU] = new vec2(-1 / Math.SQRT2, -1 / Math.SQRT2);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_U] = new vec2(0, -1);
edat.HELPER_MAP_DIR_TO_VEC[edat.DIR_RU] = new vec2(1 / Math.SQRT2, -1 / Math.SQRT2);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_PLAYER] = new vec2(10, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_BOUNCEBLOCK] = new vec2(9.6, 9.6);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_DOOR_REGULAR] = new vec2(12, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_DOOR_LOCKED] = new vec2(12, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_SWITCH_LOCKED] = new vec2(4, 4);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_DOOR_TRAP] = new vec2(12, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_SWITCH_TRAP] = new vec2(4, 4);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_CHAINGUN] = new vec2(9, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_LASER] = new vec2(9, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_ZAP] = new vec2(9, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_CHASER] = new vec2(9, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_EXIT_DOOR] = new vec2(12, 12);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_EXIT_SWITCH] = new vec2(6, 4);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_FLOORGUARD] = new vec2(6, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_GOLD] = new vec2(4, 4);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_LAUNCHPAD] = new vec2(8, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_MINE] = new vec2(4, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_ONEWAY] = new vec2(12, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_ROCKET] = new vec2(6, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_TURRET] = new vec2(6, -1);
edat.HELPER_MAP_ETYPE_TO_COLSHAPE[edat.ETYPE_THWOMP] = new vec2(9, 9);
edat.STRUCT_SIZE[edat.STRUCTTYPE_PLAYER] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_BOUNCEBLOCK] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_DOOR_REGULAR] = 3;
edat.STRUCT_SIZE[edat.STRUCTTYPE_DOOR_LOCKED] = 5;
edat.STRUCT_SIZE[edat.STRUCTTYPE_DOOR_TRAP] = 5;
edat.STRUCT_SIZE[edat.STRUCTTYPE_CHAINGUN] = 4;
edat.STRUCT_SIZE[edat.STRUCTTYPE_LASER] = 4;
edat.STRUCT_SIZE[edat.STRUCTTYPE_ZAP] = 4;
edat.STRUCT_SIZE[edat.STRUCTTYPE_CHASER] = 4;
edat.STRUCT_SIZE[edat.STRUCTTYPE_EXIT] = 4;
edat.STRUCT_SIZE[edat.STRUCTTYPE_FLOORGUARD] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_GOLD] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_LAUNCHPAD] = 3;
edat.STRUCT_SIZE[edat.STRUCTTYPE_MINE] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_ONEWAY] = 3;
edat.STRUCT_SIZE[edat.STRUCTTYPE_ROCKET] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_TURRET] = 2;
edat.STRUCT_SIZE[edat.STRUCTTYPE_THWOMP] = 3;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_BOUNCEBLOCK] = edat.ETYPE_BOUNCEBLOCK;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_CHAINGUN] = edat.ETYPE_CHAINGUN;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_CHASER] = edat.ETYPE_CHASER;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_DOOR_LOCKED] = edat.ETYPE_DOOR_LOCKED;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_DOOR_REGULAR] = edat.ETYPE_DOOR_REGULAR;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_DOOR_TRAP] = edat.ETYPE_DOOR_TRAP;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_EXIT] = edat.ETYPE_EXIT_DOOR;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_FLOORGUARD] = edat.ETYPE_FLOORGUARD;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_GOLD] = edat.ETYPE_GOLD;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_LASER] = edat.ETYPE_LASER;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_LAUNCHPAD] = edat.ETYPE_LAUNCHPAD;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_MINE] = edat.ETYPE_MINE;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_ONEWAY] = edat.ETYPE_ONEWAY;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_PLAYER] = edat.ETYPE_PLAYER;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_ROCKET] = edat.ETYPE_ROCKET;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_THWOMP] = edat.ETYPE_THWOMP;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_TURRET] = edat.ETYPE_TURRET;
edat.MAP_STRUCT_TO_ETYPE[edat.STRUCTTYPE_ZAP] = edat.ETYPE_ZAP;
mathutils.rnd_seed = uint(1);
Simulator.GRID_NUM_COLS = int(edat.num_cols + 2);
Simulator.GRID_NUM_ROWS = int(edat.num_rows + 2);
Simulator.GRID_CELL_SIZE = 24;
Simulator.GRID_CELL_HALFWIDTH = Simulator.GRID_CELL_SIZE / 2;
Segment_Circular.zero_vec = new vec2(0, 0);
Segment_Circular.cp = new vec2();
Segment_Circular.ray_point = new vec2();
Segment_Linear.zero_vec = new vec2(0, 0);
Segment_Linear.cp = new vec2();
Segment_Linear.ray_point = new vec2();
colutils.cp = new vec2();
colutils.segList = asVector(0, null);
Entity_Door_Regular.close_threshold = int(5);
Entity_Drone_Base.DIR_R = uint(0);
Entity_Drone_Base.DIR_D = uint(1);
Entity_Drone_Base.DIR_L = uint(2);
Entity_Drone_Base.DIR_U = uint(3);
Entity_Drone_Base.DIR_TO_VEC2 = asVector(4, null);
Entity_Drone_Base.DIR_TO_RAD = asVector(4, 0);
Entity_Drone_Base.ROT_0 = uint(0);
Entity_Drone_Base.ROT_90 = uint(1);
Entity_Drone_Base.ROT_180 = uint(2);
Entity_Drone_Base.ROT_270 = uint(3);
Entity_Drone_Base.MOVETYPE_SURFACE_CW = uint(0);
Entity_Drone_Base.MOVETYPE_SURFACE_CCW = uint(1);
Entity_Drone_Base.MOVETYPE_WANDER_CW = uint(2);
Entity_Drone_Base.MOVETYPE_WANDER_CCW = uint(3);
Entity_Drone_Base.MOVELIST = asVector(4, null);
Entity_Drone_Base.DIR_TO_VEC2[Entity_Drone_Base.DIR_R] = new vec2(1, 0);
Entity_Drone_Base.DIR_TO_VEC2[Entity_Drone_Base.DIR_D] = new vec2(0, 1);
Entity_Drone_Base.DIR_TO_VEC2[Entity_Drone_Base.DIR_L] = new vec2(-1, 0);
Entity_Drone_Base.DIR_TO_VEC2[Entity_Drone_Base.DIR_U] = new vec2(0, -1);
Entity_Drone_Base.DIR_TO_RAD[Entity_Drone_Base.DIR_R] = 0 * Math.PI;
Entity_Drone_Base.DIR_TO_RAD[Entity_Drone_Base.DIR_D] = 0.5 * Math.PI;
Entity_Drone_Base.DIR_TO_RAD[Entity_Drone_Base.DIR_L] = 1 * Math.PI;
Entity_Drone_Base.DIR_TO_RAD[Entity_Drone_Base.DIR_U] = 1.5 * Math.PI;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CW] = asVector(4, 0);
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CW][0] = Entity_Drone_Base.ROT_90;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CW][1] = Entity_Drone_Base.ROT_0;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CW][2] = Entity_Drone_Base.ROT_270;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CW][3] = Entity_Drone_Base.ROT_180;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CCW] = asVector(4, 0);
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CCW][0] = Entity_Drone_Base.ROT_270;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CCW][1] = Entity_Drone_Base.ROT_0;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CCW][2] = Entity_Drone_Base.ROT_90;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_SURFACE_CCW][3] = Entity_Drone_Base.ROT_180;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CW] = asVector(4, 0);
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CW][0] = Entity_Drone_Base.ROT_0;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CW][1] = Entity_Drone_Base.ROT_90;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CW][2] = Entity_Drone_Base.ROT_270;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CW][3] = Entity_Drone_Base.ROT_180;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CCW] = asVector(4, 0);
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CCW][0] = Entity_Drone_Base.ROT_0;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CCW][1] = Entity_Drone_Base.ROT_270;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CCW][2] = Entity_Drone_Base.ROT_90;
Entity_Drone_Base.MOVELIST[Entity_Drone_Base.MOVETYPE_WANDER_CCW][3] = Entity_Drone_Base.ROT_180;
Entity_Drone_Shooter_Base.zero_vec = new vec2();
Entity_Drone_Shooter_Base.FIRING_STATE_IDLE = int(0);
Entity_Drone_Shooter_Base.FIRING_STATE_PREFIRING = int(1);
Entity_Drone_Shooter_Base.FIRING_STATE_FIRING = int(2);
Entity_Drone_Shooter_Base.FIRING_STATE_POSTFIRING = int(3);
Entity_Drone_Chaingun.chaingun_maxbullets = int(6);
Entity_Drone_Chaingun.chaingun_spread = 0.3;
Entity_Rocket.STATE_IDLE = int(0);
Entity_Rocket.STATE_PREFIRE = int(1);
Entity_Rocket.STATE_HOMING = int(2);
Entity_Turret.STATE_IDLE = int(0);
Entity_Turret.STATE_TARGETTING = int(1);
Entity_Turret.STATE_PREFIRE = int(2);
Entity_Turret.STATE_POSTFIRE = int(3);
entity_helpers.zero_vec = new vec2(0, 0);
entity_helpers.potentialList = asVector(0, 0);
InputSource_Base.bit_J = int(1);
InputSource_Base.bit_L = int(2);
InputSource_Base.bit_R = int(4);
Ninja.PSTATE_STANDING = uint(0);
Ninja.PSTATE_RUNNING = uint(1);
Ninja.PSTATE_SKIDDING = uint(2);
Ninja.PSTATE_JUMPING = uint(3);
Ninja.PSTATE_FALLING = uint(4);
Ninja.PSTATE_WALLSLIDING = uint(5);
Ninja.PSTATE_DEAD = uint(6);
Ninja.PSTATE_AWAITINGDEATH = uint(7);
Ninja.PSTATE_CELEBRATING = uint(8);
Ninja.PSTATE_DISABLED = uint(9);
Ninja.PSTATE_TO_STRING = asVector(10, null);
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_STANDING] = "standing";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_RUNNING] = "running";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_SKIDDING] = "skidding";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_JUMPING] = "jumping";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_FALLING] = "falling";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_WALLSLIDING] = "wallsliding";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_DEAD] = "dead";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_AWAITINGDEATH] = "waiting to die";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_CELEBRATING] = "celebration";
Ninja.PSTATE_TO_STRING[Ninja.PSTATE_DISABLED] = "disabled";
Ragdoll.pRadius = asVector(6, 0);
Ragdoll.pDrag = asVector(6, 0);
Ragdoll.sWeight = asVector(5, 0);
Ragdoll.sMinRatio = asVector(5, 0);
Ragdoll.hacky_scale = 0.2;
Ragdoll.sMaxLen = asVector(5, 0);
Ragdoll.debugpose_pos = asVector(6, null);
Ragdoll.debugpose_vel = asVector(6, null);
Ragdoll.STATE_UNEXPLODED = int(0);
Ragdoll.STATE_EXPLODED = int(1);
Ragdoll.pRadius[0] = 2.49;
Ragdoll.pRadius[1] = 2.49;
Ragdoll.pRadius[2] = 1.99;
Ragdoll.pRadius[3] = 1.99;
Ragdoll.pRadius[4] = 2.99;
Ragdoll.pRadius[5] = 2.99;
Ragdoll.pDrag[0] = 0.99;
Ragdoll.pDrag[1] = 0.995;
Ragdoll.pDrag[2] = 0.995;
Ragdoll.pDrag[3] = 0.99;
Ragdoll.pDrag[4] = 0.99;
Ragdoll.pDrag[5] = 0.995;
Ragdoll.sWeight[0] = 0.4;
Ragdoll.sWeight[1] = 0.2;
Ragdoll.sWeight[2] = 0.26;
Ragdoll.sWeight[3] = 0.32;
Ragdoll.sWeight[4] = 0.37;
Ragdoll.sMinRatio[0] = 0.8;
Ragdoll.sMinRatio[1] = 0.6;
Ragdoll.sMinRatio[2] = 0.6;
Ragdoll.sMinRatio[3] = 0.6;
Ragdoll.sMinRatio[4] = 0.6;
Ragdoll.sMaxLen[0] = 30 * Ragdoll.hacky_scale;
Ragdoll.sMaxLen[1] = 40 * Ragdoll.hacky_scale;
Ragdoll.sMaxLen[2] = 40 * Ragdoll.hacky_scale;
Ragdoll.sMaxLen[3] = 60 * Ragdoll.hacky_scale;
Ragdoll.sMaxLen[4] = 60 * Ragdoll.hacky_scale;
Ragdoll.debugpose_pos[0] = new vec2(0, -Ragdoll.sMaxLen[0]);
Ragdoll.debugpose_pos[1] = new vec2(0, 0);
Ragdoll.debugpose_pos[2] = new vec2(Ragdoll.sMaxLen[1], Ragdoll.debugpose_pos[0].y);
Ragdoll.debugpose_pos[3] = new vec2(-Ragdoll.sMaxLen[2], Ragdoll.debugpose_pos[0].y);
Ragdoll.debugpose_pos[4] = new vec2(Math.SQRT1_2 * Ragdoll.sMaxLen[3], Math.SQRT1_2 * Ragdoll.sMaxLen[3]);
Ragdoll.debugpose_pos[5] = new vec2(Math.SQRT1_2 * -Ragdoll.sMaxLen[4], Math.SQRT1_2 * Ragdoll.sMaxLen[3]);
Ragdoll.debugpose_vel[0] = new vec2(0, 0);
Ragdoll.debugpose_vel[1] = new vec2(0, 0);
Ragdoll.debugpose_vel[2] = new vec2(0, 0);
Ragdoll.debugpose_vel[3] = new vec2(0, 0);
Ragdoll.debugpose_vel[4] = new vec2(0, 0);
Ragdoll.debugpose_vel[5] = new vec2(0, 0);
sim_globals.HORRIBLY_HACKY_DOES_STRING_TO_BA_ERROR_EXIST = false;
sim_globals.sim_rate = 40;
sim_globals.DEATHTYPE_SUICIDE = int(0);
sim_globals.DEATHTYPE_FALL = int(1);
sim_globals.DEATHTYPE_CRUSH = int(2);
sim_globals.DEATHTYPE_TIME = int(3);
sim_globals.DEATHTYPE_EXPLOSIVE = int(4);
sim_globals.DEATHTYPE_LASER = int(5);
sim_globals.DEATHTYPE_ELECTRIC = int(6);
sim_globals.DEATHTYPE_BULLET = int(7);
sim_globals.ENEMYTYPE_SUICIDE = int(0);
sim_globals.ENEMYTYPE_FALL = int(1);
sim_globals.ENEMYTYPE_CRUSH = int(2);
sim_globals.ENEMYTYPE_TIME = int(3);
sim_globals.ENEMYTYPE_ZAP = int(4);
sim_globals.ENEMYTYPE_CHAINGUN = int(5);
sim_globals.ENEMYTYPE_LASER = int(6);
sim_globals.ENEMYTYPE_TURRET = int(7);
sim_globals.ENEMYTYPE_ROCKET = int(8);
sim_globals.ENEMYTYPE_FLOORGUARD = int(9);
sim_globals.ENEMYTYPE_THWOMP = int(10);
sim_globals.ENEMYTYPE_MINE = int(11);
sim_globals.ENEMYTYPE_DEBUG = int(12);
sim_globals.ETYPE_TO_STRING = asVector(13, null);
sim_globals.ETYPE_TO_DTYPE = asVector(13, 0);
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_SUICIDE] = "suicide";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_FALL] = "falling";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_CRUSH] = "crushed";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_TIME] = "out of time";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_ZAP] = "zap";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_CHAINGUN] = "chaingun";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_LASER] = "laser";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_TURRET] = "turret";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_ROCKET] = "rocket";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_FLOORGUARD] = "floorguard";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_THWOMP] = "thwomp";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_MINE] = "mine";
sim_globals.ETYPE_TO_STRING[sim_globals.ENEMYTYPE_DEBUG] = "debug";
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_SUICIDE] = sim_globals.DEATHTYPE_EXPLOSIVE;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_FALL] = sim_globals.DEATHTYPE_FALL;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_CRUSH] = sim_globals.DEATHTYPE_CRUSH;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_TIME] = sim_globals.DEATHTYPE_EXPLOSIVE;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_ROCKET] = sim_globals.DEATHTYPE_EXPLOSIVE;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_MINE] = sim_globals.DEATHTYPE_EXPLOSIVE;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_LASER] = sim_globals.DEATHTYPE_LASER;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_ZAP] = sim_globals.DEATHTYPE_ELECTRIC;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_FLOORGUARD] = sim_globals.DEATHTYPE_ELECTRIC;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_THWOMP] = sim_globals.DEATHTYPE_ELECTRIC;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_CHAINGUN] = sim_globals.DEATHTYPE_BULLET;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_TURRET] = sim_globals.DEATHTYPE_BULLET;
sim_globals.ETYPE_TO_DTYPE[sim_globals.ENEMYTYPE_DEBUG] = sim_globals.DEATHTYPE_BULLET;
sim_loader.last_str_loaded = null;
sim_loader.OLDDATA_SEPERATION_CHAR_LEVEL = "|";
sim_loader.OLDDATA_SEPERATION_CHAR_OBJECT = "!";
sim_loader.OLDDATA_SEPERATION_CHAR_OBJTYPE = "^";
sim_loader.OLDDATA_SEPERATION_CHAR_OBJPARAM = ",";
sim_loader.OLDDATA_CHAR_PAD = int(48);
sim_loader.OLDDATA_OBJTYPE_GOLD = int(0);
sim_loader.OLDDATA_OBJTYPE_BOUNCEBLOCK = int(1);
sim_loader.OLDDATA_OBJTYPE_LAUNCHPAD = int(2);
sim_loader.OLDDATA_OBJTYPE_TURRET = int(3);
sim_loader.OLDDATA_OBJTYPE_FLOORGUARD = int(4);
sim_loader.OLDDATA_OBJTYPE_PLAYER = int(5);
sim_loader.OLDDATA_OBJTYPE_DRONE = int(6);
sim_loader.OLDDATA_OBJTYPE_ONEWAYPLATFORM = int(7);
sim_loader.OLDDATA_OBJTYPE_THWOMP = int(8);
sim_loader.OLDDATA_OBJTYPE_TESTDOOR = int(9);
sim_loader.OLDDATA_OBJTYPE_HOMINGLAUNCHER = int(10);
sim_loader.OLDDATA_OBJTYPE_EXIT = int(11);
sim_loader.OLDDATA_OBJTYPE_MINE = int(12);
tiletypes.EMPTY = int(0);
tiletypes.FULL = int(1);
tiletypes.HALF_TOP = int(2);
tiletypes.HALF_RIGHT = int(3);
tiletypes.HALF_BOTTOM = int(4);
tiletypes.HALF_LEFT = int(5);
tiletypes.MED_PP = int(6);
tiletypes.MED_NP = int(7);
tiletypes.MED_NN = int(8);
tiletypes.MED_PN = int(9);
tiletypes.CONVEX_PP = int(10);
tiletypes.CONVEX_NP = int(11);
tiletypes.CONVEX_NN = int(12);
tiletypes.CONVEX_PN = int(13);
tiletypes.CONCAVE_PP = int(14);
tiletypes.CONCAVE_NP = int(15);
tiletypes.CONCAVE_NN = int(16);
tiletypes.CONCAVE_PN = int(17);
tiletypes.SMALL_22_PP = int(18);
tiletypes.SMALL_22_NP = int(19);
tiletypes.SMALL_22_NN = int(20);
tiletypes.SMALL_22_PN = int(21);
tiletypes.LARGE_22_PP = int(22);
tiletypes.LARGE_22_NP = int(23);
tiletypes.LARGE_22_NN = int(24);
tiletypes.LARGE_22_PN = int(25);
tiletypes.SMALL_67_PP = int(26);
tiletypes.SMALL_67_NP = int(27);
tiletypes.SMALL_67_NN = int(28);
tiletypes.SMALL_67_PN = int(29);
tiletypes.LARGE_67_PP = int(30);
tiletypes.LARGE_67_NP = int(31);
tiletypes.LARGE_67_NN = int(32);
tiletypes.LARGE_67_PN = int(33);
tiletypes.EDGE_TOP = int(34);
tiletypes.EDGE_RIGHT = int(35);
tiletypes.EDGE_BOTTOM = int(36);
tiletypes.EDGE_LEFT = int(37);
tiletypes.EDGE_CORNER_UL = int(38);
tiletypes.EDGE_CORNER_UR = int(39);
tiletypes.EDGE_CORNER_DL = int(40);
tiletypes.EDGE_CORNER_DR = int(41);
tiletypes.num_tile_types = int(42);
tiletypes.num_ingame_tile_types = int(34);
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.MAP_NEW_TYPE_TO_CHAR = asVector(tiletypes.num_ingame_tile_types, null);
tiletypes.hacky_debug_chars = ".0123456789ABCDEFGHIJKLMNPQRSTUVWX";
tiletypes.XFORM_INVERT = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.XFORM_ROTCW = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.XFORM_ROTCCW = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.XFORM_FLIPH = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.XFORM_FLIPV = asVector(tiletypes.num_ingame_tile_types, 0);
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[0] = tiletypes.EMPTY;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[1] = tiletypes.FULL;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[2] = tiletypes.MED_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[3] = tiletypes.MED_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[4] = tiletypes.MED_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[5] = tiletypes.MED_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[6] = tiletypes.CONCAVE_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[7] = tiletypes.CONCAVE_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[8] = tiletypes.CONCAVE_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[9] = tiletypes.CONCAVE_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[10] = tiletypes.CONVEX_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[11] = tiletypes.CONVEX_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[12] = tiletypes.CONVEX_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[13] = tiletypes.CONVEX_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[14] = tiletypes.SMALL_22_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[15] = tiletypes.SMALL_22_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[16] = tiletypes.SMALL_22_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[17] = tiletypes.SMALL_22_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[18] = tiletypes.LARGE_22_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[19] = tiletypes.LARGE_22_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[20] = tiletypes.LARGE_22_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[21] = tiletypes.LARGE_22_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[22] = tiletypes.SMALL_67_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[23] = tiletypes.SMALL_67_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[24] = tiletypes.SMALL_67_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[25] = tiletypes.SMALL_67_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[26] = tiletypes.LARGE_67_PN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[27] = tiletypes.LARGE_67_NN;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[28] = tiletypes.LARGE_67_NP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[29] = tiletypes.LARGE_67_PP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[30] = tiletypes.HALF_BOTTOM;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[31] = tiletypes.HALF_RIGHT;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[32] = tiletypes.HALF_TOP;
tiletypes.MAP_OLD_TYPE_TO_NEW_TYPE[33] = tiletypes.HALF_LEFT;
tiletypes.XFORM_INVERT[tiletypes.EMPTY] = tiletypes.FULL;
tiletypes.XFORM_INVERT[tiletypes.FULL] = tiletypes.EMPTY;
tiletypes.XFORM_INVERT[tiletypes.HALF_TOP] = tiletypes.HALF_BOTTOM;
tiletypes.XFORM_INVERT[tiletypes.HALF_RIGHT] = tiletypes.HALF_LEFT;
tiletypes.XFORM_INVERT[tiletypes.HALF_BOTTOM] = tiletypes.HALF_TOP;
tiletypes.XFORM_INVERT[tiletypes.HALF_LEFT] = tiletypes.HALF_RIGHT;
tiletypes.XFORM_INVERT[tiletypes.MED_PP] = tiletypes.MED_NN;
tiletypes.XFORM_INVERT[tiletypes.MED_NP] = tiletypes.MED_PN;
tiletypes.XFORM_INVERT[tiletypes.MED_NN] = tiletypes.MED_PP;
tiletypes.XFORM_INVERT[tiletypes.MED_PN] = tiletypes.MED_NP;
tiletypes.XFORM_INVERT[tiletypes.CONVEX_PP] = tiletypes.CONCAVE_NN;
tiletypes.XFORM_INVERT[tiletypes.CONVEX_NP] = tiletypes.CONCAVE_PN;
tiletypes.XFORM_INVERT[tiletypes.CONVEX_NN] = tiletypes.CONCAVE_PP;
tiletypes.XFORM_INVERT[tiletypes.CONVEX_PN] = tiletypes.CONCAVE_NP;
tiletypes.XFORM_INVERT[tiletypes.CONCAVE_PP] = tiletypes.CONVEX_NN;
tiletypes.XFORM_INVERT[tiletypes.CONCAVE_NP] = tiletypes.CONVEX_PN;
tiletypes.XFORM_INVERT[tiletypes.CONCAVE_NN] = tiletypes.CONVEX_PP;
tiletypes.XFORM_INVERT[tiletypes.CONCAVE_PN] = tiletypes.CONVEX_NP;
tiletypes.XFORM_INVERT[tiletypes.SMALL_22_PP] = tiletypes.LARGE_22_NN;
tiletypes.XFORM_INVERT[tiletypes.SMALL_22_NP] = tiletypes.LARGE_22_PN;
tiletypes.XFORM_INVERT[tiletypes.SMALL_22_NN] = tiletypes.LARGE_22_PP;
tiletypes.XFORM_INVERT[tiletypes.SMALL_22_PN] = tiletypes.LARGE_22_NP;
tiletypes.XFORM_INVERT[tiletypes.LARGE_22_PP] = tiletypes.SMALL_22_NN;
tiletypes.XFORM_INVERT[tiletypes.LARGE_22_NP] = tiletypes.SMALL_22_PN;
tiletypes.XFORM_INVERT[tiletypes.LARGE_22_NN] = tiletypes.SMALL_22_PP;
tiletypes.XFORM_INVERT[tiletypes.LARGE_22_PN] = tiletypes.SMALL_22_NP;
tiletypes.XFORM_INVERT[tiletypes.SMALL_67_PP] = tiletypes.LARGE_67_NN;
tiletypes.XFORM_INVERT[tiletypes.SMALL_67_NP] = tiletypes.LARGE_67_PN;
tiletypes.XFORM_INVERT[tiletypes.SMALL_67_NN] = tiletypes.LARGE_67_PP;
tiletypes.XFORM_INVERT[tiletypes.SMALL_67_PN] = tiletypes.LARGE_67_NP;
tiletypes.XFORM_INVERT[tiletypes.LARGE_67_PP] = tiletypes.SMALL_67_NN;
tiletypes.XFORM_INVERT[tiletypes.LARGE_67_NP] = tiletypes.SMALL_67_PN;
tiletypes.XFORM_INVERT[tiletypes.LARGE_67_NN] = tiletypes.SMALL_67_PP;
tiletypes.XFORM_INVERT[tiletypes.LARGE_67_PN] = tiletypes.SMALL_67_NP;
tiletypes.XFORM_ROTCW[tiletypes.EMPTY] = tiletypes.EMPTY;
tiletypes.XFORM_ROTCW[tiletypes.FULL] = tiletypes.FULL;
tiletypes.XFORM_ROTCW[tiletypes.HALF_TOP] = tiletypes.HALF_RIGHT;
tiletypes.XFORM_ROTCW[tiletypes.HALF_RIGHT] = tiletypes.HALF_BOTTOM;
tiletypes.XFORM_ROTCW[tiletypes.HALF_BOTTOM] = tiletypes.HALF_LEFT;
tiletypes.XFORM_ROTCW[tiletypes.HALF_LEFT] = tiletypes.HALF_TOP;
tiletypes.XFORM_ROTCW[tiletypes.MED_PP] = tiletypes.MED_NP;
tiletypes.XFORM_ROTCW[tiletypes.MED_NP] = tiletypes.MED_NN;
tiletypes.XFORM_ROTCW[tiletypes.MED_NN] = tiletypes.MED_PN;
tiletypes.XFORM_ROTCW[tiletypes.MED_PN] = tiletypes.MED_PP;
tiletypes.XFORM_ROTCW[tiletypes.CONVEX_PP] = tiletypes.CONVEX_NP;
tiletypes.XFORM_ROTCW[tiletypes.CONVEX_NP] = tiletypes.CONVEX_NN;
tiletypes.XFORM_ROTCW[tiletypes.CONVEX_NN] = tiletypes.CONVEX_PN;
tiletypes.XFORM_ROTCW[tiletypes.CONVEX_PN] = tiletypes.CONVEX_PP;
tiletypes.XFORM_ROTCW[tiletypes.CONCAVE_PP] = tiletypes.CONCAVE_NP;
tiletypes.XFORM_ROTCW[tiletypes.CONCAVE_NP] = tiletypes.CONCAVE_NN;
tiletypes.XFORM_ROTCW[tiletypes.CONCAVE_NN] = tiletypes.CONCAVE_PN;
tiletypes.XFORM_ROTCW[tiletypes.CONCAVE_PN] = tiletypes.CONCAVE_PP;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_22_PP] = tiletypes.SMALL_67_NP;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_22_NP] = tiletypes.SMALL_67_NN;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_22_NN] = tiletypes.SMALL_67_PN;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_22_PN] = tiletypes.SMALL_67_PP;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_22_PP] = tiletypes.LARGE_67_NP;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_22_NP] = tiletypes.LARGE_67_NN;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_22_NN] = tiletypes.LARGE_67_PN;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_22_PN] = tiletypes.LARGE_67_PP;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_67_PP] = tiletypes.SMALL_22_NP;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_67_NP] = tiletypes.SMALL_22_NN;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_67_NN] = tiletypes.SMALL_22_PN;
tiletypes.XFORM_ROTCW[tiletypes.SMALL_67_PN] = tiletypes.SMALL_22_PP;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_67_PP] = tiletypes.LARGE_22_NP;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_67_NP] = tiletypes.LARGE_22_NN;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_67_NN] = tiletypes.LARGE_22_PN;
tiletypes.XFORM_ROTCW[tiletypes.LARGE_67_PN] = tiletypes.LARGE_22_PP;
tiletypes.XFORM_ROTCCW[tiletypes.EMPTY] = tiletypes.EMPTY;
tiletypes.XFORM_ROTCCW[tiletypes.FULL] = tiletypes.FULL;
tiletypes.XFORM_ROTCCW[tiletypes.HALF_TOP] = tiletypes.HALF_LEFT;
tiletypes.XFORM_ROTCCW[tiletypes.HALF_RIGHT] = tiletypes.HALF_TOP;
tiletypes.XFORM_ROTCCW[tiletypes.HALF_BOTTOM] = tiletypes.HALF_RIGHT;
tiletypes.XFORM_ROTCCW[tiletypes.HALF_LEFT] = tiletypes.HALF_BOTTOM;
tiletypes.XFORM_ROTCCW[tiletypes.MED_PP] = tiletypes.MED_PN;
tiletypes.XFORM_ROTCCW[tiletypes.MED_NP] = tiletypes.MED_PP;
tiletypes.XFORM_ROTCCW[tiletypes.MED_NN] = tiletypes.MED_NP;
tiletypes.XFORM_ROTCCW[tiletypes.MED_PN] = tiletypes.MED_NN;
tiletypes.XFORM_ROTCCW[tiletypes.CONVEX_PP] = tiletypes.CONVEX_PN;
tiletypes.XFORM_ROTCCW[tiletypes.CONVEX_NP] = tiletypes.CONVEX_PP;
tiletypes.XFORM_ROTCCW[tiletypes.CONVEX_NN] = tiletypes.CONVEX_NP;
tiletypes.XFORM_ROTCCW[tiletypes.CONVEX_PN] = tiletypes.CONVEX_NN;
tiletypes.XFORM_ROTCCW[tiletypes.CONCAVE_PP] = tiletypes.CONCAVE_PN;
tiletypes.XFORM_ROTCCW[tiletypes.CONCAVE_NP] = tiletypes.CONCAVE_PP;
tiletypes.XFORM_ROTCCW[tiletypes.CONCAVE_NN] = tiletypes.CONCAVE_NP;
tiletypes.XFORM_ROTCCW[tiletypes.CONCAVE_PN] = tiletypes.CONCAVE_NN;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_22_PP] = tiletypes.SMALL_67_PN;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_22_NP] = tiletypes.SMALL_67_PP;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_22_NN] = tiletypes.SMALL_67_NP;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_22_PN] = tiletypes.SMALL_67_NN;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_22_PP] = tiletypes.LARGE_67_PN;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_22_NP] = tiletypes.LARGE_67_PP;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_22_NN] = tiletypes.LARGE_67_NP;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_22_PN] = tiletypes.LARGE_67_NN;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_67_PP] = tiletypes.SMALL_22_PN;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_67_NP] = tiletypes.SMALL_22_PP;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_67_NN] = tiletypes.SMALL_22_NP;
tiletypes.XFORM_ROTCCW[tiletypes.SMALL_67_PN] = tiletypes.SMALL_22_NN;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_67_PP] = tiletypes.LARGE_22_PN;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_67_NP] = tiletypes.LARGE_22_PP;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_67_NN] = tiletypes.LARGE_22_NP;
tiletypes.XFORM_ROTCCW[tiletypes.LARGE_67_PN] = tiletypes.LARGE_22_NN;
tiletypes.XFORM_FLIPH[tiletypes.EMPTY] = tiletypes.EMPTY;
tiletypes.XFORM_FLIPH[tiletypes.FULL] = tiletypes.FULL;
tiletypes.XFORM_FLIPH[tiletypes.HALF_TOP] = tiletypes.HALF_TOP;
tiletypes.XFORM_FLIPH[tiletypes.HALF_RIGHT] = tiletypes.HALF_LEFT;
tiletypes.XFORM_FLIPH[tiletypes.HALF_BOTTOM] = tiletypes.HALF_BOTTOM;
tiletypes.XFORM_FLIPH[tiletypes.HALF_LEFT] = tiletypes.HALF_RIGHT;
tiletypes.XFORM_FLIPH[tiletypes.MED_PP] = tiletypes.MED_NP;
tiletypes.XFORM_FLIPH[tiletypes.MED_NP] = tiletypes.MED_PP;
tiletypes.XFORM_FLIPH[tiletypes.MED_NN] = tiletypes.MED_PN;
tiletypes.XFORM_FLIPH[tiletypes.MED_PN] = tiletypes.MED_NN;
tiletypes.XFORM_FLIPH[tiletypes.CONVEX_PP] = tiletypes.CONVEX_NP;
tiletypes.XFORM_FLIPH[tiletypes.CONVEX_NP] = tiletypes.CONVEX_PP;
tiletypes.XFORM_FLIPH[tiletypes.CONVEX_NN] = tiletypes.CONVEX_PN;
tiletypes.XFORM_FLIPH[tiletypes.CONVEX_PN] = tiletypes.CONVEX_NN;
tiletypes.XFORM_FLIPH[tiletypes.CONCAVE_PP] = tiletypes.CONCAVE_NP;
tiletypes.XFORM_FLIPH[tiletypes.CONCAVE_NP] = tiletypes.CONCAVE_PP;
tiletypes.XFORM_FLIPH[tiletypes.CONCAVE_NN] = tiletypes.CONCAVE_PN;
tiletypes.XFORM_FLIPH[tiletypes.CONCAVE_PN] = tiletypes.CONCAVE_NN;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_22_PP] = tiletypes.SMALL_22_NP;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_22_NP] = tiletypes.SMALL_22_PP;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_22_NN] = tiletypes.SMALL_22_PN;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_22_PN] = tiletypes.SMALL_22_NN;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_22_PP] = tiletypes.LARGE_22_NP;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_22_NP] = tiletypes.LARGE_22_PP;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_22_NN] = tiletypes.LARGE_22_PN;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_22_PN] = tiletypes.LARGE_22_NN;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_67_PP] = tiletypes.SMALL_67_NP;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_67_NP] = tiletypes.SMALL_67_PP;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_67_NN] = tiletypes.SMALL_67_PN;
tiletypes.XFORM_FLIPH[tiletypes.SMALL_67_PN] = tiletypes.SMALL_67_NN;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_67_PP] = tiletypes.LARGE_67_NP;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_67_NP] = tiletypes.LARGE_67_PP;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_67_NN] = tiletypes.LARGE_67_PN;
tiletypes.XFORM_FLIPH[tiletypes.LARGE_67_PN] = tiletypes.LARGE_67_NN;
tiletypes.XFORM_FLIPV[tiletypes.EMPTY] = tiletypes.EMPTY;
tiletypes.XFORM_FLIPV[tiletypes.FULL] = tiletypes.FULL;
tiletypes.XFORM_FLIPV[tiletypes.HALF_TOP] = tiletypes.HALF_BOTTOM;
tiletypes.XFORM_FLIPV[tiletypes.HALF_RIGHT] = tiletypes.HALF_RIGHT;
tiletypes.XFORM_FLIPV[tiletypes.HALF_BOTTOM] = tiletypes.HALF_TOP;
tiletypes.XFORM_FLIPV[tiletypes.HALF_LEFT] = tiletypes.HALF_LEFT;
tiletypes.XFORM_FLIPV[tiletypes.MED_PP] = tiletypes.MED_PN;
tiletypes.XFORM_FLIPV[tiletypes.MED_NP] = tiletypes.MED_NN;
tiletypes.XFORM_FLIPV[tiletypes.MED_NN] = tiletypes.MED_NP;
tiletypes.XFORM_FLIPV[tiletypes.MED_PN] = tiletypes.MED_PP;
tiletypes.XFORM_FLIPV[tiletypes.CONVEX_PP] = tiletypes.CONVEX_PN;
tiletypes.XFORM_FLIPV[tiletypes.CONVEX_NP] = tiletypes.CONVEX_NN;
tiletypes.XFORM_FLIPV[tiletypes.CONVEX_NN] = tiletypes.CONVEX_NP;
tiletypes.XFORM_FLIPV[tiletypes.CONVEX_PN] = tiletypes.CONVEX_PP;
tiletypes.XFORM_FLIPV[tiletypes.CONCAVE_PP] = tiletypes.CONCAVE_PN;
tiletypes.XFORM_FLIPV[tiletypes.CONCAVE_NP] = tiletypes.CONCAVE_NN;
tiletypes.XFORM_FLIPV[tiletypes.CONCAVE_NN] = tiletypes.CONCAVE_NP;
tiletypes.XFORM_FLIPV[tiletypes.CONCAVE_PN] = tiletypes.CONCAVE_PP;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_22_PP] = tiletypes.SMALL_22_PN;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_22_NP] = tiletypes.SMALL_22_NN;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_22_NN] = tiletypes.SMALL_22_NP;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_22_PN] = tiletypes.SMALL_22_PP;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_22_PP] = tiletypes.LARGE_22_PN;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_22_NP] = tiletypes.LARGE_22_NN;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_22_NN] = tiletypes.LARGE_22_NP;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_22_PN] = tiletypes.LARGE_22_PP;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_67_PP] = tiletypes.SMALL_67_PN;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_67_NP] = tiletypes.SMALL_67_NN;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_67_NN] = tiletypes.SMALL_67_NP;
tiletypes.XFORM_FLIPV[tiletypes.SMALL_67_PN] = tiletypes.SMALL_67_PP;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_67_PP] = tiletypes.LARGE_67_PN;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_67_NP] = tiletypes.LARGE_67_NN;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_67_NN] = tiletypes.LARGE_67_NP;
tiletypes.XFORM_FLIPV[tiletypes.LARGE_67_PN] = tiletypes.LARGE_67_PP;
edgedefs.edgestates_X = asVector(tiletypes.num_tile_types * 6, 0);
edgedefs.edgestates_Y = asVector(tiletypes.num_tile_types * 6, 0);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.FULL, 2, 0, 2, 2, 0, 2);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.FULL, 2, 0, 2, 2, 0, 2);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.EDGE_BOTTOM, 0, 0, 2, 0, 0, 2);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.EDGE_BOTTOM, tiletypes.EDGE_LEFT);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.EDGE_BOTTOM, tiletypes.EDGE_TOP);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.EDGE_BOTTOM, tiletypes.EDGE_RIGHT);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.HALF_BOTTOM, 0, 0, 0, 2, 0, 2);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.HALF_BOTTOM, 0, 2, 2, 0, 2, 2);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.HALF_BOTTOM, tiletypes.HALF_LEFT);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.HALF_BOTTOM, tiletypes.HALF_TOP);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.HALF_BOTTOM, tiletypes.HALF_RIGHT);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.CONCAVE_PP, 2, 0, 1, 2, 1, 0);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.CONCAVE_PP, 2, 0, 1, 2, 1, 0);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.CONCAVE_PP, tiletypes.CONCAVE_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.CONCAVE_PP, tiletypes.CONCAVE_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.CONCAVE_PP, tiletypes.CONCAVE_PN);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.CONVEX_PP, 2, 0, 1, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.CONVEX_PP, 2, 0, 1, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.CONVEX_PP, tiletypes.CONVEX_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.CONVEX_PP, tiletypes.CONVEX_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.CONVEX_PP, tiletypes.CONVEX_PN);
edgedefs.HELPER_SetEdgeStates_Copy(tiletypes.CONCAVE_PP, tiletypes.MED_PP);
edgedefs.HELPER_SetEdgeStates_Copy(tiletypes.CONCAVE_NP, tiletypes.MED_NP);
edgedefs.HELPER_SetEdgeStates_Copy(tiletypes.CONCAVE_NN, tiletypes.MED_NN);
edgedefs.HELPER_SetEdgeStates_Copy(tiletypes.CONCAVE_PN, tiletypes.MED_PN);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.SMALL_22_PP, 2, 0, 1, 0, 0, 0);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.SMALL_22_PP, 2, 1, 0, 2, 1, 0);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.SMALL_22_PP, tiletypes.SMALL_67_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.SMALL_22_PP, tiletypes.SMALL_22_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.SMALL_22_PP, tiletypes.SMALL_67_PN);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.SMALL_67_PP, 2, 1, 0, 2, 1, 0);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.SMALL_67_PP, 2, 0, 1, 0, 0, 0);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.SMALL_67_PP, tiletypes.SMALL_22_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.SMALL_67_PP, tiletypes.SMALL_67_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.SMALL_67_PP, tiletypes.SMALL_22_PN);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.LARGE_22_PP, 2, 0, 2, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.LARGE_22_PP, 2, 0, 1, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.LARGE_22_PP, tiletypes.LARGE_67_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.LARGE_22_PP, tiletypes.LARGE_22_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.LARGE_22_PP, tiletypes.LARGE_67_PN);
edgedefs.HELPER_SetEdgeStates_X(tiletypes.LARGE_67_PP, 2, 0, 1, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Y(tiletypes.LARGE_67_PP, 2, 0, 2, 2, 0, 1);
edgedefs.HELPER_SetEdgeStates_Rotate90(tiletypes.LARGE_67_PP, tiletypes.LARGE_22_NP);
edgedefs.HELPER_SetEdgeStates_Rotate180(tiletypes.LARGE_67_PP, tiletypes.LARGE_67_NN);
edgedefs.HELPER_SetEdgeStates_Rotate270(tiletypes.LARGE_67_PP, tiletypes.LARGE_22_PN);
edgetypes.EMPTY = int(0);
edgetypes.PARTIAL = int(1);
edgetypes.SOLID = int(2);
tiledefs.segdefs = asVector(tiletypes.num_tile_types, null);
tiledefs.perpindex = asVector(8, 0);
tiledefs.boundaryflags = asVector(tiletypes.num_tile_types, null);
tiledefs.boundarydefs = asVector(12, null);
tiledefs.segdefs[tiletypes.EMPTY] = null;
tiledefs.segdefs[tiletypes.FULL] = null;
tiledefs.segdefs[tiletypes.EDGE_TOP] = null;
tiledefs.segdefs[tiletypes.EDGE_RIGHT] = null;
tiledefs.segdefs[tiletypes.EDGE_BOTTOM] = null;
tiledefs.segdefs[tiletypes.EDGE_LEFT] = null;
tiledefs.segdefs[tiletypes.EDGE_CORNER_UL] = null;
tiledefs.segdefs[tiletypes.EDGE_CORNER_UR] = null;
tiledefs.segdefs[tiletypes.EDGE_CORNER_DL] = null;
tiledefs.segdefs[tiletypes.EDGE_CORNER_DR] = null;
tiledefs.segdefs[tiletypes.HALF_TOP] = new TileEdgeArchetype_Linear(-1, 0, 1, 0);
tiledefs.segdefs[tiletypes.HALF_RIGHT] = tiledefs.segdefs[tiletypes.HALF_TOP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.HALF_BOTTOM] = tiledefs.segdefs[tiletypes.HALF_RIGHT].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.HALF_LEFT] = tiledefs.segdefs[tiletypes.HALF_BOTTOM].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.MED_PP] = new TileEdgeArchetype_Linear(-1, 1, 1, -1);
tiledefs.segdefs[tiletypes.MED_NP] = tiledefs.segdefs[tiletypes.MED_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.MED_NN] = tiledefs.segdefs[tiletypes.MED_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.MED_PN] = tiledefs.segdefs[tiletypes.MED_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONVEX_PP] = new TileEdgeArchetype_Circular(-1, 1, 1, -1, -1, -1);
tiledefs.segdefs[tiletypes.CONVEX_NP] = tiledefs.segdefs[tiletypes.CONVEX_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONVEX_NN] = tiledefs.segdefs[tiletypes.CONVEX_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONVEX_PN] = tiledefs.segdefs[tiletypes.CONVEX_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONCAVE_PP] = new TileEdgeArchetype_Circular(-1, 1, 1, -1, 1, 1);
tiledefs.segdefs[tiletypes.CONCAVE_NP] = tiledefs.segdefs[tiletypes.CONCAVE_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONCAVE_NN] = tiledefs.segdefs[tiletypes.CONCAVE_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.CONCAVE_PN] = tiledefs.segdefs[tiletypes.CONCAVE_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_22_PP] = new TileEdgeArchetype_Linear(-1, 0, 1, -1);
tiledefs.segdefs[tiletypes.SMALL_67_NP] = tiledefs.segdefs[tiletypes.SMALL_22_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_22_NN] = tiledefs.segdefs[tiletypes.SMALL_67_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_67_PN] = tiledefs.segdefs[tiletypes.SMALL_22_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_67_PP] = new TileEdgeArchetype_Linear(-1, 1, 0, -1);
tiledefs.segdefs[tiletypes.SMALL_22_NP] = tiledefs.segdefs[tiletypes.SMALL_67_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_67_NN] = tiledefs.segdefs[tiletypes.SMALL_22_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.SMALL_22_PN] = tiledefs.segdefs[tiletypes.SMALL_67_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_22_PP] = new TileEdgeArchetype_Linear(-1, 1, 1, 0);
tiledefs.segdefs[tiletypes.LARGE_67_NP] = tiledefs.segdefs[tiletypes.LARGE_22_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_22_NN] = tiledefs.segdefs[tiletypes.LARGE_67_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_67_PN] = tiledefs.segdefs[tiletypes.LARGE_22_NN].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_67_PP] = new TileEdgeArchetype_Linear(0, 1, 1, -1);
tiledefs.segdefs[tiletypes.LARGE_22_NP] = tiledefs.segdefs[tiletypes.LARGE_67_PP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_67_NN] = tiledefs.segdefs[tiletypes.LARGE_22_NP].GeneratePerpArchetype();
tiledefs.segdefs[tiletypes.LARGE_22_PN] = tiledefs.segdefs[tiletypes.LARGE_67_NN].GeneratePerpArchetype();
tiledefs.perpindex[0] = 2;
tiledefs.perpindex[1] = 3;
tiledefs.perpindex[2] = 5;
tiledefs.perpindex[3] = 4;
tiledefs.perpindex[4] = 6;
tiledefs.perpindex[5] = 7;
tiledefs.perpindex[6] = 1;
tiledefs.perpindex[7] = 0;
tiledefs.HELPER_InitBoundaryFlags();
tiledefs.boundaryflags[tiletypes.FULL][0] = true;
tiledefs.boundaryflags[tiletypes.FULL][1] = true;
tiledefs.boundaryflags[tiletypes.FULL][2] = true;
tiledefs.boundaryflags[tiletypes.FULL][3] = true;
tiledefs.boundaryflags[tiletypes.FULL][4] = true;
tiledefs.boundaryflags[tiletypes.FULL][5] = true;
tiledefs.boundaryflags[tiletypes.FULL][6] = true;
tiledefs.boundaryflags[tiletypes.FULL][7] = true;
tiledefs.boundaryflags[tiletypes.EDGE_TOP][6] = true;
tiledefs.boundaryflags[tiletypes.EDGE_TOP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.EDGE_TOP, tiletypes.EDGE_RIGHT);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.EDGE_RIGHT, tiletypes.EDGE_BOTTOM);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.EDGE_BOTTOM, tiletypes.EDGE_LEFT);
tiledefs.boundaryflags[tiletypes.HALF_TOP][0] = true;
tiledefs.boundaryflags[tiletypes.HALF_TOP][4] = true;
tiledefs.boundaryflags[tiletypes.HALF_TOP][6] = true;
tiledefs.boundaryflags[tiletypes.HALF_TOP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.HALF_TOP, tiletypes.HALF_RIGHT);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.HALF_RIGHT, tiletypes.HALF_BOTTOM);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.HALF_BOTTOM, tiletypes.HALF_LEFT);
tiledefs.boundaryflags[tiletypes.MED_PP][0] = true;
tiledefs.boundaryflags[tiletypes.MED_PP][1] = true;
tiledefs.boundaryflags[tiletypes.MED_PP][6] = true;
tiledefs.boundaryflags[tiletypes.MED_PP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.MED_PP, tiletypes.MED_NP);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.MED_NP, tiletypes.MED_NN);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.MED_NN, tiletypes.MED_PN);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_PP, tiletypes.CONVEX_PP);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_NP, tiletypes.CONVEX_NP);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_NN, tiletypes.CONVEX_NN);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_PN, tiletypes.CONVEX_PN);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_PP, tiletypes.CONCAVE_PP);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_NP, tiletypes.CONCAVE_NP);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_NN, tiletypes.CONCAVE_NN);
tiledefs.HELPER_SetBoundaryFlags_Copy(tiletypes.MED_PN, tiletypes.CONCAVE_PN);
tiledefs.boundaryflags[tiletypes.SMALL_22_PP][0] = true;
tiledefs.boundaryflags[tiletypes.SMALL_22_PP][6] = true;
tiledefs.boundaryflags[tiletypes.SMALL_22_PP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_22_PP, tiletypes.SMALL_67_NP);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_67_NP, tiletypes.SMALL_22_NN);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_22_NN, tiletypes.SMALL_67_PN);
tiledefs.boundaryflags[tiletypes.SMALL_67_PP][0] = true;
tiledefs.boundaryflags[tiletypes.SMALL_67_PP][1] = true;
tiledefs.boundaryflags[tiletypes.SMALL_67_PP][6] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_67_PP, tiletypes.SMALL_22_NP);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_22_NP, tiletypes.SMALL_67_NN);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.SMALL_67_NN, tiletypes.SMALL_22_PN);
tiledefs.boundaryflags[tiletypes.LARGE_22_PP][0] = true;
tiledefs.boundaryflags[tiletypes.LARGE_22_PP][1] = true;
tiledefs.boundaryflags[tiletypes.LARGE_22_PP][4] = true;
tiledefs.boundaryflags[tiletypes.LARGE_22_PP][6] = true;
tiledefs.boundaryflags[tiletypes.LARGE_22_PP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_22_PP, tiletypes.LARGE_67_NP);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_67_NP, tiletypes.LARGE_22_NN);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_22_NN, tiletypes.LARGE_67_PN);
tiledefs.boundaryflags[tiletypes.LARGE_67_PP][0] = true;
tiledefs.boundaryflags[tiletypes.LARGE_67_PP][1] = true;
tiledefs.boundaryflags[tiletypes.LARGE_67_PP][2] = true;
tiledefs.boundaryflags[tiletypes.LARGE_67_PP][6] = true;
tiledefs.boundaryflags[tiletypes.LARGE_67_PP][7] = true;
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_67_PP, tiletypes.LARGE_22_NP);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_22_NP, tiletypes.LARGE_67_NN);
tiledefs.HELPER_SetBoundaryFlags_Perp(tiletypes.LARGE_67_NN, tiletypes.LARGE_22_PN);
tiledefs.boundarydefs[0] = new TileEdgeArchetype_Linear(-1, -1, -1, 0);
tiledefs.boundarydefs[1] = new TileEdgeArchetype_Linear(-1, 0, -1, 1);
tiledefs.boundarydefs[2] = new TileEdgeArchetype_Linear(-1, -1, -1, 1);
tiledefs.boundarydefs[9] = tiledefs.boundarydefs[1].GeneratePerpArchetype();
tiledefs.boundarydefs[10] = tiledefs.boundarydefs[0].GeneratePerpArchetype();
tiledefs.boundarydefs[11] = tiledefs.boundarydefs[2].GeneratePerpArchetype();
tiledefs.boundarydefs[7] = tiledefs.boundarydefs[10].GeneratePerpArchetype();
tiledefs.boundarydefs[6] = tiledefs.boundarydefs[9].GeneratePerpArchetype();
tiledefs.boundarydefs[8] = tiledefs.boundarydefs[11].GeneratePerpArchetype();
tiledefs.boundarydefs[4] = tiledefs.boundarydefs[6].GeneratePerpArchetype();
tiledefs.boundarydefs[3] = tiledefs.boundarydefs[7].GeneratePerpArchetype();
tiledefs.boundarydefs[5] = tiledefs.boundarydefs[8].GeneratePerpArchetype();
sim_globals.sim_rate = 60;
