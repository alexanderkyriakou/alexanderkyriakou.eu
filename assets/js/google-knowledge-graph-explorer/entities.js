// ISO language-code choices, not a promise of record coverage in every language.
export const languages = {ar:'Arabic',bg:'Bulgarian',ca:'Catalan',zh:'Chinese',hr:'Croatian',cs:'Czech',da:'Danish',nl:'Dutch',en:'English',et:'Estonian',fi:'Finnish',fr:'French',de:'German',el:'Greek',he:'Hebrew',hi:'Hindi',hu:'Hungarian',id:'Indonesian',it:'Italian',ja:'Japanese',ko:'Korean',lv:'Latvian',lt:'Lithuanian',ms:'Malay',no:'Norwegian',fa:'Persian',pl:'Polish',pt:'Portuguese',ro:'Romanian',ru:'Russian',sr:'Serbian',sk:'Slovak',sl:'Slovenian',es:'Spanish',sv:'Swedish',th:'Thai',tr:'Turkish',uk:'Ukrainian',vi:'Vietnamese'};
// Schema.org type filters accepted by the Basic request contract; coverage varies.
export const types = ['', 'Person', 'Organization', 'Corporation', 'EducationalOrganization', 'LocalBusiness', 'SportsTeam', 'MusicGroup', 'Place', 'City', 'Country', 'AdministrativeArea', 'LandmarksOrHistoricalBuildings', 'CreativeWork', 'Book', 'Movie', 'TVSeries', 'MusicAlbum', 'MusicRecording', 'VideoGame', 'Event', 'SportsEvent', 'Product'];
export const text = v => typeof v === 'string' ? v.slice(0, 12000) : '';
export function safeURL(value) {
  try { const u = new URL(value); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
export function identifier(value) {
  const s = text(value).replace(/^kg:/, '');
  return /^(?:c-[a-zA-Z0-9_-]+|\/[mg]\/[a-zA-Z0-9_-]+)$/.test(s) ? s : '';
}
export function googleLink(entity) {
  const u = new URL('https://www.google.com/search');
  u.searchParams.set(entity.googleMid ? 'kgmid' : 'q', entity.googleMid || entity.name);
  return u.href;
}
export function normalizedName(v) {
  return text(v).normalize('NFKC').toLocaleLowerCase('und').replace(/[\p{P}\p{S}]+/gu, ' ').replace(/\s+/g, ' ').trim();
}
export function matchLabel(query, entity) {
  const q = normalizedName(query), name = normalizedName(entity.name);
  if (!q) return 'Other returned result';
  if (name === q) return 'Exact name match';
  if (entity.aliases.some(a => normalizedName(a) === q)) return 'Alternative-name match';
  if (name && (` ${name} `.includes(` ${q} `) || ` ${q} `.includes(` ${name} `))) return 'Partial name match';
  return 'Other returned result';
}
export function normalizeResponse(body, language, retrievedAt = new Date().toISOString()) {
  if (!body || !Array.isArray(body.itemListElement)) throw new Error('Unexpected response schema');
  return body.itemListElement.slice(0,50).map((item, index) => {
    const r = item.result;
    if (!r || typeof r !== 'object' || typeof r.name !== 'string') throw new Error('Unexpected entity schema');
    const ids = Array.isArray(r.identifier) ? r.identifier : r.identifier ? [r.identifier] : [];
    const googleCandidates = [ r.googleKgMID, ...ids .filter(i => i?.name === 'googleKgMID' || /googleKgMID$/.test(i?.propertyID || '') ) .map(i => i.value), ];
    const googleMid = googleCandidates.map(identifier).find(i => /^\/[mg]\//.test(i)) || '';
    const id = identifier(r['@id']);
    const description = typeof r.detailedDescription === 'object' ? r.detailedDescription : {};
    return {id, cloudMid: id.startsWith('c-') ? id : '', googleMid: googleMid || (/^\/[mg]\//.test(id) ? id : ''), name:text(r.name), description:text(r.description), types:(Array.isArray(r['@type']) ? r['@type'] : [r['@type']]).filter(t=>typeof t==='string').slice(0,20), aliases:(Array.isArray(r.alternateName) ? r.alternateName : [r.alternateName]).filter(a=>typeof a==='string').slice(0,30), website:safeURL(r.url), detail:text(description.articleBody), reference:safeURL(description.url), license:safeURL(description.license), image:safeURL(r.image?.contentUrl), imageSource:safeURL(r.image?.url), source:'Google Enterprise Knowledge Graph Basic', language, retrievedAt, position:index+1};
  });
}
export function findings(entity, peers = []) {
  const items = [];
  if (peers.some(p=>p !== entity && normalizedName(p.name) === normalizedName(entity.name))) items.push({observation:'Multiple results share this name.',evidence:'Names in the returned Google result list.',interpretation:'A shared name alone does not establish identity.',action:'Compare descriptions, types and identifiers.'});
  if (!entity.googleMid) items.push({observation:'No Google MID was supplied in this response.', evidence:'Normalized Google identifier fields.',interpretation:'An entity-specific Google Search link cannot be constructed.',action:'Use the name-based Google Search link or inspect the available references.'});
  if (!entity.description) items.push({observation:'This response provides no short description.',evidence:'Google description field is absent.',interpretation:'This is a limit of the retrieved data.',action:'Inspect the source references before identifying this entity.'});
  return items;
}
export function identityFinding(entities) {
  const mids = entities.map(e=>e.googleMid || e.cloudMid);
  if (mids.every(Boolean) && new Set(mids).size === 1) return 'Shared source identifier: strong evidence these records refer to the same source identity.';
  if (entities.every(e=>e.googleMid) && new Set(entities.map(e=>e.googleMid)).size > 1) return 'Different Google MIDs: these are distinct source records. This alone does not establish whether the real-world identities differ.';
  return 'Insufficient evidence to establish matching identity. Names and missing fields are not proof.';
}
export function csv(rows) { return '\uFEFF' + rows.map(row=>row.map(v=>'"'+String(v ?? '').replace(/^[\s]*[=+@\-]|^[\t\r\n]/, "'$&").replaceAll('"','""')+'"').join(',')).join('\r\n'); }

// A source-provided article is the identity association; never search by entity name.
export function wikipediaArticle(value) {
  try {
    const url=new URL(value);
    const host=url.hostname.match(/^([a-z]{2,3})(?:\.m)?\.wikipedia\.org$/);
    if(!['http:','https:'].includes(url.protocol) || url.port || url.username || url.password || !host || !url.pathname.startsWith('/wiki/')) return null;
    url.protocol='https:'; url.hostname=host[1]+'.wikipedia.org';
    const title=decodeURIComponent(url.pathname.slice(6));
    if(!title || title.length>300 || /[\u0000-\u001f]/.test(title) || /^(?:Special|File|Category|Talk|User|Template|Wikipedia):/i.test(title)) return null;
    url.search=''; url.hash='';
    return {url:url.href,host:url.hostname,title};
  } catch { return null; }
}