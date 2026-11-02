import {NextResponse} from 'next/server';
import {cookieName} from '../../../../lib/inbox-auth';
export async function POST(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)return new Response('Forbidden',{status:403});const response=NextResponse.redirect(new URL('/inbox',request.url),303);response.cookies.set(cookieName,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return response;}
