(function () {
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = [].slice.call(root.querySelectorAll('.slide')), dots = [].slice.call(root.querySelectorAll('.dots i'));
    var i = 0, timer;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    }
    function auto() { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { show(i + 1); }, 6000); }
    var p = root.querySelector('.prev'), n = root.querySelector('.next');
    if (slides.length < 2) { if (p) p.hidden = true; if (n) n.hidden = true; }
    if (p) p.onclick = function () { show(i - 1); auto(); };
    if (n) n.onclick = function () { show(i + 1); auto(); };
    dots.forEach(function (d, k) { d.onclick = function () { show(k); auto(); }; });
    auto();
  });
})();

// Static-site search: filters a pre-built JSON index in the browser.
(function () {
  var grid = document.querySelector('[data-search]');
  if (!grid) return;
  var q = (new URLSearchParams(location.search).get('q') || '').toLowerCase().trim();
  var base = grid.getAttribute('data-search').replace(/search-index\.json$/, '');
  var h2 = document.querySelector('.listing h2');
  if (h2) h2.textContent = q ? 'Search: ' + q : 'All stories';
  var box = document.querySelector('.search input'); if (box) box.value = q;
  fetch(grid.getAttribute('data-search')).then(function (r) { return r.json(); }).then(function (items) {
    var hits = q ? items.filter(function (a) { return (a.t + ' ' + a.d + ' ' + a.k + ' ' + a.x).toLowerCase().indexOf(q) > -1; }) : items;
    grid.textContent = '';
    if (!hits.length) { grid.innerHTML = '<p>No stories found.</p>'; return; }
    hits.forEach(function (a) {
      var art = document.createElement('article'); art.className = 'gcard';
      var link = document.createElement('a'); link.href = base + 'article/' + a.s + '/'; link.className = 'gimg';
      var img = document.createElement('img'); img.src = a.i; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer'; link.appendChild(img);
      var who = document.createElement('div'); who.className = 'who'; who.textContent = a.c;
      var h3 = document.createElement('h3'), a2 = document.createElement('a'); a2.href = link.href; a2.textContent = a.t; h3.appendChild(a2);
      var p = document.createElement('p'); p.textContent = a.d;
      [link, who, h3, p].forEach(function (n) { art.appendChild(n); }); grid.appendChild(art);
    });
  }).catch(function () { grid.innerHTML = '<p>Search is unavailable right now.</p>'; });
})();
