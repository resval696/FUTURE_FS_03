import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Award, ShieldCheck, Heart, History, Star, Users } from "lucide-react";
import { TIMELINE_DATA, BUSINESS_INFO } from "../data";
import SafeImage from "../components/SafeImage";
import ironingTableImg from "@/src/assets/images/ChatGPT Image 15 juil. 2026, 16_22_23.png";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="about-page">
      {/* En-tête de la Page */}
      <section className="section" style={{ backgroundColor: "var(--color-primary-light)", padding: "60px 0", borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-subtitle">DEPUIS 1946</span>
          <h1 style={{ fontSize: "3rem", marginTop: "12px", letterSpacing: "-0.03em" }}>Notre Histoire & Patrimoine</h1>
          <p style={{ maxWidth: "600px", margin: "16px auto 0 auto", fontSize: "1.1rem" }}>
            Préserver la beauté des textiles et offrir une fraîcheur impeccable depuis près de huit décennies au cœur de Lomé, au Togo.
          </p>
        </div>
      </section>

      {/* Section Histoire principale */}
      <section className="section">
        <div className="container story-split">
          <div className="story-content">
            <span className="section-subtitle">LA PROMESSE DES FONDATEURS</span>
            <h2>Près de 80 Ans de Soin Méticuleux</h2>
            <p>
              En 1946, alors que Lomé était un port commercial dynamique et animé de la côte ouest-africaine, la famille EGLOH a compris que les textiles précieux exigeaient bien plus qu'un simple lavage à l'eau et au savon : ils demandaient une connaissance approfondie de la dynamique des fibres, de la chimie des savons naturels et d'une précision absolue au repassage.
            </p>
            <p>
              Ce qui n'était à l'origine qu'un petit atelier spécialisé de quartier est devenu, au fil de trois générations, le service de blanchisserie historique et de prestige de référence au Togo. À travers les décennies et les évolutions des textiles (des pagnes tissés traditionnels Kente ou Kita de valeur aux imprimés wax colorés, jusqu'aux délicates fibres synthétiques modernes), Kokouvi Wash est resté le garant de l'élégance à Lomé.
            </p>
            <p>
              Aujourd'hui, depuis notre siège et atelier historique au <strong>63 Rue Madjatom à Tokoin Gbadago</strong>, nous marions l'excellence de notre savoir-faire manuel traditionnel aux technologies écologiques européennes de pointe en traitement de l'eau et des fibres.
            </p>


          </div>

          <div className="story-visual">
            <div className="story-frame" style={{ height: "460px" }}>
              {/* Replace with a team photo */}
              <SafeImage
                src={ironingTableImg}
                alt="L'équipe dévouée et passionnée de l'atelier Kokouvi Wash"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Section Frise Chronologique */}
      <section className="section section-alt" id="heritage-timeline">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">LA CHRONOLOGIE</span>
            <h2>Notre Voyage à Travers le Temps</h2>
            <p>D'un atelier familial de quartier à la marque de blanchisserie premium la plus respectée de Lomé.</p>
          </div>

          <div className="timeline">
            {TIMELINE_DATA.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-content">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p style={{ fontSize: "0.95rem" }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* Valeurs et Forces de l'Entreprise */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">NOS VALEURS CLÉS</span>
            <h2>Comment nous tenons nos engagements</h2>
            <p>Nous associons près de 80 ans d'héritage de blanchisserie sur mesure à des protocoles d'intégrité rigoureux.</p>
          </div>

          <div className="card-grid">
            <div className="card" style={{ border: "none" }}>
              <div className="card-icon">
                <Star size={24} />
              </div>
              <h3 className="card-title">Fierté Intergénérationnelle</h3>
              <p className="card-text">
                Chaque vêtement confié est le garant de notre réputation familiale. Nous traitons vos chemises, costumes et pièces délicates avec la fierté et le soin de véritables artisans.
              </p>
            </div>

            <div className="card" style={{ border: "none" }}>
              <div className="card-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 className="card-title">Sûreté Textile Maximale</h3>
              <p className="card-text">
                Nous contrôlons précisément les niveaux de pH, utilisons des fers professionnels thermorégulés et séparons rigoureusement le linge pour éliminer tout risque de dégorgement de couleur ou de transfert de peluches.
              </p>
            </div>

            <div className="card" style={{ border: "none" }}>
              <div className="card-icon">
                <Users size={24} />
              </div>
              <h3 className="card-title">Ancrage Local & Éthique</h3>
              <p className="card-text">
                Fidèles à Tokoin Gbadago, nous soutenons activement les initiatives locales, formons et employons localement nos techniciens de blanchisserie dans le respect de normes éthiques strictes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bannière d'appel à l'action */}
      <section className="section section-alt" style={{ borderBottom: "none" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>Confiez vos Textiles aux Maîtres Artisans de Lomé</h2>
          <p style={{ maxWidth: "600px", margin: "16px auto 32px auto" }}>
            Découvrez la différence d'un soin textile d'élite. Planifiez un dépôt ou une collecte à domicile, ou visitez notre atelier de Tokoin Gbadago dès aujourd'hui.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link to="/estimator" className="btn btn-primary">
              Estimer mon Devis & Réserver
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Trouver l'Atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
