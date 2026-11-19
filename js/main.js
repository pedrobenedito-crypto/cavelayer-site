/* Cave Layer — conteúdo vem de content/site.json e content/mods.json (editáveis pelo painel /admin) */
(function () {
  'use strict';

  var CORES = {
    'aventura': '#2f6b1a', 'magia': '#7a2fb0', 'tecnologia': '#a3361f',
    'mundo / biomas': '#1f5f8b', 'mobs': '#8a1f3d', 'utilidade': '#5a5a5a'
  };

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (text != null) e.textContent = text;
    return e;
  }
  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); });
  }
  function youtubeId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : '';
  }

  /* ---------- textos do site ---------- */
  function renderSite(s) {
    document.querySelectorAll('[data-text]').forEach(function (n) {
      var v = s[n.getAttribute('data-text')];
      if (typeof v === 'string' && v) n.textContent = v;
    });
    document.querySelectorAll('[data-href]').forEach(function (n) {
      var v = s[n.getAttribute('data-href')];
      if (v) n.setAttribute('href', v);
    });

    var steps = document.getElementById('steps');
    (s.como_funciona || []).forEach(function (p, i) {
      var d = el('div', { 'class': 'step' });
      d.appendChild(el('span', { 'class': 'step-n' }, String(i + 1)));
      d.appendChild(el('h3', null, p.titulo || ''));
      d.appendChild(el('p', null, p.texto || ''));
      steps.appendChild(d);
    });

    var sel = document.getElementById('versao');
    (s.versoes && s.versoes.length ? s.versoes : ['1.20.1']).forEach(function (v) { sel.appendChild(el('option', null, v)); });
    sel.appendChild(el('option', null, 'Outra versão'));

    var gal = document.getElementById('gallery');
    var fotos = s.galeria || [];
    if (!fotos.length) {
      for (var i = 0; i < 3; i++) gal.appendChild(el('div', { 'class': 'ph', style: 'aspect-ratio:16/9' }, '[PRINT OU GIF DO MOD — adicione pelo painel]'));
    }
    fotos.forEach(function (f) {
      var fig = el('figure');
      fig.appendChild(el('img', { src: f.imagem, alt: f.legenda || 'Print do mod', loading: 'lazy' }));
      if (f.legenda) fig.appendChild(el('figcaption', null, f.legenda));
      gal.appendChild(fig);
    });
    var id = youtubeId(s.trailer_youtube);
    var tr = document.getElementById('trailer');
    if (id) {
      var box = el('div', { 'class': 'video' });
      box.appendChild(el('iframe', { src: 'https://www.youtube-nocookie.com/embed/' + id, title: 'Trailer', allowfullscreen: '', loading: 'lazy' }));
      tr.appendChild(box);
    } else {
      tr.appendChild(el('div', { 'class': 'ph', style: 'aspect-ratio:21/9' }, '[VÍDEO DE APRESENTAÇÃO — cole o link do YouTube no painel]'));
    }

    var faq = document.getElementById('faq');
    (s.duvidas || []).forEach(function (q) {
      var d = el('details');
      d.appendChild(el('summary', null, q.pergunta || ''));
      d.appendChild(el('p', null, q.resposta || ''));
      faq.appendChild(d);
    });
  }

  /* ---------- aparência (cores e tamanhos do painel) ---------- */
  function applyStyle(e) {
    var root = document.documentElement.style, cores = e.cores || {}, tam = e.tamanhos || {};
    Object.keys(cores).forEach(function (k) { if (cores[k]) root.setProperty('--cor-' + k.replace(/_/g, '-'), cores[k]); });
    Object.keys(tam).forEach(function (k) { var v = Number(tam[k]); if (v > 0) root.setProperty('--tam-' + k.replace(/_/g, '-'), v + 'px'); });
  }

  /* ---------- mods ---------- */
  function renderMods(data) {
    var grid = document.getElementById('modsGrid');
    (data.mods || []).filter(function (m) { return m.visivel !== false; }).forEach(function (m) {
      var c = el('article', { 'class': 'card' });
      if (m.imagem) c.appendChild(el('img', { 'class': 'card-img', src: m.imagem, alt: m.nome || 'Mod', loading: 'lazy' }));
      else c.appendChild(el('div', { 'class': 'ph', style: 'aspect-ratio:16/10' }, '[IMAGEM DO MOD]'));
      var tags = el('div', { 'class': 'tags' });
      if (m.categoria) {
        var t = el('span', { 'class': 'tag' }, m.categoria.toUpperCase());
        t.style.background = CORES[m.categoria.toLowerCase()] || '#5a5a5a';
        tags.appendChild(t);
      }
      if (m.versao) tags.appendChild(el('span', { 'class': 'tag v' }, m.versao));
      c.appendChild(tags);
      c.appendChild(el('h3', null, m.nome || ''));
      c.appendChild(el('p', null, m.descricao || ''));
      var foot = el('div', { 'class': 'card-foot' });
      foot.appendChild(el('strong', { 'class': 'price' }, m.preco || ''));
      var b;
      if (m.link_compra) {
        b = el('a', { 'class': 'card-btn', href: m.link_compra, target: '_blank', rel: 'noopener' }, 'Comprar');
      } else {
        b = el('span', { 'class': 'card-btn', 'aria-disabled': 'true', title: 'Coloque o link de pagamento no painel' }, 'Em breve');
      }
      foot.appendChild(b);
      c.appendChild(foot);
      grid.appendChild(c);
    });
  }

  /* ---------- formulário (Netlify Forms) ---------- */
  function setupForm() {
    var f = document.getElementById('orderForm'), done = document.getElementById('orderDone');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var body = new URLSearchParams(new FormData(f)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (!r.ok) throw new Error(); f.reset(); f.classList.add('hidden'); done.classList.remove('hidden'); })
        .catch(function () { alert('Não foi possível enviar agora. Tente de novo em instantes.'); });
    });
    document.getElementById('orderAgain').addEventListener('click', function () { done.classList.add('hidden'); f.classList.remove('hidden'); });
  }

  /* ---------- efeitos de rolagem ---------- */
  function layerFor(y) {
    if (y > 40) return 'Superfície'; if (y > 10) return 'Terra'; if (y > -20) return 'Pedra';
    if (y > -42) return 'Cavernas'; if (y > -56) return 'Minérios'; return 'Bedrock';
  }
  var logo = document.getElementById('logoWrap'), cta = document.getElementById('heroCta'),
      depth = document.getElementById('depth'), shade = document.getElementById('topShade'), ticking = false;
  function onScroll() {
    ticking = false;
    var el2 = document.scrollingElement || document.documentElement;
    var sy = window.scrollY || el2.scrollTop || 0, max = el2.scrollHeight - window.innerHeight;
    var r = max > 0 ? Math.min(1, Math.max(0, sy / max)) : 0, y = Math.round(64 - r * 128);
    depth.textContent = 'Y: ' + y + ' · ' + layerFor(y);
    logo.style.opacity = Math.max(0, 1 - sy / 480);
    logo.style.transform = 'translateY(' + Math.round(Math.min(sy, 600) * 0.35) + 'px)';
    var co = Math.max(0, 1 - sy / 160);
    cta.style.opacity = co; cta.style.visibility = co === 0 ? 'hidden' : 'visible';
    var k = Math.min(1, sy / 1400), mix = function (a) { return Math.round(a * 0.55 * (1 - k)); };
    var c = mix(27) + ',' + mix(53) + ',' + mix(112);
    shade.style.background = 'linear-gradient(rgba(' + c + ',' + (0.8 + 0.2 * k).toFixed(2) + ') 0%, rgba(' + c + ',0) 100%)';
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* brilho da lua: acompanha a lua desenhada na imagem do céu (1672x941, lua em 692,162) */
  function placeMoon() {
    var sec = document.getElementById('topo'), m = document.getElementById('moonPulse');
    var w = sec.offsetWidth, h = sec.offsetHeight, s = Math.max(w / 1672, h / 941);
    var ox = (w - 1672 * s) / 2, oy = h - 941 * s, d = Math.round(760 * s);
    m.style.cssText = 'display:block;left:' + Math.round(ox + 692 * s - d / 2) + 'px;top:' + Math.round(oy + 162 * s - d / 2) + 'px;width:' + d + 'px;height:' + d + 'px';
  }
  window.addEventListener('resize', placeMoon);

  /* ---------- início ---------- */
  setupForm();
  onScroll(); placeMoon();
  getJSON('content/estilo.json').then(applyStyle).catch(function () {});
  Promise.all([getJSON('content/site.json'), getJSON('content/mods.json')])
    .then(function (res) { renderSite(res[0]); renderMods(res[1]); placeMoon(); })
    .catch(function (e) { console.error('Erro ao carregar o conteúdo', e); });
})();
