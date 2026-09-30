// Génère une paire de clés VAPID. À lancer une seule fois : npm run vapid
// La clé PUBLIQUE va dans js/push.js et dans .env ; la clé PRIVÉE uniquement dans .env et dans Vercel (jamais commitée).
const webpush = require('web-push');
const k = webpush.generateVAPIDKeys();
console.log('VAPID_PUBLIC_KEY=' + k.publicKey);
console.log('VAPID_PRIVATE_KEY=' + k.privateKey);
