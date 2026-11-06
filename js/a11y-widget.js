// Outwork'em Digital accessibility widget.
// Same widget as the Comfort One site (custom rebuild of the Ally widget): same
// button (person icon, brand blue #12407A, rounded, center-left on desktop /
// center-right on mobile) and
// its visual tools. The button and panel live in a shadow root so site CSS and
// the page effects below never touch them. Choices persist across pages.
(function () {
  "use strict";
  if (window.__c1a11y) return;
  window.__c1a11y = true;

  var KEY = "owd-a11y";
  var COLOR = "#12407A";
  var STATEMENT = ""; // no accessibility statement page yet; set a path to show the link
  var ROOT_ID = "c1-a11y-root";
  var html = document.documentElement;

  var T = {
    open: "Open accessibility adjustments", title: "Accessibility Adjustments", close: "Close",
    reset: "Reset all settings", statement: "Accessibility statement",
    text: "Bigger text", lh: "Line height", align: "Text align", font: "Readable font",
    gray: "Grayscale", contrast: "Contrast", structure: "Page structure", mask: "Reading mask",
    hideImg: "Hide images", pause: "Pause animations", links: "Highlight links", off: "Off", left: "Left", center: "Center", right: "Right",
    high: "High contrast", negative: "Negative", light: "Light background", dark: "Dark background",
    headings: "Headings", landmarks: "Landmarks", linksTab: "Links", back: "Back", none: "None found"
  };

  // Tools: levels > 1 cycle through steps on each click, like Ally.
  var TOOLS = [
    { id: "text", levels: 3, icon: "M4 7V4h16v3M9 20h6M12 4v16" },
    { id: "lh", levels: 3, icon: "M3 6h12M3 12h12M3 18h12M19 4v16M17 6l2-2 2 2M17 18l2 2 2-2" },
    { id: "align", levels: 3, labels: ["left", "center", "right"], icon: "M4 6h16M4 10h10M4 14h16M4 18h10" },
    { id: "font", levels: 1, icon: "M5 20 12 4l7 16M8 14h8" },
    { id: "gray", levels: 1, icon: "M12 3a9 9 0 1 0 0 18V3z M12 3a9 9 0 0 1 0 18" },
    { id: "contrast", levels: 4, labels: ["high", "negative", "light", "dark"], icon: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0v18" },
    { id: "structure", levels: 0, icon: "M4 5h7M4 12h16M4 19h11M14 5h6" },
    { id: "mask", levels: 1, icon: "M3 9h18v6H3zM3 4h18M3 20h18" },
    { id: "hideImg", levels: 1, icon: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M3 3l18 18" },
    { id: "pause", levels: 1, icon: "M9 6v12M15 6v12" },
    { id: "links", levels: 1, icon: "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" }
  ];

  var state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  if (state.lang) { delete state.lang; save(); } // the widget is English only
  function t(k) { return T[k]; }

  // ---------- page effects ----------
  var PAGE_CSS = [
    // line height
    "html.c1a-lh-1 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6,span,a){line-height:1.75!important}",
    "html.c1a-lh-2 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6,span,a){line-height:2!important}",
    "html.c1a-lh-3 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6,span,a){line-height:2.4!important}",
    // text align
    "html.c1a-align-1 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6){text-align:left!important}",
    "html.c1a-align-2 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6){text-align:center!important}",
    "html.c1a-align-3 body :is(p,li,dd,dt,td,th,blockquote,label,h1,h2,h3,h4,h5,h6){text-align:right!important}",
    // readable font (icon fonts keep their face)
    "html.c1a-font-1 body *:not(.material-icons):not(.material-icons *):not(svg):not(svg *){font-family:'Atkinson Hyperlegible',Arial,Helvetica,sans-serif!important;letter-spacing:.01em!important}",
    // grayscale / contrast are applied to body children so fixed elements keep working
    "html.c1a-gray-1 body>*:not(#" + ROOT_ID + "){filter:grayscale(1)!important}",
    "html.c1a-contrast-1 body>*:not(#" + ROOT_ID + "){filter:contrast(1.6)!important}",
    "html.c1a-gray-1.c1a-contrast-1 body>*:not(#" + ROOT_ID + "){filter:grayscale(1) contrast(1.6)!important}",
    "html.c1a-contrast-2 body>*:not(#" + ROOT_ID + "){filter:invert(1) hue-rotate(180deg)!important}",
    "html.c1a-gray-1.c1a-contrast-2 body>*:not(#" + ROOT_ID + "){filter:grayscale(1) invert(1)!important}",
    "html.c1a-contrast-2 body :is(img,video,iframe,picture,[data-c1a-bg]){filter:invert(1) hue-rotate(180deg)!important}",
    "html.c1a-contrast-3 body *:not(#" + ROOT_ID + "){background-color:#fff!important;background-image:none!important;color:#000!important;border-color:#000!important;text-shadow:none!important}",
    "html.c1a-contrast-3 body{background:#fff!important}",
    "html.c1a-contrast-4 body *:not(#" + ROOT_ID + "){background-color:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important}",
    "html.c1a-contrast-4 body{background:#000!important}",
    "html.c1a-contrast-4 body a,html.c1a-contrast-4 body a *{color:#ffe14d!important}",
    "html.c1a-contrast-3 body a,html.c1a-contrast-3 body a *{color:#0b3fb5!important}",
    // hide images
    "html.c1a-hideImg-1 body :is(img,picture,video,figure img){visibility:hidden!important}",
    "html.c1a-hideImg-1 body [data-c1a-bg]{background-image:none!important}",
    // pause animations
    "html.c1a-pause-1 *,html.c1a-pause-1 *::before,html.c1a-pause-1 *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}",
    // highlight links
    "html.c1a-links-1 body a:not(#" + ROOT_ID + " *){text-decoration:underline!important;text-underline-offset:3px!important;outline:2px dashed #1d4ed8!important;outline-offset:2px!important}",
    "html.c1a-links-1 body a:not(#" + ROOT_ID + " *):hover{background:#ffe14d!important;color:#000!important}",
    // reading mask
    ".c1a-mask{position:fixed;left:0;right:0;background:rgba(10,12,30,.62);pointer-events:none;z-index:2147483000}",
    // skip link smooth scroll target
    "#content:focus{outline:none}"
  ].join("\n");

  function injectPageCss() {
    var s = document.createElement("style");
    s.id = "c1-a11y-page-css";
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
  }

  // Bigger text: scale each text element from its own original size.
  var TEXT_STEPS = [1, 1.15, 1.3, 1.5];
  var TEXT_SEL = "p,li,a,span,h1,h2,h3,h4,h5,h6,td,th,dd,dt,label,blockquote,button,input,select,textarea,strong,em,small,figcaption,time,div";
  function scaleText(root) {
    var f = TEXT_STEPS[state.text || 0];
    var els = (root || document.body).querySelectorAll(TEXT_SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest("#" + ROOT_ID) || el.closest(".material-icons") || el.classList.contains("material-icons")) continue;
      if (el.tagName === "DIV" && !hasOwnText(el)) continue;
      if (f === 1) {
        if (el.hasAttribute("data-c1a-fs")) { el.style.removeProperty("font-size"); el.removeAttribute("data-c1a-fs"); }
        continue;
      }
      var base = el.getAttribute("data-c1a-fs");
      if (!base) { base = parseFloat(getComputedStyle(el).fontSize); el.setAttribute("data-c1a-fs", base); }
      el.style.setProperty("font-size", (parseFloat(base) * f).toFixed(2) + "px", "important");
    }
  }
  function hasOwnText(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return true;
    return false;
  }

  // Elements with a photo background (not gradients), for hide images / negative.
  function markBackgrounds() {
    var all = document.body.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
      var bg = getComputedStyle(all[i]).backgroundImage;
      if (bg && bg.indexOf("url(") !== -1 && !all[i].closest("#" + ROOT_ID)) all[i].setAttribute("data-c1a-bg", "");
    }
  }

  var mask = null;
  function setMask(on) {
    if (on && !mask) {
      mask = [document.createElement("div"), document.createElement("div")];
      mask.forEach(function (m) { m.className = "c1a-mask"; m.setAttribute("aria-hidden", "true"); document.body.appendChild(m); });
      moveMask(window.innerHeight / 2);
      window.addEventListener("mousemove", onMaskMove, { passive: true });
      window.addEventListener("touchmove", onMaskMove, { passive: true });
    } else if (!on && mask) {
      mask.forEach(function (m) { m.remove(); });
      mask = null;
      window.removeEventListener("mousemove", onMaskMove);
      window.removeEventListener("touchmove", onMaskMove);
    }
  }
  function onMaskMove(e) { var y = e.touches ? e.touches[0].clientY : e.clientY; moveMask(y); }
  function moveMask(y) {
    if (!mask) return;
    var band = 70;
    mask[0].style.top = "0"; mask[0].style.height = Math.max(0, y - band) + "px";
    mask[1].style.top = (y + band) + "px"; mask[1].style.bottom = "0";
  }

  function pauseMedia(on) {
    document.querySelectorAll("video").forEach(function (v) { try { on ? v.pause() : null; } catch (e) {} });
  }


  function apply() {
    var keep = html.className.split(/\s+/).filter(function (c) { return c && c.indexOf("c1a-") !== 0; });
    TOOLS.forEach(function (tool) {
      var v = state[tool.id];
      if (v && tool.id !== "text") keep.push("c1a-" + tool.id + "-" + v);
    });
    html.className = keep.join(" ");
    scaleText();
    if (state.hideImg || state.contrast === 2) markBackgrounds();
    setMask(!!state.mask);
    pauseMedia(!!state.pause);
  }

  // ---------- widget UI (shadow DOM) ----------
  var UI_CSS = [
    ":host{all:initial}",
    "*{box-sizing:border-box;font-family:Roboto,'Segoe UI',Arial,Helvetica,sans-serif}",
    ".btn{position:fixed;top:50%;left:10px;transform:translateY(-50%);width:56px;height:56px;border-radius:32px;border:0;background:" + COLOR + ";color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.28);z-index:2147483100;transition:transform .2s}",
    ".btn:hover{transform:translateY(-50%) scale(1.06)}",
    ".btn:focus-visible{outline:3px solid #2563eb;outline-offset:3px}",
    ".btn svg{width:34px;height:34px}",
    "@media (max-width:767px){.btn{left:auto;right:10px;top:calc(50% - 120px);width:50px;height:50px}.btn svg{width:30px;height:30px}}",
    ".panel{position:fixed;top:12px;bottom:12px;left:12px;width:min(420px,calc(100vw - 24px));background:#fff;color:#0c0d0e;border-radius:16px;box-shadow:0 18px 60px rgba(0,0,0,.35);z-index:2147483200;display:flex;flex-direction:column;overflow:hidden;transform:translateX(-110%);transition:transform .25s ease;visibility:hidden}",
    ".panel.open{transform:none;visibility:visible}",
    "@media (max-width:767px){.panel{top:0;bottom:0;left:0;width:100vw;border-radius:0}}",
    ".head{background:" + COLOR + ";color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}",
    ".head h2{flex:1;margin:0;font-size:18px;font-weight:600;color:#fff}",
    ".ibtn{background:rgba(255,255,255,.16);border:0;color:#fff;height:36px;min-width:36px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;font-size:14px;font-weight:500}",
    ".ibtn:hover{background:rgba(255,255,255,.28)}",
    ".ibtn:focus-visible,.card:focus-visible,.foot button:focus-visible,.foot a:focus-visible,.list button:focus-visible,.tabs button:focus-visible{outline:3px solid #2563eb;outline-offset:2px}",
    ".body{flex:1;overflow:auto;padding:16px;background:#f5f6f8}",
    ".grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    ".card{background:#fff;border:2px solid #fff;border-radius:14px;padding:14px 10px 12px;min-height:108px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:#0c0d0e;font-size:14px;font-weight:500;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08);transition:border-color .15s}",
    ".card:hover{border-color:#e3c2c3}",
    ".card[aria-pressed=true]{border-color:" + COLOR + ";color:" + COLOR + "}",
    ".card[disabled]{opacity:.45;cursor:not-allowed}",
    ".card svg{width:28px;height:28px}",
    ".sub{font-size:12px;font-weight:500;color:#5a5f6b;min-height:15px}",
    ".card[aria-pressed=true] .sub{color:" + COLOR + "}",
    ".steps{display:flex;gap:4px}.steps i{width:16px;height:4px;border-radius:2px;background:#d9dbe1}.steps i.on{background:" + COLOR + "}",
    ".foot{display:flex;flex-direction:column;gap:10px;padding:14px 16px;border-top:1px solid #e6e7eb;background:#fff}",
    ".foot button{background:" + COLOR + ";color:#fff;border:0;border-radius:10px;padding:12px;font-size:15px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}",
    ".foot a{color:" + COLOR + ";font-size:14px;text-align:center;font-weight:500}",
    ".tabs{display:flex;gap:6px;margin-bottom:12px}",
    ".tabs button{flex:1;border:1px solid #d5d7de;background:#fff;border-radius:10px;padding:8px;cursor:pointer;font-size:13px;color:#0c0d0e}",
    ".tabs button[aria-pressed=true]{border-color:" + COLOR + ";color:" + COLOR + ";font-weight:600}",
    ".list{display:flex;flex-direction:column;gap:6px}",
    ".list button{text-align:left;background:#fff;border:1px solid #e6e7eb;border-radius:10px;padding:10px 12px;cursor:pointer;font-size:14px;color:#0c0d0e;display:flex;gap:10px;align-items:baseline}",
    ".list b{font-size:11px;color:" + COLOR + ";min-width:26px;text-transform:uppercase}",
    ".back{background:none;border:0;color:" + COLOR + ";font-size:14px;font-weight:600;cursor:pointer;padding:0 0 12px}",
    "@media (prefers-reduced-motion:reduce){.panel,.btn{transition:none}}"
  ].join("\n");

  var PERSON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.2" r="2.2"/><path d="M4.3 7.6c-.5-.1-.9.3-1 .8-.1.5.3.9.8 1l5.1 1v3.2l-1.9 6.4c-.2.5.1 1.1.6 1.2.5.2 1.1-.1 1.2-.6L11 14.8h2l1.9 5.8c.2.5.7.8 1.2.6.5-.2.8-.7.6-1.2l-1.9-6.4v-3.2l5.1-1c.5-.1.9-.5.8-1-.1-.5-.5-.9-1-.8-2.5.5-5.1.8-7.7.8s-5.2-.3-7.7-.8z"/></svg>';
  function icon(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; }

  var host, shadow, btn, panel, view = "tools", structTab = "headings", lastFocus = null;

  function build() {
    host = document.createElement("div");
    host.id = ROOT_ID;
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: "open" });
    var st = document.createElement("style");
    st.textContent = UI_CSS;
    shadow.appendChild(st);
    btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = PERSON;
    btn.addEventListener("click", function () { panel.classList.contains("open") ? close() : open(); });
    shadow.appendChild(btn);
    panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.addEventListener("keydown", trap);
    shadow.appendChild(panel);
    render();
  }

  function render() {
    btn.setAttribute("aria-label", t("open"));
    btn.title = t("title");
    panel.setAttribute("aria-label", t("title"));
    var head = '<div class="head"><h2>' + t("title") + '</h2>' +
      '<button type="button" class="ibtn" id="closeBtn" aria-label="' + t("close") + '">✕</button></div>';
    var body = view === "structure" ? structureView() : toolsView();
    var foot = '<div class="foot"><button type="button" id="resetBtn">↺ ' + t("reset") + '</button>' +
      (STATEMENT ? '<a href="' + STATEMENT + '">' + t("statement") + "</a>" : "") + "</div>";
    panel.innerHTML = head + '<div class="body">' + body + "</div>" + foot;
    wire();
  }

  function toolsView() {
    return '<div class="grid">' + TOOLS.map(function (tool) {
      var v = state[tool.id] || 0;
      var sub = "";
      if (tool.levels > 1) {
        sub = v ? t(tool.labels ? tool.labels[v - 1] : "") || "" : t("off");
        if (!tool.labels) sub = '<span class="steps">' + Array.apply(null, Array(tool.levels)).map(function (_, i) { return "<i" + (i < v ? ' class="on"' : "") + "></i>"; }).join("") + "</span>";
      }
      return '<button type="button" class="card" data-tool="' + tool.id + '" aria-pressed="' + (!!v) + '"' + ">" +
        icon(tool.icon) + "<span>" + t(tool.id) + '</span><span class="sub">' + sub + "</span></button>";
    }).join("") + "</div>";
  }

  function structureItems() {
    if (structTab === "headings") {
      return [].slice.call(document.querySelectorAll("h1,h2,h3,h4")).filter(visible).map(function (el) { return { el: el, tag: el.tagName, text: el.textContent }; });
    }
    if (structTab === "landmarks") {
      return [].slice.call(document.querySelectorAll("header,nav,main,footer,aside,section[aria-label],section[aria-labelledby],[role=region],[role=navigation],[role=contentinfo],[role=banner]"))
        .filter(visible).map(function (el) {
          var lbl = el.getAttribute("aria-label") || (el.getAttribute("aria-labelledby") && (document.getElementById(el.getAttribute("aria-labelledby")) || {}).textContent) || "";
          return { el: el, tag: el.getAttribute("role") || el.tagName.toLowerCase(), text: lbl || el.tagName.toLowerCase() };
        });
    }
    return [].slice.call(document.querySelectorAll("a[href]")).filter(visible).map(function (el) { return { el: el, tag: "a", text: el.getAttribute("aria-label") || el.textContent }; });
  }
  function visible(el) { return !el.closest("#" + ROOT_ID) && el.getClientRects().length > 0; }

  var structList = [];
  function structureView() {
    structList = structureItems();
    var tabs = '<div class="tabs">' + ["headings", "landmarks", "linksTab"].map(function (k) {
      var id = k === "linksTab" ? "links" : k;
      return '<button type="button" data-tab="' + id + '" aria-pressed="' + (structTab === id) + '">' + t(k) + "</button>";
    }).join("") + "</div>";
    var items = structList.length ? structList.map(function (it, i) {
      return '<button type="button" data-go="' + i + '"><b>' + it.tag + "</b><span>" + esc(it.text.replace(/\s+/g, " ").trim().slice(0, 90)) + "</span></button>";
    }).join("") : "<p>" + t("none") + "</p>";
    return '<button type="button" class="back" id="backBtn">‹ ' + t("back") + "</button>" + tabs + '<div class="list">' + items + "</div>";
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function wire() {
    shadow.getElementById("closeBtn").addEventListener("click", close);
    shadow.getElementById("resetBtn").addEventListener("click", function () {
      state = {}; save(); apply(); render(); focusFirst();
    });
    panel.querySelectorAll(".card").forEach(function (c) {
      c.addEventListener("click", function () {
        var id = c.getAttribute("data-tool");
        var tool = TOOLS.filter(function (x) { return x.id === id; })[0];
        if (id === "structure") { view = "structure"; render(); var bb = shadow.getElementById("backBtn"); if (bb) bb.focus(); return; }
        var v = state[id] || 0;
        state[id] = tool.levels > 1 ? (v + 1) % (tool.levels + 1) : (v ? 0 : 1);
        if (!state[id]) delete state[id];
        save(); apply(); render();
        var again = panel.querySelector('[data-tool="' + id + '"]'); if (again) again.focus();
      });
    });
    var back = shadow.getElementById("backBtn");
    if (back) back.addEventListener("click", function () { view = "tools"; render(); var s = panel.querySelector('[data-tool="structure"]'); if (s) s.focus(); });
    panel.querySelectorAll("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () { structTab = b.getAttribute("data-tab"); render(); var nb = panel.querySelector('[data-tab="' + structTab + '"]'); if (nb) nb.focus(); });
    });
    panel.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function () {
        var it = structList[+b.getAttribute("data-go")]; if (!it) return;
        close();
        it.el.scrollIntoView({ behavior: state.pause ? "auto" : "smooth", block: "center" });
        if (!it.el.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(it.el.tagName)) it.el.setAttribute("tabindex", "-1");
        setTimeout(function () { it.el.focus({ preventScroll: true }); }, 300);
      });
    });
  }

  function focusables() { return [].slice.call(panel.querySelectorAll("button:not([disabled]),a[href]")).filter(function (el) { return el.offsetParent !== null; }); }
  function focusFirst() { var f = focusables(); if (f[0]) f[0].focus(); }
  function trap(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables(); if (!f.length) return;
    var first = f[0], last = f[f.length - 1], active = shadow.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }
  function open() {
    lastFocus = document.activeElement;
    view = "tools"; render();
    panel.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    setTimeout(focusFirst, 30);
  }
  function close() {
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }

  // Skip to content: smooth scroll and move focus to the content anchor.
  function wireSkipLink() {
    var link = document.querySelector(".c1a-skip-link");
    var target = document.getElementById("content");
    if (!link) return;
    if (!target) { link.remove(); return; }
    link.addEventListener("click", function (e) {
      e.preventDefault();
      target.scrollIntoView({ behavior: state.pause ? "auto" : "smooth" });
      target.focus({ preventScroll: true });
    });
  }

  function init() {
    injectPageCss();
    build();
    apply();
    wireSkipLink();
    // Content added later (load more, lightboxes) gets the same text size.
    if ("MutationObserver" in window) {
      new MutationObserver(function (muts) {
        if (!state.text) return;
        muts.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1 && !n.closest("#" + ROOT_ID)) scaleText(n.parentNode || n); }); });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
