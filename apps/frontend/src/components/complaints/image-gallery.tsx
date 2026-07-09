'use client';

import * as React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { ComplaintImage } from '@/lib/types';

export function ImageGallery({ images }: { images: ComplaintImage[] }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground">
        <ImageOff className="h-6 w-6" />
        <p className="text-xs">No photos attached</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
          >
            <Image src={image.url} alt="Complaint photo" fill className="object-cover transition-transform group-hover:scale-105" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setActiveIndex(null)}
          >
            <button className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setActiveIndex(null)}>
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i! > 0 ? i! - 1 : images.length - 1));
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i! < images.length - 1 ? i! + 1 : 0));
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <motion.div
              key={activeIndex}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[80vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[activeIndex].url} alt="Complaint photo" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
