"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Lightbox, type LightboxImage } from "@/components/lightbox";
import { Reveal } from "@/components/reveal";

export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

/**
 * Galleria di immagini con lightbox al click: la miniatura condivide il
 * `layoutId` con l'immagine a schermo pieno, così al click **cresce**
 * fino al fullscreen invece di comparire in dissolvenza. Le miniature
 * usano next/image per le performance.
 */
export function GalleryWithLightbox({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState(0);

  const lightboxImages: LightboxImage[] = items.map((i) => ({
    src: i.src,
    alt: i.alt,
  }));

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item, i) => (
          <Reveal key={item.src} delay={i * 120}>
            <figure
              className="lantern-card group cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card"
              onClick={() => {
                setInitial(i);
                setOpen(true);
              }}
            >
              <motion.div
                layoutId={`gallery-${item.src}`}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:brightness-110"
                />
              </motion.div>
              <figcaption className="px-5 py-3 text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Lightbox
        images={lightboxImages}
        initial={initial}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
