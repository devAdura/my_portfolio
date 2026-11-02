import {z} from 'zod';
import {getSql} from '../../../lib/db';
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().trim().email().max(254),topic:z.enum(['Job opportunity','Freelance project','Collaboration','Just saying hello']),message:z.string().trim().min(20).max(5000),website:z.string().max(0).optional()});
export const runtime='nodejs';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Please submit the form from this website.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Invalid form submission.'},{status:415});
 if(Number(request.headers.get('content-length')||0)>18000)return Response.json({error:'Message is too large.'},{status:413});
 let body:unknown;
 try{const raw=await request.text();if(raw.length>18000)return Response.json({error:'Message is too large.'},{status:413});body=JSON.parse(raw);}catch{return Response.json({error:'Invalid form data.'},{status:400});}
 const parsed=schema.safeParse(body);if(!parsed.success)return Response.json({error:'Please enter a valid name, email and message of 20 to 5,000 characters.'},{status:400});
 try{const sql=getSql();const email=parsed.data.email.toLowerCase();const now=Date.now();
 const saved=await sql.begin(async tx=>{await tx`SELECT pg_advisory_xact_lock(hashtext(${email}))`;const recent=await tx`SELECT id FROM enquiries WHERE email=${email} AND created_at>${now-60000} LIMIT 1`;if(recent.length)return false;await tx`INSERT INTO enquiries(id,name,email,topic,message,created_at) VALUES(${crypto.randomUUID()},${parsed.data.name},${email},${parsed.data.topic},${parsed.data.message},${now})`;return true;});
 if(!saved)return Response.json({error:'Your recent message was received. Please wait a minute before sending another.'},{status:429});
 return Response.json({ok:true},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Your enquiry could not be saved. Please use email or WhatsApp to contact me directly.'},{status:503});}
}
