/* ============================================================
   Code A-Z — assistant/search.js
   Moteur de recherche de l'assistante : comprend le français, ignore
   les accents, reconnaît les synonymes (resto = restaurant, tarif = prix…).
   Même fichier utilisé dans le navigateur (phase 1) et sur le serveur
   (pour choisir les passages envoyés à l'IA, phase 2).
   Aucune dépendance, aucune donnée envoyée nulle part.
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AssistantSearch = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STOP = ('le la les un une des du de d l au aux a ai as ont est sont etre avoir et ou mais donc or ni car que qui quoi dont ou ' +
    'je tu il elle on nous vous ils elles me te se ce cet cette ces mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs ' +
    'en y dans sur sous par pour avec sans chez vers entre contre pas ne plus tres trop bien aussi comme si ' +
    'veux voudrais voulez souhaite souhaiterais aimerais cherche chercher trouver trouve besoin faire fais peut peux pouvez puis ' +
    'svp stp merci bonjour salut bonsoir hello voila cela ca c est qu il y a quel quelle quels quelles quelque comment faut fait faites').split(' ');
  var STOPSET = {}; STOP.forEach(function (w) { STOPSET[w] = 1; });

  // Groupes de synonymes : si l'un des mots est tapé, on cherche aussi les autres
  var GROUPS = [
    'prix tarif tarifs cout couts combien budget cher coute couter forfait fcfa devis montant payer paiement facture',
    'contact contacter joindre appeler telephone tel numero whatsapp mail email ecrire adresse rendez rdv parler',
    'blog article articles lire lecture billet',
    'emploi emplois job recrutement recrute recruter candidature candidat postuler poste travailler rejoindre carriere',
    'restaurant resto maquis gargote bar cafe traiteur cuisine restauration',
    'avocat avocats juriste droit juridique notaire',
    'ecole college lycee scolaire formation eleve parent universite enseignement',
    'hotel residence hebergement auberge sejour chambre airbnb meuble',
    'btp construction batiment chantier travaux maconnerie architecte decoration',
    'boutique ecommerce vente vendre panier shop magasin commerce mode vetement',
    'coiffure coiffeur salon beaute ongle ongles esthetique tresses institut perruque',
    'transport livraison livrer colis location vehicule voiture taxi demenagement',
    'agro agriculture agricole cacao cajou karite cooperative recolte agroalimentaire',
    'sante hopital clinique medecin pharmacie dentaire docteur medical soin soins patient cabinet',
    'application appli app mobile android ios',
    'remboursement rembourser annulation annuler retractation satisfait acompte garantie',
    'delai duree temps rapide livre',
    'seo referencement google visibilite trafic',
    'logo identite charte flyer affiche graphisme design graphique',
    'domaine nom hebergeur maintenance',
    'donnees confidentialite rgpd protection personnelles',
    'cookies cookie traceurs consentement',
    'projet projets realisation realisations exemple exemples reference references portfolio'
  ].map(function (g) { return g.split(' '); });
  function stemEarly(t) {
    if (t.length > 5 && /aux$/.test(t)) return t.slice(0, -3) + 'al';
    if (t.length > 4 && /[sx]$/.test(t)) t = t.slice(0, -1);
    if (t.length > 6 && /(ez|er)$/.test(t)) t = t.slice(0, -2);
    else if (t.length > 5 && /e$/.test(t)) t = t.slice(0, -1);
    return t;
  }
  var SYN = {};
  GROUPS.forEach(function (g, i) { g.forEach(function (w) { var s = w.length > 4 ? stemEarly(w) : w; (SYN[s] = SYN[s] || []).push(i); }); });

  var ANSWER_TYPES = { faq: 1, price: 1, process: 1, service: 1, legal: 1, page: 1 };
  var CARD_TYPES = { post: 1, project: 1, sector: 1, job: 1, ebook: 1, page: 1 };
  var W = { title: 4, keywords: 3, tags: 3, text: 1 };

  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'`]/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function stem(t) {
    if (t.length > 5 && /aux$/.test(t)) return t.slice(0, -3) + 'al';
    if (t.length > 4 && /[sx]$/.test(t)) t = t.slice(0, -1);
    if (t.length > 6 && /(ez|er)$/.test(t)) t = t.slice(0, -2);
    else if (t.length > 5 && /e$/.test(t)) t = t.slice(0, -1);
    return t;
  }
  function tokens(s) {
    return norm(s).split(' ').filter(function (t) { return t && !STOPSET[t] && t.length > 1; }).map(stem);
  }

  function create(kb) {
    var entries = kb.entries;
    var N = entries.length;
    var df = {};
    var docs = entries.map(function (e) {
      var m = {};
      function put(list, w) { list.forEach(function (t) { if (!m[t] || m[t] < w) m[t] = w; }); }
      put(tokens(e.text), W.text);
      put(tokens(e.keywords), W.keywords);
      put(tokens((e.tags || []).concat(e.sectors || []).join(' ')), W.tags);
      put(tokens(e.title), W.title);
      Object.keys(m).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
      return m;
    });

    function expand(qt) {
      var out = {};
      qt.forEach(function (t) { out[t] = 1; });
      var extra = {};
      qt.forEach(function (t) {
        (SYN[t] || []).forEach(function (gi) { GROUPS[gi].forEach(function (w) { var s = stem(w); if (!out[s]) extra[s] = 0.5; }); });
      });
      return { main: Object.keys(out), extra: extra };
    }

    function scoreEntry(doc, ex) {
      var total = 0, hits = 0;
      function tokenWeight(t, mult) {
        var idf = Math.log(1 + N / (df[t] || 1));
        var w = doc[t];
        if (w) return w * idf * mult;
        if (t.length >= 4) {                      // début de mot : « resto » ~ « restauration »
          var best = 0;
          for (var k in doc) { if (k.length >= 4 && (k.indexOf(t) === 0 || t.indexOf(k) === 0)) { if (doc[k] > best) best = doc[k]; } }
          if (best) return best * idf * mult * 0.6;
        }
        return 0;
      }
      ex.main.forEach(function (t) { var s = tokenWeight(t, 1); if (s) { total += s; hits++; } });
      Object.keys(ex.extra).forEach(function (t) { total += tokenWeight(t, ex.extra[t]); });
      return { score: total, hits: hits };
    }

    function rank(query) {
      var qt = tokens(query);
      var ex = expand(qt);
      var list = entries.map(function (e, i) {
        var r = scoreEntry(docs[i], ex);
        return { e: e, score: r.score, hits: r.hits };
      }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; });
      return { list: list, qt: qt, ex: ex };
    }

    // Identité d'un secteur = son nom + ses alias (sans les mots génériques)
    var GENERIC = { site: 1, sites: 1, pour: 1, secteur: 1, exemple: 1, metier: 1, activite: 1, web: 1 };
    var secIdentity = {};
    entries.forEach(function (e) {
      if (e.type !== 'sector') return;
      secIdentity[e.id] = tokens(e.title.replace('Sites pour :', '') + ' ' + e.keywords).filter(function (t) { return !GENERIC[t]; });
    });
    function sectorMatches(qt) {
      var q = qt.filter(function (t) { return !GENERIC[t]; });
      var hits = [];
      entries.forEach(function (e) {
        if (e.type !== 'sector') return;
        var ids = secIdentity[e.id], n = 0;
        q.forEach(function (t) {
          if (ids.indexOf(t) >= 0) n += 2;                                   // mot exact : compte double
          else if (t.length >= 4 && ids.some(function (k) { return k.length >= 4 && (k.indexOf(t) === 0 || t.indexOf(k) === 0); })) n += 1;
        });
        if (n) hits.push({ e: e, n: n });
      });
      return hits.sort(function (a, b) { return b.n - a.n; });
    }

    function has(ex, word) { var s = stem(word); return ex.main.indexOf(s) >= 0 || ex.extra[s] !== undefined; }
    function inQuery(qt, words) { return words.some(function (w) { return qt.indexOf(stem(w)) >= 0; }); }

    // Réponse principale + cartes de liens
    function ask(query) {
      var r = rank(query), list = r.list, qt = r.qt;
      var out = { answer: null, answers: [], cards: [], confidence: 'none', tokens: qt.length };
      if (!qt.length || !list.length) return out;
      var best = list[0].score;
      var byId = {}; entries.forEach(function (e) { byId[e.id] = e; });

      // Intention « prix » : afficher les formules pertinentes
      var asksPrice = inQuery(qt, ['prix', 'tarif', 'cout', 'combien', 'budget', 'cher', 'coute', 'forfait', 'fcfa', 'devis']);
      if (asksPrice) {
        var wanted = [];
        if (inQuery(qt, ['application', 'appli', 'app', 'mobile'])) wanted.push('prix-app');
        if (inQuery(qt, ['logo', 'flyer', 'affiche', 'identite', 'graphique', 'design', 'charte'])) wanted.push('prix-design');
        if (inQuery(qt, ['site', 'web', 'vitrine', 'internet', 'boutique', 'restaurant', 'resto'])) wanted.push('prix-web');
        if (!wanted.length) wanted = ['prix-web', 'prix-design', 'prix-app'];
        out.answers = wanted.map(function (id) { return byId[id]; }).filter(Boolean);
        out.answer = out.answers[0];
        out.confidence = 'high';
      } else {
        var ans = list.filter(function (x) { return ANSWER_TYPES[x.e.type]; });
        if (ans.length && ans[0].score >= best * 0.55 && ans[0].score >= 2.2) {
          out.answer = ans[0].e; out.answers = [ans[0].e];
          out.confidence = ans[0].score >= 4.5 ? 'high' : 'medium';
        }
      }

      // Cartes : articles, projets, secteurs, emplois, ressources, pages
      var used = {}; out.answers.forEach(function (a) { used[a.id] = 1; });
      var secHits = sectorMatches(qt);
      var ansScore = out.answer ? (list.filter(function (x) { return x.e.id === out.answer.id; })[0] || { score: 0 }).score : 0;
      if (secHits.length && (!out.answer || secHits[0].n >= 3 || ansScore < 4)) {   // secteur d'abord, puis 2 projets
        out.cards.push(secHits[0].e); used[secHits[0].e.id] = 1;
        var secName = secHits[0].e.title.replace('Sites pour : ', '');
        list.filter(function (x) { return x.e.type === 'project' && (x.e.sectors || []).indexOf(secName) >= 0; }).slice(0, 2)
          .forEach(function (x) { out.cards.push(x.e); used[x.e.id] = 1; });
        if (out.confidence === 'none') out.confidence = 'high';
      }
      list.forEach(function (x) {
        if (out.cards.length >= 3 || used[x.e.id] || !CARD_TYPES[x.e.type] || x.e.type === 'sector') return;
        if (x.score < Math.max(2, best * 0.45)) return;
        out.cards.push(x.e); used[x.e.id] = 1;
      });
      if (out.confidence === 'none' && out.cards.length) out.confidence = best >= 3 ? 'medium' : 'low';
      return out;
    }

    // Passages à donner à l'IA (phase 2)
    function context(query, k) {
      var r = rank(query), picked = [], seen = {};
      r.list.forEach(function (x) {
        if (picked.length >= (k || 4) || seen[x.e.id]) return;
        picked.push(x.e); seen[x.e.id] = 1;
      });
      // Toujours garder les coordonnées pour pouvoir orienter vers le contact
      var contact = entries.filter(function (e) { return e.id === 'page-contact'; })[0];
      if (contact && !seen[contact.id]) picked.push(contact);
      return picked;
    }

    return { ask: ask, context: context, rank: rank };
  }

  return { create: create, norm: norm, tokens: tokens };
});
