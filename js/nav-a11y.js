// Keyboard support for the header menus, on top of each page's own nav script.
// - Links inside a closed dropdown, and inside the closed mobile menu, can't be
//   reached with Tab (they used to be focusable while invisible).
// - Esc closes an open dropdown or the mobile menu and returns focus to the
//   button that opened it.
// - A dropdown closes when keyboard focus moves out of it.
// - Opening the mobile menu moves focus into it.
(function () {
  "use strict";
  if (window.__owdNavA11y) return;
  window.__owdNavA11y = true;

  var css =
    // Closed dropdowns: hidden from Tab, but only after the fade-out finishes.
    ".nav-drop{visibility:hidden;transition-property:opacity,transform,visibility;" +
    "transition-duration:.22s,.22s,0s;transition-delay:0s,0s,.22s}" +
    ".nav-item:hover .nav-drop,.nav-item.open .nav-drop{visibility:visible;transition-delay:0s,0s,0s}" +
    // Closed mobile menu: hidden from Tab once its slide-out is done.
    ".mobile-nav{visibility:hidden;transition:visibility 0s linear .45s}" +
    ".mobile-nav.open{visibility:visible;transition-delay:0s}";
  var st = document.createElement("style");
  st.id = "owd-nav-a11y";
  st.textContent = css;
  document.head.appendChild(st);

  function trigger(item) { return item.querySelector(":scope > a, :scope > button"); }
  function closeItem(item) {
    item.classList.remove("open");
    var t = trigger(item);
    if (t) t.setAttribute("aria-expanded", "false");
  }

  function init() {
    var items = [].slice.call(document.querySelectorAll(".nav-item"));
    items.forEach(function (item) {
      item.addEventListener("focusout", function (e) {
        if (item.classList.contains("open") && !item.contains(e.relatedTarget)) closeItem(item);
      });
    });

    var nav = document.getElementById("mobileNav");
    var burger = document.getElementById("hamburger");
    var closeBtn = document.getElementById("mobClose");

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" && e.key !== "Esc") return;
      var open = items.filter(function (i) { return i.classList.contains("open"); })[0];
      if (open) {
        closeItem(open);
        var t = trigger(open);
        if (t) t.focus();
        return;
      }
      if (nav && nav.classList.contains("open") && closeBtn) {
        closeBtn.click();
        if (burger) burger.focus();
      }
    });

    if (nav && burger) {
      burger.addEventListener("click", function () {
        setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 60);
      });
      if (closeBtn) closeBtn.addEventListener("click", function () {
        if (nav.contains(document.activeElement) || document.activeElement === closeBtn) burger.focus();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
