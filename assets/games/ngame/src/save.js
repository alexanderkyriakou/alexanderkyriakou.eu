export const GAME='n-v2-native',CONTENT='984be500e23bdb16c42d8af668208c623efdd7d4216e2f426d6fce4416175c6d';
const MAX_BYTES=262144,ITERATIONS=600000;
function object(v){return v!==null&&typeof v==='object'&&!Array.isArray(v);}
function keys(v,list){if(!object(v)||Object.keys(v).sort().join('|')!==[...list].sort().join('|'))throw Error('Unexpected save fields');}
function integer(v,min,max){if(!Number.isSafeInteger(v)||v<min||v>max)throw Error('Invalid save number');}
export function unlocked(ep,completed){return ep%10===0||completed.includes(ep-1);}
export function validateSave(v){
 keys(v,['game','schema','content','createdAt','updatedAt','revision','completed','bestScores','challengeScores','resume','settings']);
 if(v.game!==GAME||v.schema!==1||v.content!==CONTENT)throw Error('Unsupported game or save version');
 integer(v.createdAt,0,8640000000000000);integer(v.updatedAt,v.createdAt,8640000000000000);integer(v.revision,0,Number.MAX_SAFE_INTEGER);
 if(!Array.isArray(v.completed)||v.completed.length>120)throw Error('Invalid episode progress');
 const seen=new Set();for(const ep of v.completed){integer(ep,0,119);if(seen.has(ep))throw Error('Duplicate episode');seen.add(ep);}
 for(const ep of seen)if(ep%10&&!seen.has(ep-1))throw Error('Inconsistent progression');
 if(!object(v.bestScores)||Object.keys(v.bestScores).length>120)throw Error('Invalid scores');
 for(const[k,score]of Object.entries(v.bestScores)){if(!/^(0|[1-9]\d{0,2})$/.test(k)||!seen.has(Number(k)))throw Error('Score for an incomplete episode');integer(score,0,1_000_000);}
 if(!object(v.challengeScores)||Object.keys(v.challengeScores).length>12)throw Error('Invalid arcade scores');
 for(const[k,score]of Object.entries(v.challengeScores)){if(!/^(0|[1-9]|1[01])$/.test(k)||!Array.from({length:10},(_,i)=>Number(k)*10+i).every(ep=>seen.has(ep)))throw Error('Invalid arcade progress');integer(score,0,1_000_000);}
 keys(v.settings,['volume']);if(!Number.isFinite(v.settings.volume)||v.settings.volume<0||v.settings.volume>1)throw Error('Invalid volume');
 if(v.resume!==null){keys(v.resume,['mode','episode','slot','ticks']);if(!['episode','challenge'].includes(v.resume.mode))throw Error('Invalid mode');integer(v.resume.episode,0,119);integer(v.resume.slot,0,v.resume.mode==='challenge'?49:4);if(v.resume.mode==='challenge'&&(v.resume.episode%10||!Array.from({length:10},(_,i)=>v.resume.episode+i).every(ep=>seen.has(ep))))throw Error('Invalid arcade resume');integer(v.resume.ticks,1,1_000_000);if(!unlocked(v.resume.episode,v.completed))throw Error('Invalid resume progress');}
 return v;
}
export function freshSave(){const now=Date.now();return {game:GAME,schema:1,content:CONTENT,createdAt:now,updatedAt:now,revision:0,completed:[],bestScores:{},challengeScores:{},resume:null,settings:{volume:.3}};}
export class SaveStore {
 constructor(){this.db=null;this.memory=freshSave();}
 async open(){
  if(!globalThis.indexedDB)throw Error('Browser storage is unavailable. Progress is kept only for this session; export a backup.');
  this.db=await new Promise((resolve,reject)=>{const req=indexedDB.open('ak-ngame-v1',1);req.onupgradeneeded=()=>req.result.createObjectStore('saves');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Close other game tabs to update storage.'));});
  this.db.onversionchange=()=>{this.db.close();this.db=null;};return this.read();
 }
 async read(){
  if(!this.db)return structuredClone(this.memory);
  return new Promise((resolve,reject)=>{const tx=this.db.transaction('saves','readonly'),req=tx.objectStore('saves').get('current');req.onsuccess=()=>{try{resolve(req.result?validateSave(req.result):freshSave());}catch(e){reject(Error('Saved data is corrupt. It has been preserved; import a valid backup or explicitly reset progress.'));}};req.onerror=()=>reject(req.error);});
 }
 async update(mutator,{expectedRevision=null,replace=false}={}){
  if(!this.db){const value=mutator(structuredClone(this.memory));value.revision=this.memory.revision+1;value.updatedAt=Math.max(Date.now(),value.createdAt);validateSave(value);this.memory=value;return structuredClone(value);}
  return new Promise((resolve,reject)=>{
   const tx=this.db.transaction('saves','readwrite'),store=tx.objectStore('saves'),req=store.get('current');let value,failure;
   req.onsuccess=()=>{try{
    const old=req.result?validateSave(req.result):freshSave();
    if(expectedRevision!==null&&old.revision!==expectedRevision)throw Error('Progress changed in another tab. Review the import again.');
    value=mutator(structuredClone(old));value.revision=old.revision+1;value.updatedAt=Math.max(Date.now(),value.createdAt);validateSave(value);store.put(value,'current');
   }catch(e){failure=e;tx.abort();}};
   tx.oncomplete=()=>{this.memory=value;resolve(structuredClone(value));};tx.onabort=()=>reject(failure||tx.error||Error('Save transaction failed'));tx.onerror=()=>{};
  });
 }
 async reset(){
  const value=freshSave();if(!this.db){this.memory=value;return value;}
  await new Promise((resolve,reject)=>{const tx=this.db.transaction('saves','readwrite');tx.objectStore('saves').put(value,'current');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});this.memory=value;return value;
 }
}
const encode64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
function decode64(v,expected=null){if(typeof v!=='string'||v.length>MAX_BYTES||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(v))throw Error('Invalid backup encoding');const b=Uint8Array.from(atob(v),c=>c.charCodeAt(0));if(expected!==null&&b.length!==expected)throw Error('Invalid backup parameter size');return b;}
async function derive(password,salt){if(typeof password!=='string'||password.length===0||password.length>1024)throw Error('Enter a password between 1 and 1024 characters');const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:ITERATIONS},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
function header(v){return {format:v.format,version:v.version,game:v.game,kdf:v.kdf,iterations:v.iterations,salt:v.salt,nonce:v.nonce};}
function aad(v){return new TextEncoder().encode(JSON.stringify(header(v)));}
export async function exportSave(save,password){
 validateSave(save);const salt=crypto.getRandomValues(new Uint8Array(16)),nonce=crypto.getRandomValues(new Uint8Array(12));
 const h={format:'nv2-save',version:1,game:GAME,kdf:'PBKDF2-SHA256',iterations:ITERATIONS,salt:encode64(salt),nonce:encode64(nonce)};
 const plain=new TextEncoder().encode(JSON.stringify(save));if(plain.length>65536)throw Error('Save is too large');
 const key=await derive(password,salt),encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce,additionalData:aad(h),tagLength:128},key,plain);
 return JSON.stringify({...h,ciphertext:encode64(encrypted)});
}
export async function importSave(text,password){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('Backup exceeds 256 KiB');
 const v=JSON.parse(text);keys(v,['format','version','game','kdf','iterations','salt','nonce','ciphertext']);
 if(v.format!=='nv2-save'||v.version!==1||v.game!==GAME||v.kdf!=='PBKDF2-SHA256'||v.iterations!==ITERATIONS)throw Error('Unsupported backup metadata');
 const salt=decode64(v.salt,16),nonce=decode64(v.nonce,12),ciphertext=decode64(v.ciphertext);
 if(ciphertext.length<16||ciphertext.length>65552)throw Error('Invalid encrypted payload size');
 const key=await derive(password,salt);let decrypted;
 try{decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv:nonce,additionalData:aad(v),tagLength:128},key,ciphertext);}catch{throw Error('Incorrect password or damaged backup');}
 if(decrypted.byteLength>65536)throw Error('Decoded save is too large');
 return validateSave(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(decrypted)));
}
