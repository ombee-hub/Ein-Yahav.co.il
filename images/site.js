/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- mobile menu + dropdowns (slide-in drawer) ---------- */
(function () {
  const menu = document.getElementById('mainmenu');
  const btn = document.querySelector('.menu-btn');
  if (!menu || !btn) return;
  const isMobile = () => window.matchMedia('(max-width:920px)').matches;

  // header row (close ✕ on the right + logo) at the top of the mobile drawer
  if (!menu.querySelector('.drawer-head')) {
    const li = document.createElement('li');
    li.className = 'drawer-head';
    li.innerHTML = '<button type="button" class="drawer-close" aria-label="סגירה">✕</button>' +
                   '<a href="index.html" class="drawer-logo-link"><img src="images/ein-yahav-logo.png" alt="עין יהב"></a>';
    menu.insertBefore(li, menu.firstChild);
    li.querySelector('.drawer-close').addEventListener('click', () => close());
  }

  function sync() {
    const open = menu.classList.contains('open');
    document.body.classList.toggle('nav-open', open && isMobile());
  }
  function close() {
    menu.classList.remove('open');
    menu.querySelectorAll('.has-drop.open').forEach(d => d.classList.remove('open'));
    sync();
  }

  // menu-btn has an inline toggle; run sync right after it fires
  btn.addEventListener('click', () => setTimeout(sync, 0));

  // dropdown parent toggles submenu on mobile instead of navigating
  menu.querySelectorAll('.has-drop > .drop-toggle').forEach(t => {
    t.addEventListener('click', e => {
      if (isMobile()) { e.preventDefault(); t.closest('.has-drop').classList.toggle('open'); }
    });
  });

  // real links close the drawer
  menu.querySelectorAll('a:not(.drop-toggle)').forEach(a =>
    a.addEventListener('click', close));

  // click on the dark overlay (outside the drawer) closes it
  document.addEventListener('click', e => {
    if (document.body.classList.contains('nav-open') &&
        !menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (!isMobile()) close(); });
})();

/* ---------- carousel ---------- */
(function () {
  const car = document.getElementById('carousel');
  if (!car) return;
  const track = document.getElementById('carTrack');
  const slides = track.children;
  const dotsWrap = document.getElementById('carDots');
  let i = 0, timer;
  const n = slides.length;
  for (let k = 0; k < n; k++) {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'תמונה ' + (k + 1));
    b.addEventListener('click', () => go(k, true));
    dotsWrap.appendChild(b);
  }
  const dots = dotsWrap.children;
  function render() {
    track.style.transform = 'translateX(' + (-i * 100) + '%)';
    for (let k = 0; k < n; k++) dots[k].classList.toggle('on', k === i);
  }
  function go(k, user) { i = (k + n) % n; render(); if (user) restart(); }
  function next() { go(i + 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 5000); }
  car.querySelector('.car-next').addEventListener('click', () => { go(i + 1); restart(); });
  car.querySelector('.car-prev').addEventListener('click', () => { go(i - 1); restart(); });
  render(); restart();
  car.addEventListener('mouseenter', () => clearInterval(timer));
  car.addEventListener('mouseleave', restart);
})();

/* ---------- accessibility panel ---------- */
(function () {
  const root = document.documentElement;
  const KEY = 'einyahav-a11y';
  const state = JSON.parse(localStorage.getItem(KEY) || '{}');

  const toggles = [
    { id: 'links',        cls: 'acc-links',        icon: '🔗', label: 'הדגשת קישורים' },
    { id: 'contrast',     cls: 'acc-contrast',     icon: '◐',  label: 'ניגודיות גבוהה' },
    { id: 'darkcontrast', cls: 'acc-darkcontrast', icon: '🌙', label: 'ניגודיות כהה' },
    { id: 'spacing',      cls: 'acc-spacing',      icon: '↔',  label: 'ריווח טקסט' },
    { id: 'bigtext',      cls: 'acc-bigtext',      icon: 'T',  label: 'טקסט גדול' },
    { id: 'lineheight',   cls: 'acc-lineheight',   icon: '≡',  label: 'גובה שורה' },
    { id: 'readable',     cls: 'acc-readable',     icon: 'Df', label: 'גופן קריא' },
    { id: 'noimg',        cls: 'acc-noimg',        icon: '🖼', label: 'הסתרת תמונות' },
    { id: 'noanim',       cls: 'acc-noanim',       icon: '⏸',  label: 'ביטול הנפשות' },
    { id: 'cursor',       cls: 'acc-cursor',       icon: '➤',  label: 'סמן גדול' },
    { id: 'saturation',   cls: 'acc-saturation',   icon: '💧', label: 'גווני אפור' },
    { id: 'align',        cls: 'acc-align',        icon: '☰',  label: 'יישור טקסט' }
  ];

  function apply() {
    toggles.forEach(t => root.classList.toggle(t.cls, !!state[t.id]));
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  const btn = document.createElement('button');
  btn.className = 'acc-fab';
  btn.setAttribute('aria-label', 'תפריט נגישות');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><circle cx="12" cy="4" r="2.2" fill="currentColor"/><path fill="currentColor" d="M12 7c-3 0-5.6-.6-5.6-.6a1 1 0 0 0-.4 1.96S8 8.7 10 8.9v2.2l-1.7 6.2a1.1 1.1 0 0 0 2.12.58L12 13.6l1.58 4.28a1.1 1.1 0 0 0 2.12-.58L14 11.1V8.9c2-.2 4-.54 4-.54a1 1 0 0 0-.4-1.96S15 7 12 7Z"/></svg>';

  const panel = document.createElement('div');
  panel.className = 'acc-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'הגדרות נגישות');
  panel.innerHTML =
    '<div class="acc-head"><span>תפריט נגישות</span><button class="acc-close" aria-label="סגירת תפריט הנגישות">✕</button></div>' +
    '<div class="acc-grid">' +
      toggles.map(t => '<button class="acc-opt" data-id="' + t.id + '"><span class="acc-ico">' + t.icon + '</span><span>' + t.label + '</span></button>').join('') +
    '</div>' +
    '<button class="acc-reset">↻ איפוס כל ההגדרות</button>' +
    '<a class="acc-statement" href="accessibility.html">להצהרת הנגישות המלאה</a>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  function sync() {
    panel.querySelectorAll('.acc-opt').forEach(o =>
      o.classList.toggle('on', !!state[o.dataset.id]));
  }

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  panel.querySelector('.acc-close').addEventListener('click', () => panel.classList.remove('open'));
  panel.querySelectorAll('.acc-opt').forEach(o =>
    o.addEventListener('click', () => { state[o.dataset.id] = !state[o.dataset.id]; apply(); sync(); }));
  panel.querySelector('.acc-reset').addEventListener('click', () => {
    Object.keys(state).forEach(k => delete state[k]); apply(); sync();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.classList.remove('open'); });
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('open');
  });

  apply(); sync();
})();
