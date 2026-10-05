/* ===== STRIPE: program checkout links (all 8 live here, live mode) =====
   The one source of truth for the program checkout buttons. It used to be the
   inline <script id="programCheckoutLinks"> block on /marketing-programs/; it
   moved here so the pricing cards and the 4 program pages
   (/marketing-programs/local-seo/, /spark/, /expand/, /conquer/) read the
   same links.

   Any element with data-checkout="<plan>" and data-period="monthly|yearly"
   gets its href set from the table below. "Let's Get Started" uses each plan's
   monthly link; "Pay yearly" uses the yearly link. The pricing cards carry
   monthly buttons only (Oct 2026); the yearly buttons are on the program
   pages. If a value is missing or isn't a https://buy.stripe.com/ URL, that
   button keeps its /schedule/ fallback and any wrapper marked
   [data-checkout-wrap] stays hidden. Without JavaScript the buttons go to
   /schedule/. */
(function(){
  var programCheckoutLinks = {
    "local-seo": { "monthly": "https://buy.stripe.com/bJeaEX3XM5Mq3Wn7ESgIo0a", "yearly": "https://buy.stripe.com/14AbJ1fGu8YC3Wn6AOgIo0b" },
    "spark":     { "monthly": "https://buy.stripe.com/9B69ATbqe6Qu1Of5wKgIo0c", "yearly": "https://buy.stripe.com/cNicN52TIdeS2Sjf7kgIo0d" },
    "expand":    { "monthly": "https://buy.stripe.com/5kQ4gz65UdeS64v2kygIo0e", "yearly": "https://buy.stripe.com/cNi14ngKygr4eB10cqgIo0f" },
    "conquer":   { "monthly": "https://buy.stripe.com/dRm9AT65U8YC3WngbogIo0g", "yearly": "https://buy.stripe.com/7sY7sLdyma2G1OfbV8gIo0h" }
  };
  function ok(u){ return typeof u === 'string' && /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/.test(u); }
  function apply(){
    [].slice.call(document.querySelectorAll('[data-checkout][data-period]')).forEach(function(a){
      var plan = programCheckoutLinks[a.getAttribute('data-checkout')] || {}, url = plan[a.getAttribute('data-period')];
      if (!ok(url)) return;                       /* keep the /schedule/ fallback */
      a.setAttribute('href', url);
      var wrap = a.closest('[data-checkout-wrap]'); if (wrap) wrap.hidden = false;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
