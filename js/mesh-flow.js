/* ============================================================
   Code A-Z — mesh-flow.js
   Fond interactif : une grille invisible au repos qui se creuse
   vers le curseur, comme un drap tendu sous un poids.
   - Canvas 2D, aucune bibliothèque, code propre à Code A-Z.
   - S'active sur tout élément [data-mesh].
   - N'anime que lorsque la souris ou le doigt est dans la zone :
     au repos, aucun calcul n'est fait.
   - Désactivé si le visiteur demande de réduire les animations.
   - Couleur : l'accent de la marque (suit le thème clair / sombre).
   ============================================================ */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SPACING = 34;          // écart entre les points de la grille (px)
  var SIGMA = 130;           // rayon d'influence du curseur (px)
  var PULL = 0.62;           // force d'attraction au centre (0 à 1)
  var LEVELS = 7;            // paliers de transparence des lignes
  var MAX_ALPHA = 0.30;

  function accentRgb() {
    var v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(v);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [198, 48, 62];
  }

  function Mesh(host) {
    var canvas = document.createElement('canvas');
    canvas.className = 'mesh-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
    var target = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
    var weight = 0, goal = 0, raf = 0, visible = true, releaseTimer = 0;
    var rgb = accentRgb();
    var lastBox = null;   // zone dessinée à l'image précédente : seule elle est effacée

    function resize() {
      var r = host.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cols = Math.ceil(w / SPACING) + 2;
      rows = Math.ceil(h / SPACING) + 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (weight > 0.001) draw();
    }

    function gauss(dx, dy) { return Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA)); }

    // Position déformée du point (i, j) : attiré vers le curseur
    var P = { x: 0, y: 0, g: 0 };
    function warp(i, j) {
      var bx = (i - 1) * SPACING, by = (j - 1) * SPACING;
      var dx = pos.x - bx, dy = pos.y - by;
      var g = gauss(dx, dy);
      var k = PULL * weight * g;
      P.x = bx + dx * k;
      P.y = by + dy * k;
      P.g = g * weight;
      return P;
    }

    function draw() {
      if (lastBox) ctx.clearRect(lastBox.x, lastBox.y, lastBox.w, lastBox.h); else ctx.clearRect(0, 0, w, h);
      lastBox = null;
      if (weight < 0.002) return;
      var R = Math.ceil((SIGMA * 3.2) / SPACING);
      var ci = Math.round(pos.x / SPACING) + 1, cj = Math.round(pos.y / SPACING) + 1;
      var i0 = Math.max(0, ci - R), i1 = Math.min(cols - 1, ci + R);
      var j0 = Math.max(0, cj - R), j1 = Math.min(rows - 1, cj + R);
      var nx = i1 - i0 + 1, ny = j1 - j0 + 1;
      lastBox = { x: Math.max(0, (i0 - 3) * SPACING), y: Math.max(0, (j0 - 3) * SPACING), w: (nx + 5) * SPACING, h: (ny + 5) * SPACING };
      lastBox.w = Math.min(lastBox.w, w - lastBox.x); lastBox.h = Math.min(lastBox.h, h - lastBox.y);
      var px = new Float32Array(nx * ny), py = new Float32Array(nx * ny), pg = new Float32Array(nx * ny);
      var a, b;
      for (b = 0; b < ny; b++) for (a = 0; a < nx; a++) {
        var q = warp(i0 + a, j0 + b), idx = b * nx + a;
        px[idx] = q.x; py[idx] = q.y; pg[idx] = q.g;
      }

      // Éclat doux sous le curseur
      var glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, SIGMA * 1.3);
      glow.addColorStop(0, 'rgba(' + rgb + ',' + (0.07 * weight).toFixed(3) + ')');
      glow.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = glow;
      ctx.fillRect(pos.x - SIGMA * 1.3, pos.y - SIGMA * 1.3, SIGMA * 2.6, SIGMA * 2.6);

      // Lignes, regroupées par palier de transparence (un seul tracé par palier)
      var paths = [];
      for (var L = 0; L < LEVELS; L++) paths.push(new Path2D());
      function seg(i1_, i2_) {
        var g = (pg[i1_] + pg[i2_]) / 2;
        var lv = Math.min(LEVELS - 1, Math.floor(g * LEVELS));
        if (g < 0.02) return;
        paths[lv].moveTo(px[i1_], py[i1_]);
        paths[lv].lineTo(px[i2_], py[i2_]);
      }
      for (b = 0; b < ny; b++) for (a = 0; a < nx; a++) {
        var id = b * nx + a;
        if (a < nx - 1) seg(id, id + 1);
        if (b < ny - 1) seg(id, id + nx);
      }
      ctx.lineWidth = 1;
      for (var lvl = 0; lvl < LEVELS; lvl++) {
        ctx.strokeStyle = 'rgba(' + rgb + ',' + (((lvl + 1) / LEVELS) * MAX_ALPHA).toFixed(3) + ')';
        ctx.stroke(paths[lvl]);
      }

      // Points aux croisements
      for (b = 0; b < ny; b++) for (a = 0; a < nx; a++) {
        var gi = pg[b * nx + a];
        if (gi < 0.04) continue;
        ctx.fillStyle = 'rgba(' + rgb + ',' + Math.min(0.85, gi * 0.95).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(px[b * nx + a], py[b * nx + a], 0.7 + gi * 1.3, 0, 6.2832);
        ctx.fill();
      }
    }

    function frame() {
      raf = 0;
      // Le curseur virtuel suit le vrai avec un léger retard (effet d'élasticité)
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      weight += (goal - weight) * 0.10;
      if (Math.abs(goal - weight) < 0.003) weight = goal;
      draw();
      var moving = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3;
      if (visible && (weight > 0.002 || goal > 0) && (moving || weight !== goal)) raf = requestAnimationFrame(frame);
      else if (weight <= 0.002) { ctx.clearRect(0, 0, w, h); lastBox = null; }
    }
    function kick() { if (!raf && visible) raf = requestAnimationFrame(frame); }

    function setTarget(e) {
      var r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
    }

    host.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return;
      rgb = accentRgb();
      setTarget(e);
      if (weight < 0.01) { pos.x = target.x; pos.y = target.y; }
      goal = 1; kick();
    });
    host.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      setTarget(e); goal = 1; kick();
    });
    host.addEventListener('pointerleave', function () { goal = 0; kick(); });
    // Doigt : un appui fait naître l'effet quelques instants, sans gêner le défilement
    host.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      rgb = accentRgb();
      setTarget(e); pos.x = target.x; pos.y = target.y;
      goal = 1; kick();
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(function () { goal = 0; kick(); }, 700);
    }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (!visible) { goal = 0; weight = 0; ctx.clearRect(0, 0, w, h); lastBox = null; }
      }).observe(host);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    else window.addEventListener('resize', resize);
    resize();
  }

  function init() {
    var hosts = document.querySelectorAll('[data-mesh]');
    for (var i = 0; i < hosts.length; i++) Mesh(hosts[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
