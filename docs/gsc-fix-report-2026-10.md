# GSC "Pages" fix report, October 2026

Property: non-www `outworkemdigital.com`, export of Oct 21 2026 (crawl data to Oct 12).
Canonical domain since Oct 4: `https://www.outworkemdigital.com`.
Only the URLs listed in the task brief are covered here. The raw GSC export files were not in the repo.

"Status before" for redirect rows is the live www site on Oct 21 2026 (404, because `bcdd578` is not deployed yet).
"Final status" is what the rule in `vercel.json` produces once deployed. It is **not verified live yet**.

## 1. Not found (404)
| URL | Before | Action | Final (after deploy) |
|---|---|---|---|
| /category/news/page/2/ | 404 | Rule exists in `vercel.json` | 301 -> /about-us/news/ |
| /category/news/website-launches/ | 404 | Rule exists | 301 -> /about-us/news/ |
| /category/hvac-marketing/local-seo/ | 404 | Rule exists | 301 -> /home-service-marketing-academy/ |
| /2026/04/, /2026/07/, /2025/01/, /2025/03/ | 404 | Rule exists (`/:year(\d{4})/...`) | 301 -> /home-service-marketing-academy/ |
| /services/hvac-local-seo/ and no slash | 404 | Rule exists | 301 -> /marketing-programs/local-seo/ |
| /services/hvac-website-design/ | 404 | Rule exists | 301 -> /marketing-services/website-design-services/ |
| /services/hvac-seo | 404 | Rule exists | 301 -> /marketing-services/organic-seo-services/ |
| /services/hvac-content-marketing | 404 | Rule exists | 301 -> /marketing-services/media-content-production/ |
| /author/Thomas/ | 404 | Rule exists | 301 -> /about-us/meet-the-team/ |
| /news/reddit-chatgpt-citation-drop-ai-search/ | 301 -> /about-us/news/ | None. Old content is not in the repo. Needs the Wayback Machine or the original author. Do not invent content. | unchanged |
| /podcast/Follow, /podcast/Want, /schedule/Follow, /Apply, /Don | 404 | Searched repo HTML, JS, JSON and sitemap. Not from this repo. | stays 404 |
| /wp-content/plugins/gravityforms/assets/js/dist/ | 404 | None, correct behavior | stays 404 |

All destinations were checked as real pages (`folder/index.html`), and none of the sources shadows a live page. All redirects are single hop.

## 2. Page with redirect
| Check | Result | Action |
|---|---|---|
| Internal links using non-www, http, or missing trailing slash | 0 (except the two below) | none |
| Links to old slugs (/pool-boys-case-study/, /desert-state-roofing-case-study/, /workshops/, the Jana TopSeer slug, /marketing-programs with no slash) | 0 | none |
| https://outworkemdigital.com/2025-plan and /2025-worksheet (in the 2025 planning workshop post) | redirect to the academy | left as is (old lead magnets, no equivalent page). Option: repoint to the academy. |
| sitemap.xml | 62 URLs, all www, all trailing slash, all with a real page | `lastmod` set to 2026-10-21 for the 15 pages changed |

## 3. Crawled, currently not indexed
A (WordPress junk) and B (old redirected URLs): no repo change. Confirm with curl after deploy.

C (real pages), state before the change:
| Page | Words | Inbound internal links | Notes |
|---|---|---|---|
| guide-to-seo-for-hvac-contractors | 6205 | 7 | "2024" in title, body stats dated 2024 |
| seo-link-building-for-hvac | 3328 | 2 | |
| local-seo-for-hvac-companies | 3941 | 3 | "2025" in title, overlaps with tactics and Map Pack |
| 2024-seo-forumla-replay | 360 | 2 | thin, "2024" and a typo in the slug |
| 8-proven-strategies (Map Pack) | 778 | 4 | thin, overlaps with local SEO |
| local-seo-tactics | 3802 | 2 | overlaps with local-seo-for-hvac-companies |
| hvac-ppc-campaign-strategies | 3860 | 4 | "2024" in title |
| database-reactivation | 670 | 2 | thin |
| seven-figure-award (news) | 306 | 2 | thin |
| work-retreat (news) | 286 | 3 | thin |
| bullseye (news) | 261 | 5 | thin |

All 11: 200 on www, no noindex, canonical is correct, in the sitemap. None is linked from a service or program page or the homepage.

### Changes made
- **Internal links:** added contextual links (descriptive anchors) from service pages (organic SEO, PPC, Local Service Ads, reputation management, client gifting), program pages (local SEO, Conquer), the about pages, and the related posts.
- **Titles:** removed the stale year from the title, og:title, twitter:title, JSON-LD headline and name, H1 and description of the guide-to-seo, local-seo-for-hvac-companies and hvac-ppc posts. Slugs unchanged, so no new redirects.
- **Local SEO overlap:** kept `local-seo-for-hvac-companies` as the main strategy page. The tactics and Map Pack posts now say what they cover and link back to it. No merge, no redirect, nothing deleted.

### Not done (needs your decision or input)
- **"Last updated" and `dateModified`:** not added. The content itself was not refreshed (body text still says "in 2024" in places), so a new date would be misleading. Add it when the posts are really updated.
- **Thin posts (replay 360, three news posts about 260 to 310 words, database reactivation 670):** no expansion written. I do not have the real facts (who, when, what happened, quotes). Send the details or approve a draft built only from what is already on each page. No noindex added.
- **Body text refresh:** guide-to-seo and ppc posts still contain 2024 stats and wording.
- **Reddit/ChatGPT post rebuild:** needs source content.

## Search Console steps (after the deploy)
1. Pages report, on the **non-www property AND the www property**: open "Not found (404)" and click **Validate fix**. Do the same for "Page with redirect" (these are mostly fine, validation just clears them).
2. URL Inspection on www, then **Request indexing**, for these 11 pages:
   - /hvac-marketing/search-engine-optimization/guide-to-seo-for-hvac-contractors/
   - /hvac-marketing/search-engine-optimization/seo-link-building-for-hvac/
   - /hvac-marketing/search-engine-optimization/local-seo-for-hvac-companies/
   - /hvac-marketing/search-engine-optimization/2024-seo-forumla-replay/
   - /hvac-marketing/8-proven-strategies-to-dominate-google-map-pack-rankings-for-hvac-home-service-contractors/
   - /hvac-marketing/local-seo-tactics-for-hvac-contractors-to-maximize-visibility/
   - /hvac-marketing/pay-per-click-advertising/hvac-ppc-campaign-strategies/
   - /hvac-marketing/database-reactivation-hvac-marketing/145000-from-past-customers-5-step-database-reactivation-strategy/
   - /news/outworkem-digital-achieves-seven-figure-agency-5-figure-award/
   - /news/outworkem-digital-hosts-first-official-work-retreat/
   - /news/bullseye-automobile-partners-with-outworkem-digital/
3. Resubmit https://www.outworkemdigital.com/sitemap.xml in Sitemaps.
4. Leave "Crawled, currently not indexed" validation until the thin pages are expanded.
