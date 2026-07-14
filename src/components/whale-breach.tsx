"use client";

import { useState } from "react";
import { Whale } from "@/components/whale";
import { cn } from "@/lib/utils";

/**
 * Easter egg: la balena del footer, se cliccata, attraversa tutto lo
 * schermo nuotando (5.5s), poi torna al suo posto. Una sola alla volta.
 */
export function WhaleBreach({ className }: { className?: string }) {
  const [swimming, setSwimming] = useState(false);

  function onClick() {
    if (swimming) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSwimming(true);
    window.setTimeout(() => setSwimming(false), 5700);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label="Fai nuotare la balena"
        title="…?"
        className={cn(
          "cursor-pointer rounded-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          swimming && "opacity-30",
          className,
        )}
      >
        <Whale className="w-20" />
      </button>

      {swimming ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-[38vh] z-[80]"
        >
          <div className="whale-breach">
            <Whale className="w-52 drop-shadow-lg sm:w-72" />
          </div>
        </div>
      ) : null}
    </>
  );
}
