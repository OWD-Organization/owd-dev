// Outwork'em Digital cookie banner.
// Shows at the start of every browser session and again on every reload
// (F5 / Ctrl+Shift+R); moving between pages by clicking links does not bring
// it back. "Accept" keeps analytics on; "Decline" turns off Google Ads and the
// Meta Pixel and tells Microsoft Clarity not to use cookies. The choice lives
// in sessionStorage ("owd-cookie-consent") for the rest of the session and is
// read in the <head> of every page before the trackers load.
// window.owdCookieSettings() reopens the banner.
(function () {
  "use strict";
  if (window.__owdCookieBanner) return;
  window.__owdCookieBanner = true;

  var KEY = "owd-cookie-consent";
  var PRIVACY = "/privacy-policy/";

  function getChoice() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} }
  // Older builds kept the choice forever in localStorage; drop it.
  try { localStorage.removeItem(KEY); } catch (e) {}

  function isReload() {
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
      if (nav) return nav.type === "reload";
      return performance.navigation && performance.navigation.type === 1;
    } catch (e) { return false; }
  }

  function applyChoice(v) {
    var granted = v === "granted";
    var c = granted ? "granted" : "denied";
    if (typeof window.clarity === "function") {
      window.clarity("consentv2", { ad_Storage: c, analytics_Storage: c });
      if (!granted) window.clarity("consent", false);
    }
    if (window.dataLayer && window.dataLayer.push) {
      (function () { window.dataLayer.push(arguments); })("consent", "update", { ad_storage: c, analytics_storage: c, ad_user_data: c, ad_personalization: c });
    }
    if (typeof window.fbq === "function") window.fbq("consent", granted ? "grant" : "revoke");
    window.__owdNoTrack = !granted;
  }

  var CSS = [
    ".owd-cc{position:fixed;left:16px;bottom:16px;z-index:9000;width:min(420px,calc(100vw - 32px));box-sizing:border-box;",
    "background:var(--card,#2b2724);color:var(--copy,#f7f3eb);border:1px solid var(--line,rgba(255,255,255,.14));border-radius:16px;",
    "box-shadow:0 18px 50px rgba(0,0,0,.35);padding:20px;font-family:var(--head,'Poppins',sans-serif);",
    "transform:translateY(16px);opacity:0;transition:opacity .25s ease,transform .25s ease}",
    ".owd-cc.show{transform:none;opacity:1}",
    ".owd-cc h2{margin:0 0 6px;font-family:var(--head,'Poppins',sans-serif);font-size:16px;font-weight:700;line-height:1.3;color:inherit}",
    ".owd-cc p{margin:0 0 16px;font-family:var(--body,Georgia,serif);font-size:14px;line-height:1.55;color:inherit;opacity:.85}",
    ".owd-cc p a{color:var(--orange,#f28a2e);text-decoration:underline}",
    ".owd-cc .owd-cc-btns{display:flex;gap:10px}",
    ".owd-cc button{flex:1;min-height:44px;border-radius:999px;font-family:var(--head,'Poppins',sans-serif);font-size:14px;font-weight:600;cursor:pointer;padding:0 18px}",
    ".owd-cc .owd-cc-yes{background:var(--orange,#f28a2e);border:1px solid var(--orange,#f28a2e);color:#1a120c}",
    ".owd-cc .owd-cc-no{background:transparent;border:1px solid var(--line,rgba(255,255,255,.3));color:inherit}",
    ".owd-cc button:hover{filter:brightness(1.08)}",
    ".owd-cc button:focus-visible,.owd-cc a:focus-visible{outline:2px solid var(--orange,#f28a2e);outline-offset:2px}",
    // keep clear of the fixed Call / Book Now bar on phones
    "@media (max-width:900px){.owd-cc{left:12px;right:12px;width:auto;bottom:calc(84px + env(safe-area-inset-bottom))}}",
    "@media (prefers-reduced-motion:reduce){.owd-cc{transition:none}}"
  ].join("");

  var box;
  function show() {
    if (box) { box.remove(); box = null; }
    if (!document.getElementById("owd-cc-css")) {
      var st = document.createElement("style");
      st.id = "owd-cc-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    box = document.createElement("section");
    box.className = "owd-cc";
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", "Cookie consent");
    box.innerHTML =
      '<h2>We use cookies</h2>' +
      '<p>We use cookies to understand how visitors use our site and to measure our ads. ' +
      'You can accept or decline. Read our <a href="' + PRIVACY + '">Privacy Policy</a>.</p>' +
      '<div class="owd-cc-btns">' +
      '<button type="button" class="owd-cc-no">Decline</button>' +
      '<button type="button" class="owd-cc-yes">Accept</button>' +
      "</div>";
    document.body.appendChild(box);
    box.querySelector(".owd-cc-yes").addEventListener("click", function () { decide("granted"); });
    box.querySelector(".owd-cc-no").addEventListener("click", function () { decide("denied"); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (box) box.classList.add("show"); }); });
  }

  function decide(v) {
    setChoice(v);
    applyChoice(v);
    if (!box) return;
    var b = box; box = null;
    b.classList.remove("show");
    setTimeout(function () { b.remove(); }, 260);
  }

  window.owdCookieSettings = show;

  function init() { if (!getChoice() || isReload()) show(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
