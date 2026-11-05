/*
 * License notice for the original Bookmarklets software.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://alexanderkyriakou.eu/assets/licenses/CPAL-1-0.txt. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is the original Bookmarklets collection software authored by Alexander Kyriakou, including its catalogue, configuration and installation controls, original bookmarklet implementations and generated JavaScript, report and overlay interfaces, and dedicated HTML, CSS and JavaScript implementation in ak/bookmarklets.html and assets/js/bookmarklets.js, originally published at https://alexanderkyriakou.eu/ak/bookmarklets.
 *
 * The Original Developer is not the Initial Developer and is __________. If left blank, the Original Developer is the Initial Developer.
 *
 * The Initial Developer of the Original Code is Alexander Kyriakou. All portions of the code written by Alexander Kyriakou are Copyright (c) 2026 Alexander Kyriakou. All Rights Reserved.
 *
 * Contributor ______________________.
 *
 * No alternative license is offered by the Initial Developer for the Original Code under this source notice.
 *
 * Project scope and attribution: https://alexanderkyriakou.eu/assets/licenses/bookmarklets-LICENSE.md
 * SPDX-License-Identifier: CPAL-1.0
 */

/*
 * Third-party Matita SVG paths (@matita/icons 0.4.0), separately licensed under MIT.
 *
 * MIT License
 *
 * Copyright (c) 2026 matita.dev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* Alexander Kyriakou - browser-local bookmarklet collection.
 * Matita copy/check SVG paths: @matita/icons 0.4.0, MIT.
 * No code is fetched when installing a bookmarklet. Screenshot capture alone
 * optionally loads pinned html2canvas 1.4.1 after an explicit confirmation.
 */

(function () {
  'use strict';

  function toolkit() {
    const icons = {
      copy: [['M7.27 8.53Q14.17 8.81 21.08 8.41M19.95 7.63Q19.63 14.46 20.04 21.28M21.32 20.02Q14.47 19.59 7.63 19.88M8.49 20.87Q8.27 14.09 8.65 7.3', '1.488'], ['M15.57 6.12Q15.48 5.34 15.43 4.56Q9.98 4.7 4.54 4.42Q4.89 10.05 4.35 15.67Q5.1 15.51 5.87 15.47', '1.648']],
      close: [['M5.63 5.62Q11.53 12.22 18.06 18.19M18.05 5.63Q11.34 11.6 5.59 18.53', '1.696']],
      check: [['M4.21 11.97Q7.04 14.59 9.37 17.64Q14.91 12.25 19.8 6.27', '1.616']]
    };
    function el(tag, text, doc = document) {
      const node = doc.createElement(tag);
      if (text !== undefined) node.textContent = String(text);
      return node;
    }
    function icon(name, doc = document) {
      const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      for (const [k, v] of Object.entries({viewBox: '0 0 24 24', width: '18', height: '18', fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false'})) svg.setAttribute(k, v);
      for (const [d, width] of icons[name] || []) {
        const path = doc.createElementNS(svg.namespaceURI, 'path');
        path.setAttribute('d', d); path.setAttribute('stroke-width', width); svg.append(path);
      }
      return svg;
    }
    function button(label, action, doc = document) {
      const b = el('button', label, doc); b.type = 'button'; b.addEventListener('click', action); return b;
    }
    function download(value, name, type = 'text/plain;charset=utf-8', doc = document) {
      const blob = value instanceof Blob ? value : new Blob([value], {type});
      const url = URL.createObjectURL(blob), a = el('a', '', doc);
      a.href = url; a.download = name; a.hidden = true; doc.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
    function iconButton(label, action, doc = document) {
      const b = button('', action, doc); b.dataset.iconOnly = 'true'; b.title = label; b.setAttribute('aria-label', label); b.append(icon('copy',doc)); return b;
    }
    async function copy(value, b, status, doc = document) {
      const text = String(value), old = b ? (b.dataset.copyLabel || b.textContent || '') : '';
      if (b) { b.dataset.copyLabel=old;clearTimeout(b._akCopyTimer);delete b.dataset.copied;b.replaceChildren(icon('copy',doc));if(b.dataset.iconOnly!=='true')b.append(doc.createTextNode(old)); }
      let ok = false;
      try { if (doc.defaultView.navigator.clipboard?.writeText) { await doc.defaultView.navigator.clipboard.writeText(text); ok = true; } } catch {}
      if (!ok && typeof doc.execCommand === 'function') {
        const area = el('textarea','',doc), previous = doc.activeElement;
        area.value = text; area.readOnly = true; area.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0';
        doc.body.append(area); area.focus(); area.select();
        try { ok = doc.execCommand('copy') === true; } catch {} finally { area.remove(); previous?.focus?.({preventScroll:true}); }
      }
      if (!ok) {
        if (status) status.textContent = 'Automatic copying was blocked. Copy the text from the dialog.';
        doc.defaultView.prompt?.('Copy with Ctrl+C or Cmd+C:',text); return false;
      }
      if (b) {
        clearTimeout(b._akCopyTimer); b.replaceChildren(icon('check',doc));
        if (b.dataset.iconOnly !== 'true') b.append(doc.createTextNode('Copied'));
        b.dataset.copied = 'true';
        b._akCopyTimer = setTimeout(() => { if (b.isConnected) { b.replaceChildren(icon('copy',doc)); if (b.dataset.iconOnly !== 'true') b.append(doc.createTextNode(old)); delete b.dataset.copied; } },1800);
      }
      return true;
    }
    function notice(message, success = true) {
      const host=el('div'); host.setAttribute('data-ak-bookmarklet-overlay','');
      host.style.cssText='position:fixed!important;bottom:20px!important;right:20px!important;z-index:2147483647!important;max-width:calc(100vw - 40px)!important';
      const shadow=host.attachShadow({mode:'open'}),style=el('style'),box=el('div');
      style.textContent=':host{all:initial}div{font:14px/1.5 system-ui;color:#234967;background:#edf4fc;border:1px solid #9cb7d1;border-radius:8px;padding:12px 16px;box-shadow:0 8px 24px #0002;display:flex;align-items:center;gap:9px}svg{flex:none}';
      box.setAttribute('role','status');if(success)box.append(icon('check'));box.append(message);shadow.append(style,box);document.documentElement.append(host);setTimeout(()=>host.remove(),4000);return host;
    }
    function tab(title, options = {}) {
      const win = window.open('', '_blank');
      if (!win) throw new Error('Pop-up blocked. Allow pop-ups for this page and run the bookmarklet again.');
      const doc = win.document;
      doc.documentElement.lang = 'en';
      doc.head.replaceChildren(); doc.body.replaceChildren();
      doc.title = title;
      const meta = el('meta', undefined, doc); meta.name = 'viewport'; meta.content = 'width=device-width,initial-scale=1';
      const style = el('style', undefined, doc);
      style.textContent = '*{box-sizing:border-box}body{margin:0;padding:28px;color:#243449;background:#fafbfc;font:16px/1.55 system-ui,sans-serif}main{max-width:1180px;margin:auto}.ak-wide main{max-width:1600px}h1{font:500 2rem/1.2 Georgia,serif;margin:0 0 12px}h2{font-size:1.2rem}p{margin:0 0 16px}button,select,input,textarea{font:inherit}button{display:inline-flex;align-items:center;gap:7px;background:white;border:1px solid #a9b8c9;border-radius:6px;padding:8px 12px;color:inherit;cursor:pointer}button:hover{background:#edf4fb}button:disabled{opacity:.5;cursor:default}button[data-copied]{color:#275f8e}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #2d6594;outline-offset:3px}label{display:block;margin:12px 0 5px}input,select,textarea{max-width:100%;padding:8px;border:1px solid #a9b8c9;border-radius:4px;background:white;color:#243449}textarea{display:block;width:100%;min-height:230px;line-height:1.55}table{width:100%;border-collapse:collapse;font-size:.9rem}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ccd7e1;overflow-wrap:anywhere}th{background:#eef3f8;white-space:nowrap} .ak-table-images{min-width:1250px;table-layout:auto}.ak-table-images td:nth-child(1){min-width:220px;max-width:380px}.ak-table-images td:nth-child(2){min-width:150px;max-width:240px}.ak-table-images td:nth-child(3),.ak-table-images td:nth-child(4),.ak-table-images td:nth-child(5),.ak-table-images td:nth-child(6){white-space:nowrap;overflow-wrap:normal}.ak-table-images td:nth-child(7){max-width:320px;min-width:200px}.ak-table-images td:nth-child(8){min-width:90px}.ak-page-source{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.ak-page-source a{overflow-wrap:anywhere}.ak-source-url{display:flex;align-items:center;gap:8px;min-width:0}.ak-source-url a{overflow-wrap:anywhere}.ak-source-item{padding:16px 0;border-bottom:1px solid #ccd7e1}.ak-source-item h3{font-size:1rem;margin:0 0 6px}.ak-icon{padding:7px;min-width:34px;min-height:34px;flex:none}.ak-footer{width:100%;margin:30px 0 0;padding:16px 0;border-top:1px solid #ccd7e1;font-size:.85rem;color:#596b7d;text-align:center}.ak-summary{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.ak-summary span{padding:4px 8px;border:1px solid #ccd7e1;border-radius:4px;font-size:.8rem}.ak-summary [data-state=broken],tr[data-state=broken] td:nth-child(4){color:#a82020;background:#fff0f0}.ak-summary [data-state=redirect],tr[data-state=redirect] td:nth-child(4){color:#9a4b06;background:#fff3e5}.ak-utm-summary{display:flex;gap:8px;flex-wrap:wrap;flex:1;min-width:0;margin:0}.ak-utm-summary span{padding:6px 10px;border:1px solid #ccd7e1;border-radius:5px;overflow-wrap:anywhere}.ak-utm-row{flex-wrap:nowrap!important;align-items:center}.ak-right{margin-left:auto}a{color:#2d6594}.ak-actions{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}.ak-scroll{overflow:auto;max-height:65vh}.ak-status{padding:10px 0;min-height:30px;color:#596b7d}.ak-note{color:#596b7d;font-size:.9rem}svg{flex:none;vertical-align:middle}@media(max-width:600px){body{padding:16px}th,td{padding:7px}table{min-width:620px}}';
      if (options.wide) doc.body.className='ak-wide';
      doc.head.append(meta, style); const main = el('main', undefined, doc); doc.body.append(main);
      main.append(el('h1', title, doc));
      const source = el('div',undefined,doc); source.className='ak-page-source';
      const sourceInfo=el('div',undefined,doc), sourceTitle=el('strong',document.title || 'Source page',doc), sourceURL=el('div',undefined,doc), link=el('a',location.href,doc);
      sourceURL.className='ak-source-url';link.href=location.href;link.target='_blank';link.rel='noopener noreferrer';sourceURL.append(link);
      sourceInfo.append(sourceTitle,sourceURL);source.append(sourceInfo);main.append(source);
      const status = el('p','',doc);status.className='ak-status';status.setAttribute('role','status');main.append(status);
      const sourceCopy=iconButton('Copy source page URL',()=>copy(link.href,sourceCopy,status,doc),doc);sourceCopy.className='ak-icon';sourceURL.append(sourceCopy);
      const footer=el('footer',undefined,doc),credit=el('a','Alexander Kyriakou’s bookmarklet collection',doc);footer.className='ak-footer';credit.href='https://alexanderkyriakou.eu/ak/bookmarklets';credit.target='_blank';credit.rel='noopener noreferrer';footer.append('Bookmarklet from ',credit);const content=el('div',undefined,doc);content.className='ak-content';main.append(content,footer);
      try { win.opener = null; } catch {}
      return {win, doc, main:content, shell:main, footer, status};
    }
    function output(t, value, filename = 'export.txt') {
      const area = el('textarea', '', t.doc); area.value = value; area.setAttribute('aria-label', 'Exported content');
      const actions = el('div', undefined, t.doc); actions.className = 'ak-actions';
      const b = button('Copy', () => copy(area.value, b, t.status, t.doc), t.doc); b.prepend(icon('copy', t.doc));
      actions.append(b, button('Download', () => download(area.value, filename, 'text/plain;charset=utf-8', t.doc), t.doc));
      t.main.append(actions, area); return area;
    }
    function csv(rows) {
      return rows.map(row => row.map(value => {
        const text = String(value ?? '');
        return '"' + (/^[=+@\-\t\r]/.test(text) ? "'" : '') + text.replace(/"/g, '""') + '"';
      }).join(',')).join('\r\n');
    }
    function table(t, headers, rows, options = {}) {
      const wrap = el('div', undefined, t.doc); wrap.className = 'ak-scroll';
      const grid = el('table', undefined, t.doc), head = el('thead', undefined, t.doc), hr = el('tr', undefined, t.doc), body = el('tbody', undefined, t.doc);
      for (const h of headers) { const th = el('th', h, t.doc); th.scope = 'col'; hr.append(th); }
      if(options.className)grid.className=options.className;
      head.append(hr); grid.append(head, body); wrap.append(grid); t.main.append(wrap);
      function update(next) {
        body.replaceChildren();
        for (const row of next) {
          const tr = el('tr', undefined, t.doc);
          for (const [column,value] of row.entries()) { const td=el('td',value,t.doc);if(options.linkColumns?.includes(column)&&value){try{const url=new URL(String(value));if(/^https?:$/.test(url.protocol)){const a=el('a',String(value),t.doc);a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';td.replaceChildren(a);}}catch{}}tr.append(td); }
          if(options.decorate)options.decorate(tr,row);
          body.append(tr);
        }
      }
      update(rows); return {update, wrap, grid, body};
    }
    return {el, icon, button, iconButton, download, copy, notice, tab, output, csv, table};
  }

  function pageLinks() {
    return Array.from(document.querySelectorAll('a[href],area[href]')).flatMap(a => {
      if (a.closest('[data-ak-bookmarklet-overlay]')) return [];
      try {
        const url = new URL(a.getAttribute('href'), document.baseURI);
        if (!/^https?:$/.test(url.protocol)) return [];
        const text = (a.innerText || a.textContent || a.getAttribute('aria-label') || Array.from(a.querySelectorAll('img')).map(i => i.alt).join(' ') || '').replace(/\s+/g, ' ').trim();
        return [{url: url.href, anchor: text, type: url.hostname === location.hostname ? 'Internal (same host)' : 'External', rel: a.getAttribute('rel') || ''}];
      } catch { return []; }
    });
  }

  function cleanURL(raw, mode) {
    const url = new URL(raw);
    for (const key of [...url.searchParams.keys()]) {
      if (mode === 'all' || /^(utm_.+|gclid|dclid|fbclid|msclkid|srsltid|mc_cid|mc_eid|_ga|_gl|gbraid|wbraid)$/i.test(key)) url.searchParams.delete(key);
    }
    return url.href;
  }

  function taggedURL(raw, cfg) {
    const url = new URL(raw);
    if (!/^https?:$/.test(url.protocol)) throw new Error('Use a full http:// or https:// address.');
    for (const key of ['source', 'medium', 'campaign', 'term', 'content']) {
      const value = String(cfg[key] || '').trim();
      if (value) url.searchParams.set('utm_' + key, value);
      else url.searchParams.delete('utm_' + key);
    }
    return url.href;
  }

  function extractContent(format, includeSource) {
    const selection = window.getSelection(), selected = selection && !selection.isCollapsed && selection.toString().trim();
    let root;
    if (selected) { root = document.createElement('div'); for (let i = 0; i < selection.rangeCount; i++) root.append(selection.getRangeAt(i).cloneContents()); }
    else root = (document.querySelector('main article,article main,article,[role="main"],main') || document.body).cloneNode(true);
    root.querySelectorAll('script,style,noscript,nav,header,footer,aside,form,button,[hidden],[aria-hidden="true"],[data-ak-bookmarklet-overlay]').forEach(n => n.remove());
    function walk(node) {
      if (node.nodeType === 3) return node.nodeValue.replace(/\s+/g, ' ');
      if (node.nodeType !== 1) return '';
      const tag = node.tagName.toLowerCase();
      if (tag === 'pre') return format === 'markdown' ? '\n\n````\n' + node.textContent + '\n````\n\n' : '\n\n' + node.textContent + '\n\n';
      const value = Array.from(node.childNodes).map(walk).join('');
      if (tag === 'br') return '\n';
      if (format === 'markdown') {
        if (/^h[1-6]$/.test(tag)) return '\n\n' + '#'.repeat(Number(tag[1])) + ' ' + value.trim() + '\n\n';
        if (tag === 'a') { try { const u = new URL(node.getAttribute('href'), document.baseURI); if (/^https?:$/.test(u.protocol)) return '[' + value.trim().replace(/\]/g, '\\]') + '](<' + u.href.replace(/>/g, '%3E') + '>)'; } catch {} }
        if (tag === 'strong' || tag === 'b') return '**' + value + '**';
        if (tag === 'em' || tag === 'i') return '*' + value + '*';
        if (tag === 'li') return '\n- ' + value.trim();
        if (tag === 'img') return node.alt ? '![ ' + node.alt.replace(/[\[\]]/g, '') + ' ](<' + (node.currentSrc || node.src) + '>)' : '';
      }
      if (/^(p|div|section|article|main|blockquote|h[1-6]|ul|ol|li|tr)$/.test(tag)) return '\n\n' + value.trim() + '\n\n';
      if (tag === 'td' || tag === 'th') return value + '\t';
      return value;
    }
    const content = walk(root).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    const prefix = includeSource ? (format === 'markdown' ? '# ' : '') + document.title + '\n' + location.href + '\n\n' : '';
    return prefix + content;
  }

  function notes() {
    const key='__akQuickNotes';if(window[key]){window[key].focus();return;}
    const k=toolkit(),sourceURL=location.href,sourceTitle=document.title,host=k.el('div');host.setAttribute('data-ak-bookmarklet-overlay','');
    host.style.cssText='position:fixed!important;left:20px!important;top:80px!important;z-index:2147483647!important;width:min(560px,calc(100vw - 32px))!important;max-height:calc(100vh - 32px)!important';
    const shadow=host.attachShadow({mode:'open'}),style=k.el('style');
    style.textContent=':host{all:initial}*{box-sizing:border-box}section{font:14px/1.5 system-ui;background:#fff;color:#243449;border:1px solid #a4b8cc;border-radius:10px;box-shadow:0 12px 45px #0003;overflow:auto;max-height:calc(100vh - 32px)}header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#e9f1f9;cursor:move;touch-action:none;user-select:none}h2{font:500 20px Georgia;margin:0}header button{cursor:pointer}main{padding:16px}label{display:block;margin-bottom:5px}input,textarea,button{font:inherit;color:inherit}input,textarea{width:100%;padding:9px;border:1px solid #a9b8c9;border-radius:4px;background:white}textarea{min-height:250px;max-height:50vh;resize:vertical;line-height:1.55;font-family:ui-monospace,monospace}button{border:1px solid #a9b8c9;border-radius:4px;padding:6px 10px;background:white;cursor:pointer;display:inline-flex;align-items:center;gap:6px}button:focus-visible,input:focus-visible,textarea:focus-visible,header:focus-visible{outline:3px solid #2d6594;outline-offset:2px}.tools{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px}p{font-size:12px;color:#596b7d;margin:8px 0}svg{vertical-align:middle;width:16px;height:16px}';
    const panel=k.el('section'),bar=k.el('header'),heading=k.el('h2','Quick notes'),main=k.el('main');panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Quick Markdown notes');panel.setAttribute('aria-modal','false');bar.tabIndex=0;bar.title='Drag to move.';
    const close=k.button('',()=>dismiss());close.append(k.icon('close'));close.title='Close notes';close.setAttribute('aria-label','Close notes');bar.append(heading,close);panel.append(bar,main);
    const label=k.el('label','Filename'),name=k.el('input'),area=k.el('textarea'),tools=k.el('div'),status=k.el('p','Markdown notes · Ctrl/Cmd+S saves an .md file.');
    name.id='ak-notes-filename';label.htmlFor=name.id;name.value=sourceURL.replace(/^https?:\/\//,'').replace(/[\/\\<>:"|?*#&=]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,180)+'.md';
    area.setAttribute('aria-label','Notes in Markdown');area.placeholder='# My notes\n\nWrite in Markdown…';tools.className='tools';status.setAttribute('role','status');
    function insert(before,after=''){const start=area.selectionStart||0,end=area.selectionEnd||start,value=area.value,selected=value.slice(start,end)||'text';area.value=value.slice(0,start)+before+selected+after+value.slice(end);area.focus();area.setSelectionRange?.(start+before.length,start+before.length+selected.length);}
    for(const[label,before,after]of [['Heading','# ',''],['Bold','**','**'],['Italic','*','*'],['List','- ','']])tools.append(k.button(label,()=>insert(before,after)));
    let saved='';
    function save(){const text=area.value.replace(/\s+$/,'')+'\n\n---\n\nSource page: ['+sourceTitle.replace(/[\[\]]/g,'')+'](<'+sourceURL.replace(/>/g,'%3E')+'>).\n';const filename=(name.value.trim()||'notes').replace(/[\\/:*?"<>|]/g,'-').replace(/\.(txt|md)$/i,'')+'.md';k.download(text,filename,'text/markdown;charset=utf-8');saved=area.value;status.textContent='Markdown download requested. Source page included at the end.';}
    const foot=k.el('div');foot.className='foot';foot.append(k.button('Save Markdown',save),status);main.append(label,name,tools,area,foot);
    function dismiss(){if(area.value!==saved&&!confirm('Close without saving these notes?'))return;document.removeEventListener('keydown',keys);window.removeEventListener?.('beforeunload',unload);window.removeEventListener?.('resize',clamp);host.remove();delete window[key];}
    function keys(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'&&shadow.activeElement){e.preventDefault();save();}}
    function unload(e){if(area.value!==saved){e.preventDefault();e.returnValue='';}}
    let x=20,y=Math.min(80,Math.max(16,innerHeight-100)),drag=null;
    function clamp(){const r=host.getBoundingClientRect();x=Math.max(8,Math.min(x,Math.max(8,innerWidth-r.width-8)));y=Math.max(8,Math.min(y,Math.max(8,innerHeight-r.height-8)));host.style.setProperty('left',x+'px','important');host.style.setProperty('top',y+'px','important');}
    bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.button!==0)return;drag={x:e.clientX-x,y:e.clientY-y,id:e.pointerId};bar.setPointerCapture(e.pointerId);e.preventDefault();});
    bar.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;x=e.clientX-drag.x;y=e.clientY-drag.y;clamp();});
    function stop(){drag=null;}bar.addEventListener('pointerup',stop);bar.addEventListener('pointercancel',stop);bar.addEventListener('lostpointercapture',stop);
    bar.addEventListener('keydown',e=>{const step=e.shiftKey?20:5;if(e.key==='ArrowLeft')x-=step;else if(e.key==='ArrowRight')x+=step;else if(e.key==='ArrowUp')y-=step;else if(e.key==='ArrowDown')y+=step;else return;e.preventDefault();clamp();});
    shadow.append(style,panel);document.documentElement.append(host);document.addEventListener('keydown',keys);window.addEventListener('beforeunload',unload);window.addEventListener('resize',clamp);window[key]={focus:()=>area.focus()};clamp();area.focus();
  }

  function linksReport() {
    const rows = pageLinks(), k = toolkit(), t = k.tab('Page links');
    const filters = k.el('div', undefined, t.doc); filters.className = 'ak-actions';
    const scope = k.el('select', undefined, t.doc), mode = k.el('select', undefined, t.doc);
    scope.setAttribute('aria-label', 'Link scope'); mode.setAttribute('aria-label', 'Export format');
    for (const [value, label] of [['all','All links'],['Internal (same host)','Internal · same hostname'],['External','External']]) { const o = k.el('option', label, t.doc); o.value = value; scope.append(o); }
    for (const [value, label] of [['pairs','URLs + anchor text'],['anchors','Anchor texts only'],['urls','Unique URLs only']]) { const o = k.el('option', label, t.doc); o.value = value; mode.append(o); }
    filters.append(scope, mode); t.main.append(filters); const area = k.output(t, '', 'page-links.txt');
    const csv = k.button('Download CSV', () => k.download(k.csv([['URL','Anchor text','Type','Rel'], ...chosen().map(r => [r.url,r.anchor,r.type,r.rel])]), 'page-links.csv', 'text/csv;charset=utf-8', t.doc), t.doc); filters.append(csv);
    const grid = k.table(t, ['URL','Anchor text','Type','Rel'], []);
    function chosen() { return rows.filter(r => scope.value === 'all' || r.type === scope.value); }
    function update() { const data = chosen(); area.value = mode.value === 'urls' ? [...new Set(data.map(r => r.url))].join('\n') : mode.value === 'anchors' ? data.map(r => r.anchor).join('\n') : data.map(r => r.url + '\t' + r.anchor).join('\n'); grid.update(data.map(r => [r.url,r.anchor,r.type,r.rel])); t.status.textContent = data.length + ' link occurrences · ' + new Set(data.map(r => r.url)).size + ' unique URLs. HTTP(S) links in the current document only.'; }
    scope.addEventListener('change', update); mode.addEventListener('change', update); update();
  }

  function schemaShortcut() { window.open('https://validator.schema.org/#url=' + encodeURIComponent(location.href), '_blank', 'noopener,noreferrer'); }
  function wayback() { window.open('https://web.archive.org/web/*/' + location.href, '_blank', 'noopener,noreferrer'); }
  function pageSpeed() { window.open('https://pagespeed.web.dev/analysis?url=' + encodeURIComponent(location.href), '_blank', 'noopener,noreferrer'); }

  function designMode() {
    document.designMode = document.designMode === 'on' ? 'off' : 'on';
    alert('Page editing ' + (document.designMode === 'on' ? 'ON. Edit text directly. Run again to turn editing off. Refresh to discard edits.' : 'OFF. Refresh to discard local edits.'));
  }

  function searchConsole(cfg) {
    const property=cfg.property.trim()||'sc-domain:'+location.hostname.replace(/^www\./,'');
    const url=new URL('https://search.google.com/search-console/performance/search-analytics');
    url.searchParams.set('resource_id',property);url.searchParams.set('page','*'+location.href);url.searchParams.set('num_of_months','12');
    window.open(url.href,'_blank','noopener,noreferrer');
  }

  function anchorsToURLs() {
    const key = '__akBookmarkletAnchors';
    if (window[key]) { for (const [a, nodes] of window[key]) if (a.isConnected) a.replaceChildren(...nodes); delete window[key]; return; }
    const saved = new Map();
    for (const a of document.querySelectorAll('a[href]')) {
      if (!a.textContent.trim() || a.closest('[data-ak-bookmarklet-overlay]')) continue;
      try { if (!/^https?:$/.test(new URL(a.href).protocol)) continue; } catch { continue; }
      saved.set(a, [...a.childNodes]); a.textContent = a.href;
    }
    window[key] = saved;
  }

  function linkInspector() {
    const key = '__akBookmarkletLinkInspector';
    if (window[key]) { window[key](); return; }
    const host = document.createElement('div'); host.setAttribute('data-ak-bookmarklet-overlay', '');
    host.style.cssText = 'position:fixed!important;bottom:18px!important;right:18px!important;z-index:2147483647!important;max-width:calc(100vw - 36px)!important';
    const shadow = host.attachShadow({mode:'open'}), style = document.createElement('style');
    style.textContent = ':host{all:initial}section{font:14px/1.5 system-ui;background:#fff;color:#243449;border:1px solid #a5b7ca;border-radius:10px;box-shadow:0 8px 30px #0003;padding:16px;max-width:330px;max-height:70vh;overflow:auto}h2{font-size:17px;margin:0 0 8px}label{display:flex;align-items:center;gap:8px;margin:7px 0}input{accent-color:#2d6594}button{font:inherit;padding:6px 10px;cursor:pointer}small{display:block;margin:10px 0}';
    const box = document.createElement('section'); box.setAttribute('aria-label', 'Link attribute inspector');
    const title = document.createElement('h2'); title.textContent = 'Link attributes'; box.append(title);
    const types = [['nofollow','#fff0a8'],['sponsored','#ffd6ba'],['ugc','#e6d9ff'],['external','#ccece3'],['new-tab','#d9e8ff']];
    const active = new Set(types.map(([v]) => v));
    const links = [...document.querySelectorAll('a[href]')];
    const id = 'data-ak-inspector-' + Math.random().toString(36).slice(2), sheet = document.createElement('style');
    const saved = new Map();
    let labels = true;
    function apply() {
      const rules = [];
      for (const [a, original] of saved) { a.removeAttribute(id); if (original === null) a.removeAttribute('title'); else a.setAttribute('title', original); }
      let count = 0;
      for (const a of links) {
        const values = [], rel = (a.getAttribute('rel') || '').toLowerCase().split(/\s+/);
        for (const v of ['nofollow','sponsored','ugc']) if (rel.includes(v) && active.has(v)) values.push(v);
        try { if (new URL(a.href).hostname !== location.hostname && active.has('external')) values.push('external'); } catch {}
        if (a.target.toLowerCase() === '_blank' && active.has('new-tab')) values.push('new-tab');
        if (!values.length) continue;
        if (!saved.has(a)) saved.set(a, a.getAttribute('title'));
        a.setAttribute(id, String(count)); a.title = values.join(' · ');
        const colours = values.map(v => types.find(([name]) => name === v)[1]);
        const stops = colours.flatMap((c,i) => [c + ' ' + i/colours.length*100 + '%', c + ' ' + (i+1)/colours.length*100 + '%']).join(',');
        rules.push('a[' + id + '="' + count + '"]{background:linear-gradient(90deg,' + stops + ')!important;color:#243449!important;outline:2px solid #617d72!important;outline-offset:2px!important}');
        if (labels) rules.push('a[' + id + '="' + count + '"]::after{content:" [' + values.join(' · ') + ']"!important;font:11px/1.3 system-ui!important;color:#243449!important;background:#fff!important;padding:1px 3px!important}');
        count++;
      }
      sheet.textContent = rules.join('\n'); summary.textContent = count + ' highlighted links. Stripes indicate multiple attributes.';
    }
    for (const [name, colour] of types) {
      const label = document.createElement('label'), check = document.createElement('input'), swatch = document.createElement('span');
      check.type = 'checkbox'; check.checked = true; swatch.style.cssText = 'display:inline-block;width:16px;height:16px;background:' + colour + ';border:1px solid #888';
      label.append(check, swatch, document.createTextNode(name)); box.append(label);
      check.addEventListener('change', () => { check.checked ? active.add(name) : active.delete(name); apply(); });
    }
    const label = document.createElement('label'), check = document.createElement('input'); check.type = 'checkbox'; check.checked = true; label.append(check, 'Show text labels'); box.append(label);
    check.addEventListener('change', () => { labels = check.checked; apply(); });
    const summary = document.createElement('small'); summary.setAttribute('role','status'); box.append(summary);
    function close() { for (const [a, original] of saved) { a.removeAttribute(id); if (original === null) a.removeAttribute('title'); else a.setAttribute('title', original); } host.remove(); sheet.remove(); document.removeEventListener('keydown', escape); delete window[key]; }
    function escape(e) { if (e.key === 'Escape') close(); }
    const closeButton = document.createElement('button'); closeButton.textContent = 'Restore page & close'; closeButton.addEventListener('click', close); box.append(closeButton);
    shadow.append(style, box); document.documentElement.append(sheet, host); document.addEventListener('keydown', escape); window[key] = close; apply();
  }

  function colourPicker() {
    const k=toolkit();if(!window.EyeDropper){alert('Screen colour picking needs EyeDropper support on an HTTPS page. Try desktop Chrome or Edge.');return;}
    new EyeDropper().open().then(result=>{
      const host=k.el('div');host.setAttribute('data-ak-bookmarklet-overlay','');host.style.cssText='position:fixed!important;bottom:18px!important;right:18px!important;z-index:2147483647!important';
      const shadow=host.attachShadow({mode:'open'}),style=k.el('style');style.textContent=':host{all:initial}section{background:white;color:#243449;border:1px solid #a9b8c9;border-radius:8px;padding:16px;max-width:300px;font:14px/1.5 system-ui;box-shadow:0 8px 30px #0003}input{font:inherit;width:120px;padding:6px;margin:10px 5px 10px 0}button{font:inherit;padding:6px;margin:4px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}svg{vertical-align:middle;width:16px;height:16px}.bottom{display:flex;align-items:center;gap:10px}p{margin:6px 0;font-size:12px;flex:1}.close{margin-left:auto}';
      const box=k.el('section'),swatch=k.el('div'),value=k.el('input'),status=k.el('p','');box.setAttribute('aria-label','Picked colour');status.setAttribute('role','status');value.setAttribute('aria-label','Picked HEX colour');value.value=result.sRGBHex;value.readOnly=true;swatch.style.cssText='width:100%;height:60px;border:1px solid #aaa;background:'+result.sRGBHex;
      const copy=k.button('Copy HEX',()=>k.copy(value.value,copy,status));copy.prepend(k.icon('copy'));
      const close=k.button('',()=>host.remove());close.append(k.icon('close'));close.title='Close colour picker';close.setAttribute('aria-label','Close colour picker');close.className='close';
      const bottom=k.el('div');bottom.className='bottom';bottom.append(status,close);box.append(swatch,value,copy,bottom);shadow.append(style,box);document.documentElement.append(host);value.focus();value.select();
    }).catch(error=>{if(error.name!=='AbortError')alert(error.message);});
  }

  function imagesReport() {
    const images=[...document.images].map(i=>[i.currentSrc||i.src,!i.hasAttribute('alt')?'Missing alt attribute':i.alt===''?'Empty alt (may be decorative)':i.alt,i.naturalWidth+' × '+i.naturalHeight,Math.round(i.getBoundingClientRect().width)+' × '+Math.round(i.getBoundingClientRect().height),!i.complete?'Pending / lazy / not loaded':i.naturalWidth===0?'Load failed or unavailable':'Loaded',i.loading||'eager (default)',i.getAttribute('srcset')||'',i.getAttribute('sizes')||'']);
    const k=toolkit(),t=k.tab('Image inspector',{wide:true}),headers=['Image URL','Alt','Intrinsic px','Displayed px','Load status','Loading','Srcset','Sizes'];
    t.status.textContent=images.length+' <img> elements. CSS backgrounds, cross-origin frames and unloaded sections are outside this report.';
    const actions=k.el('div',undefined,t.doc);actions.className='ak-actions';const copy=k.iconButton('Copy image data as CSV',()=>k.copy(k.csv([headers,...images]),copy,t.status,t.doc),t.doc);
    actions.append(copy,k.button('Download CSV',()=>k.download(k.csv([headers,...images]),'images.csv','text/csv;charset=utf-8',t.doc),t.doc));t.main.append(actions);k.table(t,headers,images,{className:'ak-table-images',linkColumns:[0]});
  }

  async function cleanAndCopy(cfg) {
    const value=cleanURL(location.href,cfg.mode),k=toolkit();const ok=await k.copy(value);
    if(ok)k.notice('Clean URL copied.');
  }

  function contentReport(cfg) {
    const value = extractContent(cfg.format, cfg.source === 'yes'), k = toolkit(), t = k.tab('Clean page content');
    t.status.textContent = 'Selected text is preferred; otherwise this is a best-effort main-content extraction from the current DOM. Review before sharing.';
    k.output(t, value, cfg.format === 'markdown' ? 'page-content.md' : 'page-content.txt');
  }

  function utmReport(cfg) {
    const value=taggedURL(location.href,cfg),k=toolkit(),t=k.tab('Campaign URL');
    t.status.textContent='Campaign applied to this page. Other query parameters and the fragment are preserved.';
    const summary=k.el('div',undefined,t.doc);summary.className='ak-utm-summary';
    for(const key of ['source','medium','campaign','term','content'])if(cfg[key]?.trim())summary.append(k.el('span',key+': '+cfg[key].trim(),t.doc));
    const area=k.el('textarea','',t.doc);area.value=value;area.setAttribute('aria-label','Campaign URL');area.style.minHeight='110px';
    const actions=k.el('div',undefined,t.doc);actions.className='ak-actions ak-utm-row';const copy=k.iconButton('Copy campaign URL',()=>k.copy(area.value,copy,t.status,t.doc),t.doc);copy.className='ak-right ak-icon';actions.append(summary,copy);t.main.append(actions,area);
  }

  function promptReport(cfg) {
    const context={title:document.title,url:location.href,content:extractContent('plain',false)},value=cfg.prompt.replace(/\{(title|url|content)\}/g,(_,key)=>context[key]);
    const k=toolkit(),t=k.tab('Prompt with page context');t.status.textContent='Only the template placeholders were replaced. Edit below, then copy and open a service. Paste and send there; no prompt is submitted automatically.';
    const area=k.el('textarea','',t.doc);area.value=value;area.setAttribute('aria-label','Prepared prompt');
    const actions=k.el('div',undefined,t.doc);actions.className='ak-actions';
    const copy=k.iconButton('Copy prepared prompt',()=>k.copy(area.value,copy,t.status,t.doc),t.doc);actions.append(copy);
    for(const[label,url]of [['ChatGPT','https://chatgpt.com/'],['Claude','https://claude.ai/new'],['Gemini','https://gemini.google.com/app']]){
      const b=k.button('Copy & open '+label,async()=>{const win=t.win.open('', '_blank');if(!win){t.status.textContent='Allow pop-ups, then retry.';return;}try{win.opener=null;}catch{}const ok=await k.copy(area.value,null,t.status,t.doc);if(!ok){win.close();return;}win.location.href=url;t.status.textContent='Prompt copied. Paste it into '+label+' and send when ready.';},t.doc);actions.append(b);
    }
    t.main.append(actions,area);
  }

  function clearCookies() {
    const names = [...new Set(document.cookie.split(';').map(s => s.trim().split('=')[0]).filter(Boolean))];
    if (!confirm('Attempt to remove ' + names.length + ' JavaScript-accessible cookie names on ' + location.hostname + '? This can affect sign-in and preferences. HttpOnly cookies cannot be removed.')) return;
    const parts = location.hostname.split('.'), domains = ['', location.hostname, '.' + location.hostname];
    for (let i = 1; i < parts.length - 1; i++) domains.push(parts.slice(i).join('.'), '.' + parts.slice(i).join('.'));
    const segments = location.pathname.split('/'), paths = new Set(['/']);
    for (let i = 1; i <= segments.length; i++) { const path = segments.slice(0,i).join('/') || '/'; paths.add(path); paths.add(path.endsWith('/') ? path : path + '/'); }
    for (const name of names) for (const domain of domains) for (const path of paths) {
      document.cookie = name + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=' + path + (domain ? '; domain=' + domain : '') + (location.protocol === 'https:' ? '; Secure' : '');
    }
    const remaining = document.cookie.split(';').map(s => s.trim().split('=')[0]).filter(Boolean);
    alert('Attempted deletion of ' + names.length + ' accessible cookie names. ' + remaining.length + ' are still visible at this path. Other paths, HttpOnly cookies, third-party cookies and other site storage are not cleared.');
  }

  function checkLinks(cfg) {
    const k=toolkit(),unique=new Map();for(const link of pageLinks()){const u=new URL(link.url);u.hash='';if(!unique.has(u.href))unique.set(u.href,{...link,url:u.href});}
    const rows=[...unique.values()].slice(0,Number(cfg.limit)),t=k.tab('Link health checker');
    t.status.textContent=rows.length+' of '+unique.size+' unique HTTP(S) URLs selected. Unreadable responses are not classified as broken.';
    t.main.append(k.el('p','Checks make requests from this browser, three at a time, with an eight-second timeout. Same-origin requests can use your session; external requests omit credentials. Common action URLs are skipped.',t.doc));
    const actions=k.el('div',undefined,t.doc),summary=k.el('div',undefined,t.doc);actions.className='ak-actions';summary.className='ak-summary';summary.setAttribute('role','status');summary.setAttribute('aria-label','Result status counts');t.main.append(actions);
    const data=rows.map(r=>[r.url,r.anchor,r.type,'Not checked','']),states=rows.map(()=> 'waiting');
    const grid=k.table(t,['URL','Anchor','Type','Result','Final URL'],data,{linkColumns:[0,4],decorate:(tr,row)=>tr.setAttribute('data-state',states[data.indexOf(row)])});
    let cancelled=false,started=false,index=0,done=0;const controllers=new Set();
    function update(){grid.update(data);summary.replaceChildren();for(const[state,label]of [['waiting','Not checked'],['checking','Checking'],['ok','Reachable'],['redirect','Redirected'],['broken','404 / 410'],['restricted','Restricted'],['server','Server error'],['http','Other HTTP error'],['unverified','Unverified'],['skipped','Skipped'],['stopped','Stopped']]){const n=states.filter(s=>s===state).length;if(n){const span=k.el('span',label+': '+n,t.doc);span.setAttribute('data-state',state);summary.append(span);}}}
    const start=k.button('Start checks',async()=>{
      if(started)return;started=true;start.disabled=true;stop.disabled=false;
      async function worker(){while(!cancelled&&index<rows.length){
        const i=index++,row=rows[i],url=new URL(row.url);
        if(/(?:^|[\/_-])(logout|log-out|signout|sign-out|delete|remove|unsubscribe)(?:[\/_-]|$)/i.test(url.pathname)||[...url.searchParams].some(([a,b])=>/^(action|do|task)$/i.test(a)&&/^(delete|remove|logout|signout|unsubscribe)$/i.test(b))){data[i][3]='Skipped · action URL';states[i]='skipped';done++;update();continue;}
        const controller=new AbortController();controllers.add(controller);const timer=setTimeout(()=>controller.abort(),8000);data[i][3]='Checking';states[i]='checking';update();
        try{
          const opts={method:'HEAD',mode:'cors',credentials:url.origin===location.origin?'same-origin':'omit',redirect:'follow',signal:controller.signal};let r=await fetch(row.url,opts);
          if([405,501].includes(r.status)){r=await fetch(row.url,{...opts,method:'GET'});r.body?.cancel().catch(()=>{});}
          if([404,410].includes(r.status)){states[i]='broken';data[i][3]='Broken · HTTP '+r.status;}
          else if([401,403].includes(r.status)){states[i]='restricted';data[i][3]='Access restricted · HTTP '+r.status;}
          else if(r.status>=500){states[i]='server';data[i][3]='Server error · HTTP '+r.status;}
          else if(r.status>=400){states[i]='http';data[i][3]='HTTP error · '+r.status;}
          else if(r.redirected){states[i]='redirect';data[i][3]='Redirected → HTTP '+r.status;}
          else{states[i]='ok';data[i][3]='Reachable · HTTP '+r.status;}
          if(r.redirected&&states[i]!=='redirect')data[i][3]+=' · after redirect';data[i][4]=r.url;
        }catch{states[i]=cancelled?'stopped':'unverified';data[i][3]=cancelled?'Stopped':controller.signal.aborted?'Unable to verify · timeout':'Unable to verify · network / CORS / policy';}
        finally{clearTimeout(timer);controllers.delete(controller);done++;update();t.status.textContent=done+' / '+rows.length+' checked. Redirects show the final response; intermediate 301/302 codes are not exposed.';}
      }}
      await Promise.all([worker(),worker(),worker()]);stop.disabled=true;update();t.status.textContent=(cancelled?'Stopped. ':'Finished. ')+done+' / '+rows.length+' checked. Internal means the same hostname. Redirect colours use the browser’s redirected flag, not an inferred 301/302 code.';
    },t.doc);
    const stop=k.button('Stop',()=>{cancelled=true;controllers.forEach(c=>c.abort());},t.doc);stop.disabled=true;
    actions.append(start,stop,k.button('Download CSV',()=>k.download(k.csv([['URL','Anchor','Type','Result','Final URL'],...data]),'link-check.csv','text/csv;charset=utf-8',t.doc),t.doc),summary);update();
    t.win.addEventListener('pagehide',()=>{cancelled=true;controllers.forEach(c=>c.abort());});
  }

  async function screenshot() {
    if (!confirm('Experimental full-page render: load html2canvas 1.4.1 from cdnjs.cloudflare.com into this page? Some images, CSS, video and frames may be missing. The image is rendered locally, not uploaded.')) return;
    const k = toolkit(), t = k.tab('Experimental page capture');
    t.status.textContent = 'Loading renderer…';
    try {
      if (!window.html2canvas) await new Promise((resolve,reject) => {
        const script = document.createElement('script'), timer = setTimeout(() => { script.remove(); reject(new Error('Renderer load timed out or was blocked.')); }, 15000);
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'; script.crossOrigin = 'anonymous'; script.referrerPolicy = 'no-referrer';
        script.onload = () => { clearTimeout(timer); resolve(); }; script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Renderer was blocked or unavailable.')); }; document.head.append(script);
      });
      const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), width = document.documentElement.clientWidth;
      if (height > 30000 || height * width > 50000000) throw new Error('Page is too large for a reliable canvas export. Use your browser’s native full-page screenshot.');
      t.status.textContent = 'Rendering loaded page content…';
      const canvas = await window.html2canvas(document.documentElement, {useCORS:true,allowTaint:false,scale:1,logging:false,width,height,windowWidth:innerWidth,windowHeight:innerHeight,scrollX:0,scrollY:0});
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Canvas export failed. Use native full-page capture.');
      const url = URL.createObjectURL(blob), img = k.el('img', undefined, t.doc); img.src = url; img.alt = 'Experimental full-page rendering'; img.style.cssText = 'display:block;max-width:100%;height:auto;border:1px solid #ccc';
      const actions=k.el('div',undefined,t.doc);actions.className='ak-actions';const download=k.button('Download PNG',()=>k.download(blob,'page-capture.png','image/png',t.doc),t.doc);download.className='ak-right';actions.append(download);t.main.append(actions,img);
      t.win.addEventListener('pagehide', () => URL.revokeObjectURL(url), {once:true}); t.status.textContent = 'Rendered approximation. Review for missing or inaccurate content. Browser-native capture is more faithful.';
    } catch (error) { t.status.textContent = error.message + ' In Chrome: DevTools → Command Menu → Capture full size screenshot.'; }
  }

  function parseAI(payload) {
    const queries=new Set(),citations=new Map(),accessed=new Map();let queryFields=0;
    function addURL(raw,title,target,provenance){try{const u=new URL(raw);if(!/^https?:$/.test(u.protocol))return;const old=target.get(u.href);if(!old)target.set(u.href,{url:u.href,title:String(title||u.hostname),domain:u.hostname,provenance});}catch{}}
    function queryValues(value){
      if(typeof value==='string'){if(value.trim())queries.add(value.trim());return;}
      if(Array.isArray(value)){value.forEach(queryValues);return;}
      if(value&&typeof value==='object')for(const[key,v]of Object.entries(value))if(!/^(type|id|status|source|url|domain|language|provider)$/i.test(key)&&!/token|authorization|cookie|secret|password/i.test(key))queryValues(v);
    }
    function references(value,target=citations,provenance='Provider citation metadata'){
      if(!value||typeof value!=='object')return;if(Array.isArray(value)){value.forEach(v=>references(v,target,provenance));return;}
      const url=value.url||value.uri||value.source_url;if(typeof url==='string')addURL(url,value.title||value.attribution,target,provenance);
      if(Array.isArray(value.safe_urls))value.safe_urls.forEach(u=>addURL(u,value.title||value.alt,target,provenance));
      for(const key of ['items','entries','sources','supporting_websites','citations','content','fallback_items','web'])if(value[key])references(value[key],target,provenance);
    }
    const visited=new WeakSet();
    function walk(value){
      if(!value||typeof value!=='object'||visited.has(value))return;visited.add(value);if(Array.isArray(value)){value.forEach(walk);return;}
      for(const key of ['search_model_queries','search_queries','webSearchQueries','web_search_queries'])if(value[key]!==undefined){queryFields++;queryValues(value[key]);}
      if(value.type==='google_search_call'){queryFields++;queryValues(value.arguments?.queries);}
      if(value.type==='url_citation')references(value);
      if(['tool_use','server_tool_use'].includes(value.type)&&/^(web_search|google_search|search)$/.test(value.name||''))queryValues(value.input?.query||value.input?.queries||value.input?.search_query||value.input?.search_terms);
      if(value.recipient&&/web[._/]run|search_service|web_search/.test(value.recipient)){
        const parts=[value.content?.text,...(Array.isArray(value.content?.parts)?value.content.parts:[])];
        for(const part of parts)if(typeof part==='string')try{const cmd=JSON.parse(part);for(const key of ['search_query','system1_search_query','system2_search_query'])if(cmd[key]){queryFields++;queryValues(cmd[key]);}}catch{}
      }
      if(value.content_references)references(value.content_references);
      if(value.citations)references(value.citations);
      if(value.groundingChunks)references(value.groundingChunks,citations,'Provider grounding source');
      if(value.grounding_chunks)references(value.grounding_chunks,citations,'Provider grounding source');
      if(value.type==='search_result_group')references(value.entries,accessed,'Retrieved search result · not necessarily cited');
      if(value.search_result_groups)references(value.search_result_groups,accessed,'Retrieved search result · not necessarily cited');
      for(const[key,child]of Object.entries(value))if(!['search_model_queries','search_queries','webSearchQueries','web_search_queries','content_references','citations','groundingChunks','grounding_chunks','search_result_groups'].includes(key))walk(child);
    }
    walk(payload);return{queries:[...queries],citations:[...citations.values()],accessed:[...accessed.values()],queryFields};
  }

  async function aiData(cfg) {
    const host=location.hostname;
    const detected=/^(www\.)?(chatgpt\.com|chat\.openai\.com)$/.test(host)?'ChatGPT':/^(www\.)?claude\.ai$/.test(host)?'Claude':host==='gemini.google.com'?'Gemini':/(^|\.)google\.[a-z.]+$/.test(host)&&(new URLSearchParams(location.search).get('udm')==='50'||document.querySelector('[data-xid="aim-mars-turn-root"],[data-aim]'))?'Google AI Mode':'';
    const provider=cfg.provider||detected;
    if(!provider||cfg.provider&&detected!==cfg.provider)throw new Error('Run this bookmarklet on '+(cfg.provider||'a supported AI service')+'.');
    const k=toolkit(),t=k.tab((cfg.kind==='queries'?'Search queries · ':'Sources · ')+provider),logs=['Provider: '+provider],result=k.el('section',undefined,t.doc);
    const options=k.el('div',undefined,t.doc);options.className='ak-actions';
    const mode=k.el('select',undefined,t.doc);mode.setAttribute('aria-label','Conversation branch scope');
    for(const[value,label]of [['active','Active conversation branch'],['all','All saved branches']]){const o=k.el('option',label,t.doc);o.value=value;mode.append(o);}mode.value='active';if(provider==='ChatGPT')options.append(mode);
    t.main.append(options,result);t.status.textContent='Reading exposed search and source metadata…';
    let original=null,warning='',visible=[],suggestions=[];
    function linearize(payload){if(provider!=='ChatGPT'||mode.value==='all'||!payload?.mapping||!payload.current_node)return payload;const path=[],seen=new Set();let id=payload.current_node;while(id&&payload.mapping[id]&&!seen.has(id)){seen.add(id);path.unshift(payload.mapping[id].message);id=payload.mapping[id].parent;}return path;}
    function visibleLinks(){
      const selector=provider==='ChatGPT'?'[data-message-author-role="assistant"] a[href]':provider==='Claude'?'.font-claude-response a[href],[data-testid="assistant-message"] a[href],a[data-testid*="citation"]':provider==='Gemini'?'model-response a[href],.model-response-text a[href],[data-test-id="sources-list"] a[href]':'[data-xid="aim-mars-turn-root"] a[href],[data-aim] a[href],[role="dialog"] a[href]';
      const urls=new Map();document.querySelectorAll(selector).forEach(a=>{try{let u=new URL(a.getAttribute('href'),location.href);if(/(^|\.)google\.[a-z.]+$/.test(u.hostname)&&u.pathname==='/url'){const target=u.searchParams.get('q')||u.searchParams.get('url');if(target)u=new URL(target);}
        if(!/^https?:$/.test(u.protocol)||u.origin===location.origin||/^(chatgpt\.com|claude\.ai|gemini\.google\.com)$/.test(u.hostname))return;
        if(/(^|\.)google\.[a-z.]+$/.test(u.hostname)&&/^\/(search|preferences|accounts)/.test(u.pathname))return;
        if(!urls.has(u.href))urls.set(u.href,{url:u.href,title:(a.innerText||a.getAttribute('aria-label')||u.hostname).trim(),domain:u.hostname,provenance:'Visible answer link · not verified as a final citation'});
      }catch{}});return[...urls.values()];
    }
    function render(){
      result.replaceChildren();const data=parseAI(linearize(original)),isQuery=cfg.kind==='queries';
      function list(title,rows){if(!rows.length)return;result.append(k.el('h2',title,t.doc));for(const row of rows){const item=k.el('article',undefined,t.doc);item.className='ak-source-item';const heading=k.el('h3',row.title,t.doc),line=k.el('div',undefined,t.doc),a=k.el('a',row.url,t.doc);line.className='ak-source-url';a.href=row.url;a.target='_blank';a.rel='noopener noreferrer';const copy=k.iconButton('Copy source URL',()=>k.copy(row.url,copy,t.status,t.doc),t.doc);copy.className='ak-icon';line.append(a,copy);item.append(heading,line,k.el('small',row.provenance,t.doc));result.append(item);}}
      if(isQuery){
        t.status.textContent=data.queries.length?data.queries.length+' exposed search queries found. This may be a partial record.':'No actual internal search queries were exposed. This does not mean no searches occurred.';
        if(warning)result.append(k.el('p',warning,t.doc));const actions=k.el('div',undefined,t.doc);actions.className='ak-actions';const copy=k.iconButton('Copy all extracted queries',()=>k.copy(data.queries.join('\n'),copy,t.status,t.doc),t.doc);copy.disabled=!data.queries.length;actions.append(copy);result.append(actions);
        for(const query of data.queries){const row=k.el('div',undefined,t.doc);row.className='ak-source-item';const b=k.iconButton('Copy search query',()=>k.copy(query,b,t.status,t.doc),t.doc);row.append(k.el('span',query,t.doc),' ',b);result.append(row);}
        if(suggestions.length){result.append(k.el('h2','Visible search suggestions',t.doc),k.el('p','These are suggested search links shown by the service, not verified internal fan-out searches.',t.doc));suggestions.forEach(q=>result.append(k.el('p',q,t.doc)));}
      }else{
        const available=new Map([...visible,...data.accessed,...data.citations].map(r=>[r.url,r]));
        t.status.textContent=data.citations.length+' citation/grounding sources · '+data.accessed.length+' retrieved results · '+visible.length+' visible answer links. '+warning;
        const actions=k.el('div',undefined,t.doc);actions.className='ak-actions';const copy=k.iconButton('Copy all available source URLs',()=>k.copy([...available.keys()].join('\n'),copy,t.status,t.doc),t.doc);copy.disabled=!available.size;actions.append(copy,k.button('Download CSV',()=>k.download(k.csv([['Title','URL','Provenance'],...[...available.values()].map(r=>[r.title,r.url,r.provenance])]),'ai-sources.csv','text/csv;charset=utf-8',t.doc),t.doc));result.append(actions);
        list('Citations and grounding sources',data.citations);list('Retrieved search results · not necessarily cited',data.accessed.filter(r=>!data.citations.some(c=>c.url===r.url)));list('Visible answer links · partial fallback',visible.filter(r=>!data.citations.some(c=>c.url===r.url)&&!data.accessed.some(c=>c.url===r.url)));
      }
      const details=k.el('details',undefined,t.doc),summary=k.el('summary','Extraction details',t.doc);details.append(summary,k.el('p',logs.join(' · ')+' · Recognised query fields: '+data.queryFields,t.doc));result.append(details);
    }
    async function json(url,extra={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const r=await fetch(url,{credentials:'same-origin',...extra,signal:controller.signal});logs.push('Endpoint response: '+r.status);if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}finally{clearTimeout(timer);}}
    try{
      if(provider==='ChatGPT'){
        const id=location.pathname.match(/\/c\/([^/]+)/)?.[1];if(!id)throw new Error('Open a saved conversation first.');let session={};try{session=await json('/api/auth/session');}catch{logs.push('Session-token endpoint unavailable; trying existing cookies.');}
        original=await json('/backend-api/conversation/'+encodeURIComponent(id),session.accessToken?{headers:{Authorization:'Bearer '+session.accessToken,'Content-Type':'application/json'}}:{});
      }else if(provider==='Claude'){
        const id=location.pathname.match(/\/chat\/([a-z0-9-]+)/i)?.[1];if(!id)throw new Error('Open a saved conversation first.');let org=document.cookie.match(/(?:^|;\s*)lastActiveOrg=([^;]+)/)?.[1];org=org?decodeURIComponent(org).replace(/^"|"$/g,''):'';
        async function load(orgID){original=await json('/api/organizations/'+encodeURIComponent(orgID)+'/chat_conversations/'+encodeURIComponent(id)+'?tree=True&rendering_mode=messages&render_all_tools=true');logs.push('Conversation loaded.');render();}
        if(org&&/^[a-f0-9-]{36}$/i.test(org))await load(org);else{
          const orgs=await json('/api/organizations'),chat=Array.isArray(orgs)?orgs.filter(o=>!o.capabilities||o.capabilities.includes('chat')):[];
          if(chat.length===1)await load(chat[0].uuid);else if(chat.length>1){const select=k.el('select',undefined,t.doc);select.setAttribute('aria-label','Claude workspace');chat.forEach(o=>{const opt=k.el('option',o.name||o.uuid,t.doc);opt.value=o.uuid;select.append(opt);});options.append(select,k.button('Load selected workspace',async()=>{try{await load(select.value);}catch(e){warning=e.message;render();}},t.doc));warning='Choose the workspace that owns this conversation.';}else throw new Error('No accessible chat workspace was returned.');
        }
      }else{
        original=[];document.querySelectorAll('script[type="application/json"]').forEach(script=>{if(script.textContent.length<10000000)try{original.push(JSON.parse(script.textContent));}catch{}});
        warning=provider+': extraction is limited to browser-exposed metadata. Internal queries are not reliably exposed by this web interface. A grounding JSON file can be inspected below; no queries are guessed.';
        if(provider==='Gemini')document.querySelectorAll('a[href*="google.com/search"]').forEach(a=>{if(a.closest('model-response,.model-response-text'))try{const q=new URL(a.href).searchParams.get('q');if(q&&!suggestions.includes(q))suggestions.push(q);}catch{}});
      }
    }catch(error){warning=provider+' data could not be read ('+error.message+'). Sign-in, endpoint changes, or unavailable metadata may be responsible.';logs.push('Live extraction failed without exposing raw session data.');}
    visible=visibleLinks();render();mode.addEventListener('change',render);
    const importer=k.el('details',undefined,t.doc),label=k.el('summary','Inspect a conversation or grounding JSON file',t.doc),input=k.el('input',undefined,t.doc);input.type='file';input.accept='.json,application/json';input.setAttribute('aria-label','Choose local JSON file');
    importer.append(label,k.el('p','Optional local fallback. The file is read in this browser and is not uploaded. Only recognised search and source metadata is extracted; model thoughts are not displayed.',t.doc),input);t.main.append(importer);
    input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;if(file.size>20000000){t.status.textContent='Choose a JSON file smaller than 20 MB.';return;}try{original=JSON.parse(await file.text());warning='Reading imported JSON, not a live service response.';logs.push('Local JSON imported.');render();}catch{t.status.textContent='The selected file is not valid JSON.';}});
  }

  function platformTarget(raw, target) {
    const text=String(raw||'').trim();let url;
    try{url=new URL(text.replace(/\{url\}/g,encodeURIComponent(target)));}catch{throw new Error('Enter a full http:// or https:// platform URL.');}
    if(!/^https?:$/.test(url.protocol))throw new Error('Use an HTTP(S) platform URL.');
    if(text.includes('{url}'))return url.href;
    if(url.hostname==='validator.schema.org'&&url.pathname==='/'&&!url.search&&!url.hash)return 'https://validator.schema.org/#url='+encodeURIComponent(target);
    if(url.hostname==='pagespeed.web.dev'&&url.pathname==='/'&&!url.search&&!url.hash)return 'https://pagespeed.web.dev/analysis?url='+encodeURIComponent(target);
    if(url.hostname==='web.archive.org'&&(url.pathname==='/'||/^\/web\/\*\/$/.test(url.pathname))&&!url.search&&!url.hash)return 'https://web.archive.org/web/*/'+target;
    function slot(params){const empty=[...params].filter(([,value])=>!value.trim());const named=empty.find(([name])=>/^(url|uri|u|target|page|q|query|input|website|domain)$/i.test(name));return(named||empty.at(-1))?.[0];}
    const querySlot=slot(url.searchParams);if(querySlot!==undefined){url.searchParams.set(querySlot,target);return url.href;}
    if(url.hash.includes('=')){const hash=url.hash.slice(1),mark=hash.indexOf('?'),prefix=mark>=0?hash.slice(0,mark+1):'',params=new URLSearchParams(mark>=0?hash.slice(mark+1):hash),name=slot(params);if(name!==undefined){params.set(name,target);url.hash=prefix+params.toString();return url.href;}}
    url.searchParams.set('url',target);return url.href;
  }

  function platformShortcut(cfg) {
    window.open(platformTarget(cfg.platform,location.href),'_blank','noopener,noreferrer');
  }

  const field = (name, label, type = 'text', value = '', options = null) => ({name,label,type,value,options});
  const catalog = [
    {id:'schema',title:'Schema Validator',category:'seo',desc:'Send the open page to Schema.org’s markup validator.',note:'Opens an external service with the current URL. Private pages may not be fetchable.',run:schemaShortcut,deps:[]},
    {id:'pagespeed',title:'PageSpeed Insights',category:'seo',desc:'Start a performance check for the page you are viewing.',note:'Opens Google PageSpeed Insights with the current URL. Publicly reachable pages work best.',run:pageSpeed,deps:[]},
    {id:'gsc',title:'Google Search Console',category:'seo',desc:'Open the Performance report for this page over the past 12 months.',note:'Uses the current page as a contains filter. Requires access to the configured property.',run:searchConsole,deps:[],fields:[field('property','Search Console property','text','','')],hint:'Optional: sc-domain:yourdomain.eu or https://yourdomain.eu/. Blank uses the current hostname as a Domain property, removing www. Enter the parent domain explicitly for other subdomains.'},
    {id:'wayback',title:'Wayback history',category:'seo',desc:'See archived versions of the current URL.',note:'Opens the Internet Archive. A page may have no saved captures.',run:wayback,deps:[]},
    {id:'links',title:'Export page links',category:'seo',desc:'A new-tab report of URLs, anchor texts, and their relationships.',note:'Includes URL + anchor pairs, plain anchor texts, unique URL lists, internal/external filters, and CSV export. Internal means the same hostname.',run:linksReport,deps:[toolkit,pageLinks]},
    {id:'attributes',title:'Colour link attributes',category:'seo',desc:'See nofollow, sponsored, ugc, external, and new-tab links in place.',note:'A floating legend controls colours and labels. Stripes show overlapping attributes. Close it, press Escape, or run again to restore the page.',run:linkInspector,deps:[]},
    {id:'images',title:'Image inspector',category:'seo',desc:'Check alt text, dimensions, sources, and current image load states.',note:'Reports <img> elements in the current document, including srcset and sizes. Empty alt can be intentional. Pending lazy images are not marked broken.',run:imagesReport,deps:[toolkit]},
    {id:'link-health',title:'Link health checker',category:'seo',desc:'Check page links and distinguish broken URLs from unreadable responses.',note:'Start checks from the report. CORS, timeouts and policy blocks are “Unable to verify”, not broken. Same-host responses can use your signed-in session.',run:checkLinks,deps:[toolkit,pageLinks],badge:'Browser limits',fields:[field('limit','Maximum unique URLs','number','100')],hint:'1–500 URLs per run. Three requests at a time; eight-second timeout.'},
    {id:'notes',title:'Quick notes',category:'writing',desc:'Keep draggable Markdown notes on the page you are viewing.',note:'A floating panel stays in this tab. Drag its heading or focus it and use arrow keys. Ctrl/Cmd+S while editing saves an .md file with the source page appended. Notes are not stored automatically.',run:notes,deps:[toolkit]},
    {id:'design',title:'Edit page copy',category:'writing',desc:'Toggle design mode to try new headlines and copy on a live layout.',note:'Edits are local to the tab. Run again to stop editing; refresh to discard changes.',run:designMode,deps:[]},
    {id:'content',title:'Copy clean page content',category:'writing',desc:'Extract selected text or main content as plain text or Markdown.',note:'A new tab lets you review and copy the result. Complex layouts may need cleanup; unloaded content and cross-origin frames are outside scope.',run:contentReport,deps:[toolkit,extractContent],fields:[field('format','Output format','select','markdown',[['markdown','Markdown'],['plain','Plain text']]),field('source','Include title and source URL','select','yes',[['yes','Yes'],['no','No']])]},
    {id:'utm',title:'UTM campaign builder',category:'writing',desc:'Build a campaign URL here, or save a bookmarklet with your campaign settings.',note:'The saved bookmarklet applies the campaign to the page open when you run it. Blank fields remove the matching UTM parameter. Other parameters and fragments stay intact.',run:utmReport,deps:[toolkit,taggedURL],fields:[field('destination','Destination URL · for the URL below','url',''),field('source','Source · utm_source','text',''),field('medium','Medium · utm_medium','text',''),field('campaign','Campaign · utm_campaign','text',''),field('term','Term · optional','text',''),field('content','Content · optional','text','')],hint:'Source, medium, and campaign are required to create a campaign bookmarklet. The destination is used for the copyable URL, not fixed into the bookmarklet.'},
    {id:'chatgpt-queries',disabled:true,title:'ChatGPT search queries',category:'ai',desc:'Inspect search metadata exposed by a saved ChatGPT conversation.',note:'Experimental. Handles nested query formats, tool-call JSON and active/all-branch selection. Extraction details distinguish endpoint failures from absent metadata. Local JSON import is available.',run:aiData,deps:[toolkit,parseAI],badge:'Paused',fixed:{kind:'queries',provider:'ChatGPT'}},
    {id:'claude-queries',disabled:true,title:'Claude search queries',category:'ai',desc:'Inspect exposed web-search tool queries in a Claude conversation.',note:'Experimental. Uses the active workspace or asks you to select one. Supports a local conversation JSON file when the live endpoint does not expose the data.',run:aiData,deps:[toolkit,parseAI],badge:'Paused',fixed:{kind:'queries',provider:'Claude'}},
    {id:'gemini-queries',disabled:true,title:'Gemini exposed search data',category:'ai',desc:'Inspect browser-exposed search metadata or a local grounding JSON file.',note:'Gemini’s web interface does not reliably expose internal searches. Extracts recognised grounding query fields when present; visible suggestions are kept separate. This is not verified live fan-out extraction.',run:aiData,deps:[toolkit,parseAI],badge:'Paused',fixed:{kind:'queries',provider:'Gemini'}},
    {id:'ai-mode-queries',disabled:true,title:'Google AI Mode exposed data',category:'ai',desc:'Inspect available query metadata without inferring hidden searches.',note:'Actual internal fan-out extraction remains unverified. Available JSON can be inspected locally; missing query data is reported explicitly.',run:aiData,deps:[toolkit,parseAI],badge:'Paused',fixed:{kind:'queries',provider:'Google AI Mode'}},
    {id:'ai-citations',title:'LLM citation exporter',category:'ai',desc:'Collect source titles and URLs from ChatGPT, Claude, Gemini, or Google AI Mode.',note:'Provider metadata is preferred. Visible answer links are a clearly labelled partial fallback and can include non-citation links. AI Mode layouts without ordinary source links are unsupported.',run:aiData,deps:[toolkit,parseAI],badge:'Experimental',fixed:{kind:'citations'}},
    {id:'prompt',title:'Prompt with page context',category:'ai',desc:'Prepare a reusable prompt with selected text or the current page’s main content.',note:'The template is used exactly as written; only {title}, {url} and {content} are replaced. Copy-and-open buttons launch ChatGPT, Claude or Gemini. Paste and send there.',run:promptReport,deps:[toolkit,extractContent],fields:[field('prompt','Your exact prompt template','textarea','Summarise the key points, identify unclear claims, and suggest three specific improvements.\n\nPage title: {title}\nSource URL: {url}\n\n{content}')]},
    {id:'builder',title:'Bookmarklet builder',category:'utilities',desc:'Turn a platform’s URL-checking address into your own bookmarklet.',note:'Supply only the platform URL or its input prefix, such as https://validator.schema.org/#url=. Empty query or fragment values are filled with the page you are viewing. Otherwise a url parameter is added; the destination platform must support it.',run:platformShortcut,deps:[platformTarget],fields:[field('platform','Platform URL or URL-input prefix','url','')],hint:'Schema Validator, PageSpeed and Wayback homepages are recognised. For other tools, include the empty parameter they expect, or an optional {url} insertion marker. Preview uses https://yourdomain.eu/page.'},
    {id:'clean',title:'Clean URL & copy',category:'utilities',desc:'Remove tracking clutter or all query parameters, then copy the cleaned URL.',note:'Known-tracking mode preserves functional parameters. Removing every parameter can change which page or product is shown. Fragments are preserved.',run:cleanAndCopy,deps:[toolkit,cleanURL],fields:[field('mode','What to remove','select','tracking',[['tracking','Known tracking parameters'],['all','All query parameters']])]},
    {id:'anchors',title:'Show URLs as link text',category:'utilities',desc:'Replace text links with their destinations to inspect where they lead.',note:'Run again to restore the original link contents. Applies to the current document’s text links.',run:anchorsToURLs,deps:[]},
    {id:'colour',title:'Screen colour picker',category:'utilities',desc:'Pick a screen colour and get its HEX value.',note:'Requires HTTPS and a browser with EyeDropper support, such as desktop Chrome or Edge. Press Escape to cancel.',run:colourPicker,deps:[toolkit],badge:'Limited support'},
    {id:'cookies',title:'Clear accessible cookies',category:'utilities',desc:'Attempt to remove cookies JavaScript can access on the current site.',note:'Asks before deletion. Can affect preferences and sign-in. HttpOnly cookies, unknown paths, third-party cookies and other site storage are not cleared.',run:clearCookies,deps:[],badge:'Confirmation'},
    {id:'screenshot',title:'Experimental page capture',category:'utilities',desc:'Render the loaded page to a downloadable PNG.',note:'Loads html2canvas 1.4.1 from cdnjs only after confirmation. This is a visual approximation; CORS, CSP, unsupported CSS, video, frames, and page size can limit results. Native browser screenshots are more faithful.',run:screenshot,deps:[toolkit],badge:'Experimental'}
  ];

  function bmPanel(id, title) {
    const previous = document.querySelector('[data-ak-bm-tool="' + id + '"]');
    if (previous) { previous._akFocus?.(); return null; }
    const el = (tag, text) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = String(text); return n; };
    const host = el('div'), oldFocus = document.activeElement, cleanups = [];
    host.dataset.akBmTool = id; host.setAttribute('data-ak-bookmarklet-overlay', '');
    host.style.cssText = 'all:initial!important;display:block!important;position:fixed!important;left:16px!important;top:24px!important;width:min(740px,calc(100vw - 32px))!important;z-index:2147483647!important';
    const shadow = host.attachShadow({mode:'open'}), style = el('style');
    style.textContent = `:host{all:initial}*{box-sizing:border-box}section{font:14px/1.5 system-ui,sans-serif;color:#243449;background:#fff;border:1px solid #a4b8cc;border-radius:10px;box-shadow:0 12px 45px #0003;max-height:calc(100vh - 48px);max-height:calc(100dvh - 48px);overflow:auto;color-scheme:light}header{display:flex;align-items:center;gap:8px;padding:10px 14px;background:#e9f1f9;cursor:move;touch-action:none;user-select:none}header h2{font:500 21px/1.2 Georgia,serif;margin:0;flex:1}main{padding:16px}h3{font-size:16px;margin:20px 0 8px}p{margin:8px 0}small,.note{font-size:12px;color:#526579}a{color:#245b88}button,input,select,textarea{font:inherit;color:inherit}button{display:inline-flex;align-items:center;gap:6px;border:1px solid #9fb1c4;border-radius:5px;padding:7px 10px;background:#fff;cursor:pointer}button:hover{background:#edf4fb}button.primary{background:#2d6594;border-color:#2d6594;color:#fff}button.primary:hover{background:#234f75;border-color:#234f75}button:disabled{opacity:.55;cursor:default}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,a:focus-visible,header:focus-visible{outline:3px solid #2d6594;outline-offset:2px}label{display:block;margin:10px 0 4px}input,select,textarea{padding:8px;border:1px solid #a9b8c9;border-radius:4px;background:#fff;max-width:100%}input:not([type=checkbox]),textarea{width:100%}textarea{min-height:150px;resize:vertical;line-height:1.6}input[type=checkbox]{margin-right:8px}label.check{display:flex;align-items:flex-start;gap:4px}label.check input{margin-top:5px;flex:none}.word-link{display:inline;padding:0;border:0;border-radius:2px;background:none;color:#245b88;text-decoration:none;text-align:left;overflow-wrap:anywhere}.word-link:hover,.word-link[aria-pressed=true]{background:#e1edf8;color:#153f65}.tools{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:12px 0}.cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}.scroll{overflow:auto;margin:10px 0}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;vertical-align:top;padding:8px;border-bottom:1px solid #d7e0e8;overflow-wrap:anywhere}th{background:#eef3f8}th:first-child{min-width:115px}th.status-cell,td.status-cell{min-width:125px;overflow-wrap:normal;word-break:normal;hyphens:none;white-space:normal}.page-checks td:nth-child(3){white-space:pre-line}.stats{font-weight:600;padding:10px;background:#edf4fb;border-radius:5px}.warn{color:#8a4700}.bad{color:#a52222}.good{color:#24603c}details{margin:12px 0;padding:8px;border:1px solid #d7e0e8;border-radius:5px}summary{cursor:pointer;font-weight:600}pre,.excerpt{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.6 ui-monospace,monospace;max-height:280px;overflow:auto}mark{background:#ffde9f;color:#442d00}.result{padding:10px 0;border-bottom:1px solid #d7e0e8}.result p{margin:4px 0}.serp{font:14px/1.5 Arial,sans-serif;border:1px solid #ccd7e1;border-radius:8px;padding:16px;margin:12px 0;max-width:100%;width:600px}.serp.mobile{width:360px}.serp .url{font-size:12px;color:#3c4043;overflow-wrap:anywhere}.serp .title{font-size:20px;line-height:1.3;color:#1a0dab;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:6px 0}.serp .description{color:#4d5156;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}.serp .site-identity{display:flex;align-items:center;gap:12px;margin-bottom:8px}.serp .site-info{min-width:0}.serp .site-name{font-size:14px;line-height:20px;color:#202124;overflow-wrap:break-word}.serp .favicon{display:grid;place-items:center;flex:none;width:28px;height:28px;border-radius:50%;background:#f1f3f4;color:#5f6368;font-size:24px}.serp .favicon img{display:block;width:100%;height:100%;object-fit:contain;border-radius:50%}.serp .product-thumbnail{width:90px;height:90px;object-fit:contain;float:right;margin:8px;border-radius:5px}.serp .rich{color:#3c4043;margin-top:7px}.credit{display:block;margin-top:16px;padding:10px 12px;border-top:1px solid #d7e0e8;font-size:12px;text-align:center}[hidden]{display:none!important}@media(max-width:520px){.cols{grid-template-columns:1fr}main{padding:12px}header h2{font-size:18px}}`;
    const panel = el('section'), bar = el('header'), heading = el('h2',title), main = el('main'), status = el('p');
    heading.id = 'ak-bm-title'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-labelledby',heading.id); panel.setAttribute('aria-modal','false');
    bar.tabIndex = 0; bar.title = 'Drag to move, or focus this heading and use arrow keys.'; bar.setAttribute('aria-label',title + '. Drag or use arrow keys to move.');
    status.setAttribute('role','status'); status.className = 'note';
    function button(label, action) { const b = el('button',label); b.type = 'button'; b.addEventListener('click',action); return b; }
    let closed = false;
    function close() { if (closed) return; closed = true; cleanups.forEach(fn=>fn()); host.remove(); oldFocus?.focus?.({preventScroll:true}); }
    const minimise = button('−',()=>{ main.hidden = !main.hidden; minimise.setAttribute('aria-expanded',String(!main.hidden)); minimise.textContent = main.hidden ? '+' : '−'; clamp(); });
    minimise.setAttribute('aria-label','Minimise or expand panel'); minimise.setAttribute('aria-expanded','true');
    const dismiss = button('×',close); dismiss.setAttribute('aria-label','Close ' + title);
    bar.append(heading,minimise,dismiss); panel.append(bar,main); main.append(status);
    const credit = el('a','Alexander Kyriakou’s bookmarklet collection'); credit.href = 'https://alexanderkyriakou.eu/ak/bookmarklets'; credit.target = '_blank'; credit.rel = 'noopener noreferrer'; credit.className = 'credit';
    panel.append(credit); shadow.append(style,panel); document.documentElement.append(host);
    let x = Math.max(16,innerWidth - host.getBoundingClientRect().width - 24), y = 24, drag = null;
    function clamp() { const r = host.getBoundingClientRect(); x = Math.max(8,Math.min(x,innerWidth-r.width-8)); y = Math.max(8,Math.min(y,innerHeight-r.height-8)); host.style.setProperty('left',x+'px','important'); host.style.setProperty('top',y+'px','important'); }
    bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.button!==0)return;drag={id:e.pointerId,x:e.clientX-x,y:e.clientY-y};bar.setPointerCapture(e.pointerId);e.preventDefault();});
    bar.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;x=e.clientX-drag.x;y=e.clientY-drag.y;clamp();});
    for (const name of ['pointerup','pointercancel','lostpointercapture']) bar.addEventListener(name,()=>{drag=null;});
    bar.addEventListener('keydown',e=>{if(e.target!==bar)return;const n=e.shiftKey?20:5;if(e.key==='ArrowLeft')x-=n;else if(e.key==='ArrowRight')x+=n;else if(e.key==='ArrowUp')y-=n;else if(e.key==='ArrowDown')y+=n;else return;e.preventDefault();clamp();});
    shadow.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}});
    window.addEventListener('resize',clamp); cleanups.push(()=>window.removeEventListener('resize',clamp));
    const observer = new ResizeObserver(clamp); observer.observe(panel); cleanups.push(()=>observer.disconnect());
    function field(label, node, parent=main) { const l=el('label',label); l.append(' ',node); parent.append(l); return node; }
    function select(options) { const s=el('select'); for(const[value,label]of options){const o=el('option',label);o.value=value;s.append(o);}return s; }
    function table(headers,rows,parent=main) {
      const wrap=el('div'),t=el('table'),head=el('thead'),tr=el('tr'),body=el('tbody');wrap.className='scroll';
      const isStatus=i=>/^(Result|Basic check)$/i.test(headers[i]||'');
      for(const [i,h]of headers.entries()){const th=el('th',h);th.scope='col';if(isStatus(i))th.className='status-cell';tr.append(th);}
      head.append(tr);
      for(const row of rows){const r=el('tr');for(const [i,value]of row.entries()){const td=el('td');if(value&&typeof value==='object'&&value.nodeType)td.append(value);else td.textContent=String(value??'');if(isStatus(i))td.className='status-cell';r.append(td);}body.append(r);}
      t.append(head,body);wrap.append(t);parent.append(wrap);return t;
    }
    function download(data,name,type='application/json') { const blob=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type:type+';charset=utf-8'}),url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;shadow.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); }
    async function copy(text) { try { await navigator.clipboard.writeText(text); } catch { const a=el('textarea');a.value=text;main.append(a);a.focus();a.select();status.textContent='Copy the selected report with Ctrl/Cmd+C.'; } }
    host._akFocus=()=>bar.focus({preventScroll:true}); clamp(); bar.focus({preventScroll:true});
    return {el,host,shadow,main,status,button,field,select,table,download,copy,cleanups,close,isClosed:()=>closed};
  }

  // Text is read from the live document: excluded or CSS-hidden subtrees do not
  // become visible just because a clone lost the original styles.
  function bmText(scope, selected='', withMap=false, bounds=[]) {
    if(scope==='selection'&&!withMap)return {text:selected,label:'Selected text (snapshot)',root:null};
    const root=scope==='selection'||scope==='page'?document.body:(document.querySelector('main article,article main,main,[role="main"],article')||document.body);
    const explicitSelection=scope==='selection';
    const excluded='script,style,noscript,template,form,button,input,textarea,select,[hidden],[inert],[aria-hidden="true"],[data-ak-bookmarklet-overlay]'+(explicitSelection?'':',nav,footer,aside');
    const spans=[];let length=0;
    const parts=[], block=/^(ADDRESS|ARTICLE|BLOCKQUOTE|DD|DIV|DL|DT|FIGCAPTION|FIGURE|H[1-6]|LI|MAIN|OL|P|PRE|SECTION|TABLE|TD|TH|TR|UL)$/;
    function add(value,node=null,offset=0){parts.push(value);if(withMap&&node&&value.length)spans.push({node,start:length,end:length+value.length,offset});length+=value.length;}
    function walk(n) {
      if(explicitSelection&&!bounds.some(r=>{try{return r.intersectsNode(n);}catch{return false;}}))return;
      if(n.nodeType===3){
        if(!explicitSelection){add(n.nodeValue,n);return;}
        const intervals=bounds.filter(r=>{try{return r.intersectsNode(n);}catch{return false;}}).map(r=>[r.startContainer===n?r.startOffset:0,r.endContainer===n?r.endOffset:n.nodeValue.length]).filter(([a,b])=>b>a).sort((a,b)=>a[0]-b[0]);
        const merged=[];for(const [a,b]of intervals){const last=merged.at(-1);if(last&&a<=last[1])last[1]=Math.max(last[1],b);else merged.push([a,b]);}
        for(const [i,[a,b]]of merged.entries()){if(i)add('\n\n');add(n.nodeValue.slice(a,b),n,a);}return;
      }
      if(n.nodeType!==1)return;
      const articleHeader=n.tagName==='HEADER'&&(explicitSelection||(root!==document.body&&Boolean(n.querySelector('h1,h2'))));
      if(n.matches(excluded)||(n.tagName==='HEADER'&&!articleHeader))return;
      const s=getComputedStyle(n);if(s.display==='none'||s.contentVisibility==='hidden'||s.opacity==='0')return;
      if(s.visibility==='hidden'||s.visibility==='collapse'){for(const c of n.children)walk(c);return;}
      if(n.tagName==='BR'){add('\n');return;}
      if(n.tagName==='DETAILS'&&!n.open){const summary=[...n.children].find(c=>c.tagName==='SUMMARY');if(summary)walk(summary);return;}
      if(block.test(n.tagName)||s.display==='block'||s.display==='flex'||s.display==='grid')add('\n');
      for(const c of n.childNodes)walk(c);
      if(block.test(n.tagName)||s.display==='block'||s.display==='flex'||s.display==='grid')add('\n');
    }
    // Article headings in main-content headers are retained; site chrome is not.
    if(root){
      let hidden=false;
      for(let a=root.parentElement;a;a=a.parentElement){const s=getComputedStyle(a);if(a.matches('[hidden],[inert],[aria-hidden="true"],[data-ak-bookmarklet-overlay]')||s.display==='none'||s.opacity==='0'||s.contentVisibility==='hidden'){hidden=true;break;}}
      if(!hidden)walk(root);
    }
    return {text:parts.join('').replace(/[\t\f\v ]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim(),label:explicitSelection?'Selected text (snapshot)':root===document.body?'Page text (navigation, forms and chrome excluded)':'Main content · '+root.tagName.toLowerCase(),root,...(withMap?{sourceText:parts.join(''),spans}:{})};
  }

  function bmWords(text,foldAccents=false) {
    const normalize=s=>{s=s.normalize('NFC').toLocaleLowerCase('el').replace(/ς/g,'σ');return foldAccents?s.normalize('NFD').replace(/\p{M}/gu,'').normalize('NFC'):s;};
    return (String(text).match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}]+)*/gu)||[]).map(normalize);
  }

  async function bmGreek(cfg={}) {
    const selection=window.getSelection()?.toString().trim()||'',initial=bmText(selection?'selection':'main',selection);
    const p=bmPanel('greek','Greek orthography');if(!p)return;
    const {el,main,button,field,status}=p;
    main.append(el('p','Review the text below. Checking sends this exact text to the displayed service, with language set to Greek. Greek spelling, punctuation and grammar coverage depends on the service; names and specialist terms may be flagged.'));
    const links=el('p');links.className='note';
    for(const[label,url]of [['LanguageTool','https://languagetool.org'],['Privacy','https://languagetool.org/legal/privacy'],['Public API limits','https://dev.languagetool.org/public-http-api']]){const a=el('a',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';links.append(a,' · ');}main.append(links);
    const scope=field('Extract from',p.select([['selection','Selected text at launch'],['main','Main content'],['page','Page text']]));scope.value=selection?'selection':'main';
    const area=field('Text to check · editable snapshot',el('textarea'));area.lang='el';area.spellcheck=true;area.value=initial.text;
    const count=el('p');count.className='note';main.append(count);
    const settings=el('details');settings.append(el('summary','API endpoint'));
    const endpoint=field('LanguageTool-compatible /v2/check URL',el('input'),settings);endpoint.type='url';endpoint.value=cfg.endpoint||'https://api.languagetool.org/v2/check';
    settings.append(el('p','Custom servers must support Greek and CORS. No API secret is stored in this bookmarklet. For paid credentials, use your own authenticated service rather than embedding a key in a bookmark URL.'));main.append(settings);
    const consent=el('input');consent.type='checkbox';const consentLabel=el('label');consentLabel.className='check';consentLabel.append(consent,'I agree to send the text above to '+endpoint.value+'.');main.append(consentLabel);
    const actions=el('div');actions.className='tools';const results=el('div');let controller=null,timer=null,generation=0,lastSent=0,resultData=null;
    function invalidate(){generation++;controller?.abort();controller=null;clearTimeout(timer);results.replaceChildren();resultData=null;downloadResults.hidden=true;consent.checked=false;send.disabled=false;status.textContent='Text or service changed. Review and approve this version before checking.';updateCount();}
    function updateCount(){count.textContent=bmWords(area.value).length+' words · '+new TextEncoder().encode(area.value).length.toLocaleString()+' UTF-8 bytes · maximum 20,000 bytes per manual check. Longer pages: select a passage or shorten this snapshot.';}
    const load=button('Extract again',()=>{area.value=bmText(scope.value,selection).text;invalidate();});
    const send=button('Send text & check Greek',async()=>{
      const text=area.value;let url;
      try{url=new URL(endpoint.value);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw new Error();}catch{status.textContent='Enter an HTTPS API endpoint without credentials, query parameters or a fragment.';return;}
      if(!consent.checked){status.textContent='Approve sending this text to the displayed service first.';return;}
      if(!text.trim()){status.textContent='No text to check.';return;}
      if(new TextEncoder().encode(text).length>20000){status.textContent='This snapshot exceeds 20,000 UTF-8 bytes. Select a smaller passage or edit it. Nothing was sent.';return;}
      if(!/\p{Script=Greek}/u.test(text)){status.textContent='No Greek characters found. Edit the text or extract a Greek passage.';return;}
      if(Date.now()-lastSent<10000){status.textContent='Wait at least 10 seconds between manual checks. There are no automatic retries or batches.';return;}
      lastSent=Date.now();const version=++generation;controller=new AbortController();timer=setTimeout(()=>controller?.abort(),30000);send.disabled=true;status.textContent='Checking Greek…';results.replaceChildren();resultData=null;downloadResults.hidden=true;
      try{
        const response=await fetch(url.href,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,body:new URLSearchParams({text,language:'el'})});
        if(!response.ok)throw new Error(response.status===429?'Service rate limit reached. Wait before a new manual check.':'API returned HTTP '+response.status+'.');
        const data=await response.json();if(!Array.isArray(data.matches))throw new Error('The API did not return LanguageTool matches.');
        if(version!==generation||p.isClosed())return;
        const matches=data.matches.filter(m=>Number.isInteger(m.offset)&&Number.isInteger(m.length)&&m.offset>=0&&m.length>=0&&m.offset+m.length<=text.length);
        status.textContent=matches.length+' possible issues returned. '+(data.warnings?.incompleteResults?'The service reports incomplete results. ':'')+'No findings does not establish that the text is error-free.';
        resultData={url:location.href,language:'el',endpoint:url.href,text,matches,warnings:data.warnings||{},checkedAt:new Date().toISOString()};
        downloadResults.hidden=false;
        for(const m of matches){const row=el('div');row.className='result';row.append(el('strong',m.message||'Possible issue'),el('p',(m.rule?.issueType||m.rule?.category?.name||'Review')+' · '+(m.rule?.id||'')+' · position '+m.offset));const excerpt=el('p'),start=Math.max(0,m.offset-65),end=Math.min(text.length,m.offset+m.length+65);excerpt.className='excerpt';excerpt.lang='el';excerpt.append((start?'…':'')+text.slice(start,m.offset),el('mark',text.slice(m.offset,m.offset+m.length)||'∣'),text.slice(m.offset+m.length,end)+(end<text.length?'…':''));row.append(excerpt,el('p','Suggestions: '+((m.replacements||[]).slice(0,8).map(r=>r.value).join(' · ')||'None returned.')));results.append(row);}
      }catch(e){if(version===generation&&!p.isClosed())status.textContent=e.name==='AbortError'?'Request timed out or was cancelled. No automatic retry.':e.message+' The site may block the API through CSP, or the server may not permit CORS.';}
      finally{if(version===generation){clearTimeout(timer);send.disabled=false;controller=null;}}
    });
    send.className='primary';
    const downloadResults=button('Download results',()=>{if(resultData)p.download(resultData,'greek-orthography.json');});downloadResults.hidden=true;
    actions.append(load,send,downloadResults);main.append(actions,results);
    area.addEventListener('input',invalidate);scope.addEventListener('change',()=>{area.value=bmText(scope.value,selection).text;invalidate();});endpoint.addEventListener('input',()=>{consentLabel.lastChild.textContent='I agree to send the text above to '+endpoint.value+'.';invalidate();});
    p.cleanups.push(()=>{generation++;controller?.abort();clearTimeout(timer);});updateCount();status.textContent=initial.label+' · no text has been sent.';
  }

  function bmKeywordStats(text,keyword,fold=false) {
    const words=bmWords(text,fold),phrase=bmWords(keyword,fold),counts=new Map(),positions=[],tokens=[...text.matchAll(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}]+)*/gu)];
    for(const w of words)counts.set(w,(counts.get(w)||0)+1);
    if(phrase.length)for(let i=0;i<=words.length-phrase.length;i++){if(!phrase.every((w,j)=>w===words[i+j]))continue;let contiguous=true;for(let j=1;j<phrase.length;j++){const previous=tokens[i+j-1],next=tokens[i+j],gap=text.slice(previous.index+previous[0].length,next.index);if(!/^[ \t\n\r]+$/.test(gap)||/\n\s*\n/.test(gap)){contiguous=false;break;}}if(contiguous)positions.push(i);}
    const coverage=new Set();for(const i of positions)for(let j=0;j<phrase.length;j++)coverage.add(i+j);
    const repeated=[];for(let i=1;i<words.length;i++)if(words[i]===words[i-1])repeated.push(words[i]);
    const grams=n=>{const map=new Map();for(const line of text.split(/\n|[.!?;··]+/u)){const a=bmWords(line,fold);for(let i=0;i<=a.length-n;i++){const k=a.slice(i,i+n).join(' ');map.set(k,(map.get(k)||0)+1);}}return [...map].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,15);};
    const paragraphs=text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
    const duplicateMap=new Map();for(const s of paragraphs){const a=bmWords(s,fold);if(a.length>=8){const key=a.join(' ');const item=duplicateMap.get(key)||{text:s,count:0};item.count++;duplicateMap.set(key,item);}}
    let localMax=0,left=0,right=0;const windowSize=Math.min(100,words.length);for(let start=0;start<=words.length-windowSize&&windowSize;start++){const end=start+windowSize;while(left<positions.length&&positions[left]<start)left++;right=Math.max(right,left);while(right<positions.length&&positions[right]+phrase.length<=end)right++;localMax=Math.max(localMax,right-left);}
    return {wordCount:words.length,uniqueWords:counts.size,phraseWords:phrase.length,occurrences:positions.length,occurrencesPer100:words.length?positions.length/words.length*100:0,coveragePercent:words.length?coverage.size/words.length*100:0,localMax,consecutiveRepeats:repeated,topWords:[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])),bigrams:grams(2),trigrams:grams(3),duplicateParagraphs:[...duplicateMap.values()].filter(x=>x.count>1)};
  }

  function bmKeywords() {
    const initialSelection=window.getSelection(),selection=initialSelection?.toString().trim()||'',selectionRanges=[];
    if(initialSelection)for(let i=0;i<initialSelection.rangeCount;i++)selectionRanges.push(initialSelection.getRangeAt(i).cloneRange());
    const p=bmPanel('keywords','Keyword repetition review');if(!p)return;
    const {el,main,button,field,status}=p;
    main.append(el('p','Review signals, not an SEO verdict. There is no universal safe keyword density. Product names, specifications, menus and stopwords can repeat naturally. Counts use Unicode word tokens, case-insensitively; target phrase words must be separated by whitespace within one paragraph. No stemming or synonym expansion.'));
    const scope=field('Text scope',p.select([['main','Main content'],['page','Page text without navigation/forms'],['selection','Selected text at launch']]));scope.value=selection?'selection':'main';
    const keyword=field('Target word or phrase · optional',el('input'));keyword.placeholder='e.g. δερμάτινα παπούτσια';
    const fold=el('input');fold.type='checkbox';const foldLabel=el('label');foldLabel.className='check';foldLabel.append(fold,'Ignore Greek tonos/other accents when comparing words.');main.append(foldLabel);
    const options=el('details');options.append(el('summary','Review thresholds (your heuristics, not Google rules)'));
    const density=field('Flag target occurrences per 100 words above',el('input'),options);density.type='number';density.min='0';density.step='0.5';density.value='3';
    const cluster=field('Flag target occurrences in any 100-word window at or above',el('input'),options);cluster.type='number';cluster.min='2';cluster.step='1';cluster.value='5';main.append(options);
    const actions=el('div');actions.className='tools';const output=el('div');let report=null,debounce;
    actions.append(button('Refresh analysis',analyse),button('Download report',()=>{if(report)p.download(report,'keyword-review.json');}));main.append(actions,output);
    // Store only page highlight data, so closing/reopening the panel preserves it
    // without retaining the panel or its event handlers. Navigation discards it.
    const highlightTools=el('div'),highlightStatus=el('p');highlightTools.className='tools';highlightStatus.className='note';highlightStatus.setAttribute('role','status');
    const persistenceKey=Symbol.for('alexanderkyriakou.bookmarklets.keywordHighlights'),savedHighlights=window[persistenceKey];
    let mappedText=null,ranges=savedHighlights?.ranges||[],current=savedHighlights?.current??-1,activeTerm=savedHighlights?.activeTerm||'',styleNode=savedHighlights?.styleNode||null,wordButtons=[],fallbackOwned=savedHighlights?.fallbackOwned||null,fallbackSaved=savedHighlights?.fallbackSaved||[];
    const highlightID=savedHighlights?.highlightID||'ak-keyword-'+Math.random().toString(36).slice(2),activeID=highlightID+'-active';
    let custom=Boolean(window.CSS?.highlights&&typeof window.Highlight==='function'&&window.CSS.supports?.('selector(::highlight(ak-keyword-test))')&&(savedHighlights?.custom??true));
    function saveHighlights(){
      if(ranges.length)window[persistenceKey]={ranges,current,activeTerm,styleNode,highlightID,custom,fallbackOwned,fallbackSaved};
      else delete window[persistenceKey];
    }
    function updateHighlightControls(){previous.disabled=next.disabled=clear.disabled=!ranges.length;}
    function describeHighlights(){highlightStatus.textContent=ranges.length?'“'+activeTerm+'” · match '+(current+1)+' of '+ranges.length+(custom?' · bright yellow highlights remain when this panel closes; current match underlined.':' · showing one selected match at a time (highlight styling unavailable).'):'Click a word or phrase below to highlight its occurrences on the page.';}
    function sameRange(a,b){return a&&b&&a.startContainer===b.startContainer&&a.startOffset===b.startOffset&&a.endContainer===b.endContainer&&a.endOffset===b.endOffset;}
    function releaseSelection(){
      if(fallbackOwned){const sel=window.getSelection();if(sel?.rangeCount===1&&sameRange(sel.getRangeAt(0),fallbackOwned)){sel.removeAllRanges();for(const r of fallbackSaved){try{sel.addRange(r);}catch{}}}}
      fallbackOwned=null;fallbackSaved=[];
    }
    function clearHighlights(message=true){
      window.CSS?.highlights?.delete(highlightID);window.CSS?.highlights?.delete(activeID);styleNode?.remove();styleNode=null;releaseSelection();
      ranges=[];current=-1;activeTerm='';updateHighlightControls();saveHighlights();for(const b of wordButtons)b.setAttribute('aria-pressed','false');
      if(message)highlightStatus.textContent='Click a word or phrase below to highlight its occurrences on the page.';
    }
    function paint(){
      if(!custom)return;
      if(!styleNode){styleNode=el('style');styleNode.setAttribute('data-ak-keyword-highlight','');styleNode.textContent='::highlight('+highlightID+'){background-color:#ffff00;color:#000000}::highlight('+activeID+'){background-color:#ffff00;color:#000000;text-decoration:underline}';(document.head||document.documentElement).append(styleNode);if(!styleNode.sheet){styleNode.remove();styleNode=null;custom=false;return;}}
      const all=new window.Highlight();for(const r of ranges)all.add(r);all.priority=0;window.CSS.highlights.set(highlightID,all);
      const active=new window.Highlight(ranges[current]);active.priority=1;window.CSS.highlights.set(activeID,active);
    }
    function visit(delta=0){
      if(!ranges.length)return;
      current=(current+delta+ranges.length)%ranges.length;const r=ranges[current];
      if(!r.startContainer.isConnected||!r.endContainer.isConnected){mappedText=null;highlight(activeTerm);return;}
      paint();
      if(!custom){const sel=window.getSelection();if(sel){if(!fallbackOwned){fallbackSaved=[];for(let i=0;i<sel.rangeCount;i++)fallbackSaved.push(sel.getRangeAt(i).cloneRange());}sel.removeAllRanges();sel.addRange(r);fallbackOwned=r.cloneRange();}}
      r.startContainer.parentElement?.scrollIntoView?.({block:'center',inline:'nearest',behavior:'instant'});
      const rect=r.getBoundingClientRect();if(rect.height)window.scrollBy({top:rect.top-innerHeight*0.42,left:0,behavior:'instant'});
      saveHighlights();describeHighlights();
    }
    function highlight(term){
      const chosenTerm=term.trim();if(!chosenTerm||!bmWords(chosenTerm,fold.checked).length){highlightStatus.textContent='Enter a target word or phrase, or click one in the tables.';return;}
      clearHighlights(false);activeTerm=chosenTerm;
      if(pageChanges?.takeRecords().length)mappedText=null;
      if(!mappedText)mappedText=bmText(scope.value,selection,true,selectionRanges);
      const raw=mappedText.sourceText||'',spans=mappedText.spans||[],tokens=[...raw.matchAll(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’][\p{L}\p{M}]+)*/gu)],words=bmWords(raw,fold.checked),phrase=bmWords(activeTerm,fold.checked);
      if(!phrase.length){highlightStatus.textContent='Choose a word or phrase containing letters or numbers.';return;}
      let spanIndex=0;
      for(let i=0;i<=words.length-phrase.length;i++){
        if(!phrase.every((word,j)=>words[i+j]===word))continue;
        let contiguous=true;for(let j=1;j<phrase.length;j++){const before=tokens[i+j-1],after=tokens[i+j],gap=raw.slice(before.index+before[0].length,after.index);if(!/^[ \t\n\r]+$/.test(gap)||/\n\s*\n/.test(gap)){contiguous=false;break;}}if(!contiguous)continue;
        const start=tokens[i].index,last=tokens[i+phrase.length-1],end=last.index+last[0].length;
        while(spanIndex<spans.length&&spans[spanIndex].end<=start)spanIndex++;
        const first=spans[spanIndex];let endIndex=spanIndex;while(endIndex<spans.length&&spans[endIndex].end<end)endIndex++;const final=spans[endIndex];
        if(!first||!final||first.start>start||final.start>=end)continue;
        const range=document.createRange();range.setStart(first.node,first.offset+start-first.start);range.setEnd(final.node,final.offset+end-final.start);ranges.push(range);
      }
      if(!ranges.length){highlightStatus.textContent='No current page matches for “'+activeTerm+'” in this scope. Refresh the analysis if page content changed.';return;}
      previous.disabled=next.disabled=clear.disabled=false;current=0;for(const b of wordButtons)b.setAttribute('aria-pressed',String(b._akTerm===term));visit();
    }
    const previous=button('Previous match',()=>visit(-1)),next=button('Next match',()=>visit(1)),clear=button('Clear highlights',()=>clearHighlights());
    highlightTools.append(button('Highlight target',()=>highlight(keyword.value)),previous,next,clear);main.insertBefore(highlightTools,output);main.insertBefore(highlightStatus,output);updateHighlightControls();describeHighlights();
    function wordLink(term,label){const b=button(label,()=>highlight(term));b.className='word-link';b._akTerm=term;b.setAttribute('aria-label','Highlight '+label+' on the page');b.setAttribute('aria-pressed',String(bmWords(term,fold.checked).join(' ')===bmWords(activeTerm,fold.checked).join(' ')));wordButtons.push(b);return b;}
    const pageChanges=typeof MutationObserver==='function'&&document.body?new MutationObserver(()=>{mappedText=null;}):null;
    pageChanges?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','style','hidden','aria-hidden','open']});
    p.cleanups.push(()=>{pageChanges?.disconnect();saveHighlights();mappedText=null;});
    function analyse(){
      mappedText=null;wordButtons=[];
      if(!Number.isFinite(Number(density.value))||density.value.trim()===''||Number(density.value)<0||!Number.isInteger(Number(cluster.value))||Number(cluster.value)<2){status.textContent='Use a non-negative density threshold and a whole-number cluster threshold of at least 2.';return;}
      const sample=bmText(scope.value,selection),stats=bmKeywordStats(sample.text,keyword.value,fold.checked),n=stats.wordCount;
      report={url:location.href,scope:sample.label,keyword:keyword.value,foldAccents:fold.checked,thresholds:{occurrencesPer100:Number(density.value),windowCount:Number(cluster.value)},...stats,analysedAt:new Date().toISOString()};
      output.replaceChildren();status.textContent=sample.label+' · refresh after page content changes. Cross-origin frames, shadow trees and unloaded content are excluded.';
      const summary=el('p',n.toLocaleString()+' words · '+stats.uniqueWords.toLocaleString()+' unique tokens');summary.className='stats';output.append(summary);
      const signals=[];
      if(n<100)signals.push('Short sample: percentages and local clusters are especially unstable.');
      if(stats.phraseWords){p.table(['Target metric','Value'],[['Exact phrase occurrences',stats.occurrences+' (overlapping matches included)'],['Occurrences / total words × 100',stats.occurrencesPer100.toFixed(2)+'%'],['Words covered by the target / total words',stats.coveragePercent.toFixed(2)+'% (overlap counted once)'],['Most occurrences in a '+Math.min(n,100)+'-word window',stats.localMax]],output);if(stats.occurrences>=3&&stats.occurrencesPer100>Number(density.value))signals.push('Target repetition exceeds your density threshold. Read the copy for unnatural phrasing.');if(stats.localMax>=Number(cluster.value))signals.push('The target is clustered within a short passage. Review that passage in context.');}
      if(stats.consecutiveRepeats.length)signals.push(stats.consecutiveRepeats.length+' consecutive repeated-token pairs. Check for accidental repetition.');
      if(stats.duplicateParagraphs.length)signals.push(stats.duplicateParagraphs.length+' duplicated paragraphs of at least eight words.');
      output.append(el('h3','Review signals'));for(const s of signals.length?signals:['No selected heuristic triggered. This does not rule out keyword stuffing.'])output.append(el('p',s));
      const stop=new Set(bmWords('the a an and or of to in on for is are with this that it as by from be at your you we our και το η ο τα τη την τον των του της σε με για από στο στη στην στον στα στις στους ένα μια ένας είναι που ως να δεν θα αν ότι μας σας τους τις',true));
      const displayToken=s=>s.replace(/σ(?=$|[ ’'])/gu,'ς');
      const rows=stats.topWords.filter(([word])=>!stop.has(bmWords(word,true)[0])&&word.length>1).slice(0,25).map(([word,count])=>[displayToken(word),count,n?(count/n*100).toFixed(2)+'%':'0%']);
      output.append(el('h3','Most frequent words'));output.append(el('p','Click a word or phrase to highlight it on the page. Common Greek/English stopwords are hidden here only. Totals and target counts include every word. Inflected forms remain separate.'));p.table(['Word','Count','Share of all words'],rows.map(([word,...values])=>[wordLink(word,word),...values]),output);
      for(const[label,data]of [['Repeated two-word phrases',stats.bigrams],['Repeated three-word phrases',stats.trigrams]]){output.append(el('h3',label));p.table(['Phrase','Occurrences'],data.map(([phrase,n])=>[wordLink(phrase,displayToken(phrase)),n]),output);}
      if(stats.duplicateParagraphs.length){const d=el('details');d.append(el('summary','Duplicated paragraph excerpts'));for(const item of stats.duplicateParagraphs)d.append(el('p',item.count+' × '+item.text.slice(0,300)));output.append(d);}
      const preview=el('details');preview.append(el('summary','Text included in these counts'));preview.append(el('pre',sample.text));output.append(preview);
    }
    for(const input of [keyword,scope,fold,density,cluster])input.addEventListener('input',()=>{mappedText=null;clearTimeout(debounce);debounce=setTimeout(analyse,220);});
    p.cleanups.push(()=>clearTimeout(debounce));analyse();
  }

  function bmSchema() {
    const nodes=[],errors=[],types=new Set(),byID=new Map();
    const key=id=>{try{return new URL(id,document.baseURI).href;}catch{return String(id);}};
    const term=s=>String(s).replace(/^https?:\/\/schema\.org\//i,'').replace(/^schema:/,'');
    function visit(value){if(Array.isArray(value)){value.forEach(visit);return;}if(!value||typeof value!=='object')return;nodes.push(value);for(const type of [].concat(value['@type']||[]))types.add(term(type));if(typeof value['@id']==='string'){const id=key(value['@id']);byID.set(id,{...(byID.get(id)||{}),...value});}for(const child of Object.values(value))if(child&&typeof child==='object')visit(child);}
    const scripts=[...document.querySelectorAll('script')].filter(s=>(s.type||'').trim().toLowerCase()==='application/ld+json');
    scripts.forEach((s,i)=>{try{visit(JSON.parse(s.textContent));}catch(e){errors.push('JSON-LD block '+(i+1)+': '+e.message);}});
    const resolve=v=>v&&typeof v==='object'&&!Array.isArray(v)&&typeof v['@id']==='string'?{...(byID.get(key(v['@id']))||{}),...v}:v;
    const hasType=(v,name)=>[].concat(resolve(v)?.['@type']||[]).some(x=>term(x)===name);
    const seen=new Set(),products=[];
    for(const n of nodes){const v=resolve(n);if(!hasType(v,'Product'))continue;const id=v['@id']?key(v['@id']):n;if(seen.has(id))continue;seen.add(id);products.push(v);}
    return {scripts:scripts.length,nodes,errors,types:[...types],products,resolve,hasType};
  }

  function bmSchema() {
    const nodes=[],errors=[],blocks=[],findings=[],byID=new Map(),definitions=new Map(),origins=new WeakMap(),nodePaths=new WeakMap(),nodeContexts=new WeakMap();
    const schemaURL=/^https?:\/\/schema\.org\//i;
    function key(id){if(id.startsWith('_:'))return id;try{return new URL(id,document.baseURI).href;}catch{return id;}}
    const term=value=>String(value).replace(schemaURL,'').replace(/^schema:/,'');
    function merge(a,b){const value=Object.assign(Object.create(null),a,b);if(a['@type']!==undefined&&b['@type']!==undefined)value['@type']=[...new Set([].concat(a['@type'],b['@type']))];return value;}
    const typeList=n=>[].concat(n?.['@type']||[]).filter(v=>typeof v==='string'&&v.trim()).map(term);
    const meaningful=n=>Object.keys(n).some(k=>!['@context','@id','@graph','@included','@index'].includes(k));
    const finding=(block,path,state,message)=>findings.push({block,path,state,message});
    function checkContext(value,block,path){
      if(value===null||typeof value==='string')return;
      if(Array.isArray(value)){value.forEach((v,i)=>checkContext(v,block,path+'['+i+']'));return;}
      if(value&&typeof value==='object')return;
      finding(block,path,'Review','@context must be a string, object, array or null.');
    }
    function visit(value,block,path,contextSeen=false,level=0){
      if(level>150){finding(block,path,'Review','Nested data exceeds this checker’s depth limit.');return;}
      if(Array.isArray(value)){value.forEach((v,i)=>visit(v,block,path+'['+i+']',contextSeen,level+1));return;}
      if(!value||typeof value!=='object')return;
      const hasContext=Object.prototype.hasOwnProperty.call(value,'@context'),context=contextSeen||hasContext;
      if(hasContext)checkContext(value['@context'],block,path+'.@context');
      for(const name of ['@graph','@included'])if(name in value){const v=value[name],items=Array.isArray(v)?v:[v];if(items.some(n=>!n||typeof n!=='object'||Array.isArray(n)))finding(block,path+'.'+name,'Review',name+' should contain node objects.');}
      if('@value' in value)return; // A value object is not an entity.
      if('@list' in value||'@set' in value){for(const name of ['@list','@set'])if(name in value)visit(value[name],block,path+'.'+name,context,level+1);return;}
      const wrapper=Object.keys(value).every(k=>['@context','@graph','@included','@index'].includes(k));
      if(!wrapper){
        nodes.push(value);origins.set(value,block);nodePaths.set(value,path);nodeContexts.set(value,context);
        if('@type' in value){const ts=Array.isArray(value['@type'])?value['@type']:[value['@type']];if(!ts.length||ts.some(t=>typeof t!=='string'||!t.trim()))finding(block,path+'.@type','Review','Expected a non-empty type string or array of type strings.');}
        if('@id' in value&&typeof value['@id']!=='string')finding(block,path+'.@id','Review','Expected @id to be a string.');
        if(typeof value['@id']==='string'){
          const id=key(value['@id']),previous=byID.get(id)||{};
          byID.set(id,merge(previous,value));
          if(meaningful(value)){const ds=definitions.get(id)||[];ds.push({block,path,node:value});definitions.set(id,ds);}
        }
      }
      for(const [name,child]of Object.entries(value)){
        if(name==='@context'||name==='@value')continue;
        if(name==='@reverse'&&child&&typeof child==='object'){for(const [property,v]of Object.entries(child))visit(v,block,path+'.@reverse.'+property,context,level+1);continue;}
        if(child&&typeof child==='object')visit(child,block,path+'.'+name,context,level+1);
      }
    }
    const scripts=[...document.querySelectorAll('script')].filter(s=>(s.type||'').trim().toLowerCase()==='application/ld+json');
    scripts.forEach((s,i)=>{
      const block={block:i+1,raw:s.textContent,parsed:null,parseOK:false,topLevel:'',entityCount:0,types:[]};blocks.push(block);
      try{
        block.parsed=JSON.parse(s.textContent);block.parseOK=true;block.topLevel=Array.isArray(block.parsed)?'Array':block.parsed===null?'null':typeof block.parsed;
        const data=block.parsed;
        if(!data||typeof data!=='object'){finding(i+1,'$','Review','JSON parses, but JSON-LD needs an object or array of node objects.');return;}
        if(Array.isArray(data)&&data.some(v=>!v||typeof v!=='object'||Array.isArray(v)))finding(i+1,'$','Review','Top-level array contains a value that is not a node object.');
        visit(data,i+1,'$');
      }catch(e){const message='JSON-LD block '+(i+1)+': '+e.message;errors.push(message);finding(i+1,'$','Issue',message);}
    });
    for(const n of nodes){
      if(!Object.prototype.hasOwnProperty.call(n,'@id')||typeof n['@id']!=='string'||meaningful(n))continue;
      const id=key(n['@id']);
      if((n['@id'].startsWith('#')||n['@id'].startsWith('_:'))&&!definitions.has(id))finding(origins.get(n),nodePaths.get(n),'Review','No definition for this local @id was found in the parsed JSON-LD: '+n['@id']+'. It may be intentional.');
    }
    for(const b of blocks){const ns=nodes.filter(n=>origins.get(n)===b.block);b.entityCount=ns.filter(meaningful).length;b.types=[...new Set(ns.flatMap(typeList))];if(b.parseOK&&ns.some(n=>!nodeContexts.get(n)&&([].concat(n['@type']||[]).some(t=>typeof t==='string'&&!/^[a-z][a-z0-9+.-]*:/i.test(t))||Object.keys(n).some(k=>!k.startsWith('@')&&!/^[a-z][a-z0-9+.-]*:/i.test(k)))))finding(b.block,'$','Review','Some objects use unexpanded terms without an @context in this block or their ancestors. Check the vocabulary/context; this checker does not expand contexts.');}
    const resolve=v=>v&&typeof v==='object'&&!Array.isArray(v)&&typeof v['@id']==='string'?merge(byID.get(key(v['@id']))||{},v):v;
    const hasType=(v,name)=>typeList(resolve(v)).includes(name);
    const seen=new Set(),products=[],entities=[];
    for(const n of nodes){
      if(!meaningful(n))continue;
      const identity=typeof n['@id']==='string'?key(n['@id']):n;if(seen.has(identity))continue;seen.add(identity);
      const value=resolve(n);entities.push({types:typeList(value),id:typeof value['@id']==='string'?value['@id']:'',name:typeof value.name==='string'?value.name:typeof value.headline==='string'?value.headline:'',block:origins.get(n),path:nodePaths.get(n),properties:Object.keys(value).filter(k=>!k.startsWith('@')),value});
      if(hasType(value,'Product'))products.push(value);
    }
    const label=n=>n.tagName.toLowerCase()+(n.id?'#'+n.id:'');
    function markup(selector,typeAttr,idAttr,propertySelector){
      return [...document.querySelectorAll(selector)].filter(n=>!n.closest('[data-ak-bookmarklet-overlay]')).map((n,i)=>({item:i+1,types:(n.getAttribute(typeAttr)||'').trim().split(/\s+/).filter(Boolean).map(term),id:n.getAttribute(idAttr)||'',element:label(n),properties:[...new Set([...n.querySelectorAll(propertySelector)].flatMap(p=>(p.getAttribute(propertySelector==='[itemprop]'?'itemprop':'property')||'').split(/\s+/)).filter(Boolean))],html:n.outerHTML}));
    }
    const microdata=markup('[itemscope]','itemtype','itemid','[itemprop]'),rdfa=markup('[typeof]','typeof','resource','[property]');
    const inventory=new Map();
    function count(type,format){const row=inventory.get(type)||{type,jsonLD:0,microdata:0,rdfa:0};row[format]++;inventory.set(type,row);}
    for(const e of entities)for(const t of e.types)count(t,'jsonLD');
    for(const e of microdata)for(const t of e.types)count(t,'microdata');
    for(const e of rdfa)for(const t of e.types)count(t,'rdfa');
    const splitDefinitions=[...definitions].filter(([,ds])=>ds.length>1).map(([id,ds])=>({id,definitions:ds.map(d=>({block:d.block,path:d.path}))}));
    const types=[...new Set(nodes.flatMap(typeList))];
    return {scripts:scripts.length,nodes,errors,types,products,resolve,hasType,blocks,entities,microdata,rdfa,findings,inventory:[...inventory.values()].sort((a,b)=>a.type.localeCompare(b.type)),splitDefinitions};
  }
  function bmProduct() {
    const p=bmPanel('product','Page SEO snapshot');if(!p)return;
    const {el,main,button,status}=p;let latest=null,currentProduct=null,controller=null,timeout=null,auditVersion=0;
    main.append(el('p','A snapshot of the rendered page, not a crawl or a full validator. Indexing, Google-selected canonical, robots.txt access, rich-result eligibility and server-rendered HTML require external verification.'));
    const tools=el('div');tools.className='tools';
    tools.append(button('Refresh audit',audit),button('Download audit',()=>{if(latest)p.download(latest,'page-seo-snapshot.json');}));
    for(const[label,url]of [['Rich Results Test','https://search.google.com/test/rich-results?url='],['Schema Validator','https://validator.schema.org/#url=']]){const a=el('a',label);a.href=url+encodeURIComponent(location.href);a.target='_blank';a.rel='noopener noreferrer';tools.append(a);}main.append(tools);
    const output=el('div'),headersBox=el('details');headersBox.append(el('summary','Optional: fetch fresh response headers'));
    headersBox.append(el('p','Sends one same-origin HEAD request, using your current session. HEAD responses can differ from GET and Googlebot responses. These are not the original navigation headers. HTTP status, X-Robots-Tag and HTTP Link canonicals are shown separately.'));
    const headerStatus=el('p');headerStatus.setAttribute('role','status');const headerOutput=el('div');
    const headerButton=button('Fetch response headers',async()=>{
      if(!/^https?:$/.test(location.protocol)){headerStatus.textContent='Only HTTP(S) pages can be checked.';return;}
      const version=auditVersion,requestController=new AbortController();controller=requestController;headerButton.disabled=true;timeout=setTimeout(()=>requestController.abort(),10000);headerStatus.textContent='Fetching HEAD response…';headerOutput.replaceChildren();
      try{
        const requestedURL=location.href,r=await fetch(requestedURL,{method:'HEAD',credentials:'same-origin',cache:'no-store',signal:requestController.signal});if(p.isClosed()||version!==auditVersion)return;
        const x=r.headers.get('x-robots-tag')||'',link=r.headers.get('link')||'';
        const info={method:'HEAD',requestedURL,url:r.url,status:r.status,redirected:r.redirected,xRobotsTag:x,link,checkedAt:new Date().toISOString()};if(latest)latest.responseHeaders=info;
        headerStatus.textContent=r.status===405||r.status===501?'HEAD is not supported. Check the document GET response in browser developer tools.':'Fresh HEAD response only. Inspect agent-scoped X-Robots-Tag rules below; no index-status claim is made.';
        p.table(['Header / response','Value'],[['HTTP status',r.status],['Final URL',r.url],['Redirect followed',r.redirected?'Yes':'No'],['X-Robots-Tag',x||'Not present on this HEAD response'],['Link',link||'Not present on this HEAD response']],headerOutput);
      }catch(e){if(!p.isClosed()&&version===auditVersion)headerStatus.textContent=e.name==='AbortError'?'Request timed out or was cancelled.':'Unable to read headers: '+e.message+'. Check the original document response in developer tools.';}
      finally{if(version===auditVersion){clearTimeout(timeout);controller=null;headerButton.disabled=false;}}
    });headersBox.append(headerButton,headerStatus,headerOutput);main.append(output,headersBox);
    function safeURL(value){if(typeof value!=='string'||!value.trim())return '';try{const u=new URL(value,document.baseURI);return /^https?:$/.test(u.protocol)?u.href:'';}catch{return '';}}
    function scalar(value){if(value===null||value===undefined)return '';if(typeof value==='string'||typeof value==='number'||typeof value==='boolean')return String(value);return value?.['@value']!==undefined?String(value['@value']):'';}
    function audit(){
      auditVersion++;controller?.abort();controller=null;clearTimeout(timeout);headerButton.disabled=false;
      output.replaceChildren();headerOutput.replaceChildren();headerStatus.textContent='Not requested for this audit.';
      const metas=[...document.querySelectorAll('meta')],titles=[...document.querySelectorAll('head title')],meta=name=>metas.filter(m=>(m.getAttribute('name')||m.getAttribute('property')||'').toLowerCase()===name.toLowerCase()),value=name=>meta(name).map(m=>m.content).filter(Boolean).join(' | '),title=document.title.trim(),description=value('description');
      const canonicalNodes=[...document.querySelectorAll('link[rel]')].filter(n=>n.rel.toLowerCase().split(/\s+/).includes('canonical'));
      const canonicals=canonicalNodes.map(n=>({raw:n.getAttribute('href')||'',resolved:safeURL(n.getAttribute('href')),inHead:Boolean(n.closest('head'))}));
      const robots=metas.filter(m=>/^(robots|googlebot|googlebot-news|bingbot)$/i.test(m.name)).map(m=>({agent:m.name.toLowerCase(),content:m.content,inHead:Boolean(m.closest('head'))}));
      const blocking=robots.filter(m=>['robots','googlebot'].includes(m.agent)&&/(?:^|[\s,])(noindex|none)(?=$|[\s,])/i.test(m.content));
      const h1=[...document.querySelectorAll('h1')].filter(n=>!n.closest('[data-ak-bookmarklet-overlay]')).map(n=>(n.innerText||n.textContent||'').trim());
      const sample=bmText('main'),images=[...document.images].filter(n=>!n.closest('[data-ak-bookmarklet-overlay]')),missingAlt=images.filter(i=>!i.hasAttribute('alt')).length;
      const schema=bmSchema(),checks=[];
      const check=(name,state,detail)=>checks.push({name,state,detail});
      check('Title',!title?'Issue':titles.length!==1?'Review':'Observed',title?title+' · '+Array.from(title).length+' characters · '+titles.length+' title elements':'Missing or empty.');
      check('Meta description',!description?'Review':meta('description').length>1?'Review':'Observed',description?description+' · '+Array.from(description).length+' characters · '+meta('description').length+' tags':'Not found. Search engines may generate snippets from page content.');
      check('Canonical',canonicals.length!==1?'Review':!canonicals[0].resolved||!canonicals[0].inHead?'Issue':'Observed',!canonicals.length?'No HTML canonical found.':canonicals.map(c=>(c.raw||'(empty href)')+' → '+(c.resolved||'invalid HTTP(S) URL')+(c.inHead?'':' · outside head')).join('\n'));
      if(canonicals.length===1&&canonicals[0].resolved){const a=new URL(canonicals[0].resolved),b=new URL(location.href);a.hash='';b.hash='';check('Canonical relationship',a.href===b.href?'Observed':'Review',a.href===b.href?'Self-referencing after fragment removal.':a.origin!==b.origin?'Canonical points to another origin. Check whether intentional.':'Canonical points to a different URL, including its query string. Check variant/duplicate strategy.');if(new URL(canonicals[0].resolved).hash)check('Canonical fragment','Review','Canonical includes a fragment. Review the intended canonical URL.');}
      check('Google robots meta',blocking.length?'Blocking directive observed':'No blocking meta observed',blocking.length?blocking.map(m=>m.agent+': '+m.content).join(' | '):'No noindex/none found in robots or googlebot meta. This does not establish indexability or index status.');
      if(robots.some(m=>!m.inHead))check('Robots placement','Review','At least one robots meta is outside head.');
      check('H1',h1.length===1&&h1[0]?'Observed':'Review',h1.length+' H1 elements. '+h1.join(' | ')+' · H1 count is a review signal, not a ranking rule.');
      check('Main content','Info',bmWords(sample.text).length+' words. No universal minimum word count is imposed.');
      check('Language',document.documentElement.lang?'Observed':'Review',document.documentElement.lang||'No html lang attribute.');
      check('Images',missingAlt?'Review':'Observed',images.length+' images · '+missingAlt+' missing alt attributes. Empty alt may be intentional for decorative images; image loading and relevance need manual review.');
      const microdata=schema.microdata.filter(n=>n.types.some(t=>['Product','ProductGroup'].includes(t))).length;
      const rdfa=schema.rdfa.filter(n=>n.types.some(t=>['Product','ProductGroup'].includes(t))).length;
      check('Structured data',schema.errors.length?'Issue':schema.findings.length?'Review':'Info',schema.scripts+' JSON-LD blocks · '+schema.microdata.length+' microdata scopes · '+schema.rdfa.length+' RDFa typed elements. See the separate overall and Product sections below.');
      check('Open Graph','Info',['og:title','og:description','og:image','og:type','og:url'].map(n=>n+': '+(value(n)||'missing')).join('\n'));
      check('Twitter card','Info',['twitter:card','twitter:title','twitter:description','twitter:image'].map(n=>n+': '+(value(n)||'missing')).join('\n'));
      const hreflangs=[...document.querySelectorAll('link[hreflang][href]')].map(n=>({lang:n.hreflang,url:n.href}));
      if(hreflangs.length)check('Hreflang','Info',hreflangs.map(n=>n.lang+' → '+n.url).join('\n')+'\nReciprocal links and destination responses not checked.');
      latest={url:location.href,checkedAt:new Date().toISOString(),checks,robots,canonicals,h1,hreflangs,products:schema.products,productChecks:[],schemaErrors:schema.errors,structuredData:{inventory:schema.inventory,findings:schema.findings,blocks:schema.blocks,entities:schema.entities,microdata:schema.microdata,rdfa:schema.rdfa,splitDefinitions:schema.splitDefinitions},limitations:['Rendered DOM only','No actual index-status verification','No original navigation headers','No robots.txt parser','Basic JSON-LD structure and Product field checks only; no complete vocabulary or rich-result validation','Microdata/RDFa inventory only','No remote context expansion or linked-entity fetches']};
      status.textContent=checks.filter(c=>/Issue|Blocking/.test(c.state)).length+' issues/blocking signals · '+checks.filter(c=>c.state==='Review').length+' review items · no numerical SEO score.';
      output.append(el('h3','Page checks'));const checksTable=p.table(['Check','Result','Observed detail'],checks.map(c=>[c.name,c.state,c.detail]),output);checksTable.className='page-checks';
      if(robots.length){output.append(el('h3','Robots directives (all observed agents)'));p.table(['Agent','Content','Placement'],robots.map(r=>[r.agent,r.content,r.inHead?'head':'outside head']),output);}
      const metaDetails=el('details');metaDetails.append(el('summary','All meta tags ('+metas.length+')'));p.table(['Name / property / http-equiv','Content'],metas.map(m=>[m.name||m.getAttribute('property')||m.httpEquiv||(m.charset?'charset':'(unnamed)'),m.content||m.charset||'']),metaDetails);output.append(metaDetails);
      function list(value){return [].concat(value||[]).map(schema.resolve).filter(v=>v&&typeof v==='object');}
      function imageURL(product){for(const image of [].concat(product?.image||[])){const v=schema.resolve(image),raw=typeof v==='string'?v:v?.contentUrl||v?.url||v?.['@id'];const url=safeURL(raw);if(url)return url;}return '';}
      function offerInfo(offer){
        const v=schema.resolve(offer),spec=list(v.priceSpecification)[0]||{},aggregate=schema.hasType(v,'AggregateOffer');
        const raw=scalar(aggregate?v.lowPrice:(v.price??spec.price)),currency=scalar(v.priceCurrency||spec.priceCurrency),priceOK=raw!==''&&Number.isFinite(Number(raw))&&Number(raw)>=0;
        return {offer:v,aggregate,raw,currency,priceOK,currencyOK:/^[A-Z]{3}$/.test(currency),high:scalar(v.highPrice),availability:scalar(v.availability)};
      }
      output.append(el('h3','Structured data · overall'));
      output.append(el('p','All detected types are listed below. JSON-LD gets parsing and basic structure/reference checks; microdata and RDFa are inventoried. This is not a full Schema.org or rich-result validator. Remote contexts and linked entities are not fetched.'));
      const overallRows=[
        ['JSON-LD',schema.scripts+' blocks; '+schema.entities.length+' distinct entity definitions'],
        ['Microdata',schema.microdata.length+' item scopes'],
        ['RDFa',schema.rdfa.length+' typed elements'],
        ['Basic findings',schema.findings.filter(f=>f.state==='Issue').length+' parsing issues; '+schema.findings.filter(f=>f.state==='Review').length+' structure/reference review items']
      ];
      p.table(['Format / check','Observed'],overallRows,output);
      if(schema.inventory.length)p.table(['Detected type','JSON-LD entities','Microdata scopes','RDFa typed elements'],schema.inventory.map(v=>[v.type,v.jsonLD,v.microdata,v.rdfa]),output);
      else output.append(el('p','No types were detected. Untyped JSON-LD objects and microdata scopes can still be valid; missing markup is not automatically an SEO error.'));
      if(schema.blocks.length){
        p.table(['JSON-LD block','Parsing','Shape','Entity definitions','Types'],schema.blocks.map(b=>[b.block,b.parseOK?'JSON parses':'Parse issue',b.topLevel||'—',b.entityCount,b.types.join(', ')||'—']),output);
        if(schema.findings.length)p.table(['Block','Location','Result','Detail'],schema.findings.map(f=>[f.block,f.path,f.state,f.message]),output);
        else output.append(el('p','No basic JSON-LD parsing or structure/reference flags found. Vocabulary terms, property ranges and search-feature requirements still need full validation.'));
      }
      const entityDetails=el('details');entityDetails.append(el('summary','JSON-LD entities ('+schema.entities.length+')'));
      for(const [i,entity]of schema.entities.entries()){
        const d=el('details');d.append(el('summary',(i+1)+'. '+(entity.types.join(', ')||'Untyped object')+(entity.name?' · '+entity.name:'')));
        p.table(['Entity field','Observed'],[['@id',entity.id||'Not declared'],['Source','Block '+entity.block+' · '+entity.path],['Properties',entity.properties.join(', ')||'No non-keyword properties']],d);
        d.append(el('pre',JSON.stringify(entity.value,null,2)));entityDetails.append(d);
      }
      if(schema.entities.length)output.append(entityDetails);
      if(schema.splitDefinitions.length){const d=el('details');d.append(el('summary','IDs defined in multiple places ('+schema.splitDefinitions.length+')'));d.append(el('p','JSON-LD can split a definition across blocks or objects. These are not automatically duplicates or errors. This lightweight view merges local properties for display; compare the original blocks where values overlap.'));p.table(['@id','Definitions'],schema.splitDefinitions.map(v=>[v.id,v.definitions.map(d=>'Block '+d.block+' '+d.path).join(' | ')]),d);output.append(d);}
      for(const [name,items]of [['Microdata',schema.microdata],['RDFa',schema.rdfa]])if(items.length){
        const d=el('details');d.append(el('summary',name+' markup ('+items.length+')'));d.append(el('p','Observed attributes only. Property lists include nested elements. RDFa vocabulary/prefix inheritance, relationships and full field validation are outside this inventory.'));
        p.table(['Item','Types','Identifier','Element','Properties (including nested)'],items.map(v=>[v.item,v.types.join(', ')||'Untyped',v.id||'—',v.element,v.properties.join(', ')||'—']),d);
        for(const item of items){const raw=el('details');raw.append(el('summary','Raw '+name+' item '+item.item),el('pre',item.html));d.append(raw);}output.append(d);
      }
      if(schema.blocks.length){const raw=el('details');raw.append(el('summary','All original JSON-LD blocks'));for(const b of schema.blocks){const d=el('details');d.append(el('summary','Block '+b.block+(b.parseOK?'':' · parse issue')),el('pre',b.raw));raw.append(d);}output.append(raw);}
      output.append(el('h3','Product · additional checks'));
      if(!schema.products.length)output.append(el('p',microdata||rdfa?'Product/ProductGroup markup is present outside JSON-LD. Use the markup inventory above and a full validator to inspect its fields.':'No JSON-LD Product entities found. Product-specific fields are checked when present; they are not required for every page.'));
      const groupCount=schema.entities.filter(e=>e.types.includes('ProductGroup')).length;
      if(groupCount)output.append(el('p',groupCount+' JSON-LD ProductGroup entities are listed in the overall inventory. Individual Product variants get the additional field checks below.'));
      const productDetails=el('div');output.append(productDetails);
      for(const [i,product]of schema.products.entries()){
        const d=el('details');d.append(el('summary','Product '+(i+1)+': '+(scalar(product.name)||'(missing name)')));const offers=list(product.offers),rating=schema.resolve(product.aggregateRating),rows=[];
        const row=(name,state,detail)=>rows.push([name,state,detail]);
        row('name',scalar(product.name).trim()?'Observed':'Missing',scalar(product.name));
        row('Product snippet route',offers.length||product.review||product.aggregateRating?'Fields present':'Review','Basic presence check: name plus offers, review or aggregateRating. Nested requirements and content-policy compliance still need validation.');
        row('image',imageURL(product)?'Observed':'Review',imageURL(product)||'No HTTP(S) image found. Important for merchant listings.');
        for(const name of ['description','sku','mpn','gtin','gtin8','gtin12','gtin13','gtin14'])if(product[name]!==undefined||['description','sku'].includes(name))row(name,product[name]!==undefined?'Observed':'Review',scalar(product[name])||'Not present. These fields are not all universally required.');
        const brand=schema.resolve(product.brand);row('brand',brand?'Observed':'Review',scalar(brand?.name)||scalar(brand)||'Not present.');
        row('Offers',offers.length?'Observed':'Review',offers.length+' offer objects. Direct product sales generally need Offer data; reviews can use other product-snippet routes.');
        offers.forEach((o,j)=>{const f=offerInfo(o);row('Offer '+(j+1)+' type',schema.hasType(o,'Offer')||f.aggregate?'Observed':'Review',[].concat(o['@type']||[]).join(', ')||'Missing @type');row('Offer '+(j+1)+' '+(f.aggregate?'lowPrice':'price'),f.priceOK?'Observed':'Review',f.raw||'Missing. Nested priceSpecification is also checked for Offer.');row('Offer '+(j+1)+' currency',f.currencyOK?'Observed':'Review',f.currency||'Missing. Expect a three-letter uppercase currency code; validity is not fully checked.');row('Offer '+(j+1)+' availability',f.availability?'Observed':'Review',f.availability||'Not present.');if(f.aggregate)row('Offer '+(j+1)+' highPrice','Info',f.high||'Not present.');if(o.url)row('Offer '+(j+1)+' URL',safeURL(o.url)?'Observed':'Review',safeURL(o.url)||scalar(o.url));if(o.priceValidUntil){const raw=scalar(o.priceValidUntil),date=Date.parse(raw),today=new Date().toISOString().slice(0,10);row('Offer '+(j+1)+' priceValidUntil',!Number.isFinite(date)?'Review':raw.slice(0,10)<today?'Expired':'Observed',raw);}});
        if(rating){const val=Number(rating.ratingValue),min=Number(rating.worstRating??1),max=Number(rating.bestRating??5),count=Number(rating.reviewCount??rating.ratingCount),valid=scalar(rating.ratingValue)!==''&&Number.isFinite(val)&&Number.isFinite(min)&&Number.isFinite(max)&&max>min&&val>=min&&val<=max;row('Aggregate rating',valid?'Observed':'Review',scalar(rating.ratingValue)+' on '+min+'–'+max+' scale');row('Rating/review count',Number.isInteger(count)&&count>0?'Observed':'Review',scalar(rating.reviewCount??rating.ratingCount)||'Missing.');}
        latest.productChecks.push({product:i+1,name:scalar(product.name),checks:rows});p.table(['Product field','Basic check','Value / note'],rows,d);productDetails.append(d);
      }
      if(schema.products.length){const rawDetails=el('details');rawDetails.append(el('summary','Product JSON-LD (resolved local @id definitions)'));rawDetails.append(el('pre',JSON.stringify(schema.products,null,2)));output.append(rawDetails);}
      output.append(el('h3','Illustrative search result'));
      output.append(el('p','Approximation using this page’s metadata'+(schema.products.length?' and the selected JSON-LD Product':'')+'. Google may rewrite the title/description, choose another canonical, or show no rich result. Character counts are informational, not fixed limits.'+(schema.products.length?' Select the actual product; related products may also be marked up.':'')));
      const previewControls=el('div');previewControls.className='tools';
      const picker=p.select(schema.products.length?schema.products.map((v,i)=>[String(i),'Product '+(i+1)+': '+(scalar(v.name)||'(unnamed)')]):[['','No JSON-LD Product available']]);picker.setAttribute('aria-label','Product for search preview');
      const device=p.select([['desktop','Desktop width'],['mobile','Mobile width']]);device.setAttribute('aria-label','Preview width');if(schema.products.length)previewControls.append(picker);previewControls.append(device);
      const preview=el('div');preview.className='serp';
      const website=schema.nodes.map(schema.resolve).find(n=>{
        if(!schema.hasType(n,'WebSite'))return false;
        const url=safeURL(scalar(n.url)||scalar(n['@id']));
        return url&&new URL(url).origin===location.origin;
      });
      const siteName=scalar(website?.name).trim()||value('og:site_name')||value('application-name')||location.hostname;
      const identity=el('div'),faviconBox=el('span'),favicon=el('img'),siteInfo=el('div'),siteLabel=el('div',siteName);
      identity.className='site-identity';faviconBox.className='favicon';siteInfo.className='site-info';siteLabel.className='site-name';
      favicon.alt='';favicon.width=28;favicon.height=28;favicon.referrerPolicy='no-referrer';
      favicon.addEventListener('error',()=>{faviconBox.textContent='◎';},{once:true});
      const iconLinks=[...document.querySelectorAll('link[rel]')].filter(n=>n.rel.toLowerCase().split(/\s+/).some(v=>v==='icon'||v==='apple-touch-icon'));
      const iconURL=iconLinks.map(n=>safeURL(n.getAttribute('href'))).find(Boolean)||new URL('/favicon.ico',location.href).href;
      faviconBox.append(favicon);favicon.src=iconURL;
      const previewURL=el('div',location.hostname+' › '+location.pathname.split('/').filter(Boolean).join(' › '));previewURL.className='url';
      siteInfo.append(siteLabel,previewURL);identity.append(faviconBox,siteInfo);
      const previewTitle=el('div',title||'(No page title)'),previewDescription=el('div',description||'(No meta description. A search engine may select page text.)'),rich=el('div');
      previewTitle.className='title';previewDescription.className='description';rich.className='rich';preview.append(identity,previewTitle,previewDescription,rich);
      const loadImage=button('Load selected product thumbnail',()=>{const url=imageURL(currentProduct);if(!url){status.textContent='No usable image URL on this selected Product.';return;}const img=el('img');img.className='product-thumbnail';img.alt=scalar(currentProduct?.name)||'Product';img.referrerPolicy='no-referrer';img.addEventListener('error',()=>{img.remove();status.textContent='Thumbnail could not be loaded; it may be blocked by CSP or unavailable.';},{once:true});img.src=url;preview.querySelector('.product-thumbnail')?.remove();preview.insertBefore(img,previewTitle);});
      if(schema.products.length)previewControls.append(loadImage);output.append(previewControls,preview);
      function renderPreview(){
        currentProduct=schema.products[Number(picker.value)]||null;preview.querySelector('.product-thumbnail')?.remove();preview.className='serp'+(device.value==='mobile'?' mobile':'');rich.replaceChildren();loadImage.disabled=!imageURL(currentProduct);
        const offers=list(currentProduct?.offers),info=offers.map(offerInfo).find(f=>f.priceOK&&f.currencyOK);
        if(info){let price;try{price=new Intl.NumberFormat(document.documentElement.lang||'en',{style:'currency',currency:info.currency}).format(Number(info.raw));}catch{price=info.raw+' '+info.currency;}rich.append(el('div',(info.aggregate?'From ':'')+price+(info.availability?' · '+info.availability.replace(/^https?:\/\/schema\.org\//,''):'')));}
        const rating=schema.resolve(currentProduct?.aggregateRating);if(rating){const v=Number(rating.ratingValue),best=Number(rating.bestRating??5),worst=Number(rating.worstRating??1),n=Number(rating.reviewCount??rating.ratingCount);if(scalar(rating.ratingValue)!==''&&Number.isFinite(v)&&best>worst&&v>=worst&&v<=best&&Number.isInteger(n)&&n>0)rich.append(el('div','Rating: '+v+' / '+best+' · '+n+' ratings/reviews (from markup)'));}
      }
      picker.addEventListener('change',renderPreview);device.addEventListener('change',renderPreview);renderPreview();
    }
    p.cleanups.push(()=>{controller?.abort();clearTimeout(timeout);});audit();
  }

  // The existing generator serialises every dependency into the saved bookmark.
  catalog.push(
    {id:'greek-orthography',title:'Greek orthography',category:'writing',desc:'Review Greek page text and check possible spelling, punctuation and grammar issues in a floating panel.',note:'Sends only the text you review and approve to a LanguageTool-compatible API, on a manual button click. Default: LanguageTool public API, 20,000 UTF-8 bytes per check. Service availability, limits, CORS and site CSP apply.',run:bmGreek,deps:[bmPanel,bmText,bmWords]},
    {id:'keyword-review',title:'Keyword repetition & stuffing review',category:'writing',desc:'Count words, inspect repeated words and phrases, and review local keyword clusters.',note:'Floating, browser-local report with exact target counts, adjustable heuristics, repeated tokens and duplicate paragraphs. Heuristics are review prompts, not Google thresholds or proof of spam.',run:bmKeywords,deps:[bmPanel,bmText,bmWords,bmKeywordStats]},
    {id:'product-seo',title:'Page SEO snapshot',category:'seo',desc:'Inspect metadata, canonicals, robots directives, product JSON-LD and an illustrative search result.',note:'Floating rendered-page audit. Optional fresh HEAD response check; actual index status and Google-selected canonical remain unverified. JSON-LD field checks do not replace the Rich Results Test.',run:bmProduct,deps:[bmPanel,bmText,bmWords,bmSchema]}
  );

  function bookmarkCode(entry, cfg = {}) {
    const settings = {...cfg,...entry.fixed}; delete settings.destination;
    const body = "void(async function(){\n'use strict';\ntry {\n" + entry.deps.map(fn => fn.toString()).join('\n\n') + '\nawait (' + entry.run.toString() + ')(' + JSON.stringify(settings).replace(/</g,'\\u003c') + ');\n} catch(error) { alert("Bookmarklet: " + (error.message || error)); }\n})();';
    return {source:'javascript:' + body,href:'javascript:' + encodeURIComponent(body)};
  }

  function init() {
    const app = document.getElementById('bookmarklets-app'); if (!app) return;
    const k = toolkit(), status = app.querySelector('[data-bm-status]');
    const cards = [...app.querySelectorAll('[data-bm-card]')];
    for (const entry of catalog) {
      const card = app.querySelector('[data-bm-card="' + entry.id + '"]'); if (!card) continue;
      const form = card.querySelector('form'), link = card.querySelector('[data-bm-install]'), code = card.querySelector('[data-bm-code]');
      const error = card.querySelector('[data-bm-error]'), copy = card.querySelector('[data-bm-copy]');
      let current;
      function config() { return form ? Object.fromEntries(new FormData(form)) : {}; }
      function update() {
        const cfg = config(); let message = '';
        if (entry.id === 'link-health' && (!/^\d+$/.test(cfg.limit) || Number(cfg.limit)<1 || Number(cfg.limit)>500)) message = 'Enter a whole number from 1 to 500.';
        if (entry.id === 'utm' && ['source','medium','campaign'].some(key => !cfg[key]?.trim())) message = 'Add source, medium, and campaign to prepare this bookmarklet.';
        if (entry.id === 'prompt' && !cfg.prompt?.trim()) message = 'Add an instruction to prepare this bookmarklet.';
        if (entry.id === 'gsc' && cfg.property.trim() && !/^sc-domain:[a-z0-9.-]+$/i.test(cfg.property.trim())) { try { const u = new URL(cfg.property.trim()); if (!/^https?:$/.test(u.protocol) || u.search || u.hash) throw new Error(); } catch { message = 'Use sc-domain:yourdomain.eu or a full HTTP(S) URL-prefix property.'; } }
        if(entry.disabled)message='Paused while functionality is reviewed.';
        if(entry.id==='builder'){const preview=card.querySelector('[data-bm-platform-preview]');try{preview.textContent=platformTarget(cfg.platform,'https://yourdomain.eu/page');const name='🔖 '+new URL(cfg.platform.trim().replace(/\{url\}/g,'example')).hostname;link.textContent=name;link.title=name;}catch(e){message=e.message;preview.textContent='Add a platform URL to see an example.';}}
        current=bookmarkCode(entry,cfg);code.textContent=current.source;
        link.removeAttribute('href'); link.setAttribute('aria-disabled', String(Boolean(message))); link.draggable = !message; copy.disabled=Boolean(message);card.querySelector('[data-bm-copy-source]').disabled=Boolean(message);card.querySelector('[data-bm-expand]').disabled=Boolean(entry.disabled);
        if (!message) link.href = current.href;
        error.textContent = message; error.hidden = !message;
        if (entry.id === 'utm') {
          const result = card.querySelector('[data-bm-utm-url]'), copyURL = card.querySelector('[data-bm-copy-url]');
          let value = '', urlError = '';
          if (cfg.destination.trim() && !message) { try { value = taggedURL(cfg.destination.trim(),cfg); } catch { urlError = 'Enter a full http:// or https:// destination URL.'; } }
          result.value = value; copyURL.disabled = !value;
          card.querySelector('[data-bm-url-error]').textContent = urlError;
        }
      }
      if (form) { form.addEventListener('submit', e => e.preventDefault()); form.addEventListener('input', update); form.addEventListener('change', update); }
      copy.dataset.iconOnly='true';copy.replaceChildren(k.icon('copy'));
      copy.addEventListener('click', async () => { if (!current || copy.disabled) return; await k.copy(current.href,copy,status); });
      const rawCopy = card.querySelector('[data-bm-copy-source]');rawCopy.dataset.iconOnly='true';rawCopy.replaceChildren(k.icon('copy'));
      rawCopy.addEventListener('click', async () => { if(current&&!rawCopy.disabled){await k.copy(current.source,rawCopy,status);} });
      link.addEventListener('click', e => { e.preventDefault(); status.textContent = link.getAttribute('aria-disabled') === 'true' ? 'Complete the configuration first.' : 'Drag “' + entry.title + '” into your bookmarks bar, or copy its code into a bookmark’s URL field.'; });
      link.addEventListener('dragstart', e => {
        if (!current || link.getAttribute('aria-disabled') === 'true') { e.preventDefault(); return; }
        // Preserve the browser's native link-drag data and title.
        status.textContent = 'Drop into the bookmarks bar. Updated configuration requires saving the bookmarklet again.';
      });
      const expand = card.querySelector('[data-bm-expand]'); expand.addEventListener('click', () => { if(expand.disabled)return;const open=expand.getAttribute('aria-expanded')!=='true'; expand.setAttribute('aria-expanded',String(open)); code.parentElement.classList.toggle('bm-expanded',open); rawCopy.hidden=!open;expand.textContent=open?'Compact code':'Expand code'; });
      if (entry.id === 'utm') {
        const b = card.querySelector('[data-bm-copy-url]'); b.prepend(k.icon('copy'));
        b.addEventListener('click', async () => { const value = card.querySelector('[data-bm-utm-url]').value; if (value) { await k.copy(value,b,status); } });
      }
      update();
    }
    const search = app.querySelector('[data-bm-search]'), category = app.querySelector('[data-bm-category]'), count = app.querySelector('[data-bm-count]');
    function filter() {
      const term = search.value.trim().toLocaleLowerCase(); let n = 0;
      for (const card of cards) { const entry = catalog.find(e => e.id === card.dataset.bmCard); const show = (category.value === 'all' || category.value === entry.category) && (entry.title + ' ' + entry.desc + ' ' + entry.note).toLocaleLowerCase().includes(term); card.hidden = !show; if (show) n++; }
      for (const group of app.querySelectorAll('[data-bm-group]')) group.hidden = ![...group.querySelectorAll('[data-bm-card]')].some(c => !c.hidden);
      count.textContent = n + ' of ' + catalog.length + ' bookmarklets'; app.querySelector('[data-bm-empty]').hidden = n !== 0;
    }
    search.addEventListener('input',filter); category.addEventListener('change',filter);
    app.querySelector('[data-bm-reset]').addEventListener('click', () => { search.value = ''; category.value = 'all'; filter(); search.focus(); });
    filter(); app.dataset.ready = 'true';
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = {catalog,bookmarkCode,cleanURL,taggedURL,extractContent,toolkit,pageLinks,parseAI,platformTarget};
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init(); }
})();
