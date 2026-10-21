# Deploy instructions for the dev (Vercel is NOT connected to GitHub)

Pushing to `main` publishes nothing. Someone with access to the Vercel account must deploy by hand.
Two commits are waiting to go live: `bcdd578` (WordPress redirects in `vercel.json`) and the GSC fix commit that follows it.

## One-time setup
1. Install the CLI: `npm i -g vercel` (needs Node.js from nodejs.org).
2. Log in: `vercel login`, finish in the browser (GitHub, or the outworkemdigital.com email that owns the project).
3. Check: `vercel whoami`.
4. From the repo folder, link the project: `vercel link` (team that owns the site, link to existing project = yes, project = `owd-dev`).
   `.vercel` is already in `.gitignore`. Never commit it.
5. Confirm the live domain belongs to that project: `vercel domains ls` and `vercel project ls`
   (`outworkemdigital.com` and `www.outworkemdigital.com` must be on `owd-dev`). If they are on another project, stop and report which one.

## Deploy
```
git checkout main && git pull origin main
git log --oneline -3        # must include bcdd578 and the GSC fix commit
vercel --prod --yes
```

## Verify (every line should match)
```
curl -sI https://www.outworkemdigital.com/category/news/ | grep -iE "^HTTP|^location"        # 301/308 -> /about-us/news/
curl -sI https://www.outworkemdigital.com/services/hvac-seo | grep -iE "^HTTP|^location"     # 301/308 -> /marketing-services/organic-seo-services/
curl -sI https://www.outworkemdigital.com/author/Thomas/ | grep -iE "^HTTP|^location"        # 301/308 -> /about-us/meet-the-team/
curl -sI https://www.outworkemdigital.com/2025/01/ | grep -iE "^HTTP|^location"              # 301/308 -> /home-service-marketing-academy/
curl -sI https://www.outworkemdigital.com/ | grep -iE "^HTTP"                                # 200
curl -sI https://www.outworkemdigital.com/sitemap.xml | grep -iE "^HTTP"                     # 200
```
If a redirect URL still returns 404, the deploy did not reach the live project. Re-check step 5.

## Optional: make deploys automatic
Vercel dashboard > owd-dev > Settings > Git > Connect Git Repository > OWD-Organization/owd-dev.
After that, update `HANDOFF.md` so it no longer says deploys are manual.
