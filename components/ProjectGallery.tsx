"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { MediaItemDTO } from "@/lib/serialize";

interface ProjectGalleryProps {
  media: MediaItemDTO[];
  title: string;
}

/**
 * Every tile in a row shares the same height; width follows the image's
 * device class so mobile screenshots show tall instead of being cropped
 * into 16:9. Ratios are bucketed (not exact) so rows stay symmetric.
 */
type Bucket = {
  className: string;
  sizes: string;
};

const BUCKETS: Record<string, Bucket> = {
  mobile: {
    className: "detail-gallery-item--mobile",
    sizes: "140px",
  },
  portrait: {
    className: "detail-gallery-item--portrait",
    sizes: "200px",
  },
  square: {
    className: "detail-gallery-item--square",
    sizes: "240px",
  },
  landscape: {
    className: "detail-gallery-item--landscape",
    sizes: "320px",
  },
  wide: {
    className: "",
    sizes: "(max-width: 575px) 92vw, 420px",
  },
};

function bucketFor(item: MediaItemDTO): Bucket {
  if (!item.width || !item.height) return BUCKETS.wide;
  const ratio = item.width / item.height;
  if (ratio <= 0.6) return BUCKETS.mobile; // phone screenshots (~9:19)
  if (ratio <= 0.85) return BUCKETS.portrait; // tablet portrait (~3:4)
  if (ratio <= 1.2) return BUCKETS.square; // app windows / square shots
  if (ratio <= 1.55) return BUCKETS.landscape; // tablet/monitor 4:3-ish
  return BUCKETS.wide; // laptop/desktop 16:9+
}

/**
 * Project media gallery. Images render as tap targets that open a
 * full-screen lightbox (uncropped, arrow-key navigation, Escape to close);
 * videos play inline. Tile heights are uniform; tile widths follow each
 * image's device aspect bucket.
 */
export default function ProjectGallery({ media, title }: ProjectGalleryProps) {
  const images = media.filter((item) => item.type === "image");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length]
  );

  // Keyboard controls + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (media.length === 0) return null;

  return (
    <section className="detail-gallery" aria-label="Project media">
      <h2 className="detail-gallery-title">Gallery</h2>
      <div className="detail-gallery-grid">
        {media.map((item, index) => {
          if (item.type === "video") {
            return (
              <div
                key={`${item.url}-${index}`}
                className="detail-gallery-item detail-gallery-item--video"
              >
                <video
                  src={item.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="detail-gallery-video"
                />
              </div>
            );
          }
          const imageIndex = images.indexOf(item);
          const bucket = bucketFor(item);
          return (
            <button
              key={`${item.url}-${index}`}
              type="button"
              className={`detail-gallery-item detail-gallery-btn${
                bucket.className ? ` ${bucket.className}` : ""
              }`}
              onClick={() => setOpenIndex(imageIndex)}
              aria-label={`View image ${imageIndex + 1} of ${images.length} full size`}
              aria-haspopup="dialog"
            >
              <Image
                src={item.url}
                alt=""
                aria-hidden
                fill
                sizes={bucket.sizes}
                className="detail-gallery-img"
              />
              <span className="detail-gallery-zoom" aria-hidden>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3" />
                  <path d="M8 11h6M11 8v6" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>

      {openIndex !== null && images[openIndex] && (
        <div
          className="detail-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            className="detail-lightbox-close"
            onClick={close}
            aria-label="Close viewer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="detail-lightbox-nav detail-lightbox-nav--prev"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                className="detail-lightbox-nav detail-lightbox-nav--next"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <figure
            className="detail-lightbox-stage"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={images[openIndex].url}
              src={images[openIndex].url}
              alt={`${title} screenshot ${openIndex + 1} of ${images.length}`}
              fill
              sizes="94vw"
              className="detail-lightbox-img"
            />
          </figure>

          {images.length > 1 && (
            <span className="detail-lightbox-count" aria-hidden>
              {openIndex + 1} / {images.length}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
