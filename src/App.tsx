import { useRef } from "react";
import "./index.css";
import { Hero } from "./components/Hero";
import { StickyHeader } from "./components/StickyHeader";
import { WhatWeDo } from "./components/WhatWeDo";
import { AboutUs } from "./components/AboutUs";
import { ResponsibleTourism } from "./components/ResponsibleTourism";
import { Team } from "./components/Team";
import { Footer } from "./components/Footer";
import { useScrollPastRef } from "./hooks/useScrollPastRef";

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const isPastHero = useScrollPastRef(heroRef);

  return (
    <div className="min-h-screen bg-wildbook-bg">
      <StickyHeader visible={isPastHero} />

      <main>
        <Hero ref={heroRef} />
        <WhatWeDo />
        <AboutUs />
        <ResponsibleTourism />
        <Team />
        <Footer />
      </main>
    </div>
  );
}
