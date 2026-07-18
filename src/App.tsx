import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import QuoteEstimator from "./pages/QuoteEstimator";
import Gallery from "./pages/Gallery";
import LaundryCareTips from "./pages/LaundryCareTips";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import PickupTracking from "./pages/PickupTracking";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      {/* Scroll Progress Bar at the top of the viewport */}
      <ScrollProgress />
      
      {/* Universal Sticky Header Navigation */}
      <Header />
      
      {/* Active Route Viewport */}
      <main style={{ minHeight: "75vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/estimator" element={<QuoteEstimator />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tips" element={<LaundryCareTips />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tracking" element={<PickupTracking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Universal Dark Footer */}
      <Footer />
      
      {/* Tactile Back To Top Scroll Control */}
      <ScrollToTop />
    </BrowserRouter>
  );
}
