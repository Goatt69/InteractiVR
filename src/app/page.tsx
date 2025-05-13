'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

// Component imports
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ExperiencesSection from "../components/ExperiencesSection";
import ExperienceModal from "../components/ExperienceModal";

// Define VR experiences data
const experiences = [
  {
    id: "space",
    name: 'Space Exploration',
    path: "/models/Space.glb",
    image: "/textures/space.jpg",
    description: "The solar system is a vast expanse of space dominated by the Sun, around which eight planets and countless smaller bodies revolve in a delicate cosmic dance.",
    rating: 4,
  },
  {
    id: 'dacongvien',
    name: 'Park Environment',
    path: "/models/DACongVien.glb",
    image: "/models/DACongVienPreview.jpg",
    description: "A detailed model of a park showcasing natural elements, recreational areas, and scenic pathways perfect for virtual tours.",
    rating: 5,
  },
  {
    id: 'barbershop',
    name: 'Barbershop Interior',
    path: "/models/barbershop_interior.glb",
    image: "/models/BarbershopPreview.jpg",
    description: "An immersive barbershop interior model with realistic textures and lighting, ideal for interior design studies.",
    rating: 3,
  },
  {
    id: 'classroom',
    name: 'Modern Classroom',
    path: "/models/classroom.glb",
    image: "/models/ClassroomPreview.jpg",
    description: "A modern classroom environment designed for interactive learning experiences, featuring educational tools and collaborative spaces.",
    rating: 5,
  },
  {
    id: 'interiortest',
    name: 'Interior Design Showcase',
    path: "/models/InteriorTest.glb",
    image: "/models/InteriorTestPreview.jpg",
    description: "A test model for interior design concepts featuring different styles, materials, and lighting experiments for architectural visualization.",
    rating: 3,
  },
];

export default function Home() {
  // State management
  const [showModal, setShowModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(experiences[0]);
  const router = useRouter();

  // Event handlers
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  
  // Define the Experience type for better type safety
  type Experience = {
    id: string;
    name: string;
    path: string;
    image: string;
    description: string;
    rating: number;
  };

  const handleSelectExperience = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const startVRExperience = () => {
    closeModal();
    router.push(`/vr-experience?model=${encodeURIComponent(selectedExperience.path)}`);
  };



  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />
        
        {/* VR Experiences Section */}
        <ExperiencesSection 
          experiences={experiences} 
          onSelectExperience={(experience) => {
            handleSelectExperience(experience);
            openModal();
          }} 
        />
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Experience Selection Modal */}
      <ExperienceModal 
        isOpen={showModal}
        onClose={closeModal}
        experiences={experiences}
        selectedExperience={selectedExperience}
        onSelectExperience={handleSelectExperience}
        onStartExperience={startVRExperience}
      />
    </div>
  );
}