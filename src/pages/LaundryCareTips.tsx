import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, BookOpen, Sparkles, Heart, HelpCircle, ArrowRight, Check } from "lucide-react";
import { TIPS_DATA } from "../data";

export default function LaundryCareTips() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="tips-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">CONSEILS D'EXPERTS</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Entretien & Préservation des Textiles</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            La longévité de vos vêtements commence par les bons gestes du quotidien. Apprenez à préserver l'éclat des couleurs, la structure et la solidité des fibres grâce à nos 80 ans de savoir-faire.
          </p>
        </div>
      </section>

      {/* Grille des Conseils */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">GUIDES PRATIQUES</span>
            <h2>Soin Spécifique de 8 Textiles Clés</h2>
            <p>Retrouvez nos recommandations détaillées pour l'entretien des matières délicates, nobles et traditionnelles.</p>
          </div>

          <div className="tips-grid">
            {TIPS_DATA.map((tip, idx) => (
              <div className="tip-card" key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span className="tip-category">{tip.category}</span>
                  <div style={{ color: "var(--color-primary)" }}>
                    <BookOpen size={16} />
                  </div>
                </div>

                <h3 className="tip-title">{tip.title}</h3>
                
                <div className="tip-divider" />
                
                <p className="tip-summary">{tip.summary}</p>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                  {tip.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bannière d'information */}
      <section className="section section-alt" style={{ borderBottom: "none", paddingBottom: "120px" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "48px",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--color-border)",
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              gap: "40px",
              alignItems: "center"
            }}
          >
            <div>
              <span className="tip-category" style={{ marginBottom: "8px", display: "block" }}>VOUS CONFIEZ UN TEXTILE PRÉCIEUX ?</span>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "16px" }}>Laissez-nous Prendre Soin des Fibres Délicates</h2>
              <p style={{ fontSize: "0.95rem", marginBottom: "24px" }}>
                Les robes en soie pure, les costumes structurés sur mesure, les robes de mariée perlées et les tissus anciens tissés main peuvent facilement s'abîmer avec des lavages domestiques. Nos maîtres blanchisseurs traitent chaque fil avec le plus grand respect scientifique et de réelles techniques artisanales.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/estimator" className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  Réserver un Soin Textile
                </Link>
                <Link to="/contact" className="btn btn-secondary" style={{ padding: "12px 24px" }}>
                  Contacter un Technicien
                </Link>
              </div>
            </div>

            <div style={{ backgroundColor: "var(--color-primary-light)", padding: "30px", borderRadius: "var(--radius-md)", border: "1px dashed rgba(26,115,232,0.2)" }}>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "12px", color: "var(--color-primary)" }}>La Garantie Kokouvi Wash</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} className="text-primary" style={{ color: "var(--color-primary)" }} />
                  <span>Détergents 100% éco-responsables</span>
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} className="text-primary" style={{ color: "var(--color-primary)" }} />
                  <span>Rinçage à l'eau pure à pH équilibré</span>
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} className="text-primary" style={{ color: "var(--color-primary)" }} />
                  <span>Housses protectrices respirantes</span>
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} className="text-primary" style={{ color: "var(--color-primary)" }} />
                  <span>Repassage de précision à la vapeur</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
