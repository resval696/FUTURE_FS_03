import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Clock } from "lucide-react";
import { BUSINESS_INFO } from "../data";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [businessStatus, setBusinessStatus] = useState({ isOpen: false, workingHours: "" });
  const location = useLocation();

  useEffect(() => {
    // Fermer le tiroir de navigation au changement de page
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    // Récupérer les horaires et le statut d'ouverture en direct
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.isOpen === "boolean") {
          setBusinessStatus({
            isOpen: data.isOpen,
            workingHours: data.workingHours
          });
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du statut d'ouverture :", err);
        // Fallback en cas de redémarrage ou d'indisponibilité du serveur
        const now = new Date();
        const day = now.getUTCDay();
        const hour = now.getUTCHours();
        const isWeekday = day >= 1 && day <= 6;
        const isOpenFallback = isWeekday && hour >= 7 && hour < 20;
        setBusinessStatus({
          isOpen: isOpenFallback,
          workingHours: "Lundi - Samedi : 07:00 - 20:00"
        });
      });
  }, []);

  return (
    <>
      <header className="header" id="main-header">
        <div className="container header-inner">
        {/* Logo de la marque */}
        <Link to="/" className="logo-container" aria-label="Accueil Kokouvi Wash">
          <div className="logo-icon">KW</div>
          <div>
            <span className="logo-text">KOKOUVI WASH</span>
            <span className="logo-tagline">Blanchisserie Premium</span>
          </div>
        </Link>

        {/* Navigation Bureau */}
        <nav aria-label="Navigation principale">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Tarifs
              </NavLink>
            </li>
            <li>
              <NavLink to="/estimator" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Estimateur
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Notre Histoire
              </NavLink>
            </li>
            <li>
              <NavLink to="/tips" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Conseils
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                FAQ
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Contact
              </NavLink>
            </li>
            
            {/* Indicateur de statut en direct */}
            <li>
              <div 
                className={`live-status ${businessStatus.isOpen ? "open" : "closed"}`}
                title={businessStatus.workingHours}
              >
                <span className="dot" />
                <span>{businessStatus.isOpen ? "Ouvert" : "Fermé"}</span>
              </div>
            </li>

            {/* Bouton d'action rapide */}
            <li>
              <Link to="/estimator" className="nav-btn">
                Réserver
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bouton Hamburger Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-toggle"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          id="hamburger-menu-btn"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>

    {/* Tiroir de Navigation Mobile */}
    {isOpen && (
      <div className="mobile-drawer" id="mobile-nav-drawer">
          <div className="mobile-drawer-header">
            <Link to="/" className="logo-container" onClick={() => setIsOpen(false)}>
              <div className="logo-icon">KW</div>
              <div>
                <span className="logo-text">KOKOUVI WASH</span>
                <span className="logo-tagline">Blanchisserie Premium</span>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Statut dynamique dans le menu mobile */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Clock size={16} className="text-muted" />
            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Statut :</span>
            <div className={`live-status ${businessStatus.isOpen ? "open" : "closed"}`}>
              <span className="dot" />
              <span>{businessStatus.isOpen ? "Ouvert" : "Fermé"}</span>
            </div>
          </div>

          <ul className="mobile-drawer-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Tarifs
              </NavLink>
            </li>
            <li>
              <NavLink to="/estimator" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Estimateur de Devis
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Notre Histoire
              </NavLink>
            </li>
            <li>
              <NavLink to="/tips" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Conseils d'Entretien
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                FAQ
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `mobile-drawer-link ${isActive ? "active" : ""}`} onClick={() => setIsOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>

          <div style={{ marginTop: "auto" }}>
            <Link to="/estimator" className="btn btn-primary" style={{ width: "100%" }} onClick={() => setIsOpen(false)}>
              Demander un Devis
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
