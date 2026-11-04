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
