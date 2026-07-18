import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Send, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { BUSINESS_INFO } from "../data";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setStatus("loading");
    setStatusText("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setStatusText("Votre message a été envoyé avec succès ! Notre équipe commerciale vous recontactera rapidement.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setStatusText(data.errors?.[0]?.message || data.message || "Informations invalides. Veuillez vérifier votre saisie.");
      }
    } catch (err) {
      console.error("Contact Form submission error:", err);
      setStatus("error");
      setStatusText("Problème de connexion réseau. Veuillez réessayer.");
    }
  };

  return (
    <div id="contact-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">CONTACTEZ-NOUS</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Coordonnées & Localisation</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Contactez notre atelier fondé en 1946. Envoyez-nous un message sécurisé, appelez l'un de nos numéros ou visitez nos locaux à Tokoin Gbadago.
          </p>
        </div>
      </section>

      {/* Grille principale */}
      <section className="section">
        <div className="container contact-grid">
          {/* Panneau de gauche : Coordonnées de l'Atelier */}
          <div className="contact-info-panel">
            <h2 style={{ fontSize: "1.75rem", marginBottom: "12px" }}>Notre Siège Social</h2>
            <p>Notre atelier historique est situé au cœur de Tokoin Gbadago à Lomé, servant les familles et les professionnels de la capitale avec distinction.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "12px" }}>
              <div className="info-item">
                <div className="info-item-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-item-content">
                  <h4>Adresse Physique</h4>
                  <p style={{ fontSize: "0.95rem" }}>{BUSINESS_INFO.address}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <Phone size={20} />
                </div>
                <div className="info-item-content">
                  <h4>Lignes Téléphoniques</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                    {BUSINESS_INFO.phones.map((p, idx) => (
                      <a key={idx} href={`tel:${p.replace(/\s+/g, "")}`} style={{ fontSize: "0.95rem", textDecoration: "none", color: "var(--color-primary)", fontWeight: 600 }}>
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon">
                  <Clock size={20} />
                </div>
                <div className="info-item-content">
                  <h4>Heures d'Ouverture (GMT)</h4>
                  <p style={{ fontSize: "0.95rem" }}>
                    Lundi - Samedi : {BUSINESS_INFO.workingHours.weekdays}<br />
                    Dimanche : {BUSINESS_INFO.workingHours.sunday}
                  </p>
                </div>
              </div>
            </div>

            {/* Carte Google Map */}
            <div className="map-wrapper">
              <iframe
                title="Localisation Kokouvi Wash à Lomé, Togo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.8698990249345!2d1.2137732744671967!3d6.148169893838863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1023e13a799d7739%3A0x2d95f16361a30e6f!2sKokouvi%20Wash!5e0!3m2!1sen!2sus!4v1784139299035!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Panneau de droite : Formulaire de contact */}
          <div className="estimator-card">
            <h2 style={{ fontSize: "1.75rem", marginBottom: "12px" }}>Envoyez-nous un Message</h2>
            <p style={{ marginBottom: "32px" }}>Une question générale, un projet spécifique ou une demande professionnelle pour votre entreprise ? Remplissez notre formulaire sécurisé.</p>

            {statusText && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: status === "success" ? "#ecfdf5" : "#fef2f2",
                  border: status === "success" ? "1px solid #a7f3d0" : "1px solid #fca5a5",
                  color: status === "success" ? "#065f46" : "#991b1b",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                {status === "success" ? <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: "2px" }} /> : <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />}
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{statusText}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Votre Nom Complet *</label>
                <input
                  id="contact-name"
                  type="text"
                  className="form-input"
                  placeholder="Amévi Kokouvi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === "loading"}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Adresse Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="form-input"
                    placeholder="amevi@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={status === "loading"}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-phone">Numéro de Téléphone *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="form-input"
                    placeholder="+228 90564296"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={status === "loading"}
                    required
                />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-msg">Message ou Demande *</label>
                <textarea
                  id="contact-msg"
                  rows={5}
                  className="form-textarea"
                  placeholder="Saisissez ici en détail vos questions, remarques ou besoins d'entretien personnalisés."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  disabled={status === "loading"}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", marginTop: "12px", display: "inline-flex", gap: "10px", justifyContent: "center" }}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                <span>Envoyer le Message</span>
              </button>
            </form>

            <div style={{ margin: "32px 0 24px 0", height: "1px", backgroundColor: "var(--color-border)" }} />

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>Vous préférez échanger instantanément par messagerie mobile ?</p>
              <a href={BUSINESS_INFO.whatsappBaseUrl} target="_blank" rel="noreferrer" className="btn btn-accent" style={{ display: "inline-flex", gap: "8px", justifyContent: "center", width: "100%" }}>
                <MessageSquare size={18} />
                <span>Discuter Immédiatement sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
