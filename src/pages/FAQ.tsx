import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronUp, MessageSquare, HelpCircle, PhoneCall } from "lucide-react";
import { FAQ_DATA, BUSINESS_INFO } from "../data";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndexes, setOpenIndexes] = useState<{ [key: number]: boolean }>({
    0: true, // Expand first question automatically
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredFAQs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="faq-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">QUESTIONS FRÉQUENTES</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Foire Aux Questions (FAQ)</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Des questions sur nos délais de livraison, nos lessives écologiques, le traitement du linge délicat ou notre service de collecte ? Retrouvez toutes les réponses ci-dessous.
          </p>
        </div>
      </section>

      {/* Recherche et liste d'accordéons */}
      <section className="section">
        <div className="container">
          {/* Barre de recherche en direct */}
          <div className="pricing-search" style={{ marginBottom: "50px" }}>
            <input
              type="text"
              placeholder="Rechercher des questions (ex: Collecte, Lomé, Prix...)"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher une question fréquente"
            />
            <Search
              size={20}
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
              aria-hidden="true"
            />
          </div>

          {/* Liste d'accordéons */}
          <div className="pricing-accordion-container">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, idx) => {
                const isOpen = !!openIndexes[idx];
                return (
                  <div className="accordion-item" key={idx}>
                    <button
                      className="accordion-header"
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isOpen}
                      style={{ padding: "24px" }}
                    >
                      <div className="accordion-header-title">
                        <HelpCircle size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>{faq.question}</h3>
                      </div>
                      <div>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="accordion-body" style={{ padding: "24px" }}>
                        <p style={{ fontSize: "0.95rem", color: "var(--color-text)", lineHeight: 1.6, margin: 0 }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)" }}>
                <p>Aucune question ne correspond à votre recherche.</p>
                <button className="btn btn-secondary" onClick={() => setSearchQuery("")} style={{ marginTop: "16px" }}>
                  Réinitialiser la recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support supplémentaire */}
      <section className="section section-alt" style={{ borderBottom: "none", paddingBottom: "120px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Vous Avez d'Autres Questions ?</h2>
          <p style={{ maxWidth: "560px", margin: "16px auto 32px auto" }}>
            Notre équipe de conseillers et techniciens est à votre entière disposition pour vous expliquer nos protocoles de traitement textile, nos offres professionnelles ou organiser votre collecte.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/contact" className="btn btn-primary" style={{ display: "inline-flex", gap: "8px" }}>
              <PhoneCall size={18} />
              <span>Nous Contacter Directement</span>
            </Link>
            <a href={BUSINESS_INFO.whatsappBaseUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ display: "inline-flex", gap: "8px" }}>
              <MessageSquare size={18} />
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
