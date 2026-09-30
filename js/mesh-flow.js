/* ============================================================
   Code A-Z — mesh-flow.js  (version 2, prudente)
   Fond interactif : une grille invisible au repos qui se creuse
   vers le curseur, comme un drap tendu sous un poids.

   Garde-fous :
   - ÉTEINT PAR DÉFAUT. S'active seulement si l'adresse contient ?mesh=1
     (puis mémorisé sur cet appareil) ou si ENABLED_BY_DEFAULT = true.
     ?mesh=0 l'éteint de nouveau.
   - Aucun élément n'est ajouté à la page tant que la souris n'est pas
     dans la zone : pas de calque, pas de canvas, rien à peindre au repos.
   - Le canvas est petit (une fenêtre autour du curseur), jamais pleine page.
   - Aucun changement d'empilement (pas d'isolation, pas de z-index négatif).
   - Arrêt automatique et définitif si l'animation est lente.
   - Désactivé si le visiteur demande de réduire les animations.
   ============================================================ */
(function () {
  'use strict';

  var ENABLED_BY_DEFAULT = false;   // passer à true une fois l'essai validé
  var SPACING = 34;                 // écart entre les points (px)
  var SIGMA = 120;                  // rayon d'influence du curseur (px)
  var PULL = 0.62;                  // force d'attraction au centre
  var LEVELS = 7, MAX_ALPHA = 0.30;
  var R = Math.ceil((SIGMA * 3) / SPACING);   // demi-fenêtre en cases
  var SIDE = (2 * R + 2) * SPACING;           // côté du canvas (px)

  function store(get, key, val) {
    try {
      if (get === 'get') return localStorage.getItem(key);
      if (get === 'set') localStorage.setItem(key, val);
      if (get === 'del') localStorage.removeItem(key);
    } catch (e) {}
    return null;
  }

  var flag = new URLSearchParams(location.search).get('mesh');
  if (flag === '1') { store('set', 'codeaz-mesh', '1'); store('del', 'codeaz-mesh-off'); }
  if (flag === '0') { store('del', 'codeaz-mesh'); return; }
  if (store('get', 'codeaz-mesh-off')) return;
  if (!(ENABLED_BY_DEFAULT || flag === '1' || store('get', 'codeaz-mesh') === '1')) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Path2D === 'undefined') return;

  var disabled = false;

  function accentRgb() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(v);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [198, 48, 62];
  }

  function Mesh(host) {
    var canvas = null, ctx = null, dpr = 1;
    var target = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
    var weight = 0, goal = 0, raf = 0, releaseTimer = 0, lastT = 0;
    var slow = 0, samples = 0, rgb = accentRgb();
    var originX = 0, originY = 0;

    function attach() {
      if (canvas) return true;
      canvas = document.createElement('canvas');
      canvas.className = 'mesh-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(SIDE * dpr);
      canvas.height = Math.round(SIDE * dpr);
      canvas.style.width = SIDE + 'px';
      canvas.style.height = SIDE + 'px';
      ctx = canvas.getContext('2d');
      if (!ctx) { canvas = null; return false; }
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.style.overflow = 'clip';
      host.appendChild(canvas);
      return true;
    }
    function detach() {
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; ctx = null;
    }

    function place() {
      // La fenêtre suit le curseur, alignée sur la grille pour que les lignes ne « glissent » pas
      originX = (Math.round(pos.x / SPACING) - R - 1) * SPACING;
      originY = (Math.round(pos.y / SPACING) - R - 1) * SPACING;
      canvas.style.transform = 'translate(' + originX + 'px,' + originY + 'px)';
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIDE, SIDE);
      if (weight < 0.002) return;
      var n = 2 * R + 2, a, b;
      var px = new Float32Array(n * n), py = new Float32Array(n * n), pg = new Float32Array(n * n);
      var mx = pos.x - originX, my = pos.y - originY;   // curseur dans le repère du canvas
      for (b = 0; b < n; b++) for (a = 0; a < n; a++) {
        var bx = a * SPACING, by = b * SPACING, dx = mx - bx, dy = my - by;
        var g = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
        var k = PULL * weight * g, idx = b * n + a;
        px[idx] = bx + dx * k; py[idx] = by + dy * k; pg[idx] = g * weight;
      }
      var glow = ctx.createRadialGradient(mx, my, 0, mx, my, SIGMA * 1.3);
      glow.addColorStop(0, 'rgba(' + rgb + ',' + (0.07 * weight).toFixed(3) + ')');
      glow.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIDE, SIDE);

      var paths = [], L;
      for (L = 0; L < LEVELS; L++) paths.push(new Path2D());
      function seg(i, j) {
        var g = (pg[i] + pg[j]) / 2;
        if (g < 0.02) return;
        var lv = Math.min(LEVELS - 1, Math.floor(g * LEVELS));
        paths[lv].moveTo(px[i], py[i]); paths[lv].lineTo(px[j], py[j]);
      }
      for (b = 0; b < n; b++) for (a = 0; a < n; a++) {
        var id = b * n + a;
        if (a < n - 1) seg(id, id + 1);
        if (b < n - 1) seg(id, id + n);
      }
      ctx.lineWidth = 1;
      for (L = 0; L < LEVELS; L++) {
        ctx.strokeStyle = 'rgba(' + rgb + ',' + (((L + 1) / LEVELS) * MAX_ALPHA).toFixed(3) + ')';
        ctx.stroke(paths[L]);
      }
      for (b = 0; b < n; b++) for (a = 0; a < n; a++) {
        var gi = pg[b * n + a];
        if (gi < 0.04) continue;
        ctx.fillStyle = 'rgba(' + rgb + ',' + Math.min(0.85, gi * 0.95).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(px[b * n + a], py[b * n + a], 0.7 + gi * 1.3, 0, 6.2832);
        ctx.fill();
      }
    }

    function giveUp() {
      disabled = true;
      store('set', 'codeaz-mesh-off', '1');   // plus jamais sur cet appareil
      goal = 0; weight = 0; detach();
    }

    function frame(t) {
      raf = 0;
      if (disabled || !canvas) return;
      // Mesure de fluidité : si l'appareil peine, l'effet s'arrête tout seul
      if (lastT && t - lastT < 200) {
        samples++; if (t - lastT > 45) slow++;
        if (samples >= 40) { if (slow > 14) { giveUp(); return; } samples = 0; slow = 0; }
      }
      lastT = t;
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      weight += (goal - weight) * 0.10;
      if (Math.abs(goal - weight) < 0.003) weight = goal;
      place(); draw();
      var moving = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3;
      if (weight <= 0.002 && goal === 0) { detach(); lastT = 0; return; }
      if (moving || weight !== goal) raf = requestAnimationFrame(frame);
      else lastT = 0;
    }
    function kick() { if (!disabled && !raf && canvas) raf = requestAnimationFrame(frame); }

    function setTarget(e) {
      var r = host.getBoundingClientRect();
      target.x = e.clientX - r.left; target.y = e.clientY - r.top;
    }
    function start(e, instant) {
      if (disabled || !attach()) return;
      rgb = accentRgb();
      setTarget(e);
      if (instant || weight < 0.01) { pos.x = target.x; pos.y = target.y; }
      goal = 1; place(); kick();
    }

    host.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') start(e, false); });
    host.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || disabled) return;
      if (!canvas) { start(e, false); return; }
      setTarget(e); goal = 1; kick();
    });
    host.addEventListener('pointerleave', function () { goal = 0; kick(); });
    host.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      start(e, true);
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(function () { goal = 0; kick(); }, 700);
    }, { passive: true });
  }

  function init() {
    var hosts = document.querySelectorAll('[data-mesh]');
    for (var i = 0; i < hosts.length; i++) Mesh(hosts[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
