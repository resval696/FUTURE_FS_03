import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCw,
  Sliders,
  ChevronRight,
  Sparkles,
  Lock,
  Unlock,
  BarChart3,
  Database,
  Mail,
  Eye,
  Check,
  Layers,
  TrendingUp,
  Inbox
} from "lucide-react";

interface PickupReservation {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  specialInstructions: string | null;
  status: string;
  createdAt: string;
}

interface AdminStats {
  contacts: number;
  pickups: number;
  quotes: number;
  newsletter: number;
  futureDashboardModules: string[];
}

export default function PickupTracking() {
  const location = useLocation();
  
  // Client States
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [results, setResults] = useState<PickupReservation[]>([]);
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Admin / Secret Portal States
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [adminTab, setAdminTab] = useState<"stats" | "pickups" | "quotes" | "contacts" | "newsletter">("stats");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  
  // Admin Lists
  const [allPickups, setAllPickups] = useState<PickupReservation[]>([]);
  const [allQuotes, setAllQuotes] = useState<any[]>([]);
  const [allContacts, setAllContacts] = useState<any[]>([]);
  const [allNewsletters, setAllNewsletters] = useState<any[]>([]);

  // Filters
  const [adminSearchQuery, setAdminSearchQuery] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("Tous");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Si un numéro de téléphone ou de suivi est passé en paramètre de recherche (ex: après création)
    const params = new URLSearchParams(location.search);
    const trackingQuery = params.get("q") || params.get("phone");
    if (trackingQuery) {
      setSearchQuery(trackingQuery);
      handleSearch(trackingQuery);
    }

    const isAdmin = params.get("admin") === "true";
    if (isAdmin) {
      setShowAdminConsole(true);
    }
  }, [location]);

  // Load Admin Data on demand when console is opened or tab changes
  useEffect(() => {
    if (showAdminConsole) {
      fetchAdminStats();
      fetchAdminTabContent(adminTab);
    }
  }, [showAdminConsole, adminTab]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminStats(data.data);
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    }
  };

  const fetchAdminTabContent = async (tab: typeof adminTab) => {
    setAdminLoading(true);
    setAdminError("");
    try {
      let endpoint = "/api/admin/pickups";
      if (tab === "quotes") endpoint = "/api/admin/quotes";
      if (tab === "contacts") endpoint = "/api/admin/contacts";
      if (tab === "newsletter") endpoint = "/api/admin/newsletter";

      if (tab === "stats") {
        await fetchAdminStats();
        setAdminLoading(false);
        return;
      }

      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok && data.success) {
        if (tab === "pickups") setAllPickups(data.data);
        if (tab === "quotes") setAllQuotes(data.data);
        if (tab === "contacts") setAllContacts(data.data);
        if (tab === "newsletter") setAllNewsletters(data.data);
      } else {
        setAdminError(data.message || "Erreur de chargement des données.");
      }
    } catch (err) {
      console.error(`Error loading admin tab ${tab}:`, err);
      setAdminError("Erreur de connexion avec le serveur.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleSearch = async (queryValue: string) => {
    const term = queryValue.trim();
    if (!term) return;

    setStatus("loading");
    setMessage("");
    setSearched(true);

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
            setResults(fallbackData.data);
            setStatus("success");
            if (fallbackData.count === 0) {
              setMessage("Aucune demande de collecte trouvée pour ce numéro ou cet identifiant.");
            }
            return;
          }
        }

        setResults(data.data);
        setStatus("success");
        if (data.count === 0) {
          setMessage("Aucune demande de collecte trouvée pour ce numéro ou cet identifiant.");
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Une erreur est survenue lors de la récupération des données.");
      }
    } catch (err) {
      console.error("Error fetching tracking data:", err);
      setStatus("error");
      setMessage("Problème de connexion réseau. Veuillez réessayer.");
    }
  };

  const executeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Status update
  const handleUpdateStatus = async (pickupId: number, newStatus: string) => {
    setUpdatingId(pickupId);
    try {
      const response = await fetch(`/api/admin/pickups/${pickupId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Update client-side tracking results if they contain this item
        setResults((prevResults) =>
          prevResults.map((item) =>
            item.id === pickupId ? { ...item, status: newStatus } : item
          )
        );
        // Update admin pickups list if loaded
        setAllPickups((prev) =>
          prev.map((item) =>
            item.id === pickupId ? { ...item, status: newStatus } : item
          )
        );
        // Refresh stats counter
        fetchAdminStats();
      } else {
        alert(data.message || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Erreur de connexion.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick action: Select a pickup from Admin to track it as a customer
  const trackAsCustomer = (pickup: PickupReservation) => {
    setSearchQuery(pickup.phone);
    setResults([pickup]);
    setStatus("success");
    setSearched(true);
    
    // Only scroll to bottom client section if on small screens (mobile/tablet)
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        const el = document.getElementById("client-tracking-results");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const getStatusStep = (statusStr: string) => {
    switch (statusStr?.toLowerCase()) {
      case "en cours":
        return 1;
      case "complétée":
      case "completee":
        return 2;
      case "en attente":
      default:
        return 0;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="tracking-page" style={{ position: "relative" }}>
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">SERVICE CLIENT KOKOUVI WASH</span>
          <h1 
            style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}
            onDoubleClick={() => {
              setShowAdminConsole(!showAdminConsole);
              alert("Mode Administrateur / Simulateur activé ! Défilez vers le bas pour voir la console d'administration.");
            }}
          >
            Suivi de ma Collecte
          </h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Suivez l'avancement de votre demande de collecte premium à domicile à Lomé en temps réel.
          </p>
        </div>
      </section>

      {/* Espace Admin activable en double-cliquant sur le titre "Suivi de ma Collecte" */}

      {/* PORTAIL ADMINISTRATEUR KOKOUVI WASH (Affiché si activé) */}
      {showAdminConsole && (
        <section className="section" style={{ padding: "40px 0", backgroundColor: "#f1f5f9", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container" style={{ maxWidth: "1200px" }}>
            
            {/* Header du portail */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px", 
              backgroundColor: "var(--color-surface)", 
              padding: "20px 24px", 
              borderRadius: "var(--radius-md)", 
              boxShadow: "var(--shadow-sm)",
              borderLeft: "5px solid var(--color-secondary)"
            }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  PORTAIL DE SIMULATION & ADMINISTRATION
                </span>
                <h2 style={{ fontSize: "1.6rem", margin: "4px 0 0 0", fontWeight: 800 }}>
                  Back-Office Kokouvi Wash
                </h2>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className="badge" style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "6px 12px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600 }}>
                  Statut: Connecté (Demo)
                </span>
              </div>
            </div>

            {/* Statistiques rapides en widgets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              
              <div style={{ backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                  <Truck size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Demandes Collectes</span>
                  <strong style={{ fontSize: "1.6rem" }}>{adminStats?.pickups ?? "..."}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Devis Calculés</span>
                  <strong style={{ fontSize: "1.6rem" }}>{adminStats?.quotes ?? "..."}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
                  <Inbox size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Contacts Clients</span>
                  <strong style={{ fontSize: "1.6rem" }}>{adminStats?.contacts ?? "..."}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: "var(--color-surface)", padding: "20px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                  <Mail size={24} />
                </div>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Newsletter</span>
                  <strong style={{ fontSize: "1.6rem" }}>{adminStats?.newsletter ?? "..."}</strong>
                </div>
              </div>

            </div>

            {/* Menu des Onglets */}
            <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "24px", overflowX: "auto", gap: "8px" }}>
              <button
                onClick={() => setAdminTab("stats")}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: adminTab === "stats" ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: adminTab === "stats" ? 700 : 500,
                  color: adminTab === "stats" ? "var(--color-primary)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <BarChart3 size={16} /> Vue Générale
              </button>
              <button
                onClick={() => setAdminTab("pickups")}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: adminTab === "pickups" ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: adminTab === "pickups" ? 700 : 500,
                  color: adminTab === "pickups" ? "var(--color-primary)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <Truck size={16} /> Gérer les Collectes ({adminStats?.pickups ?? 0})
              </button>
              <button
                onClick={() => setAdminTab("quotes")}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: adminTab === "quotes" ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: adminTab === "quotes" ? 700 : 500,
                  color: adminTab === "quotes" ? "var(--color-primary)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <TrendingUp size={16} /> Devis Calculés ({adminStats?.quotes ?? 0})
              </button>
              <button
                onClick={() => setAdminTab("contacts")}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: adminTab === "contacts" ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: adminTab === "contacts" ? 700 : 500,
                  color: adminTab === "contacts" ? "var(--color-primary)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <Inbox size={16} /> Messages de Contact ({adminStats?.contacts ?? 0})
              </button>
              <button
                onClick={() => setAdminTab("newsletter")}
                style={{
                  padding: "12px 20px",
                  background: "none",
                  border: "none",
                  borderBottom: adminTab === "newsletter" ? "3px solid var(--color-primary)" : "3px solid transparent",
                  fontWeight: adminTab === "newsletter" ? 700 : 500,
                  color: adminTab === "newsletter" ? "var(--color-primary)" : "var(--color-text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap"
                }}
              >
                <Mail size={16} /> Newsletter ({adminStats?.newsletter ?? 0})
              </button>
            </div>

            {/* Contenu de l'onglet actif */}
            <div style={{ minHeight: "300px" }}>
              
              {/* Message de Chargement ou d'erreur */}
              {adminLoading && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Loader2 className="animate-spin text-primary" size={40} style={{ margin: "0 auto 12px auto" }} />
                  <p>Chargement des données administratives...</p>
                </div>
              )}

              {adminError && (
                <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "8px", marginBottom: "16px" }}>
                  <p><strong>Erreur:</strong> {adminError}</p>
                </div>
              )}

              {/* Onglet 1: Statistiques Générales / Vue Générale */}
              {!adminLoading && adminTab === "stats" && (
                <div className="card animate-fade-in" style={{ padding: "32px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={20} className="text-secondary" />
                    Vue d'ensemble opérationnelle
                  </h3>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "24px" }}>
                    Bienvenue dans la console de simulation opérationnelle de Kokouvi Wash. Cet espace vous permet de suivre l'état de l'application, de visualiser les données stockées dans la base de données SQLite de démonstration et de modifier le flux de traitement des commandes.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                    <div style={{ border: "1px solid var(--color-border)", padding: "20px", borderRadius: "var(--radius-sm)", backgroundColor: "#fafbfc" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Layers size={16} className="text-primary" /> Modèles de Données Connectés
                      </h4>
                      <ul style={{ paddingLeft: "20px", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <li><strong>Collectes :</strong> Réservations premium à domicile avec date, heure et statut.</li>
                        <li><strong>Devis de nettoyage :</strong> Estimations calculées avec prix en Francs CFA (XOF).</li>
                        <li><strong>Demandes de support :</strong> Formulaire de contact pour demandes de renseignements.</li>
                        <li><strong>Abonnés :</strong> Inscriptions à la lettre d'information hebdomadaire.</li>
                      </ul>
                    </div>

                    <div style={{ border: "1px solid var(--color-border)", padding: "20px", borderRadius: "var(--radius-sm)", backgroundColor: "#fafbfc" }}>
                      <h4 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Sliders size={16} className="text-secondary" /> Comment évaluer les fonctionnalités ?
                      </h4>
                      <ol style={{ paddingLeft: "20px", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <li>Cliquez sur l'onglet <strong>Gérer les Collectes</strong> pour afficher toutes les commandes enregistrées.</li>
                        <li>Utilisez les filtres ou cherchez un nom de client (ex: Gaston Kokou).</li>
                        <li>Mettez à jour le statut en cliquant sur les boutons d'actions rapides (en attente, en cours, complétée).</li>
                        <li>Cliquez sur <strong>Suivre l'état</strong> pour charger instantanément cette demande spécifique dans le stepper client ci-dessous !</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet 2: Gérer les Collectes */}
              {!adminLoading && adminTab === "pickups" && (
                <div className="card" style={{ padding: "24px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                  
                  <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" }}>
                    
                    {/* Colonne Gauche : Tableau et filtres */}
                    <div style={{ flex: results.length > 0 ? "1 1 60%" : "1 1 100%", minWidth: "300px", transition: "all 0.3s ease-in-out" }}>
                      {/* Filtres de recherche admin */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                        
                        {/* Recherche textuelle */}
                        <div style={{ position: "relative", minWidth: "260px" }}>
                          <input
                            type="text"
                            placeholder="Rechercher par nom, téléphone..."
                            value={adminSearchQuery}
                            onChange={(e) => setAdminSearchQuery(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 36px",
                              borderRadius: "4px",
                              border: "1px solid var(--color-border)",
                              fontSize: "0.9rem"
                            }}
                          />
                          <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
                        </div>

                        {/* Filtre de statut */}
                        <div style={{ display: "flex", gap: "6px" }}>
                          {["Tous", "en attente", "en cours", "complétée"].map((st) => (
                            <button
                              key={st}
                              onClick={() => setAdminStatusFilter(st)}
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                borderRadius: "20px",
                                border: "1px solid " + (adminStatusFilter === st ? "var(--color-primary)" : "var(--color-border)"),
                                backgroundColor: adminStatusFilter === st ? "var(--color-primary)" : "#ffffff",
                                color: adminStatusFilter === st ? "#ffffff" : "var(--color-text)",
                                cursor: "pointer",
                                textTransform: "capitalize"
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                      </div>

                      {/* Tableau des collectes */}
                      {allPickups.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                          <p style={{ color: "var(--color-text-muted)" }}>Aucune demande de collecte enregistrée.</p>
                        </div>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                            <thead>
                              <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                                <th style={{ padding: "12px 8px" }}>ID</th>
                                <th style={{ padding: "12px 8px" }}>Client</th>
                                <th style={{ padding: "12px 8px" }}>Téléphone</th>
                                <th style={{ padding: "12px 8px" }}>Date & Heure</th>
                                <th style={{ padding: "12px 8px" }}>Adresse</th>
                                <th style={{ padding: "12px 8px" }}>Statut</th>
                                <th style={{ padding: "12px 8px", textAlign: "right" }}>Actions opérationnelles</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allPickups
                                .filter((p) => {
                                  const matchesSearch = p.customerName.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                                                        p.phone.includes(adminSearchQuery);
                                  const matchesStatus = adminStatusFilter === "Tous" || p.status.toLowerCase() === adminStatusFilter.toLowerCase();
                                  return matchesSearch && matchesStatus;
                                })
                                .map((pickup) => (
                                  <tr key={pickup.id} style={{ borderBottom: "1px solid var(--color-border)", fontSize: "0.9rem" }}>
                                    <td style={{ padding: "14px 8px", fontWeight: "bold" }}>KW-{pickup.id}</td>
                                    <td style={{ padding: "14px 8px", fontWeight: 600 }}>{pickup.customerName}</td>
                                    <td style={{ padding: "14px 8px" }}>{pickup.phone}</td>
                                    <td style={{ padding: "14px 8px" }}>
                                      <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{pickup.preferredDate}</div>
                                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{pickup.preferredTime}</div>
                                    </td>
                                    <td style={{ padding: "14px 8px", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={pickup.address}>
                                      {pickup.address}
                                    </td>
                                    <td style={{ padding: "14px 8px" }}>
                                      <span style={{
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        backgroundColor: pickup.status === "complétée" ? "#d1fae5" : pickup.status === "en cours" ? "#dbeafe" : "#fef3c7",
                                        color: pickup.status === "complétée" ? "#065f46" : pickup.status === "en cours" ? "#1e40af" : "#92400e"
                                      }}>
                                        {pickup.status}
                                      </span>
                                    </td>
                                    <td style={{ padding: "14px 8px", textAlign: "right" }}>
                                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                        
                                        {/* Action : Suivre */}
                                        <button
                                          onClick={() => trackAsCustomer(pickup)}
                                          title="Afficher cette collecte dans le suivi client en direct"
                                          style={{
                                            padding: "4px 8px",
                                            fontSize: "0.75rem",
                                            backgroundColor: results.some(r => r.id === pickup.id) ? "var(--color-primary)" : "#f8fafc",
                                            color: results.some(r => r.id === pickup.id) ? "#ffffff" : "var(--color-text)",
                                            border: "1px solid var(--color-border)",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                          }}
                                        >
                                          <Eye size={12} /> {results.some(r => r.id === pickup.id) ? "Suivi actif" : "Suivre"}
                                        </button>

                                        {/* Quick Status Modifiers */}
                                        {pickup.status !== "en attente" && (
                                          <button
                                            onClick={() => handleUpdateStatus(pickup.id, "en attente")}
                                            style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "4px", backgroundColor: "#ffffff", cursor: "pointer" }}
                                          >
                                            Mettre en Attente
                                          </button>
                                        )}

                                        {pickup.status !== "en cours" && (
                                          <button
                                            onClick={() => handleUpdateStatus(pickup.id, "en cours")}
                                            style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid #93c5fd", borderRadius: "4px", backgroundColor: "#eff6ff", color: "#1e40af", cursor: "pointer" }}
                                          >
                                            Prendre en Charge
                                          </button>
                                        )}

                                        {pickup.status !== "complétée" && (
                                          <button
                                            onClick={() => handleUpdateStatus(pickup.id, "complétée")}
                                            style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid #6ee7b7", borderRadius: "4px", backgroundColor: "#ecfdf5", color: "#047857", cursor: "pointer", fontWeight: 600 }}
                                          >
                                            Terminer la Collecte
                                          </button>
                                        )}

                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Colonne Droite : Aperçu interactif du Stepper Client */}
                    {results.length > 0 && (
                      <div style={{ 
                        flex: "1 1 35%", 
                        minWidth: "320px", 
                        position: "sticky", 
                        top: "20px", 
                        alignSelf: "flex-start",
                        border: "2px solid var(--color-primary)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-lg)",
                        overflow: "hidden",
                        backgroundColor: "var(--color-surface)",
                        animation: "fadeIn 0.3s ease-out"
                      }}>
                        {/* Header de l'aperçu */}
                        <div style={{ 
                          backgroundColor: "var(--color-primary)", 
                          color: "#ffffff", 
                          padding: "12px 16px", 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center" 
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={16} />
                            <strong style={{ fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aperçu client en direct</strong>
                          </div>
                          <button 
                            onClick={() => {
                              setResults([]);
                              setSearched(false);
                            }}
                            style={{ 
                              background: "none", 
                              border: "none", 
                              color: "#ffffff", 
                              cursor: "pointer", 
                              fontSize: "0.8rem", 
                              fontWeight: "bold",
                              opacity: 0.8
                            }}
                          >
                            Masquer
                          </button>
                        </div>
                        
                        {/* Contenu de l'aperçu pour le pickup sélectionné */}
                        {results.map((pickup) => {
                          const currentStep = getStatusStep(pickup.status);
                          return (
                            <div key={pickup.id} style={{ padding: "20px" }}>
                              <div style={{ marginBottom: "16px", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
                                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>KW-1946-{pickup.id}</span>
                                <h4 style={{ margin: "2px 0 0 0", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text)" }}>{pickup.customerName}</h4>
                                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>Tél: {pickup.phone}</span>
                              </div>

                              {/* Stepper Vertical */}
                              <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "relative", paddingLeft: "10px", margin: "20px 0" }}>
                                
                                {/* Ligne verticale de fond */}
                                <div style={{ 
                                  position: "absolute", 
                                  left: "21px", 
                                  top: "14px", 
                                  bottom: "14px", 
                                  width: "4px", 
                                  backgroundColor: "#e2e8f0",
                                  zIndex: 1
                                }} />

                                {/* Ligne de progression active verticale */}
                                <div style={{ 
                                  position: "absolute", 
                                  left: "21px", 
                                  top: "14px", 
                                  height: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "100%", 
                                  width: "4px", 
                                  backgroundColor: "var(--color-primary)",
                                  zIndex: 2,
                                  transition: "height 0.4s ease-in-out"
                                }} />

                                {/* Étape 1 : En attente */}
                                <div style={{ display: "flex", gap: "16px", alignItems: "center", zIndex: 3, position: "relative" }}>
                                  <div style={{ 
                                    width: "36px", 
                                    height: "36px", 
                                    borderRadius: "50%", 
                                    backgroundColor: currentStep >= 0 ? "var(--color-primary)" : "#ffffff", 
                                    border: "3px solid " + (currentStep >= 0 ? "var(--color-primary)" : "#cbd5e1"),
                                    color: "#ffffff",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    boxShadow: "0 0 0 4px #ffffff",
                                    transition: "all 0.3s"
                                  }}>
                                    <Clock size={16} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ 
                                      fontSize: "0.9rem", 
                                      fontWeight: currentStep === 0 ? "800" : "600",
                                      color: currentStep === 0 ? "var(--color-primary)" : "var(--color-text-muted)"
                                    }}>
                                      En attente
                                    </span>
                                  </div>
                                </div>

                                {/* Étape 2 : En cours */}
                                <div style={{ display: "flex", gap: "16px", alignItems: "center", zIndex: 3, position: "relative" }}>
                                  <div style={{ 
                                    width: "36px", 
                                    height: "36px", 
                                    borderRadius: "50%", 
                                    backgroundColor: currentStep >= 1 ? "var(--color-primary)" : "#ffffff", 
                                    border: "3px solid " + (currentStep >= 1 ? "var(--color-primary)" : "#cbd5e1"),
                                    color: currentStep >= 1 ? "#ffffff" : "var(--color-text-muted)",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    boxShadow: "0 0 0 4px #ffffff",
                                    transition: "all 0.3s"
                                  }}>
                                    <Truck size={16} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ 
                                      fontSize: "0.9rem", 
                                      fontWeight: currentStep === 1 ? "800" : "600",
                                      color: currentStep === 1 ? "var(--color-primary)" : "var(--color-text-muted)"
                                    }}>
                                      En cours
                                    </span>
                                  </div>
                                </div>

                                {/* Étape 3 : Complétée */}
                                <div style={{ display: "flex", gap: "16px", alignItems: "center", zIndex: 3, position: "relative" }}>
                                  <div style={{ 
                                    width: "36px", 
                                    height: "36px", 
                                    borderRadius: "50%", 
                                    backgroundColor: currentStep === 2 ? "var(--color-success)" : "#ffffff", 
                                    border: "3px solid " + (currentStep === 2 ? "var(--color-success)" : "#cbd5e1"),
                                    color: currentStep === 2 ? "#ffffff" : "var(--color-text-muted)",
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    boxShadow: "0 0 0 4px #ffffff",
                                    transition: "all 0.3s"
                                  }}>
                                    <CheckCircle size={16} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ 
                                      fontSize: "0.9rem", 
                                      fontWeight: currentStep === 2 ? "800" : "600",
                                      color: currentStep === 2 ? "var(--color-success)" : "var(--color-text-muted)"
                                    }}>
                                      Complétée
                                    </span>
                                  </div>
                                </div>

                              </div>

                              {/* Message d'état */}
                              <div style={{ 
                                backgroundColor: "#f8fafc", 
                                padding: "12px 14px", 
                                borderRadius: "var(--radius-sm)", 
                                border: "1px solid var(--color-border)",
                                marginTop: "16px"
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                                  <span style={{ 
                                    width: "10px", 
                                    height: "10px", 
                                    borderRadius: "50%", 
                                    backgroundColor: currentStep === 2 ? "var(--color-success)" : "var(--color-primary)" 
                                  }} />
                                  <strong style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                                    {pickup.status}
                                  </strong>
                                </div>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                                  {currentStep === 0 && "Demande enregistrée. Coursier en cours de répartition."}
                                  {currentStep === 1 && "Coursier en route ou traitement en cours dans notre atelier."}
                                  {currentStep === 2 && "Linge propre livré à domicile ! Merci de votre confiance."}
                                </p>
                              </div>

                              {/* Infos rendez-vous */}
                              <div style={{ fontSize: "0.8rem", marginTop: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div><strong>Date souhaitée :</strong> {pickup.preferredDate}</div>
                                <div><strong>Créneau horaire :</strong> {pickup.preferredTime}</div>
                                <div style={{ marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 }} title={pickup.address}>
                                  <strong>Adresse :</strong> {pickup.address}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* Onglet 3: Devis Calculés */}
              {!adminLoading && adminTab === "quotes" && (
                <div className="card" style={{ padding: "24px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>Historique des devis calculés par les clients</h3>
                  
                  {allQuotes.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <p style={{ color: "var(--color-text-muted)" }}>Aucun calcul de devis enregistré.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                            <th style={{ padding: "12px 8px" }}>ID</th>
                            <th style={{ padding: "12px 8px" }}>Nom</th>
                            <th style={{ padding: "12px 8px" }}>Téléphone</th>
                            <th style={{ padding: "12px 8px" }}>Services & Quantités</th>
                            <th style={{ padding: "12px 8px" }}>Total Estimé</th>
                            <th style={{ padding: "12px 8px" }}>Calculé le</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allQuotes.map((q) => (
                            <tr key={q.id} style={{ borderBottom: "1px solid var(--color-border)", fontSize: "0.9rem" }}>
                              <td style={{ padding: "12px 8px", fontWeight: "bold" }}>#{q.id}</td>
                              <td style={{ padding: "12px 8px", fontWeight: 600 }}>{q.customerName || "Anonyme"}</td>
                              <td style={{ padding: "12px 8px" }}>{q.phone || "Non renseigné"}</td>
                              <td style={{ padding: "12px 8px", fontSize: "0.85rem", maxWidth: "250px" }}>
                                {q.itemsJson ? (
                                  <div style={{ whiteSpace: "pre-wrap" }}>
                                    {(() => {
                                      try {
                                        const parsed = JSON.parse(q.itemsJson);
                                        return Object.entries(parsed).map(([key, val]: any) => `${key}: ${val}`).join(", ");
                                      } catch {
                                        return q.itemsJson;
                                      }
                                    })()}
                                  </div>
                                ) : "N/A"}
                              </td>
                              <td style={{ padding: "12px 8px", fontWeight: "bold", color: "var(--color-primary)" }}>{q.totalPrice.toLocaleString("fr-FR")} F CFA</td>
                              <td style={{ padding: "12px 8px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{formatDate(q.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet 4: Messages de Contact */}
              {!adminLoading && adminTab === "contacts" && (
                <div className="card" style={{ padding: "24px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>Messages reçus via le formulaire de Contact</h3>
                  
                  {allContacts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <p style={{ color: "var(--color-text-muted)" }}>Aucun message de contact reçu.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {allContacts.map((contact) => (
                        <div key={contact.id} style={{ border: "1px solid var(--color-border)", borderRadius: "8px", padding: "20px", backgroundColor: "#fafbfc" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                            <div>
                              <strong style={{ fontSize: "1rem" }}>{contact.name}</strong>
                              <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginLeft: "10px" }}>({contact.email})</span>
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{formatDate(contact.createdAt)}</span>
                          </div>
                          <div style={{ fontSize: "0.9rem", borderLeft: "3px solid var(--color-primary)", paddingLeft: "12px", margin: "12px 0" }}>
                            <strong style={{ display: "block", marginBottom: "4px" }}>Sujet: {contact.subject}</strong>
                            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{contact.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Onglet 5: Newsletter Subscriptions */}
              {!adminLoading && adminTab === "newsletter" && (
                <div className="card" style={{ padding: "24px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>Emails inscrits à la Newsletter</h3>
                  
                  {allNewsletters.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                      <p style={{ color: "var(--color-text-muted)" }}>Aucune adresse inscrite à la newsletter.</p>
                    </div>
                  ) : (
                    <div style={{ maxWidth: "500px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid var(--color-border)", textAlign: "left", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                            <th style={{ padding: "10px" }}>Adresse Email</th>
                            <th style={{ padding: "10px", textAlign: "right" }}>Inscrit le</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allNewsletters.map((n) => (
                            <tr key={n.id} style={{ borderBottom: "1px solid var(--color-border)", fontSize: "0.9rem" }}>
                              <td style={{ padding: "10px", fontWeight: 500 }}>{n.email}</td>
                              <td style={{ padding: "10px", textAlign: "right", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{formatDate(n.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* ZONE CLIENT RECHERCHE ET SUIVI */}
      <div id="client-tracking-results">
        {/* Formulaire de recherche de suivi */}
        <section className="section" style={{ padding: "40px 0" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <div className="card" style={{ padding: "32px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "16px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <Search className="text-primary" size={24} />
                Suivre ma collecte en direct
              </h2>
              <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginBottom: "24px", fontSize: "0.95rem" }}>
                Saisissez le <strong>numéro de téléphone</strong> que vous avez indiqué lors de votre réservation pour suivre l'état de votre collecte en temps réel.
              </p>

              <form onSubmit={executeSearch} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Ex: +228 90 03 85 27"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px 14px 44px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      fontSize: "1rem",
                      outline: "none",
                      backgroundColor: "var(--color-bg)",
                      transition: "var(--transition-smooth)"
                    }}
                    required
                  />
                  <Search
                    size={20}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)"
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === "loading"}
                  style={{ padding: "14px 28px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Recherche...
                    </>
                  ) : (
                    <>
                      Trouver ma collecte
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Aide rapide */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "12px 16px", backgroundColor: "var(--color-primary-light)", borderRadius: "var(--radius-sm)" }}>
                <Sparkles size={16} className="text-primary" />
                <span style={{ fontSize: "0.85rem", color: "var(--color-primary-dark)" }}>
                  <strong>Astuce :</strong> Vous pouvez également réserver une nouvelle collecte directement sur notre <Link to="/estimator" style={{ textDecoration: "underline", fontWeight: "bold" }}>Estimateur de Devis</Link>.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Zone d'affichage des résultats */}
        <section className="section" style={{ padding: "0 0 80px 0" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            
            {/* État de chargement */}
            {status === "loading" && (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <Loader2 className="animate-spin text-primary" size={48} style={{ margin: "0 auto 16px auto" }} />
                <p style={{ fontSize: "1.1rem" }}>Recherche de vos informations de collecte en cours...</p>
              </div>
            )}

            {/* Erreur de récupération */}
            {status === "error" && (
              <div className="alert error" style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", borderRadius: "var(--radius-sm)", backgroundColor: "#fef2f2", borderLeft: "4px solid var(--color-error)" }}>
                <AlertCircle className="text-error" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h3 style={{ fontSize: "1.1rem", color: "#991b1b", marginBottom: "4px" }}>Une erreur est survenue</h3>
                  <p style={{ color: "#7f1d1d" }}>{message}</p>
                </div>
              </div>
            )}

            {/* Aucun résultat */}
            {status === "success" && results.length === 0 && searched && (
              <div className="card" style={{ padding: "48px 32px", textAlign: "center", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
                  <AlertCircle className="text-secondary-dark" size={32} />
                </div>
                <h3 style={{ fontSize: "1.4rem", marginBottom: "8px" }}>Aucune collecte trouvée</h3>
                <p style={{ maxWidth: "500px", margin: "0 auto 24px auto", color: "var(--color-text-muted)" }}>
                  Nous n'avons trouvé aucune demande active pour "<strong>{searchQuery}</strong>". Veuillez vérifier l'exactitude de votre numéro de téléphone (avec ou sans l'indicatif +228).
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button 
                    onClick={() => handleSearch(searchQuery)} 
                    className="btn btn-secondary" 
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <RefreshCw size={16} /> Réessayer
                  </button>
                  <Link to="/estimator" className="btn btn-primary">
                    Planifier une collecte
                  </Link>
                </div>
              </div>
            )}

            {/* Liste des résultats */}
            {status === "success" && results.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                    {results.length} demande{results.length > 1 ? "s" : ""} de collecte trouvée{results.length > 1 ? "s" : ""}
                  </h3>
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-primary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: 600,
                      fontSize: "0.9rem"
                    }}
                  >
                    <RefreshCw size={14} /> Rafraîchir
                  </button>
                </div>

                {results.map((pickup) => {
                  const currentStep = getStatusStep(pickup.status);
                  
                  return (
                    <div 
                      key={pickup.id} 
                      className="card" 
                      style={{ 
                        borderRadius: "var(--radius-md)", 
                        backgroundColor: "var(--color-surface)", 
                        boxShadow: "var(--shadow-lg)",
                        border: "1px solid var(--color-border)",
                        overflow: "hidden"
                      }}
                    >
                      {/* Header de la collecte */}
                      <div style={{ 
                        backgroundColor: "var(--color-primary-light)", 
                        padding: "20px 24px", 
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}>
                        <div>
                          <span style={{ 
                            fontSize: "0.8rem", 
                            fontWeight: 700, 
                            color: "var(--color-primary)", 
                            letterSpacing: "0.05em",
                            textTransform: "uppercase" 
                          }}>
                            Numéro de suivi
                          </span>
                          <h4 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "var(--color-text)" }}>
                            Collecte n° KW-1946-{pickup.id}
                          </h4>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>
                            Enregistré le :
                          </span>
                          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text)" }}>
                            {formatDate(pickup.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Zone d'état graphique (Visual Stepper) */}
                      <div style={{ padding: "32px 24px", backgroundColor: "#fafbfc" }}>
                        
                        {/* Stepper graphique */}
                        <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "32px", position: "relative" }}>
                          
                          {/* Ligne de connexion arrière-plan */}
                          <div style={{ 
                            position: "absolute", 
                            left: "40px", 
                            right: "40px", 
                            top: "20px", 
                            height: "4px", 
                            backgroundColor: "#e2e8f0", 
                            zIndex: 1 
                          }} />
                          
                          {/* Ligne de progression active */}
                          <div style={{ 
                            position: "absolute", 
                            left: "40px", 
                            width: currentStep === 0 ? "0%" : currentStep === 1 ? "50%" : "calc(100% - 80px)", 
                            top: "20px", 
                            height: "4px", 
                            backgroundColor: "var(--color-primary)", 
                            zIndex: 2,
                            transition: "width 0.4s ease-in-out"
                          }} />

                          {/* Étape 1 : En attente */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, zIndex: 3, position: "relative" }}>
                            <div style={{ 
                              width: "44px", 
                              height: "44px", 
                              borderRadius: "50%", 
                              backgroundColor: currentStep >= 0 ? "var(--color-primary)" : "#ffffff", 
                              border: "3px solid " + (currentStep >= 0 ? "var(--color-primary)" : "#cbd5e1"),
                              color: "#ffffff",
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              boxShadow: "0 0 0 4px #ffffff",
                              transition: "all 0.3s"
                            }}>
                              <Clock size={20} />
                            </div>
                            <span style={{ 
                              marginTop: "10px", 
                              fontSize: "0.85rem", 
                              fontWeight: currentStep === 0 ? "800" : "600",
                              color: currentStep === 0 ? "var(--color-primary)" : "var(--color-text-muted)",
                              textAlign: "center"
                            }}>
                              En attente
                            </span>
                          </div>

                          {/* Étape 2 : En cours */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, zIndex: 3, position: "relative" }}>
                            <div style={{ 
                              width: "44px", 
                              height: "44px", 
                              borderRadius: "50%", 
                              backgroundColor: currentStep >= 1 ? "var(--color-primary)" : "#ffffff", 
                              border: "3px solid " + (currentStep >= 1 ? "var(--color-primary)" : "#cbd5e1"),
                              color: currentStep >= 1 ? "#ffffff" : "var(--color-text-muted)",
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              boxShadow: "0 0 0 4px #ffffff",
                              transition: "all 0.3s"
                            }}>
                              <Truck size={20} />
                            </div>
                            <span style={{ 
                              marginTop: "10px", 
                              fontSize: "0.85rem", 
                              fontWeight: currentStep === 1 ? "800" : "600",
                              color: currentStep === 1 ? "var(--color-primary)" : "var(--color-text-muted)",
                              textAlign: "center"
                            }}>
                              En cours
                            </span>
                          </div>

                          {/* Étape 3 : Complétée */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, zIndex: 3, position: "relative" }}>
                            <div style={{ 
                              width: "44px", 
                              height: "44px", 
                              borderRadius: "50%", 
                              backgroundColor: currentStep === 2 ? "var(--color-success)" : "#ffffff", 
                              border: "3px solid " + (currentStep === 2 ? "var(--color-success)" : "#cbd5e1"),
                              color: currentStep === 2 ? "#ffffff" : "var(--color-text-muted)",
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              boxShadow: "0 0 0 4px #ffffff",
                              transition: "all 0.3s"
                            }}>
                              <CheckCircle size={20} />
                            </div>
                            <span style={{ 
                              marginTop: "10px", 
                              fontSize: "0.85rem", 
                              fontWeight: currentStep === 2 ? "800" : "600",
                              color: currentStep === 2 ? "var(--color-success)" : "var(--color-text-muted)",
                              textAlign: "center"
                            }}>
                              Complétée
                            </span>
                          </div>

                        </div>

                        {/* Explication textuelle de l'état actuel */}
                        <div style={{ 
                          backgroundColor: "#ffffff", 
                          border: "1px solid var(--color-border)", 
                          borderRadius: "var(--radius-sm)", 
                          padding: "16px 20px", 
                          display: "flex", 
                          gap: "14px", 
                          alignItems: "center" 
                        }}>
                          <div style={{ 
                            width: "12px", 
                            height: "12px", 
                            borderRadius: "50%", 
                            backgroundColor: currentStep === 2 ? "var(--color-success)" : "var(--color-primary)",
                            animation: currentStep === 2 ? "none" : "pulse 1.5s infinite"
                          }} />
                          <div>
                            <strong style={{ fontSize: "1rem" }}>Statut : </strong>
                            <span style={{ 
                              fontWeight: 700, 
                              color: currentStep === 2 ? "var(--color-success)" : "var(--color-primary)",
                              textTransform: "uppercase",
                              letterSpacing: "0.02em"
                            }}>
                              {pickup.status}
                            </span>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                              {currentStep === 0 && "Votre demande est bien enregistrée ! Un coursier de Kokouvi Wash est en cours de répartition pour venir collecter votre sac."}
                              {currentStep === 1 && "Notre coursier est en route pour collecter votre linge, ou votre linge est actuellement pris en charge et choyé dans notre atelier."}
                              {currentStep === 2 && "Votre linge propre, impeccablement repassé et désinfecté a été livré à votre domicile ou hôtel à Lomé ! Merci de votre confiance."}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Informations détaillées sur la réservation */}
                      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                        
                        {/* Colonne 1 : Client & Adresse */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <h5 style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid var(--color-border)", paddingBottom: "6px" }}>
                            Coordonnées de livraison
                          </h5>
                          
                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <User size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Client</span>
                              <span style={{ fontWeight: 600 }}>{pickup.customerName}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <Phone size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Téléphone</span>
                              <span style={{ fontWeight: 600 }}>{pickup.phone}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <MapPin size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Adresse de Collecte</span>
                              <span style={{ fontWeight: 600 }}>{pickup.address}</span>
                            </div>
                          </div>
                        </div>

                        {/* Colonne 2 : Planification & Instructions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <h5 style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid var(--color-border)", paddingBottom: "6px" }}>
                            Détails du Rendez-vous
                          </h5>

                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <Calendar size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Date de Passage souhaitée</span>
                              <span style={{ fontWeight: 600 }}>{pickup.preferredDate}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <Clock size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Créneau horaire choisi</span>
                              <span style={{ fontWeight: 600 }}>{pickup.preferredTime}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <FileText size={18} className="text-primary" style={{ flexShrink: 0, marginTop: "2px" }} />
                            <div>
                              <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "block" }}>Instructions de lavage</span>
                              <span style={{ fontWeight: 500, fontSize: "0.9rem", fontStyle: pickup.specialInstructions ? "normal" : "italic" }}>
                                {pickup.specialInstructions || "Aucune consigne particulière"}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Zone de Simulation interactive pour le test (uniquement visible par l'administrateur) */}
                      {showAdminConsole && (
                        <div style={{ 
                          backgroundColor: "#f8fafc", 
                          borderTop: "1px solid var(--color-border)", 
                          padding: "16px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-text-muted)" }}>
                            <Sliders size={16} />
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                              Zone de démonstration interactive rapide
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                            Modifiez l'état de cette demande pour tester en direct le visuel dynamique :
                          </p>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
                            <button
                              onClick={() => handleUpdateStatus(pickup.id, "en attente")}
                              className="btn"
                              disabled={updatingId === pickup.id}
                              style={{ 
                                padding: "6px 12px", 
                                fontSize: "0.8rem", 
                                backgroundColor: pickup.status === "en attente" ? "var(--color-primary)" : "#ffffff",
                                color: pickup.status === "en attente" ? "#ffffff" : "var(--color-text)",
                                border: "1px solid " + (pickup.status === "en attente" ? "var(--color-primary)" : "var(--color-border)"),
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              En attente
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(pickup.id, "en cours")}
                              className="btn"
                              disabled={updatingId === pickup.id}
                              style={{ 
                                padding: "6px 12px", 
                                fontSize: "0.8rem", 
                                backgroundColor: pickup.status === "en cours" ? "var(--color-primary)" : "#ffffff",
                                color: pickup.status === "en cours" ? "#ffffff" : "var(--color-text)",
                                border: "1px solid " + (pickup.status === "en cours" ? "var(--color-primary)" : "var(--color-border)"),
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              En cours
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(pickup.id, "complétée")}
                              className="btn"
                              disabled={updatingId === pickup.id}
                              style={{ 
                                padding: "6px 12px", 
                                fontSize: "0.8rem", 
                                backgroundColor: pickup.status === "complétée" ? "var(--color-success)" : "#ffffff",
                                color: pickup.status === "complétée" ? "#ffffff" : "var(--color-text)",
                                border: "1px solid " + (pickup.status === "complétée" ? "var(--color-success)" : "var(--color-border)"),
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              {updatingId === pickup.id ? <Loader2 className="animate-spin" size={12} /> : null}
                              Complétée
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>
      </div>

    </div>
  );
}
