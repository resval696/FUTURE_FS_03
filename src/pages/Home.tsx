import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SafeImage from "../components/SafeImage";
import frontstoreImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_03.png";
import receptionImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_11.png";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle,
  Leaf,
  Heart,
  Smartphone,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  Flame,
  Printer,
  Calendar,
  Layers,
  Bed,
  Briefcase
} from "lucide-react";
import { SERVICES_DATA, VALUES_DATA, FAQ_DATA, GALLERY_DATA, BUSINESS_INFO } from "../data";

// Composant pour mapper les icônes de Lucide depuis des chaînes de caractères
const IconMapper = ({ name, size = 24 }: { name: string; size?: number }) => {
  switch (name) {
    case "Sparkles": return <Sparkles size={size} />;
    case "ShieldAlert": return <ShieldAlert size={size} />;
    case "Flame": return <Flame size={size} />;
    case "Printer": return <Printer size={size} />;
    case "Layers": return <Layers size={size} />;
    case "Bed": return <Bed size={size} />;
    case "Heart": return <Heart size={size} />;
    case "Briefcase": return <Briefcase size={size} />;
    case "Award": return <Award size={size} />;
    case "Leaf": return <Leaf size={size} />;
    case "CheckCircle": return <CheckCircle size={size} />;
    case "Smartphone": return <Smartphone size={size} />;
    default: return <Sparkles size={size} />;
  }
};

export default function Home() {
  const [businessStatus, setBusinessStatus] = useState({ isOpen: false, workingHours: "" });

  useEffect(() => {
    // Faire défiler vers le haut au chargement de la page
    window.scrollTo(0, 0);

    // Récupérer le statut d'ouverture en direct
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isOpen === "boolean") {
          setBusinessStatus({ isOpen: data.isOpen, workingHours: data.workingHours });
        }
      })
      .catch(() => {
        // Fallback si le serveur est indisponible
        const now = new Date();
        const day = now.getUTCDay();
        const hour = now.getUTCHours();
        setBusinessStatus({
          isOpen: day !== 0 && hour >= 7 && hour < 20,
          workingHours: "Lundi - Samedi : 07:00 - 20:00"
        });
      });
  }, []);

  return (
    <div id="home-page">
      {/* ==========================================
         SECTION HÉROS (HERO)
         ========================================== */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="badge-founded">
              <Award size={14} />
              <span>Soin textile d'exception depuis 1946</span>
            </div>
            
            <h1 className="hero-title" id="hero-heading">
              Le soin textile d'élite pour des <span>générations</span>.
            </h1>
            
            <p className="hero-description">
              Près de 80 ans de maîtrise de la blanchisserie à Lomé, au Togo. Alliant la précision artisanale du travail à la main aux technologies éco-responsables de pointe.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <div className={`live-status ${businessStatus.isOpen ? "open" : "closed"}`}>
                <span className="dot" />
                <span>{businessStatus.isOpen ? "Ouvert Actuellement" : "Fermé"} • Lun-Sam 07h-20h</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/estimator" className="btn btn-primary">
                <span>Prendre Rendez-vous</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Découvrir nos Services
              </Link>
            </div>
          </div>

          <div className="hero-image-wrapper">
            {/* Replace with the real Kokouvi Wash storefront */}
            <SafeImage
              src={frontstoreImg}
              alt="La devanture réelle de Kokouvi Wash à Tokoin Gbadago"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION NOTRE HISTOIRE (SINCE 1946)
         ========================================== */}
      <section className="section" id="story-section" aria-labelledby="story-heading">
        <div className="container story-split">
          <div className="story-visual">
            <div className="story-frame">
              {/* Replace with the real reception desk */}
              <SafeImage
                src={receptionImg}
                alt="L'accueil chaleureux et espace de dépôt de Kokouvi Wash"
              />
            </div>
            <div className="story-floating-badge">
              <span className="story-badge-year">80</span>
              <span className="story-badge-text">Ans de Maîtrise</span>
            </div>
          </div>

          <div className="story-content">
            <span className="section-subtitle">NOTRE HISTOIRE & PATRIMOINE</span>
            <h2 id="story-heading" className="section-title">Fondé en 1946 à Lomé</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--color-text)", fontWeight: 500 }}>
              Chez Kokouvi Wash, la blanchisserie n'est pas un simple service : c'est un héritage familial et un artisanat transmis depuis près de huit décennies.
            </p>
            <p>
              Créé en 1946 dans la capitale du Togo, Kokouvi Wash a débuté comme un atelier de lavage à la main et de repassage de précision. Plusieurs générations plus tard, nous continuons de servir Lomé au <strong>63 Rue Madjatom</strong> avec la même passion et le même soin rigoureux.
            </p>
            <p>
              Nous allions des techniques de préservation traditionnelles aux machines de lavage de pointe et à des produits hypoallergéniques pour offrir le meilleur traitement textile de la capitale.
            </p>
            <div style={{ marginTop: "12px" }}>
              <Link to="/about" className="btn btn-primary">
                Lire Notre Histoire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION APERÇU DES SERVICES
         ========================================== */}
      <section className="section section-alt" id="services-preview" aria-labelledby="services-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">NOS PRESTATIONS</span>
            <h2 id="services-heading" className="section-title">Un Soin d'Exception pour vos Textiles</h2>
            <p>Du linge de tous les jours aux vêtements traditionnels les plus précieux, découvrez nos services de blanchisserie de haut niveau.</p>
          </div>

          <div className="card-grid">
            {SERVICES_DATA.slice(0, 4).map((service) => (
              <div className="card" key={service.id}>
                <div className="card-icon">
                  <IconMapper name={service.icon} />
                </div>
                <h3 className="card-title">{service.title}</h3>
                <p className="card-text">{service.description}</p>
                <Link to="/services" style={{ color: "var(--color-primary)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", fontSize: "0.9rem", marginTop: "auto" }}>
                  <span>En savoir plus</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link to="/services" className="btn btn-secondary">
              Découvrir nos 8 Services Spécialisés
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION LE PROCESSUS KOKOUVI WASH
         ========================================== */}
      <section className="section" id="process-section" aria-labelledby="process-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">NOTRE PROCESSUS</span>
            <h2 id="process-heading" className="section-title">Le Standard de la Perfection</h2>
            <p>Découvrez comment nous traitons votre linge, étape par étape, pour garantir un résultat d'une propreté éclatante.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            <div className="card card-yellow" style={{ padding: "30px", border: "none" }}>
              <div className="card-icon" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.25rem" }}>01</div>
              <h3 className="card-title" style={{ fontSize: "1.15rem" }}>Tri & Diagnostic</h3>
              <p className="card-text" style={{ fontSize: "0.9rem" }}>
                Chaque vêtement est inspecté individuellement pour identifier la sensibilité du tissu, les taches, les boutons desserrés ou de légères déchirures avant lavage.
              </p>
            </div>

            <div className="card card-yellow" style={{ padding: "30px", border: "none" }}>
              <div className="card-icon" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.25rem" }}>02</div>
              <h3 className="card-title" style={{ fontSize: "1.15rem" }}>Lavage Éco-Responsable</h3>
              <p className="card-text" style={{ fontSize: "0.9rem" }}>
                Nettoyage à l'aide de détergents biodégradables de qualité supérieure, sans phosphate et à pH neutre, parfaits pour la protection des fibres délicates.
              </p>
            </div>

            <div className="card card-yellow" style={{ padding: "30px", border: "none" }}>
              <div className="card-icon" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.25rem" }}>03</div>
              <h3 className="card-title" style={{ fontSize: "1.15rem" }}>Repassage de Précision</h3>
              <p className="card-text" style={{ fontSize: "0.9rem" }}>
                Défroissé et pressé à la main avec des fers professionnels thermorégulés pour garantir des plis soignés et une forme préservée.
              </p>
            </div>

            <div className="card card-yellow" style={{ padding: "30px", border: "none" }}>
              <div className="card-icon" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.25rem" }}>04</div>
              <h3 className="card-title" style={{ fontSize: "1.15rem" }}>Emballage de Protection</h3>
              <p className="card-text" style={{ fontSize: "0.9rem" }}>
                Vos tenues sont suspendues sous housse respirante ou délicatement empaquetées pour éviter toute poussière ou pli jusqu'à leur livraison.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION POURQUOI NOUS CHOISIR (NOS VALEURS)
         ========================================== */}
      <section className="section section-alt" id="values-section" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">NOS VALEURS</span>
            <h2 id="values-heading" className="section-title">Pourquoi Lomé choisit Kokouvi Wash</h2>
            <p>Notre dévouement à l'égard de la qualité, de l'environnement et de notre savoir-faire fidélise nos clients année après année.</p>
          </div>

          <div className="card-grid">
            {VALUES_DATA.map((value, idx) => (
              <div className="card" key={idx} style={{ padding: "32px", border: "none" }}>
                <div className="card-icon" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                  <IconMapper name={value.icon} />
                </div>
                <h3 className="card-title" style={{ fontSize: "1.25rem" }}>{value.title}</h3>
                <p className="card-text" style={{ fontSize: "0.9rem" }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION PORTFOLIO / GALERIE
         ========================================== */}
      <section className="section" id="gallery-preview" aria-labelledby="gallery-preview-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">APERÇU DE L'ATELIER</span>
            <h2 id="gallery-preview-heading" className="section-title">Notre Savoir-faire en Images</h2>
            <p>Découvrez notre laverie moderne, nos postes de repassage de précision et notre attention méticuleuse au linge délicat.</p>
          </div>

          <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {GALLERY_DATA.slice(0, 3).map((item) => (
              <div className="gallery-item" key={item.id}>
                <div className="gallery-img-container" style={{ height: "200px" }}>
                  <SafeImage src={item.url} alt={item.title} className="gallery-img" />
                </div>
                <div className="gallery-text-padding">
                  <span className="tip-category">{item.category}</span>
                  <h4 className="gallery-card-title" style={{ marginTop: "4px" }}>{item.title}</h4>
                  <p style={{ fontSize: "0.85rem" }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/gallery" className="btn btn-secondary">
              Voir toute la Galerie & l'Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION DE PREVIEW DE LA FAQ
         ========================================== */}
      <section className="section" id="faq-preview" aria-labelledby="faq-preview-heading">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">DES QUESTIONS ?</span>
            <h2 id="faq-preview-heading" className="section-title">Aperçu de la FAQ</h2>
            <p>Des questions simples ? Voici des réponses rapides aux interrogations les plus fréquentes.</p>
          </div>

          <div className="pricing-accordion-container" style={{ marginBottom: "40px" }}>
            {FAQ_DATA.slice(0, 3).map((item, idx) => (
              <div className="accordion-item" key={idx}>
                <div className="accordion-header" style={{ padding: "20px 24px" }}>
                  <h3 className="accordion-header-title" style={{ fontSize: "1.05rem" }}>
                    <span>{item.question}</span>
                  </h3>
                </div>
                <div className="accordion-body" style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: "0.95rem" }}>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link to="/faq" className="btn btn-secondary">
              Voir Toutes les Questions (FAQ)
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================
         SECTION APPEL À L'ACTION (CTA)
         ========================================== */}
      <section className="section" id="cta-section" style={{ borderBottom: "none", paddingBottom: "120px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div style={{ backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-lg)", padding: "60px 40px", border: "1px solid rgba(26,115,232,0.1)", maxWidth: "900px", margin: "0 auto" }}>
            <span className="section-subtitle">PRÊT À ESSAYER LA DIFFÉRENCE PREMIUM ?</span>
            <h2 style={{ fontSize: "2.25rem", margin: "16px 0", letterSpacing: "-0.02em" }}>Planifiez votre Premier Dépôt Dès Aujourd'hui</h2>
            <p style={{ maxWidth: "560px", margin: "0 auto 32px auto" }}>
              Laissez nos courreurs professionnels collecter vos vêtements directement à votre domicile ou à votre bureau à Lomé, et découvrez l'excellence de près de 80 ans d'artisanat textile.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/estimator" className="btn btn-primary">
                Demander un Devis en Ligne
              </Link>
              <a href={BUSINESS_INFO.whatsappBaseUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ display: "inline-flex", gap: "8px" }}>
                <MessageSquare size={18} />
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
