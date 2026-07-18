import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, Calendar, MessageSquare, Loader2, Check } from "lucide-react";
import { BUSINESS_INFO } from "../data";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Merci pour votre inscription !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.errors?.[0]?.message || data.message || "Adresse e-mail non valide.");
      }
    } catch (err) {
      console.error("Erreur d'inscription newsletter :", err);
      setStatus("error");
      setMessage("Échec de l'inscription. Veuillez réessayer plus tard.");
    }
  };

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        {/* Bannière de la Newsletter */}
        <div className="newsletter-banner" style={{ marginBottom: "80px" }}>
          <div className="newsletter-content">
            <h3>Inscrivez-vous à notre Newsletter</h3>
            <p>Recevez des guides d'entretien pour vos textiles délicats, des récits de notre patrimoine et des offres exclusives directement dans votre boîte de réception.</p>
          </div>
          <div className="newsletter-form-container">
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Entrez votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="newsletter-input"
                aria-label="Adresse e-mail pour la newsletter"
                required
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="newsletter-btn"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : status === "success" ? (
                  <Check size={18} />
                ) : (
                  "S'abonner"
                )}
              </button>
            </form>
            {message && (
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "0.85rem",
                  color: status === "success" ? "#a7f3d0" : "#fca5a5",
                  fontWeight: 600,
                  paddingLeft: "8px",
                }}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Grille principale du Footer */}
        <div className="footer-grid">
          {/* Colonne d'information sur la marque */}
          <div className="footer-brand">
            <Link to="/" className="logo-container" style={{ textDecoration: "none" }}>
              <div className="logo-icon" style={{ backgroundColor: "var(--color-secondary)", color: "var(--color-text)" }}>KW</div>
              <div>
                <span className="logo-text" style={{ color: "white" }}>KOKOUVI WASH</span>
                <span className="logo-tagline" style={{ color: "var(--color-secondary)" }}>Soin textile impeccable depuis 1946</span>
              </div>
            </Link>
            <p style={{ marginTop: "16px" }}>
              Préserver l'intégrité, les couleurs et les textures de vos vêtements de marque et de vos tissus traditionnels d'exception à Lomé, au Togo, depuis près de 80 ans.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <a
                href={BUSINESS_INFO.whatsappBaseUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent"
                style={{ padding: "10px 16px", fontSize: "0.85rem", display: "inline-flex", gap: "6px" }}
              >
                <MessageSquare size={16} />
                <span>Discuter sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Colonne Navigation */}
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Accueil</Link></li>
              <li><Link to="/services" className="footer-link">Nos Services</Link></li>
              <li><Link to="/pricing" className="footer-link">Grille des Tarifs</Link></li>
              <li><Link to="/estimator" className="footer-link">Estimateur Interactif</Link></li>
              <li><Link to="/about" className="footer-link">Notre Histoire & Engagement</Link></li>
              <li><Link to="/tips" className="footer-link">Conseils d'Entretien</Link></li>
              <li><Link to="/faq" className="footer-link">Foire Aux Questions (FAQ)</Link></li>
              <li><Link to="/contact" className="footer-link">Contact & Localisation</Link></li>
            </ul>
          </div>

          {/* Colonne Coordonnées */}
          <div className="footer-links-col">
            <h4>Coordonnées</h4>
            <ul className="footer-links" style={{ gap: "16px" }}>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <MapPin size={18} className="text-secondary" style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
                <span style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                  {BUSINESS_INFO.address}
                </span>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Calendar size={18} style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
                <span style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                  Lun - Sam : {BUSINESS_INFO.workingHours.weekdays}<br />
                  Dimanche : {BUSINESS_INFO.workingHours.sunday}
                </span>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Phone size={18} style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {BUSINESS_INFO.phones.map((phone, i) => (
                    <a key={i} href={`tel:${phone.replace(/\s+/g, "")}`} className="footer-link" style={{ fontSize: "0.95rem" }}>
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Partie inférieure du Footer */}
        <div className="footer-bottom">
          <p>
            <Link 
              to="/tracking?admin=true" 
              style={{ 
                color: "inherit", 
                textDecoration: "none", 
                cursor: "text" 
              }}
              title="Accès Administrateur"
            >
              ©
            </Link>{" "}
            {new Date().getFullYear()} Kokouvi Wash. Tous droits réservés. Blanchisserie haut de gamme depuis 1946 à Lomé.
          </p>
          <p>
            Créé avec fierté et passion
            <Link 
              to="/tracking?admin=true" 
              style={{ 
                color: "inherit", 
                textDecoration: "none", 
                cursor: "text",
                marginLeft: "2px"
              }}
              title="Accès Administrateur"
            >
              .
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
