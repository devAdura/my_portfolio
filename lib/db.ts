import postgres from 'postgres';
let sql:ReturnType<typeof postgres>|undefined;
export function getSql(){
 if(!process.env.DATABASE_URL)throw new Error('Database is not configured');
 return sql??=postgres(process.env.DATABASE_URL,{max:1,prepare:false,idle_timeout:20,connect_timeout:10,ssl:process.env.NODE_ENV==='production'?'verify-full':undefined});
}
