import postgres from 'postgres';
import {readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL before running migrations');
const sql=postgres(process.env.DATABASE_URL,{max:1,ssl:process.env.NODE_ENV==='production'?'verify-full':undefined});
try{await sql.begin(async tx=>{await tx`SELECT pg_advisory_xact_lock(40917731)`;await tx.unsafe(await readFile(new URL('../migrations/001_enquiries.sql',import.meta.url),'utf8'));});console.log('Database migration applied.');}finally{await sql.end();}
