"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Rivela il contenuto quando entra in viewport (fade + salita a molla),
 * una volta sola. `delay` in ms per lo stagger. Con prefers-reduced-motion
 * il contenuto è mostrato subito, senza wrapper animato.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={cn(className)}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
