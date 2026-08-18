(function(){
  function setLang(l){
    document.body.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('[data-setlang]').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l ? 'true' : 'false');
    });
  }
  document.querySelectorAll('[data-setlang]').forEach(function(b){
    b.addEventListener('click', function(){ setLang(b.getAttribute('data-setlang')); });
  });
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  if (burger){
    var open = function(){ menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); burger.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; };
    var close = function(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); burger.setAttribute('aria-expanded','false'); document.body.style.overflow=''; };
    burger.addEventListener('click', function(){ menu.classList.contains('open') ? close() : open(); });
    document.getElementById('menuClose').addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('vis'); io.unobserve(en.target); } });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  var form = document.getElementById('demoForm');
  if (form){
    /* Hoe lang het formulier openstond. De server weigert alles wat binnen 2,5
       seconde binnenkomt -- zo snel vult geen mens dit in. */
    var geopendOp = Date.now();
    var knop = form.querySelector('button[type="submit"]');
    var ok = document.getElementById('formOk');
    var fout = document.getElementById('formFout');

    function melding(el, tekst){
      if (tekst) el.textContent = tekst;
      el.style.display = '';
      el.classList.add('show');
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (knop.disabled) return;

      ok.classList.remove('show');
      fout.classList.remove('show');
      fout.style.display = 'none';
      knop.disabled = true;

      var engels = document.body.getAttribute('data-lang') === 'en';

      /* Met afsluitende slash: vercel.json staat op trailingSlash, en zonder
         slash krijgt elke inzending eerst een omleiding voor z'n kiezen. */
      fetch('/api/contact/', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          naam:    document.getElementById('f-naam').value,
          bedrijf: document.getElementById('f-bedrijf').value,
          email:   document.getElementById('f-email').value,
          rol:     document.getElementById('f-rol').value,
          bericht: document.getElementById('f-bericht').value,
          website: document.getElementById('f-website').value,
          elapsedMs: Date.now() - geopendOp
        })
      })
      /* Antwoordt de server geen JSON -- een storing, of de functie draait niet --
         dan hoort de bezoeker geen ontledingsfout te zien maar een gewone zin. */
      .then(function(r){
        return r.text().then(function(t){
          var d = {};
          try { d = JSON.parse(t); } catch (_) {}
          return {ok: r.ok, data: d};
        });
      })
      .then(function(res){
        if (!res.ok) throw new Error(res.data && res.data.error);
        melding(ok);
        form.reset();
        geopendOp = Date.now();
      })
      .catch(function(err){
        melding(fout, err.message || (engels
          ? 'Sending failed. Please email us directly.'
          : 'Versturen is niet gelukt. Mail ons gerust rechtstreeks.'));
      })
      .finally(function(){ knop.disabled = false; });
    });
  }
})();