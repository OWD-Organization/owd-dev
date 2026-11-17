// Outwork'em Digital ChatGPT listing pop-up, loaded on every page except
// /schedule/ and the 404 page.
// Opens once per browser session (sessionStorage "owd-cbl-pop"): after 20 s on
// a page, after 40% scroll, or on desktop exit intent. "Pick a time" goes to
// the booking calendar on /chatgpt-business-listing/ (#calendar). On that page
// it scrolls to the calendar instead, and it never opens while the calendar is
// on screen or after the visitor already clicked a link to it.
(function () {
  "use strict";
  if (window.__owdCblPop) return;
  window.__owdCblPop = true;

  var KEY = "owd-cbl-pop";
  var PAGE = "/chatgpt-business-listing/";
  var BOOK = PAGE + "#calendar";
  var DELAY = 20000;

  function seen() { try { return !!sessionStorage.getItem(KEY); } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} }
  if (seen()) return;
  if (typeof HTMLDialogElement !== "function") return;

  var onPage = location.pathname.replace(/\/?$/, "/") === PAGE;
  var cal = onPage ? document.getElementById("calendar") : null;

  var CSS = [
    ".owd-pop{width:min(460px,calc(100vw - 32px));box-sizing:border-box;margin:auto;padding:28px 26px 24px;",
    "border:1px solid var(--line,rgba(255,255,255,.14));border-radius:var(--radius,16px);",
    "background:var(--card,#2b2724);color:var(--text,#f7f3eb);box-shadow:0 24px 60px rgba(0,0,0,.35)}",
    ".owd-pop::backdrop{background:rgba(6,14,28,.6)}",
    ".owd-pop[open]{animation:owdPopIn .28s cubic-bezier(.22,1,.36,1)}",
    "@keyframes owdPopIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}",
    "@media (prefers-reduced-motion:reduce){.owd-pop[open]{animation:none}}",
    ".owd-pop-x{position:absolute;top:8px;right:8px;width:44px;height:44px;display:grid;place-items:center;",
    "background:none;border:0;border-radius:8px;color:var(--muted,#a9a29a);cursor:pointer}",
    ".owd-pop-x:hover{color:var(--text,#f7f3eb)}",
    ".owd-pop-chip{display:inline-flex;align-items:center;margin:0 0 12px;padding:5px 14px;border:1px solid var(--orange,#f28a2e);",
    "border-radius:999px;font-family:var(--head,'Poppins',sans-serif);font-size:12px;font-weight:700;letter-spacing:.08em;",
    "text-transform:uppercase;color:var(--orange-text,#f5a35a)}",
    ".owd-pop-title{font-family:var(--head,'Poppins',sans-serif);font-size:clamp(20px,3vw,24px);font-weight:800;line-height:1.25;",
    "margin:0 0 10px;padding-right:28px;text-wrap:balance;color:inherit}",
    ".owd-pop-text{font-family:var(--body,Georgia,serif);font-size:15.5px;line-height:1.6;color:var(--copy,#e9e3da);margin:0 0 20px}",
    ".owd-pop-actions{display:flex;flex-direction:column;gap:6px;align-items:stretch}",
    ".owd-pop-book{display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;box-sizing:border-box;padding:0 24px;",
    "border-radius:8px;background:var(--orange,#f28a2e);color:#1a120c;text-decoration:none;",
    "font-family:var(--head,'Poppins',sans-serif);font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}",
    ".owd-pop-book:hover{filter:brightness(1.08)}",
    ".owd-pop-later{min-height:44px;background:none;border:0;font-family:var(--head,'Poppins',sans-serif);font-size:14px;",
    "font-weight:600;color:var(--muted,#a9a29a);cursor:pointer}",
    ".owd-pop-later:hover{color:var(--text,#f7f3eb)}",
    ".owd-pop-foot{font-family:var(--head,'Poppins',sans-serif);font-size:13.5px;color:var(--muted,#a9a29a);text-align:center;margin:6px 0 0}",
    ".owd-pop-foot a{color:var(--orange-text,#f5a35a);text-decoration:none}",
    ".owd-pop a:focus-visible,.owd-pop button:focus-visible{outline:2px solid var(--orange,#f28a2e);outline-offset:2px}"
  ].join("");

  var ICON_CLOSE = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.29 1.41 1.42 6.3-6.3 6.29 6.3 1.42-1.42-6.3-6.29 6.3-6.3z"/></svg>';
  var ICON_CAL = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>';

  var pop, timer, done = false;

  function build() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    pop = document.createElement("dialog");
    pop.className = "owd-pop";
    pop.setAttribute("aria-labelledby", "owdPopTitle");
    pop.setAttribute("aria-describedby", "owdPopText");
    pop.innerHTML =
      '<button class="owd-pop-x" type="button" data-pop-close aria-label="Close">' + ICON_CLOSE + '</button>' +
      '<p class="owd-pop-chip">ChatGPT listings</p>' +
      '<p class="owd-pop-title" id="owdPopTitle">Not sure where your business stands on ChatGPT?</p>' +
      '<p class="owd-pop-text" id="owdPopText">Book a discovery call. We look up whether ChatGPT already has your company ' +
      'and walk you through what OpenAI lets you do with it today. Nothing is sold on the call.</p>' +
      '<div class="owd-pop-actions">' +
      '<a class="owd-pop-book" href="' + BOOK + '" autofocus>Pick a time ' + ICON_CAL + '</a>' +
      '<button class="owd-pop-later" type="button" data-pop-close>Not now</button>' +
      '</div>' +
      '<p class="owd-pop-foot">Rather talk now? <a href="tel:8336951214">Call 833-695-1214</a></p>';
    document.body.appendChild(pop);

    [].forEach.call(pop.querySelectorAll("[data-pop-close]"), function (b) {
      b.addEventListener("click", function () { pop.close(); });
    });
    // Backdrop clicks land on the dialog itself, outside its box.
    pop.addEventListener("click", function (e) {
      if (e.target !== pop) return;
      var r = pop.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) pop.close();
    });
    if (cal) {
      pop.querySelector(".owd-pop-book").addEventListener("click", function (e) {
        e.preventDefault();
        pop.close();
        var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
        cal.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        var frame = cal.querySelector("iframe");
        if (frame) {
          frame.setAttribute("tabindex", "-1");
          setTimeout(function () { frame.focus({ preventScroll: true }); }, reduce ? 0 : 500);
        }
        if (history.replaceState) history.replaceState(null, "", "#calendar");
      });
    }
  }

  function stop() { done = true; clearTimeout(timer); markSeen(); }

  // Measured on the spot, so a fast scroll never reads a stale value.
  function calVisible() {
    if (!cal) return false;
    var r = cal.getBoundingClientRect();
    return r.bottom > innerHeight * 0.25 && r.top < innerHeight * 0.75;
  }

  function open() {
    if (done || calVisible() || document.querySelector("dialog[open]")) return;
    stop();
    if (!pop) build();
    pop.showModal();
  }

  function start() {
    timer = setTimeout(function tick() {
      if (calVisible()) timer = setTimeout(tick, 5000); else open();
    }, DELAY);
    addEventListener("scroll", function () {
      var max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max > 0.4) open();
    }, { passive: true });
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
      document.addEventListener("mouseout", function (e) {
        if (!e.relatedTarget && e.clientY <= 0) open();
      });
    }
    // Anyone already headed for the calendar does not need the nudge.
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || (pop && pop.contains(a))) return;
      var h = a.getAttribute("href");
      if (h === "#calendar" || h.indexOf(BOOK) !== -1) stop();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
