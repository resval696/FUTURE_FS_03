import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, AlertCircle, Phone, ArrowRight, BookOpen, Clock } from "lucide-react";
import { PRICING_DATA, BUSINESS_INFO } from "../data";

export default function Pricing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    men: true,
    curtains: true,
    women: false,
    kids: false,
    "household-linen": false,
    "special-services": false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleFilterChange = (categoryId: string) => {
    setActiveFilter(categoryId);
    // Expand the category automatically if a single category is selected
    if (categoryId !== "all") {
      setExpandedCategories((prev) => ({
        ...prev,
        [categoryId]: true,
      }));
    }
  };

  // Logique de filtrage et recherche
  const filteredPricingData = PRICING_DATA.map((category) => {
    if (activeFilter !== "all" && category.id !== activeFilter) {
      return null;
    }

    const filteredItems = category.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesCategoryName = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery && filteredItems.length === 0 && !matchesCategoryName) {
      return null;
    }

    return {
      ...category,
      items: searchQuery ? filteredItems : category.items,
    };
  }).filter(Boolean);

  return (
    <div id="pricing-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">TARIFS TRANSPARENTS</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Grille des Tarifs de Nettoyage</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Des prix clairs, justes et transparents. Sélectionnez une catégorie ci-dessous ou utilisez notre estimateur dynamique pour simuler votre devis estimatif de réservation.
          </p>
        </div>
      </section>

      {/* Section Principale des Tarifs */}
      <section className="section">
        <div className="container">
          {/* Recherche en direct et Filtres */}
          <div style={{ marginBottom: "48px" }}>
            <div className="pricing-search">
              <input
                type="text"
                placeholder="Rechercher un vêtement (ex: Costume, Chemise, Rideau...)"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher un tarif"
              />
              <Search
                size={20}
                style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
            </div>

            {/* Boutons de filtrage par catégorie */}
            <div className="pricing-tabs">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                Toutes les Catégories
              </button>
              {PRICING_DATA.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                  onClick={() => handleFilterChange(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Note d'information sur les prix ajustés */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto 32px auto",
              backgroundColor: "var(--color-primary-light)",
              border: "1px solid var(--color-primary)",
              borderRadius: "var(--radius-md)",
              padding: "20px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={24} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong style={{ color: "var(--color-primary)", display: "block", marginBottom: "4px" }}>Note sur nos Tarifs :</strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.5 }}>
                Tous nos tarifs ont été soigneusement ajustés et harmonisés sur la base d'un tarif de référence de <strong>500 FCFA pour une chemise standard</strong>. Toutes les catégories sont pleinement actives pour vous permettre de simuler précisément votre devis de nettoyage avant réservation ! <strong className="text-primary" style={{ display: "block", marginTop: "8px" }}>⚠️ Note : Les prix finaux peuvent légèrement varier une fois sur le lieu après vérification et inspection physique de l'état de vos articles lors de la collecte ou du dépôt.</strong>
              </p>
            </div>
          </div>

          {/* Liste interactive en accordéon */}
          <div className="pricing-accordion-container">
            {filteredPricingData.length > 0 ? (
              // @ts-ignore
              filteredPricingData.map((category) => (
                <div className="accordion-item" key={category.id}>
                  {/* En-tête de l'accordéon */}
                  <button
                    className="accordion-header"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={expandedCategories[category.id]}
                    aria-controls={`pricing-panel-${category.id}`}
                  >
                    <div className="accordion-header-title">
                      <h3>{category.name}</h3>
                      {category.status && (
                        <span className={`accordion-header-badge ${category.status.includes("Bientôt") ? "yellow" : ""}`}>
                          {category.status}
                        </span>
                      )}
                    </div>
                    <div>
                      {expandedCategories[category.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {/* Contenu de l'accordéon */}
                  {expandedCategories[category.id] && (
                    <div className="accordion-body" id={`pricing-panel-${category.id}`} role="region">
                      <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", marginBottom: "16px" }}>
                        {category.description}
                      </p>

                      <div className="table-responsive">
                        <table className="price-table">
                          <thead>
                            <tr>
                              <th>Désignation</th>
                              <th>Type de Soin</th>
                              <th style={{ textAlign: "right" }}>Prix (FCFA)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.items.map((item: any, itemIdx: number) => (
                              <tr key={itemIdx}>
                                <td className="price-item-name">{item.name}</td>
                                <td className="price-item-type">{item.type}</td>
                                <td className="price-item-amount">
                                  {item.price !== null ? (
                                    `${item.price.toLocaleString("fr-FR")} XOF`
                                  ) : (
                                    <span className="placeholder-status">
                                      {category.status || "Tarif à confirmer"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)" }}>
                <p>Aucun vêtement ou catégorie ne correspond à votre recherche.</p>
                <button className="btn btn-secondary" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }} style={{ marginTop: "16px" }}>
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Appel à l'action pour le calculateur */}
      <section className="section section-alt" style={{ borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Calculateur de Devis Interactif</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 32px auto" }}>
            Ajoutez précisément vos chemises, costumes, pantalons ou rideaux à votre panier virtuel pour calculer instantanément votre devis estimatif avant réservation. Vous pourrez ensuite le valider directement sur WhatsApp en un clic.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/estimator" className="btn btn-primary" style={{ display: "inline-flex", gap: "8px" }}>
              <span>Ouvrir l'Estimateur Interactif</span>
              <ArrowRight size={18} />
            </Link>
            <a href={BUSINESS_INFO.whatsappBaseUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ display: "inline-flex", gap: "8px" }}>
              <Phone size={18} />
              <span>Demander un Tarif Personnalisé</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
