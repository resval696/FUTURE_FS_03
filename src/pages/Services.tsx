import { useEffect } from "react";
import { Link } from "react-router-dom";
import SafeImage from "../components/SafeImage";
import washingMachinesImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_14_24.png";
import {
  Sparkles,
  ShieldAlert,
  Flame,
  Printer,
  Layers,
  Bed,
  Heart,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { SERVICES_DATA } from "../data";

// Composant pour mapper les icônes de Lucide depuis des chaînes de caractères
const IconMapper = ({ name, size = 32 }: { name: string; size?: number }) => {
  switch (name) {
    case "Sparkles": return <Sparkles size={size} />;
    case "ShieldAlert": return <ShieldAlert size={size} />;
    case "Flame": return <Flame size={size} />;
    case "Printer": return <Printer size={size} />;
    case "Layers": return <Layers size={size} />;
    case "Bed": return <Bed size={size} />;
    case "Heart": return <Heart size={size} />;
    case "Briefcase": return <Briefcase size={size} />;
    default: return <Sparkles size={size} />;
  }
};

export default function Services() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="services-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">NOS SPÉCIALITÉS</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Soin Professionnel des Textiles</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Chaque fibre a ses secrets. Nous proposons des traitements sur mesure et éco-responsables pour votre garde-robe quotidienne, vos tenues d'affaires et vos vêtements traditionnels d'exception.
          </p>
        </div>
      </section>

      {/* Grille des Services */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">LE STANDARD PREMIUM</span>
            <h2>Nos 8 Catégories de Maîtrise Textile</h2>
            <p>Du lavage classique en machine contrôlée au nettoyage à sec rigoureux sans produits agressifs, choisissez le soin idéal pour vos vêtements.</p>
          </div>

          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "40px" }}>
            {SERVICES_DATA.map((service) => (
              <div className="card" key={service.id} style={{ padding: "40px", border: "1px solid var(--color-border)" }}>
                <div className="card-icon" style={{ width: "64px", height: "64px", borderRadius: "12px" }}>
                  <IconMapper name={service.icon} />
                </div>
                
                <h3 className="card-title" style={{ fontSize: "1.5rem", marginTop: "8px" }}>
                  {service.title}
                </h3>
                
                <p className="card-text" style={{ fontSize: "1rem" }}>
                  {service.description}
                </p>

                <div style={{ margin: "12px 0", height: "1px", backgroundColor: "var(--color-border)" }} />

                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                  {service.detail}
                </p>

                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                  <Link
                    to="/estimator"
                    className="btn btn-secondary"
                    style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem", padding: "10px 20px" }}
                  >
                    <span>Simuler le Prix pour cette Catégorie</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section d'Intégrité du Processus */}
      <section className="section section-alt">
        <div className="container">
          <div className="story-split" style={{ alignItems: "center" }}>
            <div className="story-visual">
              <div className="story-frame" style={{ height: "400px" }}>
                {/* Real photo of Kokouvi Wash washing machines */}
                <SafeImage
                  src={washingMachinesImg}
                  alt="Les machines à laver industrielles haut de gamme de Kokouvi Wash"
                />
              </div>
            </div>

            <div className="story-content">
              <span className="section-subtitle">DÉVOUEMENT POUR CHAQUE FIBRE</span>
              <h2>Un Contrôle de Qualité Rigoureux à Chaque Étape</h2>
              <p>
                Nous ne traitons pas vos vêtements comme un simple volume industriel. Chaque pièce est unique et raconte une histoire. C'est pourquoi nous appliquons des contrôles de qualité rigoureux et constants :
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={20} className="text-primary" style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--color-text)" }}>Tri Individuel Systématique :</strong> Nous trions le linge par couleur (clairs/sombres), par matière et par degré de salissure pour éliminer tout risque de décoloration.
                  </div>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={20} className="text-primary" style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--color-text)" }}>Contrôle de pH & Température :</strong> Nos machines sont programmées pour adapter précisément le niveau de pH et la température de l'eau, prévenant le rétrécissement du lin ou de la laine.
                  </div>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <CheckCircle2 size={20} className="text-primary" style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ color: "var(--color-text)" }}>Conditionnement Protecteur Respirant :</strong> Les vêtements prêts vous sont remis sous housse de protection aérée de haute qualité ou délicatement pliés dans des coffrets en carton sur mesure.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="section" style={{ borderBottom: "none", paddingBottom: "120px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Vous Avez un Besoin Spécifique ou Express ?</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 32px auto" }}>
            Que vous soyez gérant d'hôtel à Lomé, que vous organisiez une cérémonie ou que vous ayez besoin d'un nettoyage express en 24h pour des costumes de travail, nous nous adaptons à toutes vos exigences.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/contact" className="btn btn-primary">
              Contacter nos Experts
            </Link>
            <Link to="/estimator" className="btn btn-secondary">
              Estimer un Devis en Ligne
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
