import {languages, types, identifier, normalizeResponse} from './entities.js';
import {accessToken} from './auth.js';
export class ApiError extends Error { constructor(status,message) { super(message); this.status=status; } }
export function parameters(url, mode) {
  const p = url.searchParams;
  const allowed = mode === 'search' ? ['q','language','type','limit'] : ['id','language'];
  for (const k of p.keys()) if (!allowed.includes(k) || p.getAll(k).length !== 1) throw new ApiError(400,'Unsupported or repeated parameter.');
  const language = p.get('language') || 'en';
  if (!Object.hasOwn(languages, language)) throw new ApiError(400,'Choose a supported language.');
  if (mode === 'lookup') {
    const id = identifier(p.get('id'));
    if (!id || id.length > 150) throw new ApiError(400,'Enter a valid Cloud MID or Google MID.');
    return {id,language};
  }
  const q = (p.get('q') || '').normalize('NFKC').replace(/\s+/g,' ').trim();
  const type = p.get('type') || '', limit = p.get('limit') || '10';
  if (!q || q.length > 200 || /[\u0000-\u001f\u007f]/.test(q)) throw new ApiError(400,'Enter a keyword between 1 and 200 characters.');
  if (!types.includes(type) || !['10','20','50'].includes(limit)) throw new ApiError(400,'Invalid type or result limit.');
  return {q,language,type,limit:Number(limit)};
}
export function upstreamURL(env,mode,p) {
  if (!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(env.GOOGLE_PROJECT_ID || '')) throw new ApiError(503,'Google project is not configured.');
  const u = new URL(`https://enterpriseknowledgegraph.googleapis.com/v1/projects/${env.GOOGLE_PROJECT_ID}/locations/global/publicKnowledgeGraphEntities:${mode === 'lookup' ? 'Lookup' : 'Search'}`);
  u.searchParams.set('languages',p.language);
  if (mode === 'lookup') u.searchParams.set('ids',p.id);
  else { u.searchParams.set('query',p.q); u.searchParams.set('limit',p.limit); if (p.type) u.searchParams.set('types',p.type); }
  return u;
}
const response = (data,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...(status===429 ? {'Retry-After':'60'} : {})}});
export async function handle({request,env}, mode, deps={}) {
  try {
    if (request.method !== 'GET') return new Response(null,{status:405,headers:{Allow:'GET'}});
    const origin = request.headers.get('Origin');
    if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') throw new ApiError(403,'Cross-site requests are not supported.');
    const p = parameters(new URL(request.url),mode);
    if (env.KG_ENABLED !== 'true') throw new ApiError(503,'Live search is not enabled yet. The site owner must verify Google Basic pricing, data terms and quotas before activation.');
    const u = upstreamURL(env,mode,p);
    const token = await (deps.token || accessToken)(env);
    const r = await (deps.fetch || fetch)(u,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'},signal:AbortSignal.timeout(12000)});
    if (!r.ok) throw new ApiError(r.status === 429 ? 429 : 502,r.status === 429 ? 'Google quota reached. Please try again later.' : r.status === 401 || r.status === 403 ? 'Google authorization failed. The site owner must check the service account and API access.' : 'Google is temporarily unavailable. Please try again.');
    const raw = await r.text();
    if (raw.length > 2000000) throw new ApiError(502,'Google returned an oversized response.');
    let entities;
    try { entities = normalizeResponse(JSON.parse(raw),p.language); } catch { throw new ApiError(502,'Google returned an unexpected response format.'); }
    return response({entities,language:p.language,source:'Google Enterprise Knowledge Graph Basic'});
  } catch (e) {
    return response({error:e instanceof ApiError ? e.message : e.name === 'TimeoutError' ? 'The upstream request timed out. Please retry.' : 'The service could not complete this request. The site owner should check configuration.'},e instanceof ApiError ? e.status : 502);
  }
}
