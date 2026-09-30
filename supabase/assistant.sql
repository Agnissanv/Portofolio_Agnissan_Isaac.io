-- À exécuter une fois dans Supabase > SQL Editor (après schema.sql).
-- Sert à limiter l'usage de l'assistante IA gratuite : par visiteur et par jour,
-- sans jamais stocker d'adresse IP en clair (seulement une empreinte anonyme).

create table if not exists assistant_usage (
  key   text primary key,               -- ex. g:2026-10-01 (total du jour) ou v:<empreinte>:2026-10-01
  count int  not null default 0,
  day   date not null default current_date
);

alter table assistant_usage enable row level security;   -- aucune règle = inaccessible depuis le navigateur

create or replace function assistant_hit(p_key text)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare c int;
begin
  delete from assistant_usage where day < current_date - 1;   -- ménage : on ne garde que 2 jours
  insert into assistant_usage (key, count, day) values (p_key, 1, current_date)
    on conflict (key) do update set count = assistant_usage.count + 1
    returning count into c;
  return c;
end;
$$;

revoke all on function assistant_hit(text) from public, anon, authenticated;
grant execute on function assistant_hit(text) to service_role;
