import {Session} from './session.js';
import {Renderer} from './renderer.js';
import {setArtData} from './display.js';
import {Clock} from './clock.js';
import {AudioPlayer} from './audio.js';
import {SaveStore,freshSave,unlocked,exportSave,importSave} from './save.js';
const $=id=>document.getElementById(id),board=$('board'),store=new SaveStore(),audio=new AudioPlayer();
let save=freshSave(),levels=[],renderer,session=null,selected=0,slot=0,phase='menu',mode='episode',resumePhase='playing',busy=false,backupMode='export',imported=null,importRevision=null;
const held=new Set(),recorded=[];
let previewEpisode=null,previewRendered=null,previewViews=[];
const label=ep=>ep<100?String(ep).padStart(2,'0'):(ep<110?'a':'b')+ep%10;
const notice=message=>{$('notice').textContent=message;};
const clock=new Clock(()=>{
 if(!session)return;
 session.step({jump:held.has('KeyZ'),left:held.has('ArrowLeft'),right:held.has('ArrowRight')});
 if(debugEnabled)recorded.push(session.snapshot());
 updateHud();
 if((session.won||session.dead)&&phase==='playing'){
  held.clear();phase=session.won?'won':'dead';
  $('game-message').textContent=session.won?'The ninja found the way.':"The ninja didn't find the way.";
  $('continue').textContent=session.won?'Continue · Z':'Retry · Z';$('continue').hidden=false;
 }
 if(phase==='won'||phase==='dead')$('continue').disabled=session.postGameTicks<30;
},reason=>{if(reason){held.clear();resumePhase=phase;phase='paused';$('game-message').textContent=reason;$('continue').hidden=false;$('continue').textContent='Resume · P';$('continue').disabled=false;}});
const debugEnabled=new URLSearchParams(location.search).get('debug')==='1';
function updateHud(){if(!session)return;$('time').textContent=(session.time/60).toFixed(2);$('gold').textContent=session.gold;$('episode-label').textContent=label(session.level.episode)+(mode==='challenge'?' · arcade':'');}
function renderMenu(){
 const showSecrets=Array.from({length:100},(_,i)=>i).every(ep=>save.completed.includes(ep));$('episodes').style.gridTemplateColumns=`repeat(${showSecrets?12:10},1fr)`;
 if(selected>=(showSecrets?120:100)||(!unlocked(selected,save.completed)&&!save.completed.includes(selected)))selected=0;
 $('episodes').replaceChildren();for(let ep=0;ep<(showSecrets?120:100);ep++){
  const b=document.createElement('button');b.textContent=label(ep);b.disabled=!unlocked(ep,save.completed);b.classList.toggle('complete',save.completed.includes(ep));b.classList.toggle('selected',selected===ep);b.title=`Episode ${label(ep)}${save.completed.includes(ep)?' - complete':b.disabled?' - locked':''}`;b.setAttribute('aria-label',b.title);
  b.tabIndex=selected===ep?0:-1;
  b.setAttribute('aria-pressed',String(selected===ep));b.setAttribute('aria-controls','episode-preview');b.setAttribute('aria-expanded',String(previewEpisode===ep&&!b.disabled));
  b.onclick=()=>selectEpisode(ep);$('episodes').append(b);
 }
 $('arcades').replaceChildren();for(let col=0;col<(showSecrets?12:10);col++)if(Array.from({length:10},(_,i)=>col*10+i).every(ep=>save.completed.includes(ep))){const b=document.createElement('button');b.textContent=`Arcade a-${col<10?col:col===10?'a':'b'}`;b.onclick=()=>start(col*10,0,5400,'challenge');$('arcades').append(b);}
 $('progress-count').textContent=`${save.completed.length} / 120 complete`;$('play').textContent=`Play episode ${label(selected)}`;$('resume').hidden=!save.resume;$('resume').textContent=save.resume?`Resume ${label(save.resume.episode)}-${save.resume.slot}`:'Resume episode';
 $('volume').value=save.settings.volume;audio.volume=save.settings.volume;
 updatePreview(showSecrets?120:100);
}
function selectEpisode(ep){
 if(!unlocked(ep,save.completed)&&!save.completed.includes(ep))return;
 selected=ep;previewEpisode=ep;renderMenu();
 const button=$('episodes').children[ep];button?.focus({preventScroll:true});button?.scrollIntoView({block:'nearest',inline:'nearest'});
}
// Navigation follows the live visual layout, including narrow-screen layouts.
$('episodes').addEventListener('keydown',event=>{
 if(phase!=='menu'||event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
 const target=event.composedPath()[0],buttons=[...$('episodes').children];
 if(!buttons.includes(target)||target.disabled)return;
 if(event.key==='Enter'){event.preventDefault();if(!event.repeat)start(buttons.indexOf(target));return;}
 const direction={ArrowLeft:['left','right','top','bottom',-1],ArrowRight:['left','right','top','bottom',1],ArrowUp:['top','bottom','left','right',-1],ArrowDown:['top','bottom','left','right',1]}[event.key];
 if(!direction)return;
 const [near,far,crossNear,crossFar,sign]=direction,current=target.getBoundingClientRect();
 const candidates=buttons.filter(b=>b!==target&&!b.disabled).map(button=>{
  const rect=button.getBoundingClientRect();
  const gap=sign>0?rect[near]-current[far]:current[near]-rect[far];
  const offset=Math.abs((rect[crossNear]+rect[crossFar]-current[crossNear]-current[crossFar])/2);
  const aligned=rect[crossFar]>current[crossNear]&&rect[crossNear]<current[crossFar];
  return{button,rect,gap,offset,aligned};
 }).filter(c=>c.rect.width>0&&c.rect.height>0&&c.gap>=-1);
 const aligned=candidates.filter(c=>c.aligned),pool=aligned.length?aligned:candidates;
 pool.sort((a,b)=>aligned.length?a.gap-b.gap||a.offset-b.offset:(a.gap+2*a.offset)-(b.gap+2*b.offset));
 if(!pool.length)return; // At a boundary, retain normal page scrolling.
 event.preventDefault();selectEpisode(buttons.indexOf(pool[0].button));
});
function updatePreview(visibleEpisodes){
 const section=$('episode-preview');
 const eligible=previewEpisode!==null&&previewEpisode<visibleEpisodes&&(unlocked(previewEpisode,save.completed)||save.completed.includes(previewEpisode));
 section.hidden=!eligible;
 if(!eligible){previewEpisode=null;previewRendered=null;previewViews=[];$('preview-levels').replaceChildren();return;}
 if(previewRendered===previewEpisode)return;
 $('preview-title').textContent=`Episode ${label(previewEpisode)} · level previews`;
 $('preview-levels').replaceChildren();previewViews=[];
 for(const level of levels.slice(previewEpisode*5,previewEpisode*5+5)){
  const figure=document.createElement('figure'),canvas=document.createElement('canvas'),caption=document.createElement('figcaption');
  canvas.width=792;canvas.height=600;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',`Preview of ${level.name}`);
  canvas.textContent=`Level preview: ${level.name}`;caption.textContent=level.name;
  figure.append(canvas,caption);$('preview-levels').append(figure);
  const view=new Renderer(canvas);view.images=renderer.images;view.pathCache=renderer.pathCache;previewViews.push({view,level});
 }
 previewRendered=previewEpisode;drawPreviews();
}
function drawPreviews(){
 if($('episode-preview').hidden||$('menu').hidden)return;
 try{for(const{view,level}of previewViews)view.drawPreview(level);}
 catch(e){$('episode-preview').hidden=true;notice(`Level previews could not be drawn: ${e.message}`);}
}
async function persist(mutator,options){try{save=await store.update(mutator,options);renderMenu();return true;}catch(e){notice(`Progress could not be saved: ${e.message} Export a backup before leaving.`);return false;}}
function start(ep=selected,index=0,ticks=5400,newMode='episode'){
 clock.pause();held.clear();audio.stop();audio.enable();selected=ep;slot=index;mode=newMode;
 try{session=new Session(levels[ep*5+index],{startingTicks:ticks,scoreImmediately:mode==='episode'});}catch(e){fatal(e);return;}
 recorded.length=0;phase='ready';$('menu').hidden=true;$('game').hidden=false;$('level-name').textContent=session.level.name;$('game-message').textContent='Press Z or Space to begin.';$('continue').textContent='Begin · Z';$('continue').hidden=false;$('continue').disabled=false;updateHud();renderer.draw(session);board.focus();
 if(!debugEnabled)persist(old=>({...old,resume:{mode:newMode,episode:ep,slot:index,ticks}}),{expectedRevision:save.revision});
 navigator.storage?.persist?.().catch(()=>{});
}
function showMenu(){clock.pause();held.clear();audio.stop();phase='menu';$('game').hidden=true;$('menu').hidden=false;renderMenu();$('episodes').children[selected]?.focus();}
function pause(reason='Paused.'){if(['playing','won','dead'].includes(phase)){clock.pause(reason);audio.stop();}}
async function proceed(){
 if(busy)return;
 if(phase==='ready'||phase==='paused'){
  phase=phase==='ready'?'playing':resumePhase;
  const postGame=phase==='won'||phase==='dead';
  $('continue').hidden=!postGame;$('continue').disabled=postGame&&session.postGameTicks<30;
  $('continue').textContent=phase==='won'?'Continue · Z':'Retry · Z';
  $('game-message').textContent=phase==='won'?'The ninja found the way.':phase==='dead'?"The ninja didn't find the way.":'';
  board.focus();audio.enable();clock.resume();return;
 }
 if((phase!=='dead'&&phase!=='won')||session.postGameTicks<30)return;
 if(phase==='dead'){if(mode==='challenge'&&session.time<=0){showMenu();notice('Time is up. Start a new arcade challenge.');return;}start(selected,slot,mode==='episode'?session.startingTicks:session.time,mode);return;}
 if(slot<(mode==='challenge'?49:4)){start(selected,slot+1,session.score,mode);return;}
 busy=true;const finishedEpisode=selected,finishedScore=session.score,finishedMode=mode;
 if(!debugEnabled)await persist(old=>{
  if(finishedMode==='challenge')return {...old,challengeScores:{...old.challengeScores,[finishedEpisode/10]:Math.max(old.challengeScores[finishedEpisode/10]||0,finishedScore)},resume:old.resume?.episode===finishedEpisode?null:old.resume};
  const completed=[...new Set([...old.completed,finishedEpisode])].sort((a,b)=>a-b),bestScores={...old.bestScores,[finishedEpisode]:Math.max(old.bestScores[finishedEpisode]||0,finishedScore)};
  return {...old,completed,bestScores,resume:old.resume?.episode===finishedEpisode?null:old.resume};
 });
  busy=false;
  showMenu();
  notice('');
}
function fatal(e){console.error(e);clock.pause();phase='error';held.clear();notice(`The game stopped: ${e.message}. Progress has been preserved.`);$('continue').hidden=true;}
// Keep canvas keyboard focus when activating its round controls with a pointer.
for(const id of ['pause','continue'])$(id).addEventListener('pointerdown',event=>event.preventDefault());
$('play').onclick=()=>start();$('resume').onclick=()=>{const r=save.resume;if(r)start(r.episode,r.slot,r.ticks,r.mode);};$('menu-button').onclick=showMenu;$('pause').onclick=()=>phase==='paused'?proceed():pause();$('continue').onclick=proceed;
board.addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','KeyZ','KeyK','KeyP','KeyQ','Space','Escape'].includes(e.code))return;e.preventDefault();
 if(e.repeat)return;held.add(e.code);
 if(e.code==='KeyQ'){showMenu();return;}
 if(e.code==='KeyP'||e.code==='Escape'){if(['playing','won','dead'].includes(phase))pause();else if(phase==='paused')proceed();return;}
 if((e.code==='KeyZ'||e.code==='Space')&&phase!=='playing')proceed();
 if(e.code==='KeyK'&&phase==='playing')session.suicide();
});
window.addEventListener('keyup',e=>held.delete(e.code));window.addEventListener('blur',()=>{held.clear();pause('Paused because the game lost focus.');});
board.addEventListener('blur',()=>{held.clear();pause('Paused because the game lost focus.');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){held.clear();pause('Paused while the tab was hidden.');}});
$('volume').onchange=()=>{const volume=Number($('volume').value);audio.volume=volume;if(!volume)audio.stop();persist(old=>({...old,settings:{volume}}));};
function download(content,name,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function confirmation(title,description,action){
 const dialog=$('confirm-dialog');$('confirm-title').textContent=title;$('confirm-description').textContent=description;$('confirm-action').textContent=action;dialog.returnValue='';
 return new Promise(resolve=>{dialog.addEventListener('close',()=>{const result=dialog.returnValue==='confirm';dialog.returnValue='';resolve(result);},{once:true});dialog.showModal();});
}
function backup(mode){backupMode=mode;$('backup-form').reset();$('backup-error').textContent='';$('file-label').hidden=mode!=='import';$('backup-file').required=mode==='import';$('backup-title').textContent=mode==='import'?'Import save':'Export save';$('backup-submit').textContent=mode==='import'?'Unlock backup':'Export';$('backup-description').textContent=mode==='import'?'Choose an encrypted backup and enter its password. You will review it before replacing progress.':'Choose a password for your backup. Forgotten passwords cannot be recovered.';$('password').autocomplete=mode==='import'?'current-password':'new-password';$('backup-dialog').showModal();}
$('export').onclick=()=>backup('export');$('import').onclick=()=>backup('import');$('backup-cancel').onclick=()=>$('backup-dialog').close();
$('backup-dialog').addEventListener('close',()=>{$('password').value='';$('backup-file').value='';});
$('backup-form').onsubmit=async event=>{
 event.preventDefault();const password=$('password').value;$('backup-submit').disabled=true;$('backup-error').textContent='';
 try{
  if(backupMode==='export'){const latest=await store.read();download(await exportSave(latest,password),'n-v2-backup.nv2save');$('backup-dialog').close();notice('Encrypted backup exported. Keep its password in a safe place.');}
  else{
   const file=$('backup-file').files[0];if(!file||file.size>262144)throw Error('Choose a backup no larger than 256 KiB');
   imported=await importSave(await file.text(),password);const latest=await store.read();importRevision=latest.revision;$('backup-dialog').close();
   if(await confirmation('Replace progress?',`Backup: ${imported.completed.length} completed episodes, saved ${new Date(imported.updatedAt).toLocaleString()}. This replaces the current ${latest.completed.length} completed episodes and settings.`, 'Replace progress')){
    const ok=await persist(()=>structuredClone(imported),{expectedRevision:importRevision});if(ok)notice('Backup imported successfully.');
   }
  }
 }catch(e){if($('backup-dialog').open)$('backup-error').textContent=e.message;else notice(e.message);}
 finally{$('password').value='';$('backup-submit').disabled=false;imported=null;}
};
$('reset').onclick=async()=>{if(await confirmation('Reset progress?','This deletes only this game’s progress and settings in this browser. Export a backup first if you want to keep them.','Reset progress')){try{save=await store.reset();renderMenu();notice('Game progress reset.');}catch(e){notice(e.message);}}};
// Re-read after a tab becomes visible; transactions always read the latest revision.
window.addEventListener('focus',async()=>{if(phase==='menu'){try{save=await store.read();renderMenu();}catch(e){notice(e.message);}}});
if(debugEnabled){$('debug').hidden=false;$('step').onclick=()=>{clock.pause();phase='paused';try{session.step({jump:held.has('KeyZ'),left:held.has('ArrowLeft'),right:held.has('ArrowRight')});recorded.push(session.snapshot());updateHud();renderer.draw(session);}catch(e){fatal(e);}};$('overlay').onchange=()=>renderer.debug=$('overlay').checked;$('recording').onclick=()=>download(JSON.stringify({provenance:'native-port-generated; not an original-game reference',levelId:session.level.id,inputs:session.inputs,states:recorded},null,2),'ngame-recording.json');}
async function main(){
 $('play').disabled=true;notice('Loading original level data and vector assets…');
 try{save=await store.open();}catch(e){notice(e.message);}
 const storageMessage=$('notice').textContent;
 const responses=await Promise.all([fetch(new URL('../data/levels.json',import.meta.url)),fetch(new URL('../data/art.json',import.meta.url))]);
 if(responses.some(r=>!r.ok))throw Error('Required game data could not be loaded');
 const [levelData,art]=await Promise.all(responses.map(r=>r.json()));levels=levelData;setArtData(art);renderer=new Renderer(board);await renderer.prepare();
 const observer=new ResizeObserver(()=>{if(session&&phase!=='menu'&&phase!=='error')renderer.draw(session);});observer.observe(board);
 const previewObserver=new ResizeObserver(drawPreviews);previewObserver.observe($('preview-levels'));
 if(debugEnabled){for(const l of levels){const o=document.createElement('option');o.value=l.id;o.textContent=l.name;$('debug-level').append(o);}$('debug-level').onchange=()=>{const l=levels.find(l=>l.id===$('debug-level').value);start(l.episode,l.slot);};}
 renderMenu();$('play').disabled=false;notice(storageMessage.startsWith('Loading')?'':storageMessage);
 function animate(now){try{clock.frame(now);if(session&&phase!=='menu'&&phase!=='error')renderer.draw(session);}catch(e){fatal(e);}requestAnimationFrame(animate);}requestAnimationFrame(animate);
}
main().catch(fatal);

export function developmentState(){
 if(!debugEnabled)throw Error('Enable development tools with ?debug=1');
 return {phase,held:[...held],snapshot:session?.snapshot(),frameTimes:renderer?.samples,diagnostics:'See data/simulation-smoke-report.json for bounded smoke diagnostics.'};
}
