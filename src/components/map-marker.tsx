"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Marker della carta del territorio: al passaggio del cursore si solleva
 * e si ingrandisce con una molla. Wrapper client minimo, così la mappa
 * resta un server component.
 */
export function MapMarker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      whileHover={{ scale: 1.14, y: -4 }}
      whileTap={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 320, damping: 14 }}
      className={cn("relative flex", className)}
    >
      {children}
    </motion.span>
  );
}
