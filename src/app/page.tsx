'use client';

// Component imports
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/GallerySection";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Gallery Section */}
        <GallerySection
          title="VR Gallery"
          subtitle="Explore our collection of stunning VR environments and experiences."
        />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}