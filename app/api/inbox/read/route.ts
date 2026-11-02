import {cookies} from 'next/headers';
import {verifySession,cookieName} from '../../../../lib/inbox-auth';
import {getSql} from '../../../../lib/db';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin||!verifySession((await cookies()).get(cookieName)?.value))return new Response('Forbidden',{status:403});
 const id=(await request.formData()).get('id');if(typeof id!=='string'||!/^[0-9a-f-]{36}$/i.test(id))return new Response('Invalid enquiry',{status:400});
 await getSql()`UPDATE enquiries SET read=true WHERE id=${id}`;return Response.redirect(new URL('/inbox',request.url),303);
}
