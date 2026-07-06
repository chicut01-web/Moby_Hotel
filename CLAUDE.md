# Ostello del Convento di Sant'Antonio — Sito di prenotazione

## Cosa stiamo costruendo
Sito web bilingue (IT/EN) per una struttura ricettiva: l'Ostello del Convento di Sant'Antonio
ad Acerno (SA), gestito dall'ente no-profit Moby Dick ETS.
Funzioni: raccontare la struttura, mostrare le sistemazioni, raccogliere richieste di
prenotazione e gestirle da un'area admin. App reale, multi-file, deployabile (NON single-file).

## La struttura (per testi e storytelling)
Complesso conventuale francescano del XVII secolo dedicato a Sant'Antonio, nel centro di Acerno.
Impianto monastico a "corte" con chiostro centrale porticato (archi su colonne in pietra,
giardino con pozzo), collegato a una chiesa a navata unica. Danneggiato dal terremoto del 1980 e
recuperato come Ostello della Gioventù. Durante i restauri sono affiorati affreschi sei-settecenteschi.
- Piano terra: reception (atrio-accettazione), ufficio, sala riunioni, sala mensa (~50 posti) con
  ricevimento pasti, chiostro (cuore visivo), sacrestia. La chiesa è esclusa dalla gestione.
- Primo piano: ~20 camere attorno al chiostro — mix camerate (3-4 letti singoli) e camere private
  (matrimoniali/doppie), soffitti a volta o travi a vista, pavimenti in cotto, bagni comuni
  (file di lavabi e docce). Presenti soluzioni per l'accessibilità.
- Seminterrato: lavanderia/stireria, dispensa, locale caldaia, deposito, e spazi storici
  (cisterna e ipogeo) valorizzabili come punto di interesse.
Territorio: Acerno è una località montana dei Monti Picentini (Parco Regionale): trekking, natura,
escursioni a cavallo, enogastronomia. Target: gruppi, scolaresche, escursionisti, pellegrini,
famiglie, viaggiatori attenti ad ambiente e accessibilità.

## Missione e tono
Moby Dick ETS è un Ente del Terzo Settore. Tra le finalità: turismo sostenibile, sociale e
accessibile, per promuovere il territorio salernitano e favorire mobilità/accessibilità per tutti.
Tono: accogliente, autentico, etico, radicato nel luogo. NON lusso ostentato, NON corporate.

## Stack tecnico
- Next.js (App Router) + TypeScript (strict).
- Tailwind CSS + shadcn/ui per i componenti.
- Supabase (Postgres) per i dati + Supabase Auth per l'area admin.
- next-intl (o equivalente) per la localizzazione IT/EN; IT è la lingua di default.
- Validazione form con zod + react-hook-form.
- Email transazionali via Resend (o SMTP).
- Immagini con next/image.

## Architettura e struttura file
- Organizzazione pulita e modulare: `src/app/` (route), `src/components/` (UI riutilizzabile),
  `src/lib/` (client supabase, helper, email), `messages/` (traduzioni it/en),
  `supabase/` (migrazioni e seed).
- Routing localizzato: `/[locale]/...` con `it` ed `en`.
- Niente file monolitici: ogni pagina/feature in componenti separati e tipizzati.

## Comandi (aggiornare dopo lo scaffold)
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npm run typecheck` (aggiungere lo script se assente)

## Modello dati (Supabase)
- `rooms`: name_it, name_en, description_it, description_en, type ('dorm'|'private'|'accessible'),
  capacity int, beds int, price_per_night numeric, is_accessible bool, images text[], is_active bool.
- `availability_blocks`: room_id (fk, nullable = blocco generale), start_date, end_date, reason.
- `booking_requests`: room_id (fk), guest_name, guest_email, guest_phone, check_in date,
  check_out date, num_guests int, message, status ('pending'|'confirmed'|'declined'), locale.
- `site_settings` (opzionale): coppie chiave/valore (nome struttura, email di notifica, ecc.).
- RLS: lettura pubblica solo su `rooms` attive; insert pubblico su `booking_requests`;
  tutto il resto solo per utenti autenticati (admin).

## Modello di prenotazione (v1)
Flusso "richiesta di prenotazione" SENZA pagamenti online:
1) l'ospite sceglie date, sistemazione e numero ospiti; 2) il sistema mostra solo le sistemazioni
disponibili per quelle date; 3) la richiesta viene salvata con stato `pending`; 4) email all'ospite
("richiesta ricevuta") e all'ostello; 5) l'admin conferma/rifiuta e parte l'email all'ospite.
Progettare il codice perché in futuro si possa aggiungere disponibilità in tempo reale + Stripe.

## Design system
- Concept: "serenità monastica + ospitalità calda e contemporanea". Chiaro, luminoso, autentico.
  Evitare dark/heavy e aspetto da template generico.
- Palette (ispirata ai materiali reali): bianchi caldi/calce, grigio pietra, cotto/terracotta,
  verde salvia-oliva (il chiostro), un solo accento caldo (ocra o bordeaux ecclesiastico, usato con parsimonia).
- Tipografia: serif umanista elegante per i titoli + sans-serif umanista pulito per il testo.
- Layout: molto whitespace, fotografia grande e atmosferica protagonista, griglie semplici,
  micro-interazioni discrete. Mobile-first.
- Definire i token (colori, font) nella config di Tailwind, non valori hard-coded sparsi.

## Accessibilità (requisito della missione)
Contrasto AA, navigazione da tastiera, focus visibili, alt text, HTML semantico, label sui form.

## Immagini
Le foto reali della struttura le inserisce l'utente (chiostro, sale voltate, camere, cotto).
Per ora usare placeholder e predisporre `public/images/` + l'array `images` nelle camere.
Sono disponibili anche le piante architettoniche, usabili come elemento grafico in "Il Convento".

## Guardrail — NON fare
- NIENTE pagamenti online in v1.
- MAI committare segreti: `.env*` deve stare in `.gitignore`. La service_role key di Supabase
  resta SOLO lato server.
- Chiedere conferma prima di: operazioni distruttive sul DB (drop/reset di tabelle con dati),
  cancellare file, o qualsiasi scelta ambigua.
- Niente account utente per gli ospiti: l'unico login è quello admin.
- Niente integrazioni con channel manager / OTA esterni in v1.

## Nome struttura
"Ostello del Convento di Sant'Antonio" è provvisorio: tienilo in una variabile/config
(o in `site_settings`) così è facile cambiarlo.