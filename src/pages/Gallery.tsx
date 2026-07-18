import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Eye, Sparkles } from "lucide-react";
import { GALLERY_DATA } from "../data";
import SafeImage from "../components/SafeImage";

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["all", ...Array.from(new Set(GALLERY_DATA.map((item) => item.category.toLowerCase())))];

  const filteredImages = GALLERY_DATA.filter((img) => {
    if (activeCategory === "all") return true;
    return img.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const openLightbox = (imgId: string) => {
    const index = filteredImages.findIndex((img) => img.id === imgId);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredImages.length - 1 : prev - 1;
    });
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredImages.length - 1 ? 0 : prev + 1;
    });
  };

  // Accessibilité : navigation par touches fléchées et échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <div id="gallery-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">L'ATELIER</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Notre Galerie Photos</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Découvrez en toute transparence nos équipements professionnels, nos techniques de repassage vapeur et nos processus de blanchisserie rigoureux.
          </p>
        </div>
      </section>

      {/* Section Principale de la Galerie */}
      <section className="section">
        <div className="container">
          {/* Filtres par catégorie */}
          <div className="gallery-filter" aria-label="Filtrer les images de la galerie">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setActiveCategory(cat);
                  closeLightbox();
                }}
                style={{ textTransform: "capitalize" }}
              >
                {cat === "all" ? "Tout voir" : cat}
              </button>
            ))}
          </div>

          {/* Grille d'images */}
          <div className="gallery-grid" role="region" aria-label="Galerie Visuelle">
            {filteredImages.map((item) => (
              <div
                className="gallery-item"
                key={item.id}
                onClick={() => openLightbox(item.id)}
                role="button"
                tabIndex={0}
                aria-label={`Ouvrir l'image en grand : ${item.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openLightbox(item.id);
                  }
                }}
              >
                <div className="gallery-img-container">
                  <SafeImage src={item.url} alt={item.title} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <div className="gallery-info">
                      <span className="gallery-caption">{item.category}</span>
                      <h4>{item.title}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", marginTop: "8px", fontWeight: 500 }}>
                        <Eye size={14} />
                        <span>Agrandir l'image</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="gallery-text-padding">
                  <span className="tip-category">{item.category}</span>
                  <h3 className="gallery-card-title" style={{ marginTop: "4px" }}>{item.title}</h3>
                  <p className="card-text" style={{ fontSize: "0.85rem" }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visionneuse (Lightbox) */}
      {activeImage && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true" aria-label="Visionneuse de galerie d'images">
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Bouton Fermer */}
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Fermer la visionneuse"
              id="lightbox-close-btn"
            >
              <X size={32} />
            </button>

            {/* Bouton Précédent */}
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => handlePrev(e)}
              aria-label="Image précédente"
              id="lightbox-prev-btn"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image Active */}
            <div className="lightbox-img-wrapper">
              <SafeImage
                src={activeImage.url}
                alt={activeImage.title}
                className="lightbox-img"
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Bouton Suivant */}
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => handleNext(e)}
              aria-label="Image suivante"
              id="lightbox-next-btn"
            >
              <ChevronRight size={24} />
            </button>

            {/* Informations de l'image */}
            <div className="lightbox-caption-box">
              <span className="tip-category" style={{ color: "var(--color-secondary)" }}>{activeImage.category}</span>
              <h3 style={{ margin: "6px 0", fontSize: "1.25rem" }}>{activeImage.title}</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "0.9rem" }}>{activeImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
