-- Disponibilità camere per date, calcolata lato DB.
-- SECURITY DEFINER: legge availability_blocks e booking_requests (tabelle
-- admin-only per RLS) senza esporle; l'anon riceve solo le camere libere.

create or replace function public.get_available_rooms(
  p_check_in date,
  p_check_out date
)
returns setof public.rooms
language sql
security definer
set search_path = public
stable
as $$
  select r.*
  from rooms r
  where r.is_active = true
    -- Nessun blocco (specifico della camera o generale) che tocchi il soggiorno.
    -- Blocchi con estremi inclusivi; soggiorno con notti [check_in, check_out).
    and not exists (
      select 1
      from availability_blocks b
      where (b.room_id = r.id or b.room_id is null)
        and b.start_date < p_check_out
        and b.end_date >= p_check_in
    )
    -- Nessuna prenotazione confermata sovrapposta.
    and not exists (
      select 1
      from booking_requests br
      where br.room_id = r.id
        and br.status = 'confirmed'
        and br.check_in < p_check_out
        and br.check_out > p_check_in
    )
  order by r.price_per_night asc;
$$;

revoke all on function public.get_available_rooms(date, date) from public;
grant execute on function public.get_available_rooms(date, date)
  to anon, authenticated;
