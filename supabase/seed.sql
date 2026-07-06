-- Dati di esempio. Rispecchiano le camere segnaposto del sito.
-- Idempotente: pulisce le camere di seed prima di reinserirle.

delete from rooms
where name_it in (
  'Camerata del Chiostro',
  'Camerata dei Pellegrini',
  'Camera del Pozzo',
  'Camera dell''Affresco',
  'Camera San Francesco'
);

insert into rooms
  (name_it, name_en, description_it, description_en, type, capacity, beds, price_per_night, is_accessible, is_active)
values
  ('Camerata del Chiostro', 'Cloister Dorm',
   'Camerata da quattro letti singoli affacciata sul porticato, soffitto a volta e pavimento in cotto. Bagni comuni a pochi passi.',
   'Four single-bed dorm overlooking the portico, with a vaulted ceiling and terracotta floor. Shared bathrooms a few steps away.',
   'dorm', 4, 4, 25, false, true),

  ('Camerata dei Pellegrini', 'Pilgrims'' Dorm',
   'Tre letti singoli sotto travi a vista, ideale per piccoli gruppi ed escursionisti diretti ai sentieri del Parco.',
   'Three single beds under exposed beams, ideal for small groups and hikers heading to the Park''s trails.',
   'dorm', 3, 3, 22, false, true),

  ('Camera del Pozzo', 'Well Room',
   'Camera doppia tranquilla con vista sul giardino del chiostro e il vecchio pozzo. Due letti singoli o matrimoniale su richiesta.',
   'Quiet double room overlooking the cloister garden and the old well. Two single beds or a double on request.',
   'private', 2, 2, 68, false, true),

  ('Camera dell''Affresco', 'Fresco Room',
   'Camera matrimoniale raccolta, vicino a uno degli affreschi sei-settecenteschi riaffiorati durante i restauri.',
   'Cosy double room near one of the 17th–18th-century frescoes that resurfaced during the restoration.',
   'private', 2, 1, 78, false, true),

  ('Camera San Francesco', 'San Francesco Room',
   'Camera accessibile al piano terra, vicino alla reception, con bagno dedicato e accesso senza barriere al chiostro.',
   'Accessible ground-floor room near reception, with a private step-free bathroom and barrier-free access to the cloister.',
   'accessible', 2, 2, 70, true, true);

insert into site_settings (key, value) values
  ('site_name', 'Ostello del Convento di Sant''Antonio'),
  ('notification_email', 'info@mobydickets.it')
on conflict (key) do update set value = excluded.value;
