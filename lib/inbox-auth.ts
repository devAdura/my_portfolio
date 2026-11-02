import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
const cookieName='elite_inbox_session';
function sessionSecret(){const key=process.env.INBOX_SESSION_SECRET;if(!key||key.length<32)throw new Error('Inbox session secret must contain at least 32 characters');return key;}
export function inboxConfigured(){return (process.env.INBOX_PASSWORD?.length??0)>=16&&(process.env.INBOX_SESSION_SECRET?.length??0)>=32;}
export function validPassword(password:string){if(!inboxConfigured())return false;const expected=createHash('sha256').update(process.env.INBOX_PASSWORD!).digest();const actual=createHash('sha256').update(password).digest();return timingSafeEqual(expected,actual);}
export function createSession(){const expiry=String(Date.now()+8*60*60*1000);return expiry+'.'+createHmac('sha256',sessionSecret()).update(expiry).digest('hex');}
export function verifySession(token:string|undefined){if(!token||!inboxConfigured())return false;const [expiry,signature,...rest]=token.split('.');if(rest.length||!/^\d{13}$/.test(expiry)||!signature||!/^[a-f0-9]{64}$/.test(signature)||Number(expiry)<Date.now()||Number(expiry)>Date.now()+8*60*60*1000)return false;const expected=createHmac('sha256',sessionSecret()).update(expiry).digest();return timingSafeEqual(expected,Buffer.from(signature,'hex'));}
export function clientKey(request:Request){const ip=process.env.VERCEL?request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')||'unknown':'local';return createHmac('sha256',sessionSecret()).update(ip.split(',')[0].trim()).digest('hex');}
export {cookieName};
