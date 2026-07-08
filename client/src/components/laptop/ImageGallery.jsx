import { useState } from 'react';
import Lightbox from '../ui/Lightbox';
import './ImageGallery.css';

export default function ImageGallery({ images, alt }) {
  const [selected, setSelected] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="gallery">
      <div className="gallery-main" onClick={() => setLightboxOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightboxOpen(true); }}>
        <img src={images[selected]} alt={`${alt} - ${selected + 1}`} />
      </div>
      <div className="gallery-thumbnails">
        {images.map((img, i) => (
          <button
            key={i}
            className={`gallery-thumb ${i === selected ? 'active' : ''}`}
            onClick={() => setSelected(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={img} alt={`${alt} thumbnail ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={selected}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setSelected(s => (s > 0 ? s - 1 : images.length - 1))}
          onNext={() => setSelected(s => (s < images.length - 1 ? s + 1 : 0))}
        />
      )}
    </div>
  );
}
