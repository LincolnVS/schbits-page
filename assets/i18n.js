/* Motor bilíngue (PT/EN) leve e sem dependências, compartilhado por todas as
   páginas. Dois mecanismos, um só engine:
     1) Blocos longos: elementos com [data-lang="pt"|"en"] aparecem/somem via CSS
        (regra em site.css), controlados pelo atributo data-active no <html>.
     2) Strings curtas: elementos com [data-i18n="chave"] têm o texto trocado a
        partir do dicionário global window.I18N = { pt:{...}, en:{...} }.
   Idioma escolhido: localStorage > idioma do navegador > 'en'. */
(function () {
  function detect() {
    var saved = localStorage.getItem('lang');
    if (saved === 'pt' || saved === 'en') return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('pt') === 0 ? 'pt' : 'en';
  }

  function apply(lang) {
    var dict = (window.I18N && window.I18N[lang]) || {};
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
    document.documentElement.setAttribute('data-active', lang);

    // strings curtas
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    // atributos (ex.: placeholder, aria-label, content): data-i18n-attr="attr:chave"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'), v = dict[p[1]];
        if (v != null) el.setAttribute(p[0].trim(), v);
      });
    });

    // estado dos botões do alternador
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    });
  }

  function set(lang) { localStorage.setItem('lang', lang); apply(lang); }

  window.SchbitsI18n = { set: set };

  function init() {
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { set(b.dataset.setLang); });
    });
    apply(detect());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
