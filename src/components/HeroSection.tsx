'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import ThemeSelectionModal from './ThemeSelectionModal';

interface Theme {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  imageUrl: string;
}

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  
  // Sample themes data
  const themes: Theme[] = [
    {
      id: 'solar-system',
      name: 'Solar System',
      description: 'The solar system is a vast expanse of space dominated by the Sun, around which eight planets and countless smaller bodies revolve in a delicate cosmic dance.',
      progress: 40,
      totalItems: 10,
      completedItems: 4,
      imageUrl: '/gallery/Space.png'
    },
    {
      id: 'ocean-exploration',
      name: 'Ocean Exploration',
      description: 'Dive into the mysterious depths of the ocean and discover fascinating marine life, underwater formations, and the beauty beneath the waves.',
      progress: 70,
      totalItems: 10,
      completedItems: 7,
      imageUrl: '/ocean.jpg'
    },
    {
      id: 'ancient-civilizations',
      name: 'Ancient Civilizations',
      description: 'Travel back in time and walk among the greatest civilizations in history. Explore ancient architecture, art, and cultural practices.',
      progress: 20,
      totalItems: 10,
      completedItems: 2,
      imageUrl: '/ancient.jpg'
    },
    {
      id: 'space-station',
      name: 'Space Station',
      description: 'Experience life aboard a space station and learn about the challenges and innovations of space travel and habitation.',
      progress: 90,
      totalItems: 10,
      completedItems: 9,
      imageUrl: '/space-station.jpg'
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleThemeSelection = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const startExperience = () => {
    console.log(`Starting experience with theme: ${selectedTheme}`);
    closeModal();
    // Additional logic to launch the VR experience
  };

  // Get the selected theme details
  const selectedThemeDetails = themes.find(theme => theme.id === selectedTheme);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="space-y-6 center text-center ">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Immersive <span className="text-blue-600">VR Experiences</span> for Learning
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore interactive 3D environments designed to make learning engaging and effective. 
              Discover a new way to interact with digital content through virtual reality.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              <Button
                color="primary"
                size="lg"
                className="font-medium"
                onClick={openModal}
              >
                Start Experience
              </Button>
              <Button
                as={Link}
                href="/experiences"
                color="primary"
                size="lg"
                className="font-medium"
                variant="bordered"
              >
                Browse All
              </Button>
              <Button
                as={Link}
                href="/about"
                color="secondary"
                size="lg"
                className="font-medium"
                variant="flat"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection Modal */}
      <ThemeSelectionModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeSelection={handleThemeSelection}
        onStartExperience={startExperience}
      />
    </section>
  );
}
