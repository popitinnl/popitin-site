(function(){
  /* language tabs drive the same l-nl/l-en spans as the front-end */
  document.querySelectorAll('[data-editlang]').forEach(function(b){
    b.addEventListener('click', function(){
      document.body.setAttribute('data-lang', b.getAttribute('data-editlang'));
      document.querySelectorAll('[data-editlang]').forEach(function(x){
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
    });
  });

  var main = document.getElementById('pageCanvas');
  if (!main) return;

  /* neutralise front-end links inside the canvas */
  main.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(e){ e.preventDefault(); });
  });

  /* section hover chips */
  var names = {'hero':'Hero','meet':'Maak kennis','quote':'Klantquote','groen':'De groene gedachte','seg':'Doelgroepen','cta':'Call-to-action'};
  main.querySelectorAll('[data-sec]').forEach(function(sec){
    sec.classList.add('edit-block');
    var chip = document.createElement('span');
    chip.className = 'edit-chip';
    chip.textContent = '✎ ' + (names[sec.getAttribute('data-sec')] || 'Sectie');
    sec.appendChild(chip);
  });

  /* editable text */
  main.querySelectorAll('h1,h2,h3,p,blockquote,.n,.t,.s,.who,li b,li span').forEach(function(el){
    if (el.closest('.edit-chip')) return;
    el.setAttribute('contenteditable','true');
    el.setAttribute('spellcheck','false');
  });

  /* mini WYSIWYG toolbar on selection */
  var bar = document.getElementById('wysBar');
  function place(){
    var sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed){ bar.classList.remove('show'); return; }
    var node = sel.anchorNode && sel.anchorNode.parentElement;
    if (!node || !node.closest('[contenteditable="true"]') || !main.contains(node)){ bar.classList.remove('show'); return; }
    var r = sel.getRangeAt(0).getBoundingClientRect();
    bar.style.left = Math.max(10, r.left + r.width/2 - bar.offsetWidth/2) + 'px';
    bar.style.top = Math.max(10, r.top - 48) + 'px';
    bar.classList.add('show');
  }
  document.addEventListener('selectionchange', function(){ setTimeout(place, 10); });
  bar.querySelectorAll('button[data-cmd]').forEach(function(b){
    b.addEventListener('mousedown', function(e){
      e.preventDefault();
      var cmd = b.getAttribute('data-cmd');
      if (cmd === 'createLink'){
        var url = prompt('Link naar:', 'https://');
        if (url) document.execCommand(cmd, false, url);
      } else {
        document.execCommand(cmd, false, null);
      }
    });
  });

  /* image replace overlays */
  main.querySelectorAll('img').forEach(function(img){
    if (img.closest('.avatar')) return;
    var wrap = document.createElement('span');
    wrap.className = 'img-edit';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    var ov = document.createElement('span');
    ov.className = 'img-overlay';
    ov.innerHTML = '<span class="ic">🖼</span><span>Afbeelding vervangen</span><span class="small">Upload — wordt automatisch gecomprimeerd naar WebP</span>';
    wrap.appendChild(ov);
    ov.addEventListener('click', function(){ toast('Demo: upload & automatische compressie zitten in de echte versie'); });
  });

  /* toast + save */
  var toastEl = document.getElementById('cmsToast');
  var tmr;
  function toast(msg){
    toastEl.querySelector('span:last-child').textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tmr);
    tmr = setTimeout(function(){ toastEl.classList.remove('show'); }, 2600);
  }
  document.getElementById('saveBtn').addEventListener('click', function(){
    toast('Wijzigingen opgeslagen — demo, er wordt nog niets bewaard');
  });
  window.cmsToast = toast;
})();