/*
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://alexanderkyriakou.eu/assets/licenses/CPAL-1-0.txt. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is the Crawler IP Verifier, including its input parsing, IP address and CIDR matching, user-agent interpretation, evidence assessment, filtering and export logic, dedicated HTML, CSS and JavaScript interface code, and project-specific dataset publishing and DNS verification code identified as part of this project, originally published at https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer.
 *
 * The Original Developer is not the Initial Developer and is __________. If left blank, the Original Developer is the Initial Developer.
 *
 * The Initial Developer of the Original Code is Alexander Kyriakou. All portions of the code written by Alexander Kyriakou are Copyright (c) 2026 Alexander Kyriakou. All Rights Reserved.
 *
 * Contributor ______________________.
 *
 * No alternative license is offered by the Initial Developer for the Original Code under this source notice.
 *
 * Section 14 Attribution Information (Exhibit B):
 * Attribution Copyright Notice: Copyright (c) 2026 Alexander Kyriakou.
 * Attribution Phrase (not exceeding 10 words): Based on the Crawler IP Verifier by Alexander Kyriakou
 * Attribution URL: https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer
 * Graphic Image as provided in the Covered Code, if any: None.
 * Display of Attribution Information is required in Larger Works which are defined in the CPAL as a work which combines Covered Code or portions thereof with code not governed by the terms of the CPAL.
 *
 * SPDX-License-Identifier: CPAL-1.0
 */
import {wikipediaArticle,types,languages,googleLink,matchLabel,identifier,findings,identityFinding,csv,safeURL} from './entities.js';
const $ = id => document.getElementById(id);
const form = $('kg-search'), results = $('kg-results'), profile = $('kg-profile'), tray = $('kg-tray'), share=$('kg-share');
let current = [], selected = [], controller, profileController, generation = 0, profileGeneration = 0, activeEntity;
const app=$('kg-app');
let shareTimer, shareCopyVersion=0;
const resultCards=new Map();
const memo = new Map(); // Only in-page reuse; no persistence or cross-visitor caching.
function el(tag,content,cls) { const e=document.createElement(tag); if(content !== undefined) e.textContent=content; if(cls) e.className=cls; return e; }
function button(label,fn,cls='') { const b=el('button',label,cls); b.type='button'; b.addEventListener('click',fn); return b; }
function link(label,url) { const a=el('a',label); a.href=safeURL(url); a.target='_blank'; a.rel='noopener noreferrer'; return a; }
function announce(message, quiet=false) {
  $('kg-status').textContent=message;
  $('kg-status').classList.toggle('kg-sr-only',quiet);
}
function icon(name) {
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  for(const [key,value] of Object.entries({viewBox:'0 0 24 24',width:'16',height:'16',fill:'none',stroke:'currentColor','stroke-width':'1.8','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'})) svg.setAttribute(key,value);
  // Matita icons, @matita/icons 0.4.0, MIT; see MATITA-LICENSE.txt.
  const paths=({compare:[["M3.94 7.99Q11.93 7.91 19.91 8.03", "1.744"], ["M15.63 4.14Q17.42 6.19 19.48 7.97Q17.6 9.77 15.91 11.74", "1.664"], ["M19.68 16.06Q11.89 16.72 4.1 16.16", "1.664"], ["M8.47 12.01Q6.28 13.9 4.39 16.09Q6.29 17.91 8.39 19.51", "1.664"]],close:[["M5.63 5.62Q11.53 12.22 18.06 18.19", "1.696"], ["M18.05 5.63Q11.34 11.6 5.59 18.53", "1.696"]],chevron:[["M8.69 5.4Q11.87 8.9 15.32 12.13Q12.09 15.58 8.85 19.03", "1.712"]],copy:[["M7.27 8.53Q14.17 8.81 21.08 8.41M19.95 7.63Q19.63 14.46 20.04 21.28M21.32 20.02Q14.47 19.59 7.63 19.88M8.49 20.87Q8.27 14.09 8.65 7.3", "1.488"], ["M15.57 6.12Q15.48 5.34 15.43 4.56Q9.98 4.7 4.54 4.42Q4.89 10.05 4.35 15.67Q5.1 15.51 5.87 15.47", "1.648"]],check:[["M4.21 11.97Q7.04 14.59 9.37 17.64Q14.91 12.25 19.8 6.27", "1.616"]]})[name] || [];
  for(const [d,width] of paths) { const path=document.createElementNS(svg.namespaceURI,'path'); path.setAttribute('d',d); path.setAttribute('stroke-width',width); svg.append(path); }
  return svg;
}
const shareGroup=el('div',undefined,'kg-share-wrap'), shareFeedback=el('span',undefined,'kg-share-feedback');
shareFeedback.id='kg-share-feedback'; shareFeedback.setAttribute('role','status'); shareFeedback.setAttribute('aria-live','polite'); shareFeedback.setAttribute('aria-atomic','true');
share.replaceWith(shareGroup); shareGroup.append(share,shareFeedback); share.setAttribute('aria-describedby',shareFeedback.id);
$('kg-clear-query').replaceChildren(icon('close'));
function disclosure(label) { const d=el('details'), summary=el('summary',label); const arrow=icon('chevron'); arrow.classList.add('kg-disclosure-icon'); summary.append(arrow); d.append(summary); return d; }
function actionIcon(control,name) { control.prepend(icon(name)); return control; }
function googleAction(entity) {
  const a=link('',googleLink(entity)); a.className='kg-google-search';
  a.setAttribute('aria-label',`${entity.name} on Google Search`); a.title=`${entity.name} on Google Search`;
  const logo=el('img'); logo.src='/assets/images/thoughts/google-knowledge-graph-explorer/google.svg'; logo.width=14; logo.height=14; logo.alt='';
  a.prepend(logo); return a;
}
function compareAction(entity) {
  const b=actionIcon(button('',()=>selectEntity(entity),'kg-icon-button kg-compare'),'compare');
  b.title='Compare'; b.setAttribute('aria-label',`Compare ${entity.name}`); return b;
}
// One source of truth for browser controls and server validation.
for(const [id,options] of [['kg-lang',Object.entries(languages)],['kg-type',types.map(t=>[t,t || 'All entities'])]]) {
  const select=$(id); select.replaceChildren();
  for(const [value,label] of options) { const option=el('option',label); option.value=value; select.append(option); }
}
form.elements.language.value='en';
function heading(target,title) { const h=el('h2',title); h.tabIndex=-1; target.append(h); return h; }
function focus(e) { e.focus({preventScroll:true}); e.scrollIntoView({block:'nearest'}); }
async function request(mode,params,signal) {
  const key=mode+'?'+new URLSearchParams(params);
  if (memo.has(key)) return structuredClone(memo.get(key));
  const r=await fetch('/kg/'+key,{signal});
  const data=await r.json();
  if (!r.ok) throw new Error(data.error || 'Request failed. Please retry.');
  // Reuse only explicit user actions during this page session. Cleared on navigation/reload.
  if(memo.size>60) memo.clear(); if(mode!=='image' || data.image) memo.set(key,data);
  return structuredClone(data);
}
function setURL(entity='') {
  const u=new URL(location.href); u.search='';
  for(const [k,v] of new FormData(form)) if(v) u.searchParams.set(k,v);
  if(entity) u.searchParams.set('entity',entity);
  history.replaceState(null,'',u);
}
async function copy(value) {
  const version=++shareCopyVersion; clearTimeout(shareTimer); shareFeedback.textContent='';
  try {
    await navigator.clipboard.writeText(value); if(version!==shareCopyVersion) return;
    share.dataset.copied='true'; share.title='Copied'; shareFeedback.textContent='Link copied';
    shareTimer=setTimeout(()=>{share.dataset.copied='false';share.title='Copy search link';shareFeedback.textContent='';},1800);
  } catch { if(version===shareCopyVersion) {share.dataset.copied='false';share.title='Copy failed. Copy the browser address manually.';} }
}
const articleImages=new Map();
function image(entity,source=null) {
  const wrap=el('div',undefined,'kg-image');
  const placeholder=()=>wrap.replaceChildren(el('span',(entity.name || '?').slice(0,1)));
  if(source) source.hidden=true;
  const show=(url,credit)=>{
    const img=el('img'); img.alt=entity.name; img.loading='lazy'; img.width=48; img.height=48; img.referrerPolicy='no-referrer';
    img.addEventListener('error',()=>{
      // A valid thumbnail URL can still fail to load. Try the same file's original once.
      if(credit?.originalImage && credit.originalImage!==url) { show(credit.originalImage,credit); return; }
      placeholder(); if(source) source.hidden=true;
      if(wrap.dataset.wikipedia) {
        wrap.dataset.wikipedia='unavailable'; wrap.title='The Wikipedia image could not be loaded.';
      } else fallback();
    },{once:true});
    img.src=url; wrap.replaceChildren(img);
    if(credit && source) { const a=link('Image source',credit.imageSource); source.replaceChildren(a); source.title=[credit.artist,credit.license].filter(Boolean).join(' · '); source.hidden=false; }
  };
  const fallback=async()=>{
    const article=wikipediaArticle(entity.reference) || wikipediaArticle(entity.website);
    if(!article || wrap.dataset.wikipedia) return;
    wrap.dataset.wikipedia='requested';
    try {
      if(!articleImages.has(article.url)) {
        if(articleImages.size>60) articleImages.clear();
        articleImages.set(article.url,request('image',{article:article.url}));
      }
      const data=await articleImages.get(article.url);
      if(data.image) { show(data.image.image,data.image); wrap.dataset.wikipedia='loaded'; wrap.removeAttribute('title'); }
      else { articleImages.delete(article.url); wrap.dataset.wikipedia='unavailable'; wrap.title=({ 'no-article-image':'Wikipedia did not supply a lead image.', 'no-file-metadata':'Wikipedia image file metadata was not available.', 'missing-image-license':'Wikipedia image license metadata was missing.', 'image-license-not-supported':'The Wikipedia image does not have recognized reuse metadata.' })[data.reason] || 'Wikipedia did not return a usable image.'; }
    } catch(error) { articleImages.delete(article.url); wrap.dataset.wikipedia='unavailable'; wrap.title=error.message || 'Wikipedia image unavailable.'; }
  };
  placeholder();
  if(entity.image) show(entity.image,entity.imageSource ? {imageSource:entity.imageSource} : null); else fallback();
  const frame=el('div',undefined,'kg-image-frame'); frame.append(wrap); return frame;
}
function selectEntity(entity) {
  const key=entity.id || entity.googleMid;
  if(!key) return announce('This entity has no stable identifier for comparison.');
  if(selected.some(e=>(e.id || e.googleMid)===key)) return announce('Already selected for comparison.');
  if(selected.length===3) return announce('Compare up to three entities. Remove one to add another.');
  selected.push(entity); renderTray(); announce(`${entity.name} added to comparison.`);
}
function updateTrayOffset() {
  const height=tray.hidden ? 0 : Math.ceil(tray.getBoundingClientRect().height+12);
  app.style.setProperty('--kg-tray-offset',height+'px');
}
new ResizeObserver(updateTrayOffset).observe(tray);
function renderTray(focusIndex=null) {
  tray.replaceChildren(); tray.hidden=selected.length===0;
  if(!selected.length) {
    $('kg-comparison').hidden=true; announce(''); updateTrayOffset();
    if(focusIndex!==null) results.querySelector('h2')?.focus({preventScroll:true});
    return;
  }
  tray.append(el('strong',`Compare entities (${selected.length}/3)`));
  const items=el('div',undefined,'kg-tray-items');
  selected.forEach((entity,index)=>{
    if(index) { const separator=icon('compare'); separator.classList.add('kg-tray-separator'); items.append(separator); }
    const chip=el('span',undefined,'kg-tray-selection'); chip.append(el('span',entity.name));
    const remove=actionIcon(button('',()=>{
      selected=selected.filter(e=>e!==entity); announce(''); renderTray(index);
      if(selected.length>=2) compare(false); else $('kg-comparison').hidden=true;
    },'kg-icon-button kg-tray-remove'),'close');
    remove.title=`Remove ${entity.name}`; remove.setAttribute('aria-label',`Remove ${entity.name}`); chip.append(remove); items.append(chip);
  });
  const go=button('Compare',()=>compare(),'kg-primary kg-tray-compare'); go.disabled=selected.length<2;
  tray.append(items,go); updateTrayOffset();
  if(focusIndex!==null) (items.querySelectorAll('button')[Math.min(focusIndex,selected.length-1)] || go).focus({preventScroll:true});
}
const resultSizing=new ResizeObserver(entries=>{
  requestAnimationFrame(()=>{
    for(const {target} of entries) {
      if(!target.isConnected) continue;
      const card=target.closest('.kg-result'), types=target.querySelector('.kg-result-types');
      const size=Math.floor(Math.min(target.getBoundingClientRect().height,card.clientWidth*.25));
      card.style.setProperty('--kg-result-image-size',size+'px');
      card.style.setProperty('--kg-result-types-height',types.getBoundingClientRect().height+'px');
    }
  });
});
function resultHeader(label) {
  const row=el('div',undefined,'kg-results-heading'); const h=heading(row,label);
  row.append(shareGroup); results.append(row); return h;
}
function romanOrder(position) {
  let result='';
  for(const [value,letters] of [[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]) {
    while(position>=value) { result+=letters; position-=value; }
  }
  return result;
}
function renderResults(query) {
  results.replaceChildren(); resultSizing.disconnect(); resultCards.clear(); resultHeader(`${current.length} ${current.length===1?'entity':'entities'} returned`);
  results.append(el('p','Google API order is not a measure of popularity, authority or entity strength. Match labels describe name similarity.','kg-note'));
  if(!current.length) {
    results.append(el('p','No matching entities were returned for these terms and filters. This does not establish whether an entity or Knowledge Panel exists.'));
    const actions=el('div',undefined,'kg-actions');
    actions.append(button('Remove type filter',()=>{form.elements.type.value=''; form.requestSubmit();}),button('Change language',()=>{ setAdvanced(true); focus(form.elements.language);}),link('Search Google by name','https://www.google.com/search?q='+encodeURIComponent(query)));
    results.append(actions);
  }
  for(const entity of current) {
    const card=el('article',undefined,'kg-result');
    const content=el('div',undefined,'kg-result-content');
    const labels=el('div',undefined,'kg-labels');
    const order=el('span',undefined,'kg-note kg-api-order');
    order.title=`Google API order: ${entity.position}`;
    order.append(el('span','API','kg-api-acronym'),' order∘',el('span',romanOrder(entity.position),'kg-api-number'));
    labels.append(el('span',matchLabel(query,entity),'kg-badge '+(matchLabel(query,entity)==='Exact name match'?'kg-exact':'')),order);
    content.append(labels,el('h3',entity.name),el('p',entity.description || 'Description not provided.'),el('p',entity.types.join(' · ') || 'Type not provided.','kg-note kg-result-types'));
    const actions=el('div',undefined,'kg-actions kg-result-secondary');
    actions.append(googleAction(entity),compareAction(entity));
    const inspect=button('Inspect entity',()=>showProfile(entity),'kg-inspect');
    inspect.setAttribute('aria-controls','kg-profile'); inspect.setAttribute('aria-expanded','false');
    const controls=el('div',undefined,'kg-result-controls'); controls.append(inspect,actions);
    card.append(image(entity),content,controls); resultCards.set(entity,card); results.append(card); resultSizing.observe(content);
  }
  if(current.length>1 && current.some(e=>findings(e,current).some(f=>f.observation.startsWith('Multiple')))) results.insertBefore(el('p','Several entities share a name. Compare descriptions, types and identifiers to distinguish them.','kg-callout'),results.children[2]);
  if(current.length) results.append(el('p','Returned data describes source records; it does not establish Knowledge Panel availability.','kg-note kg-source-note'));
  highlightInspected();
}
async function search() {
  ++shareCopyVersion; clearTimeout(shareTimer); shareFeedback.textContent=''; share.dataset.copied='false'; share.title='Copy search link';
  controller?.abort(); profileController?.abort(); ++profileGeneration;
  controller=new AbortController(); const run=++generation;
  profile.hidden=true; activeEntity=null; results.replaceChildren(); resultSizing.disconnect(); resultCards.clear(); resultHeader('Search results');
  const q=form.elements.q.value.trim(); form.elements.q.value=q; syncClearInput();
  if(!q) return announce('Enter a keyword or identifier.');
  $('kg-submit').disabled=true; results.setAttribute('aria-busy','true'); announce('Searching…');
  setURL();
  try {
    const id=identifier(q), params=id ? {id,language:form.elements.language.value} : Object.fromEntries(new FormData(form));
    const data=await request(id?'lookup':'search',params,controller.signal);
    if(run!==generation) return;
    current=data.entities; renderResults(q); announce(`${current.length} entities returned.`,true);
  } catch(e) { if(run===generation && e.name!=='AbortError') { current=[]; results.append(el('p',e.message,'kg-error')); announce(e.message); } }
  finally { if(run===generation) { $('kg-submit').disabled=false; results.setAttribute('aria-busy','false'); } }
}
function syncClearInput() { $('kg-clear-query').hidden=!form.elements.q.value; }
form.elements.q.addEventListener('input',syncClearInput);
$('kg-clear-query').addEventListener('click',()=>{form.elements.q.value='';syncClearInput();form.elements.q.focus();});
function highlightInspected() {
  for(const [entity,card] of resultCards) {
    const key=entity.id || entity.googleMid, activeKey=activeEntity?.id || activeEntity?.googleMid;
    const inspected=!profile.hidden && !!activeEntity && (key ? key===activeKey : entity===activeEntity);
    card.classList.toggle('kg-is-inspected',inspected);
    card.querySelector('.kg-inspect').setAttribute('aria-expanded',String(inspected));
  }
}
function setAdvanced(open) { $('kg-advanced').hidden=!open; $('kg-advanced-toggle').setAttribute('aria-expanded',String(open)); }
$('kg-advanced-toggle').addEventListener('click',()=>setAdvanced($('kg-advanced').hidden));
form.addEventListener('submit',e=>{ e.preventDefault(); search(); });
for(const b of document.querySelectorAll('[data-example]')) b.addEventListener('click',()=>{form.elements.q.value=b.dataset.example; syncClearInput(); form.requestSubmit();});
function detailsList(entity) {
  const dl=el('dl',undefined,'kg-facts');
  for(const [label,value] of [['Types',entity.types.join(', ')],['Google MID',entity.googleMid],['Cloud MID',entity.cloudMid],['Language',languages[entity.language] || entity.language],['Source',entity.source],['Retrieved',entity.retrievedAt]]) {
    const dd=el('dd',value || 'Not provided.'); if(value && label.endsWith('MID')) dd.append(' ', midCopyButton(value, label));
    dl.append(el('dt',label),dd);
    if(label==='Cloud MID') { const search=el('dd'); search.append(link(`${entity.name} on Google Search`,googleLink(entity))); dl.append(el('dt','Google Search'),search); }
    if(label==='Language') { const website=el('dd'); website.append(entity.website ? link(entity.website,entity.website) : 'Not provided.'); dl.append(el('dt','Website'),website); }
  }
  return dl;
}
function showProfile(entity) { renderProfile(entity); }
function closeProfile() {
  const target=results.querySelector('.kg-is-inspected .kg-inspect') || results.querySelector('h2') || form.elements.q;
  profileController?.abort(); ++profileGeneration; profile.hidden=true; activeEntity=null; highlightInspected(); setURL(); focus(target);
}
function renderProfile(entity) {
  profileController?.abort(); profileController=new AbortController(); const run=++profileGeneration;
  activeEntity=entity; profile.hidden=false; profile.replaceChildren(); highlightInspected(); setURL(entity.id || entity.googleMid);
  const close=actionIcon(button('',closeProfile,'kg-icon-button kg-profile-close'),'close');
  close.title='Close inspection'; close.setAttribute('aria-label','Close entity inspection'); profile.append(close);
  const title=heading(profile,entity.name);
  const imageCredit=el('span',undefined,'kg-image-credit'); imageCredit.hidden=true;
  profile.append(image(entity,imageCredit));
  profile.append(el('p',entity.description || 'Description not provided.'),detailsList(entity));
  if(entity.detail) profile.append(el('p',entity.detail));
  const links=el('div',undefined,'kg-actions'); links.append(imageCredit);
  if(!entity.googleMid) profile.append(el('p','Google MID unavailable; the Google Search link searches by name.','kg-note'));
  if(entity.reference) links.append(link('Description source',entity.reference));
  if(entity.license) links.append(link('Description license',entity.license));
  profile.append(links);
  const lang=disclosure('Compare languages'); lang.className='kg-language-comparison';
  const langForm=el('form'); const row=el('div',undefined,'kg-options');
  for(const [index,label] of ['First language','Second language'].entries()) {
    const field=el('div'), s=el('select'); s.id='kg-language-'+index; s.name='language'+index;
    for(const [value,name] of Object.entries(languages)) { const o=el('option',name); o.value=value; s.append(o); }
    s.value=index===0 ? entity.language : ''; // User explicitly chooses the second language.
    if(index===1) { const o=el('option','Choose a language'); o.value=''; s.prepend(o); s.value=''; }
    s.required=true; const l=el('label',label); l.htmlFor=s.id; field.append(l,s); row.append(field);
  }
  const submit=el('button','Compare','kg-primary'); submit.type='submit'; submit.disabled=!entity.id;
  const output=el('div'); output.setAttribute('aria-live','polite');
  row.classList.add('kg-language-options'); row.append(submit); langForm.append(row); lang.append(langForm,output);
  langForm.addEventListener('submit',async e=>{
    e.preventDefault(); const langs=[...new FormData(langForm).values()];
    if(langs[0]===langs[1]) { output.replaceChildren(el('p','Choose two different languages.')); return; }
    submit.disabled=true; output.replaceChildren(el('p','Loading language records…'));
    const pairs=await Promise.allSettled(langs.map(language=>request('lookup',{id:entity.id,language},profileController.signal)));
    if(run!==profileGeneration) return;
    const records=pairs.map((p,i)=>({label:languages[langs[i]],entity:p.status==='fulfilled' ? p.value.entities.find(e=>e.id===entity.id) : null,error:p.status==='rejected'?p.reason.message:'No record returned for this identifier.'}));
    output.replaceChildren(comparisonView(records,'Language comparison')); submit.disabled=false;
  });
  if(!entity.id) lang.append(el('p','A stable source lookup identifier was not provided.'));
  lang.addEventListener('toggle',()=>{if(lang.open) lang.querySelector('summary').scrollIntoView({block:'nearest'});});
  profile.append(lang);
  const wiki=disclosure('External identity research');
  wiki.append(el('p','A name search finds candidates; it does not establish a matching identity. Review the record before associating it with this entity.','kg-note'),link('Find candidates on Wikidata','https://www.wikidata.org/w/index.php?search='+encodeURIComponent(entity.name)));
  const wikiForm=el('form',undefined,'kg-identity-form'); const wikiLabel=el('label','Inspect a candidate Wikidata ID'); wikiLabel.htmlFor='kg-wiki-id';
  const wikiInput=el('input'); wikiInput.id='kg-wiki-id'; wikiInput.name='id'; wikiInput.placeholder='Q42'; wikiInput.pattern='Q[1-9][0-9]{0,11}'; wikiInput.required=true;
  const wikiSubmit=el('button','Retrieve Wikidata record'); wikiSubmit.type='submit';
  const wikiResult=el('div'); wikiResult.setAttribute('aria-live','polite'); wikiForm.append(wikiLabel,wikiInput,wikiSubmit); wiki.append(wikiForm,wikiResult);
  wikiForm.addEventListener('submit',async e=>{
    e.preventDefault(); wikiSubmit.disabled=true; wikiResult.replaceChildren(el('p','Retrieving candidate…'));
    try {
      const data=await request('enrich',{id:wikiInput.value,language:entity.language,googleMid:entity.googleMid},profileController.signal);
      if(run!==profileGeneration) return;
      wikiResult.replaceChildren(el('h3',data.name || data.id),el('p',data.description || 'Description not provided.'),el('p',data.identity,'kg-callout'),el('p','Aliases: '+(data.aliases.join(', ') || 'Not provided.')),link('Wikidata source record',data.url),el('p',`Source: Wikidata · ${data.retrievedAt}`,'kg-note'),link('Wikidata structured data: CC0',data.license));
      for(const url of data.websites) wikiResult.append(el('p','Wikidata website claim: '),link(url,url));
      if(entity.website && data.websites.length && !data.websites.includes(entity.website)) wikiResult.append(el('p','The website values differ across these records. Verify identity and definitions before interpreting this as a disagreement.'));
    } catch(e) { if(run===profileGeneration && e.name!=='AbortError') wikiResult.replaceChildren(el('p',e.message,'kg-error')); }
    finally { if(run===profileGeneration) wikiSubmit.disabled=false; }
  });
  profile.append(wiki); focus(title);
}
const fields=[['Name','name'],['Description','description'],['Types','types'],['Google MID','googleMid'],['Cloud MID','cloudMid'],['Associated website','website'],['Description reference','reference'],['Detailed description','detail'],['Source','source'],['Retrieved','retrievedAt']];
function value(entity,key) { const v=entity?.[key]; return Array.isArray(v)?v.join(', '):v || ''; }
function comparisonView(records,caption) {
  const wrapper=el('div',undefined,'kg-table-wrap'); wrapper.tabIndex=0; wrapper.setAttribute('role','region'); wrapper.setAttribute('aria-label',caption);
  const table=el('table'), cap=el('caption',caption), head=el('thead'), tr=el('tr');
  tr.append(el('th','Field')); for(const r of records) { const th=el('th',r.label); th.scope='col'; tr.append(th); } head.append(tr);
  const body=el('tbody');
  for(const [label,key] of fields) {
    const row=el('tr'), th=el('th',label); th.scope='row'; row.append(th);
    const vals=records.map(r=>value(r.entity,key));
    const state=vals.some(v=>!v)?'Missing information':new Set(vals).size===1?'Identical values':'Different values';
    for(const [i,r] of records.entries()) { const td=el('td'); td.dataset.label=r.label; td.append(el('strong',r.label,'kg-mobile-label'),el('span',r.entity ? vals[i] || 'Not provided.' : r.error),el('small',state,'kg-note')); row.append(td); }
    body.append(row);
  }
  table.append(cap,head,body); wrapper.append(table); return wrapper;
}
function compare(navigate=true) {
  if(selected.length<2) return;
  const target=$('kg-comparison'); target.hidden=false; target.replaceChildren();
  const h=heading(target,'Entity comparison'); target.append(el('p',identityFinding(selected)),comparisonView(selected.map(e=>({label:e.name,entity:e})),'Selected entities'));
  const footer=el('div',undefined,'kg-comparison-footer'), actions=el('div',undefined,'kg-actions kg-export-actions');
  // Exports exclude detailed licensed descriptions and images until reuse terms are verified.
  actions.append(button('Export comparison CSV',()=>download(csv([['Field',...selected.map(e=>e.name)],...fields.filter(([,k])=>k!=='detail').map(([label,key])=>[label,...selected.map(e=>value(e,key))])]),'comparison.csv','text/csv;charset=utf-8')));
  footer.append(el('p','Exports omit images and detailed descriptions. Review applicable source terms before reuse.','kg-note'),actions);
  target.append(footer);
  if(navigate) { h.focus({preventScroll:true}); requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})); }
}
function download(content,name,type) { const u=URL.createObjectURL(new Blob([content],{type})); const a=el('a'); a.href=u; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }
share.addEventListener('click',()=>{setURL(activeEntity?.id || ''); copy(location.href);});
const params=new URL(location.href).searchParams;
for(const key of ['q','language','type','limit']) { const val=params.get(key); if(val!==null) form.elements[key].value=val; }
if(!form.elements.language.value) form.elements.language.value='en';
if(!form.elements.limit.value) form.elements.limit.value='10';
syncClearInput();
const entityParam=identifier(params.get('entity'));
if(entityParam) {
  const initialGeneration=generation, initialProfileGeneration=profileGeneration;
  request('lookup',{id:entityParam,language:form.elements.language.value}).then(data=>{if(generation!==initialGeneration || profileGeneration!==initialProfileGeneration) return;const e=data.entities.find(e=>e.id===entityParam || e.googleMid===entityParam); if(e) showProfile(e); else announce('The shared entity was not returned for this language.');}).catch(e=>announce(e.message));
} else if(form.elements.q.value) form.requestSubmit();

function midCopyButton(value, label) {
  let timer;

  const b = button('', async () => {
    clearTimeout(timer);
    paint(false);
    b.disabled = true;

    try {
      await navigator.clipboard.writeText(value);
      paint(true);
      // The tick, tooltip and accessible label confirm success locally.
      timer = setTimeout(() => paint(false), 1500);
    } catch {
      b.title='Copy failed. Select and copy the identifier manually.';
      b.setAttribute('aria-label',`Copy ${label} failed; select and copy manually`);
    } finally {
      b.disabled = false;
    }
  }, 'kg-copy-icon');

  function paint(copied) {
    b.replaceChildren(icon(copied ? 'check' : 'copy'));
    b.dataset.copied = String(copied);
    b.setAttribute('aria-label', copied ? `${label} copied` : `Copy ${label}`);
    b.title = copied ? 'Copied' : `Copy ${label}`;
  }

  paint(false);
  return b;
}