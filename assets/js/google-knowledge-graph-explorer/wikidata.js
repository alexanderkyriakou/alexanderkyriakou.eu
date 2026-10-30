import {ApiError} from './api.js';
import {safeURL,text} from './entities.js';
export async function enrich({request},fetcher=fetch) {
  const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  try {
    if(request.method!=='GET') return new Response(null,{status:405,headers:{Allow:'GET'}});
    const origin=request.headers.get('Origin');
    if((origin && origin!==new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site')==='cross-site') throw new ApiError(403,'Cross-site requests are not supported.');
    const p=new URL(request.url).searchParams;
    for(const k of p.keys()) if(!['id','language','googleMid'].includes(k) || p.getAll(k).length!==1) throw new ApiError(400,'Unsupported parameter.');
    const id=p.get('id') || '', language=p.get('language') || 'en';
    if(!/^Q[1-9][0-9]{0,11}$/.test(id) || !/^[a-z]{2}$/.test(language)) throw new ApiError(400,'Enter a Wikidata identifier such as Q42.');
    const r=await fetcher(`https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,{headers:{Accept:'application/json','User-Agent':'KGExplorer/1.0 (https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer)'},signal:AbortSignal.timeout(10000)});
    if(!r.ok) throw new ApiError(r.status===429 ? 429 : 502,'Wikidata is unavailable. Google results remain available.');
    const data=await r.json(), entity=data.entities?.[id];
    if(!entity || entity.missing!==undefined) throw new ApiError(404,'No Wikidata record returned.');
    // Only non-deprecated, concrete claims; do not silently elevate unsupported values.
    const claims=prop=>(entity.claims?.[prop] || []).filter(c=>c.rank!=='deprecated' && c.mainsnak?.snaktype==='value').map(c=>c.mainsnak.datavalue?.value);
    const mids=claims('P646').filter(v=>typeof v==='string');
    return reply({id,name:text(entity.labels?.[language]?.value),description:text(entity.descriptions?.[language]?.value),aliases:(entity.aliases?.[language] || []).slice(0,30).map(a=>text(a.value)),websites:claims('P856').map(safeURL).filter(Boolean),googleMids:mids,identity: p.get('googleMid') && mids.includes(p.get('googleMid')) ? 'Shared Google MID in Wikidata P646; supporting cross-source identity evidence.' : 'Candidate only: identity association not established.',source:'Wikidata',url:`https://www.wikidata.org/wiki/${id}`,license:'https://creativecommons.org/publicdomain/zero/1.0/',retrievedAt:new Date().toISOString()});
  } catch(e) { return reply({error:e instanceof ApiError?e.message:'Wikidata could not be retrieved. Google results remain available.'},e instanceof ApiError?e.status:502); }
}
