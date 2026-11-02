# Elite Software portfolio

Portfolio for Adura Gbemi, with a React and Next.js frontend, PostgreSQL enquiry storage, and a private owner inbox. The downloadable CV retains the official name.

## GitHub and Vercel

Target repository: https://github.com/devAdura/my_portfolio

1. Push this checkout to the repository.
2. Import that repository into Vercel using the Next.js framework preset.
3. Connect a PostgreSQL database from the Vercel Marketplace, or an existing database, and set DATABASE_URL. Use separate databases for production and preview deployments.
4. Set INBOX_PASSWORD privately in Vercel to a unique password of at least 16 characters. Set INBOX_SESSION_SECRET to a separate random secret of at least 32 characters. Do not put these values into Git, chat, screenshots, or logs.
5. Apply the schema using npm run db:migrate with DATABASE_URL securely supplied through the environment. Apply this before testing contact submissions. The build intentionally does not alter the database or require production credentials.
6. Deploy. Set NEXT_PUBLIC_SITE_URL to the final production address and redeploy. If omitted, Vercel's production-domain variable supplies the canonical origin.
7. Verify the homepage, CV download, contact submission, and private /inbox sign-in.

Vercel automatically builds new commits pushed to the connected production branch. No Cloudflare Worker bindings or ChatGPT sign-in are used in this copy.

## Local development

Use Node.js 22 or later. Run npm ci, copy .env.example to .env.local, fill values privately, then run npm run db:migrate and npm run dev. Local database TLS follows the supplied database connection options. Production database connections require certificate verification.

Checks: npm run typecheck, npm test, npm run build.

## Contact and inbox

Direct email: oyetundetim@gmail.com. WhatsApp: +234 915 243 7771.

The contact form validates fields, rejects off-site requests and honeypot submissions, and uses PostgreSQL advisory locks to throttle repeated enquiries from the same email address. Enquiries are stored in PostgreSQL. Automatic email notifications are not configured.

The owner inbox at /inbox uses a password, a signed eight-hour HTTP-only cookie, SameSite protection, and database-backed sign-in throttling. Changing INBOX_SESSION_SECRET revokes existing sessions. ChatGPT identity headers are never used for authentication.

## Migration scope

The original public site remains live while this deployment is prepared. This checkout contains source and public assets only. Existing enquiry records from the previous Cloudflare database are not copied automatically. Export and import those records separately if needed before retiring the previous site.

No production PostgreSQL connection or GitHub/Vercel authorization has been embedded in this repository. Contact persistence requires database provisioning and the migration above.
