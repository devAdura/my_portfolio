import {NextResponse} from 'next/server';
import {createSession,validPassword,cookieName,clientKey,inboxConfigured} from '../../../../lib/inbox-auth';
import {getSql} from '../../../../lib/db';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Forbidden',{status:403});
 if(!inboxConfigured())return new Response('Inbox access is not configured',{status:503});
 if(Number(request.headers.get('content-length')||0)>2048)return new Response('Invalid request',{status:413});
 const data=await request.formData();const password=data.get('password');if(typeof password!=='string'||password.length>256)return new Response('Invalid request',{status:400});
 try{const sql=getSql();const key=clientKey(request);const now=Date.now();
 const allowed=await sql.begin(async tx=>{await tx`SELECT pg_advisory_xact_lock(hashtext(${key}))`;const [row]=await tx`SELECT attempts,window_start FROM inbox_login_attempts WHERE client_key=${key}`;if(row&&Number(row.window_start)>now-600000&&row.attempts>=5)return false;await tx`INSERT INTO inbox_login_attempts(client_key,attempts,window_start) VALUES(${key},1,${now}) ON CONFLICT(client_key) DO UPDATE SET attempts=CASE WHEN inbox_login_attempts.window_start<${now-600000} THEN 1 ELSE inbox_login_attempts.attempts+1 END,window_start=CASE WHEN inbox_login_attempts.window_start<${now-600000} THEN ${now} ELSE inbox_login_attempts.window_start END`;return true;});
 if(!allowed)return new Response('Too many attempts. Try again in ten minutes.',{status:429});
 if(!validPassword(password))return NextResponse.redirect(new URL('/inbox',request.url),303);
 await sql`DELETE FROM inbox_login_attempts WHERE client_key=${key}`;
 const response=NextResponse.redirect(new URL('/inbox',request.url),303);response.cookies.set(cookieName,createSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return response;
 }catch{return new Response('Sign-in is temporarily unavailable.',{status:503});}
}
