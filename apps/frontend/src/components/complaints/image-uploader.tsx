'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;

interface ImageUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingImages?: { id: string; url: string }[];
  onRemoveExisting?: (id: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ files, onChange, existingImages = [], onRemoveExisting, disabled }: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const totalCount = files.length + existingImages.length;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const valid: File[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`${file.name} exceeds the 5MB limit`);
        continue;
      }
      valid.push(file);
    }

    const combined = [...files, ...valid].slice(0, MAX_FILES - existingImages.length);
    if (files.length + valid.length > MAX_FILES - existingImages.length) {
      toast.warning(`Only ${MAX_FILES} images are allowed per complaint`);
    }
    onChange(combined);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        <AnimatePresence>
          {existingImages.map((img) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              <Image src={img.url} alt="Complaint attachment" fill className="object-cover" />
              {onRemoveExisting && !disabled && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          ))}
          {files.map((file, index) => (
            <motion.div key={`${file.name}-${index}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange(files.filter((_, i) => i !== index))}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {totalCount < MAX_FILES && !disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary'
            )}
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[11px] font-medium">Add photo</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-muted-foreground">Up to {MAX_FILES} images, 5MB each. JPEG, PNG, WEBP or GIF.</p>
    </div>
  );
}
