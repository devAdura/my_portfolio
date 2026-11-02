import {cookies} from 'next/headers';
import {verifySession,cookieName,inboxConfigured} from '../../lib/inbox-auth';
import {getSql} from '../../lib/db';
export const dynamic='force-dynamic';
export const metadata={title:'Private enquiry inbox | Elite Software',robots:{index:false,follow:false}};
export default async function Inbox(){
 const session=(await cookies()).get(cookieName)?.value;
 if(!verifySession(session))return <main className="inbox-page"><a href="/">← Elite Software</a><h1>Private enquiry inbox</h1>{inboxConfigured()?<form action="/api/inbox/login" method="post"><p>Sign in to review your portfolio enquiries.</p><label>Inbox password<input name="password" type="password" required minLength={16} maxLength={256} autoComplete="current-password" style={{display:'block',padding:12,border:'1px solid #aaa',margin:'16px 0',maxWidth:'100%'}}/></label><button className="button primary">Sign in</button><p>If sign-in fails, check your password or try again in ten minutes.</p></form>:<p>Inbox access has not been configured. Contact Adura directly through the email or WhatsApp links on the homepage.</p>}</main>;
 const rows=await getSql()`SELECT id,name,email,topic,message,created_at,read FROM enquiries ORDER BY created_at DESC LIMIT 200`;
 return <main className="inbox-page"><a href="/">← Elite Software</a><div className="inbox-summary"><h1>Your enquiries</h1><form method="post" action="/api/inbox/logout"><button className="inbox-action">Sign out</button></form></div><p>Messages are saved privately here. Email notifications are not configured.</p>{!rows.length&&<p>No enquiries yet.</p>}{rows.map(row=><article className="inbox-card" key={row.id}><span className="read-badge">{row.read?'READ':'NEW'}</span><h2>{row.topic}</h2><p><strong>{row.name}</strong> · <a href={`mailto:${row.email}`}>{row.email}</a></p><small>{new Date(Number(row.created_at)).toLocaleString('en-GB',{timeZone:'Africa/Lagos'})} WAT</small><p style={{whiteSpace:'pre-wrap'}}>{row.message}</p>{!row.read&&<form method="post" action="/api/inbox/read"><input type="hidden" name="id" value={row.id}/><button className="inbox-action">Mark as read</button></form>}</article>)}</main>;
}
