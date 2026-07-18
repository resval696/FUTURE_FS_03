import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, MessageSquare, Phone, Calendar, MapPin, Clock, FileText, CheckCircle2, Loader2, AlertCircle, Search, Truck, CheckCircle } from "lucide-react";
import { PRICING_DATA, BUSINESS_INFO } from "../data";

interface SelectedItems {
  [itemName: string]: {
    name: string;
    price: number;
    quantity: number;
    categoryName: string;
  };
}

export default function QuoteEstimator() {
  const [activeTab, setActiveTab] = useState<"estimator" | "pickup">("estimator");
  
  // État du calculateur de devis
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState({ success: false, text: "" });

  // État du formulaire de demande de collecte
  const [pickupForm, setPickupForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
  });
  const [isSubmittingPickup, setIsSubmittingPickup] = useState(false);
  const [pickupStatus, setPickupStatus] = useState({ success: false, text: "" });
  const [lastSavedPhone, setLastSavedPhone] = useState("");

  // État du panneau de suivi intégré à côté de la collecte
  const [trackingQuery, setTrackingQuery] = useState("");
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trackingResults, setTrackingResults] = useState<any[]>([]);
  const [trackingMessage, setTrackingMessage] = useState("");
  const [trackingSearched, setTrackingSearched] = useState(false);

  const getStatusStep = (statusStr: string) => {
    const s = (statusStr || "").toLowerCase();
    if (s === "en cours") return 1;
    if (s === "complétée" || s === "complete" || s === "achevée") return 2;
    return 0; // "en attente" or default
  };

  const handleTrackingSearch = async (queryValue: string) => {
    const term = queryValue.trim();
    if (!term) return;

    setTrackingStatus("loading");
    setTrackingMessage("");
    setTrackingSearched(true);

    try {
      const isNumeric = /^\d+$/.test(term);
      let url = `/api/pickups/track?phone=${encodeURIComponent(term)}`;
      
      if (isNumeric && term.length < 6) {
        url = `/api/pickups/track?id=${term}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.count === 0 && isNumeric && term.length < 6) {
          const fallbackResponse = await fetch(`/api/pickups/track?phone=${encodeURIComponent(term)}`);
          const fallbackData = await fallbackResponse.json();
          if (fallbackResponse.ok && fallbackData.success) {
            setTrackingResults(fallbackData.data);
            setTrackingStatus("success");
            if (fallbackData.count === 0) {
              setTrackingMessage("Aucune demande de collecte trouvée pour ce numéro.");
            }
            return;
          }
        }

        setTrackingResults(data.data);
        setTrackingStatus("success");
        if (data.count === 0) {
          setTrackingMessage("Aucune demande de collecte trouvée pour ce numéro.");
        }
      } else {
        setTrackingStatus("error");
        setTrackingMessage(data.message || "Une erreur est survenue lors de la récupération.");
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err);
      setTrackingStatus("error");
      setTrackingMessage("Problème de connexion réseau. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filtrer les catégories qui ont des prix calculables
  const purchasableCategories = PRICING_DATA.filter(cat => !cat.status);

  const handleQtyChange = (categoryName: string, itemName: string, price: number, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemName] || { name: itemName, price, quantity: 0, categoryName };
      const newQty = Math.max(0, current.quantity + delta);
      
      const updated = { ...prev };
      if (newQty === 0) {
        delete updated[itemName];
      } else {
        updated[itemName] = { ...current, quantity: newQty };
      }
      return updated;
    });
  };

  const getEstimatedTotal = () => {
    return Object.values(selectedItems).reduce((total: number, item: any) => total + item.price * item.quantity, 0);
  };

  const handleSendQuoteWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemsArray = Object.values(selectedItems);
    if (itemsArray.length === 0) {
      alert("Veuillez sélectionner au moins un vêtement pour l'estimation.");
      return;
    }
    if (!customerName || !phone) {
      alert("Veuillez renseigner votre Nom et votre Numéro de Téléphone.");
      return;
    }

    setIsSubmittingQuote(true);
    setQuoteMessage({ success: false, text: "" });

    const total = getEstimatedTotal();
    const itemsDescription = itemsArray.map((item: any) => `${item.quantity}x ${item.name} (${(item.price * item.quantity).toLocaleString("fr-FR")} XOF)`).join(", ");

    try {
      // 1. Soumettre les données à l'API backend `/api/quotes`
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          items: itemsDescription,
          estimatedTotal: total,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setQuoteMessage({ success: true, text: "Estimation enregistrée avec succès !" });
        
        // 2. Ouvrir WhatsApp
        let messageText = `Bonjour Kokouvi Wash ! Je souhaite demander un devis pour mes vêtements :\n\n`;
        itemsArray.forEach((item: any) => {
          messageText += `• ${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString("fr-FR")} XOF\n`;
        });
        messageText += `\n*Total Estimé :* ${(total as any).toLocaleString("fr-FR")} XOF\n`;
        messageText += `*Nom du client :* ${customerName}\n`;
        messageText += `*Téléphone :* ${phone}\n\n`;
        messageText += `Merci de me confirmer la prise en charge !`;

        const encodedMsg = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/22891864972?text=${encodedMsg}`;
        
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 500);
      } else {
        setQuoteMessage({ success: false, text: resData.message || "Échec de l'enregistrement de l'estimation. Veuillez vérifier les informations." });
      }
    } catch (err) {
      console.error("Quote save error:", err);
      setQuoteMessage({ success: false, text: "Erreur d'enregistrement. Ouverture de WhatsApp." });
      
      // Fallback
      let messageText = `Bonjour Kokouvi Wash ! Devis estimé :\n`;
      itemsArray.forEach((item: any) => {
        messageText += `- ${item.quantity}x ${item.name}\n`;
      });
      messageText += `Total : ${(total as any).toLocaleString("fr-FR")} XOF\nClient : ${customerName}`;
      window.open(`https://wa.me/22891864972?text=${encodeURIComponent(messageText)}`, "_blank");
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handlePickupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupForm.customerName || !pickupForm.phone || !pickupForm.address || !pickupForm.preferredDate || !pickupForm.preferredTime) {
      alert("Veuillez remplir tous les champs obligatoires pour planifier une collecte.");
      return;
    }

    setIsSubmittingPickup(true);
    setPickupStatus({ success: false, text: "" });

    try {
      const response = await fetch("/api/pickups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pickupForm),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setPickupStatus({ success: true, text: "Votre demande de collecte premium a été enregistrée avec succès ! Redirection vers WhatsApp pour envoyer vos informations..." });
        setLastSavedPhone(pickupForm.phone);
        setTrackingQuery(pickupForm.phone);
        handleTrackingSearch(pickupForm.phone);
        
        // Formater le message WhatsApp
        let messageText = `Bonjour Kokouvi Wash ! Je souhaite planifier une collecte premium à domicile :\n\n`;
        messageText += `*Nom du client :* ${pickupForm.customerName}\n`;
        messageText += `*Téléphone :* ${pickupForm.phone}\n`;
        messageText += `*Adresse de collecte :* ${pickupForm.address}\n`;
        messageText += `*Date souhaitée :* ${pickupForm.preferredDate}\n`;
        messageText += `*Créneau horaire :* ${pickupForm.preferredTime}\n`;
        if (pickupForm.specialInstructions) {
          messageText += `*Consignes particulières :* ${pickupForm.specialInstructions}\n`;
        }
        messageText += `\nMerci de me confirmer la prise en charge !`;

        const encodedMsg = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/22891864972?text=${encodedMsg}`;

        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 500);

        setPickupForm({
          customerName: "",
          phone: "",
          address: "",
          preferredDate: "",
          preferredTime: "",
          specialInstructions: "",
        });
      } else {
        setPickupStatus({ success: false, text: resData.errors?.[0]?.message || resData.message || "Échec de l'enregistrement. Veuillez vérifier les informations." });
      }
    } catch (err) {
      console.error("Pickup reservation error:", err);
      setPickupStatus({ success: false, text: "Erreur d'enregistrement. Ouverture directe de WhatsApp..." });

      // Fallback
      let messageText = `Bonjour Kokouvi Wash ! Je souhaite planifier une collecte premium à domicile :\n\n`;
      messageText += `*Nom du client :* ${pickupForm.customerName}\n`;
      messageText += `*Téléphone :* ${pickupForm.phone}\n`;
      messageText += `*Adresse de collecte :* ${pickupForm.address}\n`;
      messageText += `*Date souhaitée :* ${pickupForm.preferredDate}\n`;
      messageText += `*Créneau horaire :* ${pickupForm.preferredTime}\n`;
      if (pickupForm.specialInstructions) {
        messageText += `*Consignes particulières :* ${pickupForm.specialInstructions}\n`;
      }
      messageText += `\nMerci de me confirmer la prise en charge !`;

      const encodedMsg = encodeURIComponent(messageText);
      const whatsappUrl = `https://wa.me/22891864972?text=${encodedMsg}`;
      window.open(whatsappUrl, "_blank");
    } finally {
      setIsSubmittingPickup(false);
    }
  };

  return (
    <div id="estimator-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">SERVICE PRATIQUE</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Estimateur de Devis & Réservation</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Sélectionnez vos vêtements pour simuler votre total et valider votre demande sur WhatsApp, ou programmez une collecte premium directement à votre adresse à Lomé.
          </p>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="section">
        <div className="container">
          {/* Note sur la variation des prix sur place */}
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto 30px auto",
              backgroundColor: "var(--color-primary-light)",
              border: "1px solid var(--color-primary)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <AlertCircle size={20} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: "0.925rem", color: "var(--color-text)", lineHeight: 1.5 }}>
              <strong>Note importante :</strong> Les tarifs affichés sont fournis à titre indicatif. Les prix réels peuvent varier une fois sur le lieu après vérification et inspection de l'état ou des spécificités de vos vêtements par notre équipe.
            </p>
          </div>

          {/* Sélection de l'onglet */}
          <div className="pricing-tabs" style={{ marginBottom: "50px" }}>
            <button
              className={`filter-btn ${activeTab === "estimator" ? "active" : ""}`}
              onClick={() => setActiveTab("estimator")}
              style={{ padding: "12px 24px", fontSize: "1.05rem", display: "inline-flex", gap: "8px", alignItems: "center" }}
            >
              <Calculator size={18} />
              <span>Estimateur de Devis Interactif</span>
            </button>
            <button
              className={`filter-btn ${activeTab === "pickup" ? "active" : ""}`}
              onClick={() => setActiveTab("pickup")}
              style={{ padding: "12px 24px", fontSize: "1.05rem", display: "inline-flex", gap: "8px", alignItems: "center" }}
            >
              <Calendar size={18} />
              <span>Demande de Collecte à Domicile</span>
            </button>
          </div>

          {/* Onglet 1 : Calculateur de devis */}
          {activeTab === "estimator" && (
            <div className="quote-estimator-grid">
              {/* Sélection des vêtements */}
              <div className="estimator-card">
                <h2 style={{ fontSize: "1.5rem", marginBottom: "24px" }}>Sélectionnez vos Vêtements</h2>
                
                {purchasableCategories.map((category) => (
                  <div key={category.id} style={{ marginBottom: "32px" }}>
                    <h3 style={{ fontSize: "1.15rem", color: "var(--color-primary)", paddingBottom: "8px", borderBottom: "1px solid var(--color-border)", marginBottom: "12px" }}>
                      {category.name}
                    </h3>
                    
                    <div>
                      {category.items.map((item, itemIdx) => {
                        const qty = selectedItems[item.name]?.quantity || 0;
                        return (
                          <div className="estimator-item-row" key={itemIdx}>
                            <div className="estimator-item-info">
                              <span className="estimator-item-name">{item.name}</span>
                              <span className="estimator-item-price">
                                {item.price ? `${item.price.toLocaleString("fr-FR")} XOF / pièce` : "Bientôt Disponible"}
                              </span>
                            </div>
                            
                            {item.price && (
                              <div className="qty-control">
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleQtyChange(category.name, item.name, item.price!, -1)}
                                  aria-label={`Diminuer la quantité de ${item.name}`}
                                >
                                  -
                                </button>
                                <span className="qty-val">{qty}</span>
                                <button
                                  type="button"
                                  className="qty-btn"
                                  onClick={() => handleQtyChange(category.name, item.name, item.price!, 1)}
                                  aria-label={`Augmenter la quantité de ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panneau récapitulatif du panier en direct */}
              <div className="summary-card">
                <h3 className="summary-title">
                  <FileText size={20} className="text-primary" style={{ color: "var(--color-primary)" }} />
                  <span>Récapitulatif de l'Estimation</span>
                </h3>

                {Object.keys(selectedItems).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "var(--color-text-muted)" }}>
                    <Calculator size={48} style={{ margin: "0 auto 16px auto", opacity: 0.3 }} />
                    <p>Aucun vêtement sélectionné. Ajustez les quantités à gauche pour démarrer votre devis.</p>
                  </div>
                ) : (
                  <div>
                    <div className="summary-item-list">
                      {Object.values(selectedItems).map((item: any, idx) => (
                        <div className="summary-item-line" key={idx}>
                          <span>{item.quantity}x {item.name}</span>
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            {(item.price * item.quantity).toLocaleString("fr-FR")} XOF
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="total-line">
                      <span className="total-label">Total Estimé :</span>
                      <span className="total-amount">{(getEstimatedTotal() as any).toLocaleString("fr-FR")} XOF</span>
                    </div>

                    {/* Coordonnées du client */}
                    <form onSubmit={handleSendQuoteWhatsApp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="calc-name">Votre Nom Complet *</label>
                        <input
                          id="calc-name"
                          type="text"
                          className="form-input"
                          placeholder="Jean Kouassi"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="calc-phone">Numéro de Téléphone (avec indicatif pays, ex : +228...) *</label>
                        <input
                          id="calc-phone"
                          type="tel"
                          className="form-input"
                          placeholder="+228 91864972"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", padding: "14px", display: "inline-flex", gap: "10px", justifyContent: "center" }}
                        disabled={isSubmittingQuote}
                      >
                        {isSubmittingQuote ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <MessageSquare size={18} />
                        )}
                        <span>Valider sur WhatsApp</span>
                      </button>

                      {quoteMessage.text && (
                        <p style={{ fontSize: "0.85rem", color: quoteMessage.success ? "var(--color-success)" : "var(--color-error)", fontWeight: 600, textAlign: "center", marginTop: "8px" }}>
                          {quoteMessage.text}
                        </p>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglet 2 : Demande de Collecte */}
          {activeTab === "pickup" && (
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "24px", alignItems: "flex-start", maxWidth: "1200px", margin: "0 auto" }}>
              
              {/* Formulaire de réservation à gauche */}
              <div className="estimator-card" style={{ flex: "1 1 55%", minWidth: "320px", margin: 0 }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "32px" }}>
                  <div className="card-icon" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)" }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.5rem" }}>Planifier une Collecte Premium à Domicile</h2>
                    <p style={{ fontSize: "0.9rem" }}>Nous collectons votre linge ou vos vêtements directement chez vous, à votre hôtel ou lieu de travail à Lomé.</p>
                  </div>
                </div>

                {pickupStatus.text && (
                  <div
                    style={{
                      marginBottom: "24px",
                      padding: "16px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: pickupStatus.success ? "#ecfdf5" : "#fef2f2",
                      border: pickupStatus.success ? "1px solid #a7f3d0" : "1px solid #fca5a5",
                      color: pickupStatus.success ? "#065f46" : "#991b1b",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    {pickupStatus.success ? <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: "2px" }} /> : <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{pickupStatus.text}</span>
                      {pickupStatus.success && (
                        <button 
                          onClick={() => {
                            if (lastSavedPhone) {
                              setTrackingQuery(lastSavedPhone);
                              handleTrackingSearch(lastSavedPhone);
                            }
                          }}
                          style={{ 
                            background: "none",
                            border: "none",
                            padding: 0,
                            alignSelf: "flex-start", 
                            fontSize: "0.85rem", 
                            fontWeight: 700, 
                            color: "#047857", 
                            textDecoration: "underline", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "4px",
                            cursor: "pointer"
                          }}
                        >
                          Suivre l'état de ma collecte en direct ci-contre →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handlePickupSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pickup-name">Votre Nom Complet *</label>
                      <input
                        id="pickup-name"
                        type="text"
                        className="form-input"
                        placeholder="Gaston Kokou"
                        value={pickupForm.customerName}
                        onChange={(e) => setPickupForm({ ...pickupForm, customerName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pickup-phone">Numéro de Téléphone *</label>
                      <input
                        id="pickup-phone"
                        type="tel"
                        className="form-input"
                        placeholder="+228 90038527"
                        value={pickupForm.phone}
                        onChange={(e) => setPickupForm({ ...pickupForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pickup-address">Adresse de Collecte à Lomé *</label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="pickup-address"
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: "40px" }}
                        placeholder="63 Rue Madjatom, Tokoin Gbadago, Lomé"
                        value={pickupForm.address}
                        onChange={(e) => setPickupForm({ ...pickupForm, address: e.target.value })}
                        required
                      />
                      <MapPin size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="pickup-date">Date Souhaitée *</label>
                      <input
                        id="pickup-date"
                        type="date"
                        className="form-input"
                        min={new Date().toISOString().split("T")[0]}
                        value={pickupForm.preferredDate}
                        onChange={(e) => setPickupForm({ ...pickupForm, preferredDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pickup-time">Créneau Horaire Souhaité *</label>
                      <select
                        id="pickup-time"
                        className="form-select"
                        value={pickupForm.preferredTime}
                        onChange={(e) => setPickupForm({ ...pickupForm, preferredTime: e.target.value })}
                        required
                      >
                        <option value="">Sélectionnez un créneau horaire</option>
                        <option value="08:00 AM - 10:00 AM">Matinée (08:00 - 10:00)</option>
                        <option value="10:00 AM - 12:00 PM">Fin de Matinée (10:00 - 12:00)</option>
                        <option value="12:00 PM - 02:00 PM">Midi / Déjeuner (12:00 - 14:00)</option>
                        <option value="02:00 PM - 04:00 PM">Après-midi (14:00 - 16:00)</option>
                        <option value="04:00 PM - 06:00 PM">Fin d'après-midi (16:00 - 18:00)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pickup-instructions">Consignes Particulières (Optionnel)</label>
                    <textarea
                      id="pickup-instructions"
                      rows={4}
                      className="form-textarea"
                      placeholder="Précisez ici les sensibilités des tissus, consignes particulières ou caractéristiques des pièces fragiles (ex : soie, robe de mariée, broderies dorées, etc.)."
                      value={pickupForm.specialInstructions}
                      onChange={(e) => setPickupForm({ ...pickupForm, specialInstructions: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px", marginTop: "12px", display: "inline-flex", gap: "10px", justifyContent: "center" }}
                    disabled={isSubmittingPickup}
                  >
                    {isSubmittingPickup ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <MessageSquare size={18} />
                    )}
                    <span>Planifier et envoyer sur WhatsApp</span>
                  </button>
                </form>
              </div>

              {/* Panneau de suivi client à droite */}
              <div className="estimator-card" style={{ flex: "1 1 40%", minWidth: "320px", border: "2px solid var(--color-primary-light)", margin: 0, padding: "24px", borderRadius: "var(--radius-md)" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                  <div className="card-icon" style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-primary)", width: "36px", height: "36px" }}>
                    <Search size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Suivi en Direct</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", margin: 0 }}>Saisissez votre numéro pour suivre votre linge</p>
                  </div>
                </div>

                {/* Recherche de suivi */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTrackingSearch(trackingQuery);
                  }}
                  style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
                >
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type="tel"
                      placeholder="Ex: +228 90038527"
                      value={trackingQuery}
                      onChange={(e) => setTrackingQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.85rem"
                      }}
                      required
                    />
                    <Phone size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: "10px 16px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                    disabled={trackingStatus === "loading"}
                  >
                    {trackingStatus === "loading" ? <Loader2 className="animate-spin" size={14} /> : "Rechercher"}
                  </button>
                </form>

                {/* Résultats de suivi */}
                {trackingStatus === "loading" && (
                  <div style={{ textAlign: "center", padding: "30px 0" }}>
                    <Loader2 className="animate-spin text-primary" size={24} style={{ margin: "0 auto" }} />
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "8px" }}>Recherche de votre collecte...</p>
                  </div>
                )}

                {trackingStatus === "error" && (
                  <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{trackingMessage}</span>
                  </div>
                )}

                {trackingStatus === "success" && trackingResults.length === 0 && (
                  <div style={{ textAlign: "center", padding: "30px 12px", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "#f8fafc" }}>
                    <AlertCircle size={24} style={{ color: "var(--color-text-muted)", margin: "0 auto 8px auto", opacity: 0.6 }} />
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: 0, fontWeight: 500 }}>
                      Aucune collecte active pour "<strong>{trackingQuery}</strong>".
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "4px", margin: "4px 0 0 0" }}>
                      Vérifiez l'exactitude de votre numéro de téléphone (avec ou sans l'indicatif +228).
                    </p>
                  </div>
                )}

                {trackingStatus === "success" && trackingResults.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "480px", overflowY: "auto", paddingRight: "4px" }}>
                    {trackingResults.map((pickup) => {
                      const currentStep = getStatusStep(pickup.status);
                      return (
                        <div key={pickup.id} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "16px", backgroundColor: "#ffffff" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "10px", marginBottom: "12px" }}>
                            <div>
                              <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", fontWeight: "bold" }}>KW-1946-{pickup.id}</span>
                              <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "bold" }}>{pickup.customerName}</h4>
                            </div>
                            <span style={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: pickup.status === "complétée" ? "#d1fae5" : pickup.status === "en cours" ? "#dbeafe" : "#fef3c7",
                              color: pickup.status === "complétée" ? "#065f46" : pickup.status === "en cours" ? "#1e40af" : "#92400e"
                            }}>
                              {pickup.status}
                            </span>
                          </div>

                          {/* Stepper Vertical miniature */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", paddingLeft: "8px", margin: "14px 0" }}>
                            <div style={{ 
                              position: "absolute", 
                              left: "17px", 
                              top: "10px", 
                              bottom: "10px", 
                              width: "3px", 
                              backgroundColor: "#e2e8f0",
                              zIndex: 1
                            }} />

                            <div style={{ 
                              position: "absolute", 
                              left: "17px", 
                              top: "10px", 
                              height: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%", 
                              width: "3px", 
                              backgroundColor: "var(--color-primary)",
                              zIndex: 2,
                              transition: "height 0.4s ease-in-out"
                            }} />

                            {/* Étape 1 */}
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", zIndex: 3, position: "relative" }}>
                              <div style={{ 
                                width: "22px", 
                                height: "22px", 
                                borderRadius: "50%", 
                                backgroundColor: currentStep >= 0 ? "var(--color-primary)" : "#ffffff", 
                                border: "2px solid " + (currentStep >= 0 ? "var(--color-primary)" : "#cbd5e1"),
                                color: "#ffffff",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                boxShadow: "0 0 0 2px #ffffff"
                              }}>
                                <Clock size={10} />
                              </div>
                              <span style={{ fontSize: "0.8rem", fontWeight: currentStep === 0 ? "bold" : "normal", color: currentStep === 0 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                                En attente
                              </span>
                            </div>

                            {/* Étape 2 */}
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", zIndex: 3, position: "relative" }}>
                              <div style={{ 
                                width: "22px", 
                                height: "22px", 
                                borderRadius: "50%", 
                                backgroundColor: currentStep >= 1 ? "var(--color-primary)" : "#ffffff", 
                                border: "2px solid " + (currentStep >= 1 ? "var(--color-primary)" : "#cbd5e1"),
                                color: currentStep >= 1 ? "#ffffff" : "var(--color-text-muted)",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                boxShadow: "0 0 0 2px #ffffff"
                              }}>
                                <Truck size={10} />
                              </div>
                              <span style={{ fontSize: "0.8rem", fontWeight: currentStep === 1 ? "bold" : "normal", color: currentStep === 1 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                                En cours
                              </span>
                            </div>

                            {/* Étape 3 */}
                            <div style={{ display: "flex", gap: "12px", alignItems: "center", zIndex: 3, position: "relative" }}>
                              <div style={{ 
                                width: "22px", 
                                height: "22px", 
                                borderRadius: "50%", 
                                backgroundColor: currentStep === 2 ? "var(--color-success)" : "#ffffff", 
                                border: "2px solid " + (currentStep === 2 ? "var(--color-success)" : "#cbd5e1"),
                                color: currentStep === 2 ? "#ffffff" : "var(--color-text-muted)",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                boxShadow: "0 0 0 2px #ffffff"
                              }}>
                                <CheckCircle size={10} />
                              </div>
                              <span style={{ fontSize: "0.8rem", fontWeight: currentStep === 2 ? "bold" : "normal", color: currentStep === 2 ? "var(--color-success)" : "var(--color-text-muted)" }}>
                                Complétée
                              </span>
                            </div>
                          </div>

                          <div style={{ backgroundColor: "#f8fafc", padding: "8px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--color-text-muted)", lineHeight: 1.4, marginTop: "8px" }}>
                            {currentStep === 0 && "Demande enregistrée. Coursier en cours de répartition."}
                            {currentStep === 1 && "Coursier en route ou traitement en cours dans notre atelier."}
                            {currentStep === 2 && "Linge propre livré à domicile ! Merci de votre confiance."}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Message d'explication initial si vide */}
                {!trackingSearched && (
                  <div style={{ textAlign: "center", padding: "30px 10px", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)", backgroundColor: "#f8fafc" }}>
                    <Truck size={36} style={{ color: "var(--color-primary)", opacity: 0.25, margin: "0 auto 12px auto" }} />
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                      Saisissez simplement votre numéro de téléphone pour suivre le statut de vos commandes en temps réel.
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
}
