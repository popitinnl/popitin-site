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
    form.addEventListener('submit', function(e){
      e.preventDefault();
      document.getElementById('formOk').classList.add('show');
      form.reset();
    });
  }
})();