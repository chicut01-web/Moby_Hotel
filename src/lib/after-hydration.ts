
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
