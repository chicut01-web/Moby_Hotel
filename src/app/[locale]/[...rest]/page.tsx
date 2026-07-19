import { notFound } from "next/navigation";

/**
 * Catch-all per i percorsi inesistenti sotto un locale valido: delega
 * alla not-found.tsx del locale (la 404 di brand).
 */
export default function CatchAllPage() {
  notFound();
}
