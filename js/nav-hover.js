/* Keeps a desktop dropdown open across the gap between the trigger and
   the panel. Closing waits briefly, and moving onto another top-level
   item closes the previous one immediately. */
(function () {
  var items = [].slice.call(document.querySelectorAll(".nav-item"));
  if (!items.length) return;
  var timers = new WeakMap();
  function shut(item) {
    item.classList.remove("hovering");
  }
  items.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      items.forEach(function (other) {
        if (other === item) return;
        var pending = timers.get(other);
        if (pending) clearTimeout(pending);
        shut(other);
      });
      var own = timers.get(item);
      if (own) clearTimeout(own);
      item.classList.add("hovering");
    });
    item.addEventListener("mouseleave", function () {
      var pending = setTimeout(function () { shut(item); }, 280);
      timers.set(item, pending);
    });
  });
})();
