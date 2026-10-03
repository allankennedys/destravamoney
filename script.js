(function () {
  var doc = document.documentElement;
  var temIO = 'IntersectionObserver' in window;

  // Entrada suave das seções
  var revs = document.querySelectorAll('.rev');
  if (temIO) {
    doc.classList.add('js');
    var ioRev = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('vis');
          ioRev.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { ioRev.observe(el); });
  }

  // CTA fixo no mobile: aparece quando nenhum botão da página está à vista
  var fixo = document.getElementById('fixo');
  if (fixo && temIO) {
    var visiveis = new Set();
    var rolou = false;
    var atualiza = function () {
      var on = rolou && visiveis.size === 0;
      fixo.classList.toggle('on', on);
      fixo.setAttribute('aria-hidden', on ? 'false' : 'true');
      fixo.querySelector('a').tabIndex = on ? 0 : -1;
    };
    var ioCta = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) visiveis.add(e.target); else visiveis.delete(e.target);
      });
      atualiza();
    });
    document.querySelectorAll('main [data-cta]').forEach(function (b) { ioCta.observe(b); });
    window.addEventListener('scroll', function () {
      var r = window.scrollY > 200;
      if (r !== rolou) { rolou = r; atualiza(); }
    }, { passive: true });
  }

  // Clique no CTA → evento para Pixel/GTM, se estiverem instalados
  document.querySelectorAll('[data-cta]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
      if (window.dataLayer) window.dataLayer.push({ event: 'clique_whatsapp', produto: 'destrava-money' });
    });
  });
})();
