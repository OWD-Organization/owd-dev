<script>
(function(){
  var html=document.documentElement;
  /* theme is resolved by the inline script in <head>, before first paint */
  var btn=document.getElementById('themeToggle');
  if(btn) btn.addEventListener('click',function(){
    var isDark=html.getAttribute('data-theme')==='dark';
    html.classList.add('switching');html.setAttribute('data-theme',isDark?'light':'dark');
    localStorage.setItem('owd-theme-v2',isDark?'light':'dark');
    setTimeout(function(){html.classList.remove('switching');},380);
  });
  html.classList.add('js');
  var header=document.querySelector('header');
  function onScroll(){if(header)header.classList.toggle('scrolled',window.scrollY>24);}
  onScroll();addEventListener('scroll',onScroll,{passive:true});

  /* mobile nav */
  var hamburger=document.getElementById('hamburger'),mobileNav=document.getElementById('mobileNav'),
    mobClose=document.getElementById('mobClose'),mobOverlay=document.getElementById('mobOverlay'),
    mobSvcToggle=document.getElementById('mobSvcToggle'),mobSub=document.getElementById('mobSub'),
    themeToggleMob=document.getElementById('themeToggleMob');
  function openMob(){if(mobileNav)mobileNav.classList.add('open');if(hamburger){hamburger.classList.add('open');hamburger.setAttribute('aria-expanded','true');}document.body.style.overflow='hidden';}
  function closeMob(){if(mobileNav)mobileNav.classList.remove('open');if(hamburger){hamburger.classList.remove('open');hamburger.setAttribute('aria-expanded','false');}document.body.style.overflow='';}
  if(hamburger)hamburger.addEventListener('click',openMob);
  if(mobClose)mobClose.addEventListener('click',closeMob);
  if(mobOverlay)mobOverlay.addEventListener('click',closeMob);
  if(mobSvcToggle) mobSvcToggle.addEventListener('click',function(){
    var open = !mobSvcToggle.classList.contains('open');
    mobSvcToggle.classList.toggle('open', open);
    mobSvcToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(mobSub) mobSub.classList.toggle('open', open);
  });
  var mobCsToggle=document.getElementById('mobCsToggle');var mobCsSub=document.getElementById('mobCsSub');
  if(mobCsToggle) mobCsToggle.addEventListener('click',function(){
    var open = !mobCsToggle.classList.contains('open');
    mobCsToggle.classList.toggle('open', open);
    mobCsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(mobCsSub) mobCsSub.classList.toggle('open', open);
  });
  var mobAbToggle=document.getElementById('mobAbToggle');
  var mobAbSub=document.getElementById('mobAbSub');
  if(mobAbToggle) mobAbToggle.addEventListener('click',function(){
    var open = !mobAbToggle.classList.contains('open');
    mobAbToggle.classList.toggle('open', open);
    mobAbToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(mobAbSub) mobAbSub.classList.toggle('open', open);
  });
  if(themeToggleMob)themeToggleMob.addEventListener('click',function(){
    var isDark=html.getAttribute('data-theme')==='dark';
    html.classList.add('switching');html.setAttribute('data-theme',isDark?'light':'dark');
    localStorage.setItem('owd-theme-v2',isDark?'light':'dark');
    setTimeout(function(){html.classList.remove('switching');},380);
  });

  /* nav dropdown */
  function setDrop(item, open){
    item.classList.toggle('open', open);
    var t = item.querySelector(':scope > a') || item.querySelector('a');
    if(t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  var navItems=[].slice.call(document.querySelectorAll('.nav-item'));
  navItems.forEach(function(item){
    var trigger = item.querySelector(':scope > a') || item.querySelector('a');
    if(!trigger) return;
    trigger.setAttribute('aria-expanded','false');
    trigger.setAttribute('aria-haspopup','true');
    trigger.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); trigger.click(); }
    });
    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      var isOpen = item.classList.contains('open');
      navItems.forEach(function(i){ setDrop(i, false); });
      if(!isOpen) setDrop(item, true);
    });
  });
  document.addEventListener('click', function(){ navItems.forEach(function(i){ setDrop(i, false); }); });

  /* accordion */
  var accItems=[].slice.call(document.querySelectorAll('.acc-item'));
  function setAcc(i,open){i.classList.toggle('open',open);var t=i.querySelector('.acc-trigger');if(t)t.setAttribute('aria-expanded',open?'true':'false');}
  accItems.forEach(function(item){
    item.querySelector('.acc-trigger').addEventListener('click',function(){
      var isOpen=item.classList.contains('open');
      accItems.forEach(function(i){setAcc(i,false);});
      if(!isOpen)setAcc(item,true);
    });
  });

  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  var sel=['.section-head','.pp-inc','.pp-annual','.acc-item','.cta-band','.pp-compare-scroll'].join(',');
  var items=[].slice.call(document.querySelectorAll(sel));
  items.forEach(function(el){el.classList.add('reveal');});
  items.forEach(function(el){
    var sibs=[].slice.call(el.parentElement.children).filter(function(c){return c.classList.contains('reveal');});
    var i=sibs.indexOf(el);if(i>0)el.style.setProperty('--d',(i*80)+'ms');
  });
  [].slice.call(document.querySelectorAll('.reveal')).forEach(function(el){ if(items.indexOf(el)<0) items.push(el); });
  items.forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top<window.innerHeight&&r.bottom>0) el.classList.add('in'); });
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.10,rootMargin:'0px 0px -6% 0px'});
  items.forEach(function(el){ if(!el.classList.contains('in')) io.observe(el); });
})();
// Bring the current program's column into view when the compare table scrolls sideways
(function(){
  var s=document.querySelector('.pp-compare-scroll'); if(!s) return;
  var cur=s.querySelector('th.is-current'), first=s.querySelector('thead th');
  if(cur && first && s.scrollWidth>s.clientWidth+2){
    s.scrollLeft=Math.max(0,cur.offsetLeft-first.offsetWidth);
  }
})();
</script>
