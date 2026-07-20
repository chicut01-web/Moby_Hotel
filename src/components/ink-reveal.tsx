"use client";

import { type ElementType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Titolo che "si scrive" a inchiostro, parola per parola, quando entra in
 * viewport: ogni parola sale a fuoco (blur + salita) su una molla, in
 * cascata. Una sola volta. Con prefers-reduced-motion il testo è già
 * tutto lì, senza animazione.
 *
 * `as` sceglie il tag (default h2); `startDelay` ritarda la cascata iniziale;
 * `stagger` è il ritardo tra una parola e l'altra (ms).
 */
export function InkReveal({
  text,
  as,
  className,
  startDelay = 0,
  stagger = 90,
  wordClassName,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  startDelay?: number;
  stagger?: number;
  wordClassName?: string;
}) {
  const reduced = useReducedMotion();
  const Tag = (as ?? "h2") as ElementType;
  const words = text.split(" ");

  if (reduced) return <Tag className={cn(className)}>{text}</Tag>;

  return (
    <Tag className={cn(className)}>
      {words.map((word, i) => (
        // Lo spazio sta FUORI dallo span animato: dentro un inline-block
        // il whitespace finale viene troncato e le parole si attaccano.
        <span key={`${word}-${i}`}>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ opacity: 0, y: 14, filter: "blur(7px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2, margin: "0px 0px -5% 0px" }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 20,
              mass: 0.7,
              delay: (startDelay + i * stagger) / 1000,
            }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </Tag>
  );
}
