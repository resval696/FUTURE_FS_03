import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="not-found-page" style={{ padding: "120px 24px", minHeight: "65vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ maxWidth: "540px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#fef2f2", color: "var(--color-error)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={44} />
        </div>
        
        <h1 style={{ fontSize: "5rem", fontFamily: "var(--font-mono)", fontWeight: 900, lineHeight: 1, color: "var(--color-primary)" }}>404</h1>
        
        <h2 style={{ fontSize: "2rem" }}>Page Non Trouvée</h2>
        
        <p style={{ fontSize: "1.05rem" }}>
          L'adresse de page demandée n'existe pas ou a été déplacée dans le cadre de l'évolution de notre atelier de blanchisserie. Laissez-nous vous guider vers un soin textile d'exception.
        </p>

        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
          <Link to="/" className="btn btn-primary" style={{ display: "inline-flex", gap: "8px" }}>
            <Home size={18} />
            <span>Retour à l'Accueil</span>
          </Link>
          <Link to="/services" className="btn btn-secondary">
            Découvrir nos Services
          </Link>
        </div>
      </div>
    </div>
  );
}
