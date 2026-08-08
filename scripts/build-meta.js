// ============================================================
// Code A-Z — build-meta.js
// Met à jour automatiquement la date "dernière mise à jour" dans index.html
// Usage : node scripts/build-meta.js
// ============================================================

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');

function build() {
  if (!fs.existsSync(INDEX_PATH)) { console.log('index.html introuvable.'); return; }

  let html = fs.readFileSync(INDEX_PATH, 'utf-8');
  const now = new Date();
  const monthYear = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const updated = html.replace(/(<b id="lastUpdate">)(.*?)(<\/b>)/, `$1${monthYear}$3`);

  if (updated === html) {
    console.log('Repère <b id="lastUpdate"> introuvable — rien n\'a été modifié.');
    return;
  }

  fs.writeFileSync(INDEX_PATH, updated, 'utf-8');
  console.log(`index.html mis à jour — dernière mise à jour : ${monthYear}`);
}

build();