const encoder = new TextEncoder();
const tokens = new Map();
const inflight = new Map();
const b64 = bytes => btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
const encode = obj => b64(encoder.encode(JSON.stringify(obj)));
export async function accessToken(env, fetcher = fetch) {
  const email = env.GOOGLE_CLIENT_EMAIL, pem = env.GOOGLE_PRIVATE_KEY?.replaceAll('\\n','\n');
  if (!email || !pem) throw new Error('Google credentials are not configured');
  const cacheKey = email + pem;
  const cached = tokens.get(cacheKey);
  if (cached?.expires > Date.now()+60000) return cached.value;
  if (inflight.has(cacheKey)) return inflight.get(cacheKey);
  const task = (async()=>{
    const now = Math.floor(Date.now()/1000);
    const unsigned = encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
    const der = Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g,'').replace(/\s/g,'')),c=>c.charCodeAt(0));
    const key = await crypto.subtle.importKey('pkcs8',der,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5',key,encoder.encode(unsigned));
    const response = await fetcher('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:unsigned+'.'+b64(new Uint8Array(signature))}),signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('Google authentication failed');
    const data = await response.json();
    if (typeof data.access_token !== 'string' || !Number.isFinite(data.expires_in)) throw new Error('Invalid authentication response');
    if (tokens.size > 4) tokens.clear();
    tokens.set(cacheKey,{value:data.access_token,expires:Date.now()+Math.min(data.expires_in,3600)*1000});
    return data.access_token;
  })();
  inflight.set(cacheKey,task);
  try { return await task; } finally { inflight.delete(cacheKey); }
}
