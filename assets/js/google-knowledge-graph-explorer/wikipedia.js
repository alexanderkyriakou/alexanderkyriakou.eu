import {ApiError} from './api.js';
import {safeURL,wikipediaArticle} from './entities.js';

const plain=value=>typeof value==='string' ? value.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,1000) : '';
const mediaURL=value=>{ const u=safeURL(value); return u && new URL(u).protocol==='https:' && ['upload.wikimedia.org','thumb.wikimedia.org'].includes(new URL(u).hostname) ? u : ''; };
export async function articleImage(article,fetcher=fetch,{allowNonFree=false,onUnavailable=()=>{}}={}) {
  const source=wikipediaArticle(article);
  if(!source) throw new ApiError(400,'Provide a direct HTTPS Wikipedia article URL.');
  const unavailable=reason=>{onUnavailable(reason);return null;};
  const api=async (params,stage,host=source.host)=>{
    const u=new URL(`https://${host}/w/api.php`);
    u.search=new URLSearchParams({action:'query',format:'json',formatversion:'2',...params});
    const response=await fetcher(u,{headers:{Accept:'application/json','User-Agent':'KGExplorer/1.0 (https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer)'},redirect:'error',signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new ApiError(502,`Wikipedia ${stage} lookup failed (HTTP ${response.status}).`);
    const data=await response.json(); if(data.error) throw new ApiError(502,`Wikipedia ${stage} lookup could not be completed.`); return data;
  };
  const pageData=await api({titles:source.title,prop:'pageimages',piprop:'name',redirects:'1',pilicense:'any'},'article');
  const page=pageData.query?.pages?.[0];
  if(!page?.pageimage || page.missing) return unavailable('no-article-image');
  const fileParams={titles:'File:'+page.pageimage,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'500',redirects:'1'};
  // Commons owns most Wikipedia photos and their authoritative attribution metadata.
  // Query it directly; a locally hosted Wikipedia file may not exist there.
  const commonsData=await api(fileParams,'file','commons.wikimedia.org');
  let info=commonsData.query?.pages?.[0]?.imageinfo?.[0];
  if(!info) {
    const localData=await api(fileParams,'file');
    info=localData.query?.pages?.[0]?.imageinfo?.[0];
  }
  if(!info) return unavailable('no-file-metadata');
  const image=mediaURL(info?.thumburl) || mediaURL(info?.url);
  if(!image) return unavailable('unsupported-image-url');
  const imageSource=safeURL(info.descriptionurl);
  if(!imageSource || !/^https:\/\/(?:commons\.wikimedia\.org|[a-z]{2,3}\.wikipedia\.org)\/wiki\/File:/.test(imageSource)) return unavailable('unsupported-file-source');
  const meta=info.extmetadata || {};
  // Do not silently reuse non-free files or files with unknown licensing as fallbacks.
  const license=plain(meta.LicenseShortName?.value);
  const free=(meta.Copyrighted?.value==='False' || /^(?:CC0|CC BY(?:-SA)?(?: |$)|Public domain)/i.test(license)) && !/(?:non.free|fair use|\bNC\b|\bND\b)/i.test(license);
  if(!free && !allowNonFree) return unavailable(license ? 'image-license-not-supported' : 'missing-image-license');
  return {image,originalImage:mediaURL(info.url),imageSource,article:source.url,freelyLicensed:free,artist:plain(meta.Artist?.value),credit:plain(meta.Credit?.value),license,licenseURL:safeURL(meta.LicenseUrl?.value)};
}
export async function wikipediaImage({request},fetcher=fetch) {
  const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  try {
    if(request.method!=='GET') return new Response(null,{status:405,headers:{Allow:'GET'}});
    const url=new URL(request.url), origin=request.headers.get('Origin');
    if(origin && origin!==url.origin || request.headers.get('Sec-Fetch-Site')==='cross-site') throw new ApiError(403,'Cross-site requests are not supported.');
    if([...url.searchParams.keys()].some(k=>k!=='article') || url.searchParams.getAll('article').length!==1) throw new ApiError(400,'Provide one article parameter.');
    let reason;
    const image=await articleImage(url.searchParams.get('article'),fetcher,{onUnavailable:value=>{reason=value;}});
    return reply({image,...(!image && {reason})});
  } catch(error) { return reply({error:error instanceof ApiError ? error.message : 'Wikipedia image unavailable.'},error instanceof ApiError ? error.status : 502); }
}