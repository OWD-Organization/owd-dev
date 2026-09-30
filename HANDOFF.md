# Handoff — OWD Site rebuild, dev tracker work

Generated on 2026-09-29. This file is temporary (the user is going to delete it).
It gives another agent enough context to continue the dev tracker work without
rereading the whole conversation.

## 1. What this repo is

A rebuild of the Outwork'em Digital site (a marketing agency for home service
contractors), written in plain HTML/CSS/JS. No framework, no build step. 60
`.html` files, each with its CSS mostly inline (partially extracted; see item
18 below).

- **Repo:** `OWD-Organization/owd-dev` on GitHub (the local remote still points
  at `TeamOWD/owd-dev`; it works via a GitHub redirect).
- **Final domain:** `outworkemdigital.com` (WordPress, still in production).
- **Preview:** `https://owd-dev.vercel.app`. This build, serving today.
- **Working source:** `OWD_Website_Audit_Dev_Tracker - Dev Tracker.csv` at the
  repo root (downloaded from a Google Sheet, "Dev Tracker" tab). The user
  updates it by hand in Sheets and re-downloads the CSV when it needs to be
  reread. **Do not assume the local copy is current.** Ask for a fresh download
  if time has passed.

## 2. The most important part: how to deploy

**The Vercel project is NOT connected to GitHub.** Pushing to `main` publishes
nothing. Every change needs this sequence:

```
git add -A -- . ':!OWD_Website_Audit_Dev_Tracker - Dev Tracker.csv'
git commit -m "..."
git push origin main
vercel --prod --yes
```

(The CSV is always excluded from the commit. It is the user's working file,
not part of the site.)

After every deploy, **verify with `curl` against
`https://owd-dev.vercel.app`** that the change is actually live. Do not assume
the deploy matched what was requested. More than once the deploy lagged the
latest commit.

The user gave standing authorization to commit, push, and deploy without
asking at each step (see memory `no-commit-without-authorization.md`). You
still have to report defects you find, not only report success.

## 3. Style rules already set (do not reinvent them)

- **Zero em dashes (—) in visible text.** The 340 that existed were replaced,
  each according to its job (a comma for apposition, a period for independent
  clauses, a colon for title plus subtitle, and so on; see
  `no-em-dashes-in-copy.md`). En dashes (–) are allowed for ranges.
- **Each blog post's thumbnail is its own main photo**, not a separate image
  (`blog-thumbnail-is-main-photo.md`).
- The site's only correct phone number is **833-695-1214** (not 844-931-4624,
  which was an old leftover). The `tel:` format is always `tel:8336951214`.
- Phone links and footer links have **no underline** (explicit
  `text-decoration:none`). Normal running text keeps the browser's native
  underline.
- **Shared CSS** lives in 5 stylesheets, one per template family, in `/css/`,
  with a content hash in the filename and `Cache-Control: immutable` for one
  year (see `vercel.json`). **If you edit one of those sheets, rotate the hash
  in the filename and update every `<link>` that references it.** Otherwise
  the change never reaches anyone with a cached copy (immutable = 1 year).
- `vercel.json` has an `X-Robots-Tag: noindex, nofollow` header rule
  **scoped to host `*.vercel.app`**. It turns itself off when the real domain
  points here. Do not touch that condition without thinking about launch day.
- Analytics tags (Google Ads, Meta Pixel, Microsoft Clarity) are already
  ported from WordPress, **with the same `*.vercel.app` host guard** applied
  in JS (a header cannot do this, because the script has to be injected
  conditionally). See the `<script>` block right after Feedbucket on any page.

## 4. Real status of the Dev Tracker (43 rows: ID 1-38 + L1-L5)

**Watch out: the CSV says "Done" on two rows where there is NO real
implementation in this repo.** Verify it yourself before trusting the Status
column. It looks like someone marked Done based on what already exists on the
live WordPress site (via RankMath, and so on), not on this new build.

| ID | Real status | What was done |
|---|---|---|
| 1 | Done, deployed | `X-Robots-Tag: noindex` scoped to `*.vercel.app` in `vercel.json` |
| 2 | Done, deployed | Phone unified to 833-695-1214 across the site |
| 3 | **CSV says Done. That is false.** | Zero JSON-LD in the repo. Nobody implemented Schema.org here. Still 100% open. |
| 4 | Done, deployed | Canonical + Open Graph + Twitter card on all 58 pages, pointing at `outworkemdigital.com` |
| 5 | Partial. The tracker did not ask for it this way. | Pixels ARE ported (Ads, Meta, Clarity) with a host guard, but **not inside a GTM container** as the fix asks. They load directly. The GTM container is still missing if they insist on that architecture, and the GHL iframe submit on `/schedule/` still needs to be verified. |
| 6 | Open | Redirects for old indexed URLs. `docs/url-map.md` DOES exist (it is not uploaded on deploy because of `.vercelignore`, but it is in the repo) and lists the exact 9 production URLs that are indexed and have no page in this build: `/verified-support/`, `/careers/`, `/workshops/`, `/outwork-em-podcast/`, `/trial/`, `/guides/`, `/news/reddit-chatgpt-citation-drop-ai-search/`, `/news/outworkem-digital-co-founder-thomas-eberts-achieves-clickfunnels-2-comma-club-award/`, `/news/thomas-eberts-featured-in-forbes-alongside-jordan-belfort/`. The tracker fix asks to rebuild the Forbes and Reddit/ChatGPT posts as real pages (they are trust and AI search assets) and to decide redirect vs. new page for the rest. The original Sheet's "301 Redirect Map" tab is still missing, so the destination for each URL is unknown. It did not come in this CSV export. Ask for it if needed. |
| 7 | Done, deployed | 99 images downloaded from WordPress into `/img`, converted to WebP, references repointed. (The tracker said 138. The real count of unique files was 99 across 156 references.) |
| 8 | Open, waiting on the user | Feedbucket is still on all 58 pages. The tracker says remove it **before production**. The user is actively using it to get feedback from Ryan and Jana, so removing it today would cut that channel. **Do not remove it without confirming with the user first.** It probably comes off only on the real launch day. |
| 9 | **CSV says Done. That is false.** | `robots.txt`, `sitemap.xml`, and `404.html` do not exist in the repo. Still 100% open. |
| 10 | Done, deployed | `.vercelignore` keeps these out of the deploy: `docs/`, `*.md`, `*.csv`, `inspiration/`, `wireframe-dark.html`, `web-design-page.pdf`, `stdout`, `.vscode/` |
| 11-13 | Open | Not reviewed yet in this session |
| 14 | Done, deployed | Real alt text on 600 images (they were `alt=""`, not missing). Along the way, 13 more hotlinks (Cloudinary + googleusercontent) were migrated too. |
| 15 | Done, deployed | 5 broken internal links (all absolute URLs to outworkemdigital.com) repointed. 34 more internal links that left the build because they were absolute were converted to relative. 2 lead magnets (`/2025-plan`, `/2025-worksheet`) were left absolute on purpose because they have no equivalent in the new build. |
| 16 | Done, deployed | Old "TopSeer Marketers" brand cleaned up (5 anchor IDs + 1 news slug), with a 301 redirect in `vercel.json` |
| 17 | Done, deployed | Explicit width/height + loading on 599/600 `<img>` tags (the only one left alone is the `our-work` lightbox, on purpose: `display:none` until it opens, and CSS forces `auto`) |
| 18 | Done, deployed | Shared CSS extracted into 5 sheets, one per template family (see section 3) |
| 19-38 | Open | Not reviewed yet in this session |
| L1-L5 | **Out of scope for this repo** | These are fixes to the **live** WordPress site (`outworkemdigital.com`), not to this build. Nothing to do here unless the user asks to replicate the same fix in the new build. No WordPress access was connected in this session (the WPvibe connector showed up in the tools but was never used). |

## 5. Work done that is NOT in the tracker

Before and during this session, many design and content changes were made at
the user's direct request (Ryan and Jana via Feedbucket), with no tracker ID.
The most recent, oldest to newest (see `git log` for the full detail, about
50 commits):

- Animated light on the homepage hero that follows the cursor
- Hero photo replaced with a leads/revenue dashboard (several iterations; the
  final image is a render, not a real screenshot)
- Line balancing on titles (`text-wrap:balance`) across the site
- Contrast and font weight on orange cards (WCAG AA)
- Testimonials section removed temporarily (waiting on real client clips). The
  CSS stays. Only the markup needs to be pasted back when it returns.
- Google reviews removed temporarily (the Google Business Profile is being
  renamed). Same approach: CSS is live, markup is out.
- "Real Work" (portfolio) filled with the first 3 real case studies
- Podcast video embedded (it used to be a fake player)
- Real Instagram feed via Elfsight (it used to be an invented account card)
- Main container widened from 1120px to 1250px across the site
- 12-month trajectory charts on `marketing-programs` (inline SVG, palette
  checked with the dataviz skill)
- Comic illustration in the "Transparency" section
- Ryan's photo reframed in the `/schedule/` hero

**Watch the testimonials section and the Google reviews.** They are
*deliberately* out of the markup. They are not broken. If someone asks to
"fix" those sections, first confirm whether they want them back (in which
case the CSS is already ready) or whether it is a misunderstanding.

## 6. Things to check before continuing

1. **Re-download the CSV** from the Sheet if time has passed. The user updates
   it there, not here.
2. **Do not trust the Status column** without checking the repo (see section
   4. IDs 3 and 9 are the proof it can be wrong).
3. **Ask for the "301 Redirect Map" tab** from the original Sheet if you need
   the destination for each of the 9 URLs listed in `docs/url-map.md`. It did
   not come in this CSV export.
4. IDs 11, 12, 13, and 19-38 **were not touched yet** in this session. They
   are fully open for the next one.
