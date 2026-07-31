/**
 * Vero solo dopo che la pagina d'ingresso è stata dipinta.
 *
 * Serve a distinguere due montaggi che in React sono identici ma per
 * l'utente non lo sono affatto:
 *
 * - **primo caricamento**: il markup arriva dal server e deve essere
 *   leggibile subito. Partire nascosti significherebbe una pagina vuota
 *   per tutta l'attesa dello script — e vuota per sempre se lo script
 *   non arriva.
 * - **cambio pagina**: lo script è già in funzione e sta costruendo lui
 *   il contenuto. Qui partire nascosti non toglie niente a nessuno, ed è
 *   ciò che fa comparire i titoli.
 *
 * Due frame perché il primo passaggio di idratazione monta i componenti
 * dentro il primo: quando il secondo arriva, la pagina d'ingresso è
 * dipinta e ogni montaggio successivo è una navigazione.
 */
let dipinta = false;

if (typeof window !== "undefined") {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dipinta = true;
    });
  });
}

export function paginaGiaDipinta() {
  return dipinta;
}
