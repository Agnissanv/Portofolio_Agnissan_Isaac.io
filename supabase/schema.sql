-- À exécuter une fois dans Supabase > SQL Editor.
-- Choisissez une région européenne à la création du projet (ex. Paris ou Francfort).

create table if not exists push_subscriptions (
  endpoint   text primary key,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

create table if not exists push_notified (
  item_key   text primary key,          -- ex. post:mon-article, project:immo, job:developpeur-front-end
  sent_at    timestamptz not null default now()
);

-- Sécurité : RLS activée SANS aucune règle = personne ne peut lire ni écrire depuis le navigateur.
-- Seules nos fonctions serveur (clé service_role) accèdent aux tables.
alter table push_subscriptions enable row level security;
alter table push_notified enable row level security;
