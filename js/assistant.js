/* ============================================================
   Code A-Z — assistant.js
   Assistante virtuelle du site : guide les visiteurs vers les tarifs, les
   exemples par secteur, les articles, les emplois, le contact…
   - Phase 1 : recherche instantanée dans la mémoire du site (assistant/kb.json).
     Gratuite, sans aucun service externe, rien n'est envoyé nulle part.
   - Phase 2 : questions libres traitées par une IA gratuite (via /api/assistant),
     uniquement si le serveur est configuré ET si le visiteur l'accepte.
   Le nom se change dans assistant/persona.json (puis npm run build).
   ============================================================ */
(function () {
  'use strict';

  var CONSENT_KEY = 'codeaz-assistant-ia';     // « 1 » = le visiteur accepte les questions libres à l'IA
  var NAME = 'Aya';
  var state = { open: false, ready: false, loading: false, engine: null, kb: null, ai: null, history: [], busy: false, last: '' };
  var el = {};

  /* ---------- petits utilitaires ---------- */
  function $(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function store(op, key, val) {
    try { if (op === 'get') return localStorage.getItem(key); if (op === 'set') localStorage.setItem(key, val); if (op === 'del') localStorage.removeItem(key); } catch (e) {}
    return null;
  }
  function scrollDown() { el.log.scrollTop = el.log.scrollHeight; }
  var TYPE_LABEL = { post: 'Article', project: 'Projet', sector: 'Exemples par secteur', job: 'Emploi', ebook: 'Guide gratuit', page: 'Page', price: 'Tarifs', faq: 'Question fréquente', legal: 'Informations légales', process: 'Méthode', service: 'Service' };

  /* ---------- messages ---------- */
  function bubble(who) {
    var row = $('div', 'asst-row asst-' + who);
    var b = $('div', 'asst-bubble');
    row.appendChild(b);
    el.log.appendChild(row);
    return b;
  }
  function say(text) { var b = bubble('bot'); b.textContent = text; scrollDown(); return b; }
  function userSays(text) { var b = bubble('me'); b.textContent = text; scrollDown(); }

  // Texte de l'IA : seuls les liens [texte](/chemin) du site, wa.me et mailto sont acceptés
  function linkify(parent, text) {
    var re = /\[([^\]]{1,80})\]\((\/[^\s)]*|https:\/\/wa\.me\/[^\s)]*|mailto:[^\s)]*)\)/g, last = 0, m;
    function plain(t) {
      t.split('\n').forEach(function (line, i) {
        if (i) parent.appendChild(document.createElement('br'));
        line.split(/(\*\*[^*]{1,80}\*\*)/).forEach(function (part) {          // **gras** -> vrai gras, sans HTML brut
          if (!part) return;
          if (/^\*\*[^*]+\*\*$/.test(part)) parent.appendChild($('strong', null, part.slice(2, -2)));
          else parent.appendChild(document.createTextNode(part.replace(/\*\*/g, '')));
        });
      });
    }
    while ((m = re.exec(text))) {
      plain(text.slice(last, m.index));
      var a = $('a', 'asst-link', m[1]);
      a.href = m[2];
      if (/^https?:/.test(m[2])) { a.target = '_blank'; a.rel = 'noopener'; }
      parent.appendChild(a);
      last = re.lastIndex;
    }
    plain(text.slice(last));
  }
  function sayRich(text) { var b = bubble('bot'); linkify(b, text); scrollDown(); return b; }

  function cards(list) {
    if (!list || !list.length) return;
    var wrap = $('div', 'asst-cards');
    list.forEach(function (e) {
      var a = $('a', 'asst-card');
      a.href = e.url;
      a.appendChild($('span', 'asst-card-type', TYPE_LABEL[e.type] || 'Page'));
      a.appendChild($('span', 'asst-card-title', e.title.replace(/^Sites pour : /, 'Sites pour ')));
      if (e.text && e.type !== 'page') a.appendChild($('span', 'asst-card-text', e.text.length > 90 ? e.text.slice(0, 88).replace(/\s+\S*$/, '') + '…' : e.text));
      wrap.appendChild(a);
    });
    el.log.appendChild(wrap);
    scrollDown();
  }

  function chips(items) {
    var wrap = $('div', 'asst-chips');
    items.forEach(function (it) {
      var b = $('button', 'asst-chip', it.label);
      b.type = 'button';
      b.addEventListener('click', function () { wrap.remove(); it.run ? it.run() : ask(it.q || it.label, true); });
      wrap.appendChild(b);
    });
    el.log.appendChild(wrap);
    scrollDown();
  }
  function defaultChips() {
    chips([
      { label: 'Combien ça coûte ?', q: 'Combien coûte un site web ?' },
      { label: 'Voir des exemples', run: function () { userSays('Voir des exemples'); reply(function () { say('Avec plaisir ! Dites-moi votre métier (restaurant, avocat, école, boutique…) et je vous montre des sites de votre secteur. Ou parcourez tout le portfolio :'); cards([{ type: 'page', title: 'Portfolio (réalisations)', url: '/#portfolio' }]); }); } },
      { label: 'Lire le blog', q: 'Je veux lire un article' },
      { label: 'Vous contacter', q: 'Comment vous contacter ?' }
    ]);
  }

  var typingNode = null;
  function typing(on) {
    if (on && !typingNode) { typingNode = bubble('bot'); typingNode.classList.add('asst-typing'); typingNode.innerHTML = '<span></span><span></span><span></span>'; typingNode.setAttribute('aria-label', NAME + ' écrit…'); scrollDown(); }
    if (!on && typingNode) { typingNode.parentNode.remove(); typingNode = null; }
  }
  function reply(fn) { typing(true); setTimeout(function () { typing(false); fn(); }, 350); }

  /* ---------- réponses de la phase 1 ---------- */
  var OPENERS = ['Avec plaisir !', 'Bonne question !', 'Voici ce que j’ai trouvé :', 'Très volontiers !'];
  var opener = 0;
  function nextOpener() { return OPENERS[opener++ % OPENERS.length]; }

  function showAnswer(e) {
    var b = bubble('bot');
    b.appendChild($('div', 'asst-title', e.title));
    if (e.plans) {
      var ul = $('ul', 'asst-plans');
      e.plans.forEach(function (p) { var li = $('li'); li.appendChild($('strong', null, p.plan)); li.appendChild(document.createTextNode(' — ' + p.amount + ' : ' + p.desc)); ul.appendChild(li); });
      b.appendChild(ul);
      if (e.note) b.appendChild($('div', 'asst-note', e.note));
    } else {
      var t = e.text || '';
      b.appendChild($('div', null, t.length > 480 ? t.slice(0, 478).replace(/\s+\S*$/, '') + '…' : t));
    }
    if (e.id === 'page-contact') {
      var act = $('div', 'asst-actions');
      [['WhatsApp', 'https://wa.me/2250546797258?text=Bonjour%2C%20je%20souhaite%20discuter%20d%27un%20projet%20avec%20Code%20A-Z.'], ['Appeler', 'tel:+2250546797258'], ['E-mail', 'mailto:valenbouge@gmail.com'], ['Formulaire', '/#contact']].forEach(function (x) {
        var a = $('a', 'asst-btn', x[0]); a.href = x[1]; if (/^https/.test(x[1])) { a.target = '_blank'; a.rel = 'noopener'; } act.appendChild(a);
      });
      b.appendChild(act);
    } else if (e.url && !e.plans) {
      var more = $('a', 'asst-link', 'En savoir plus →'); more.href = e.url; b.appendChild($('div', 'asst-more')).appendChild(more);
    }
    scrollDown();
  }

  function respond(res, text) {
    if (res.answers.length) {
      say(nextOpener());
      res.answers.forEach(showAnswer);
      if (res.answers.some(function (a) { return a.type === 'price'; })) {
        var cta = res.answers.length > 1 ? 'Pour un chiffrage précis, parlons-en : c’est gratuit et sans engagement. 😊' : 'Pour un chiffrage précis, c’est gratuit et sans engagement. 😊';
        say(cta);
        cards([{ type: 'page', title: 'Tarifs complets', url: '/#tarifs' }, { type: 'page', title: 'Demander un devis', url: '/#contact' }]);
      } else { cards(res.cards); }
      if (res.confidence === 'medium') offerAI(text);
      return true;
    }
    if (res.cards.length) {
      var sector = res.cards[0].type === 'sector';
      say(sector ? 'Bien sûr ! Voici des sites de votre secteur :' : nextOpener());
      cards(res.cards);
      if (res.confidence !== 'high') offerAI(text);
      return true;
    }
    return false;
  }

  function notFound(text, noAI) {
    say('Je n’ai pas trouvé exactement ça, mais je ne vous laisse pas repartir les mains vides. 😊');
    chips([
      { label: 'Voir les tarifs', q: 'Combien coûte un site web ?' },
      { label: 'Voir le portfolio', run: function () { cards([{ type: 'page', title: 'Portfolio (réalisations)', url: '/#portfolio' }]); } },
      { label: 'Vous contacter', q: 'Comment vous contacter ?' }
    ]);
    if (!noAI) offerAI(text);
  }

  /* ---------- IA conversationnelle (en premier) ; la recherche du site sert de filet de sécurité ---------- */
  var AI_PAUSE_MS = 10 * 60 * 1000;             // après un quota atteint ou une panne, on n'insiste pas pendant 10 min
  function aiUsable() { return state.ai === true && !state.declined && Date.now() > (state.aiOffUntil || 0); }

  function offerAI(text) {
    if (!aiUsable() || store('get', CONSENT_KEY) === '1' || !text || text.split(/\s+/).length < 2) return;
    chips([{ label: '✨ Poser ma question à l’IA', run: function () { askAI(text); } }]);
  }

  function consentBubble(then, declined) {
    var b = bubble('bot');
    b.appendChild($('div', null, 'Pour vous répondre avec mes mots, je m’appuie sur un service d’intelligence artificielle externe (Groq, États-Unis). Votre message lui est transmis, sans votre nom. Merci de ne pas y écrire de données personnelles.'));
    var more = $('a', 'asst-link', 'Détails dans la politique de confidentialité'); more.href = '/politique-confidentialite.html#donnees';
    b.appendChild($('div', 'asst-more')).appendChild(more);
    var row = $('div', 'asst-actions');
    var yes = $('button', 'asst-btn asst-btn-main', 'J’accepte'); yes.type = 'button';
    var no = $('button', 'asst-btn', 'Non merci'); no.type = 'button';
    yes.addEventListener('click', function () { store('set', CONSENT_KEY, '1'); row.remove(); then(); });
    no.addEventListener('click', function () {
      row.remove(); state.declined = true;
      say('Pas de souci ! Je vous réponds avec la recherche dans le site. 😊');
      if (declined) declined();
    });
    row.appendChild(yes); row.appendChild(no); b.appendChild(row);
    scrollDown();
  }

  function contactButtons() {
    var act = $('div', 'asst-actions');
    [['WhatsApp', 'https://wa.me/2250546797258?text=Bonjour%2C%20je%20souhaite%20discuter%20d%27un%20projet%20avec%20Code%20A-Z.'], ['Appeler', 'tel:+2250546797258'], ['E-mail', 'mailto:valenbouge@gmail.com'], ['Formulaire', '/#contact']].forEach(function (x) {
      var a = $('a', 'asst-btn', x[0]); a.href = x[1]; if (/^https/.test(x[1])) { a.target = '_blank'; a.rel = 'noopener'; } act.appendChild(a);
    });
    el.log.appendChild(act); scrollDown();
  }

  // Phase 1 : recherche dans le site (instantanée, gratuite)
  function searchSite(text, notice) {
    reply(function () {
      if (notice) say(notice);
      var res = state.engine.ask(text);
      if (respond(res, text)) return;
      notFound(text, true);
    });
  }

  // Phase 2 : IA ; en cas d'échec (quota, panne, lenteur) on retombe sur la recherche
  function askAI(text) {
    if (store('get', CONSENT_KEY) !== '1') { consentBubble(function () { askAI(text); }, function () { searchSite(text); }); return; }
    if (state.busy) return;
    state.busy = true; typing(true);
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 16000);
    fetch('/api/assistant', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: state.history.slice(-6) }), signal: ctl ? ctl.signal : undefined
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
      .then(function (x) {
        typing(false);
        if (!x.ok || !x.d.reply) throw { status: x.status };
        state.history.push({ role: 'user', content: text }, { role: 'assistant', content: x.d.reply });
        sayRich(x.d.reply);
        if (x.d.links && x.d.links.length) cards(x.d.links);
        var local = state.engine && state.engine.ask(text);        // les coordonnées restent à un clic
        if (local && local.answer && local.answer.id === 'page-contact') contactButtons();
      })
      .catch(function (e) {
        typing(false);
        state.aiOffUntil = Date.now() + AI_PAUSE_MS;
        searchSite(text, e && e.status === 429
          ? 'J’ai beaucoup de questions en ce moment ! Voici ce que j’ai trouvé dans le site :'
          : 'Petit souci de mon côté, voici ce que j’ai trouvé dans le site :');
      })
      .then(function () { clearTimeout(timer); state.busy = false; });
  }

  /* ---------- saisie du visiteur ---------- */
  var SMALLTALK = [
    [/^(bonjour|salut|bonsoir|hello|coucou|hey|slt)\b/i, function () { say('Bonjour ! 😊 Que puis-je faire pour vous : des tarifs, des exemples de sites, un article, un contact ?'); defaultChips(); }],
    [/\b(merci|thanks|super|parfait|genial)\b/i, function () { say('Avec grand plaisir ! 😊 Si vous avez d’autres questions, je suis là.'); }],
    [/\b(au revoir|bye|a bientot|a plus)\b/i, function () { say('Au revoir et à très bientôt ! 😊'); }],
    [/(qui es[- ]tu|tu es qui|es[- ]tu (un|une) (robot|ia|humain|personne)|ton nom|comment (tu )?t.appelles)/i, function () { say('Je m’appelle ' + NAME + ', l’assistante virtuelle de Code A-Z. Je suis une intelligence artificielle, pas une personne : je vous guide dans le site, et pour tout le reste, l’équipe est joignable sur WhatsApp. 😊'); }]
  ];

  // viaChip : les boutons rapides utilisent la recherche du site (réponses exactes, sans quota)
  function ask(text, viaChip) {
    text = String(text || '').trim();
    if (!text) return;
    userSays(text);
    state.last = text;
    (state.aiCheck || Promise.resolve()).then(function () {
      whenReady(function () {
        for (var i = 0; i < SMALLTALK.length; i++) if (SMALLTALK[i][0].test(text) && text.split(/\s+/).length <= 6) { reply(SMALLTALK[i][1]); return; }
        if (!viaChip && aiUsable()) { askAI(text); return; }       // IA d'abord
        searchSite(text);                                          // sinon : recherche dans le site
      });
    });
  }

  /* ---------- chargement paresseux de la mémoire ---------- */
  var waiting = [];
  function whenReady(fn) {
    if (state.ready) return fn();
    waiting.push(fn);
    if (state.loading) return;
    state.loading = true;
    function loadKb() {
      fetch('/assistant/kb.json').then(function (r) { return r.json(); }).then(function (kb) {
        state.kb = kb; state.engine = window.AssistantSearch.create(kb); NAME = (kb.persona && kb.persona.name) || NAME;
        state.ready = true; waiting.splice(0).forEach(function (f) { f(); });
      }).catch(function () {
        state.loading = false;
        say('Oups, je n’arrive pas à charger mes informations pour le moment. Vous pouvez nous écrire sur WhatsApp : +225 05 46 79 72 58.');
      });
    }
    if (window.AssistantSearch) loadKb();
    else { var s = document.createElement('script'); s.src = '/assistant/search.js'; s.onload = loadKb; s.onerror = function () { state.loading = false; }; document.head.appendChild(s); }
  }

  /* ---------- fenêtre ---------- */
  function build() {
    el.launcher = $('button', 'asst-launcher');
    el.launcher.type = 'button';
    el.launcher.setAttribute('aria-haspopup', 'dialog');
    el.launcher.setAttribute('aria-expanded', 'false');
    el.launcher.innerHTML = '<span class="asst-avatar" aria-hidden="true">A<i></i></span><span class="asst-launcher-label">Besoin d’aide ?</span>';
    el.launcher.setAttribute('aria-label', 'Ouvrir l’assistante virtuelle de Code A-Z');

    el.panel = $('section', 'asst-panel');
    el.panel.hidden = true;
    el.panel.setAttribute('role', 'dialog');
    el.panel.setAttribute('aria-label', 'Assistante virtuelle');
    el.panel.innerHTML =
      '<header class="asst-head"><span class="asst-avatar" aria-hidden="true">A<i></i></span>' +
      '<div class="asst-who"><strong class="asst-name"></strong><span>Assistante virtuelle de Code A-Z</span></div>' +
      '<button type="button" class="asst-close" aria-label="Fermer l’assistante">&times;</button></header>' +
      '<div class="asst-log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
      '<form class="asst-form" autocomplete="off"><label class="sr-only" for="asstInput">Votre question</label>' +
      '<input id="asstInput" class="asst-input" type="text" maxlength="400" placeholder="Posez votre question…" enterkeyhint="send">' +
      '<button type="submit" class="asst-send" aria-label="Envoyer">&#10148;</button></form>' +
      '<p class="asst-foot">Je suis une IA : vérifiez les informations importantes. <a href="/politique-confidentialite.html#donnees">Vie privée</a></p>';
    el.panel.querySelector('.asst-name').textContent = NAME;
    el.log = el.panel.querySelector('.asst-log');
    el.input = el.panel.querySelector('.asst-input');

    el.panel.querySelector('.asst-close').addEventListener('click', function () { toggle(false); });
    el.panel.querySelector('.asst-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = el.input.value; el.input.value = '';
      if (v.trim()) ask(v);
    });
    el.panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); toggle(false); } });
    el.launcher.addEventListener('click', function () { toggle(!state.open); });

    document.body.appendChild(el.panel);
    document.body.appendChild(el.launcher);
    document.body.classList.add('has-assistant');
  }

  var greeted = false;
  function toggle(open) {
    state.open = open;
    el.panel.hidden = !open;
    el.launcher.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('asst-open', open);
    if (open) {
      if (!greeted) {
        greeted = true;
        say('Bonjour ! 😊 Je suis ' + NAME + ', l’assistante virtuelle de Code A-Z. Posez-moi votre question avec vos mots : tarifs, exemples de sites par secteur, articles du blog, emplois, contact… Je suis là pour vous guider !');
        defaultChips();
        whenReady(function () {});                                   // précharge la mémoire dès l'ouverture
        state.aiCheck = fetch('/api/assistant').then(function (r) { return r.ok ? r.json() : { enabled: false }; }).then(function (d) { state.ai = !!d.enabled; }).catch(function () { state.ai = false; });
      }
      setTimeout(function () { if (matchMedia('(pointer:fine)').matches) el.input.focus(); }, 50);
    } else {
      el.launcher.focus();
    }
  }

  function init() {
    if (document.querySelector('.asst-launcher')) return;
    build();
    // Lien profond : /?aide=1 ouvre l'assistante
    if (/[?&]aide=1\b/.test(location.search)) toggle(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.CodeAZAssistant = { open: function () { toggle(true); }, ask: function (q) { toggle(true); ask(q); } };
})();
