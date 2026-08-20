"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Building } from "lucide-react";

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted flex items-center justify-center">
      {imgSrc ? (
        <Image
          src={error ? fallbackSrc : imgSrc}
          alt={alt || "Property image"}
          className={className}
          onError={() => {
            setError(true);
            setImgSrc(fallbackSrc);
          }}
          {...props}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
          <Building className="h-8 w-8 mb-1" />
          <span className="text-xs">No image available</span>
        </div>
      )}
    </div>
  );
}

