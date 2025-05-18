'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import ThemeSelectionModal from './ThemeSelectionModal';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const router = useRouter();

  const handleThemeSelection = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const startExperience = () => {
    router.push(`/vr-experience?model=${selectedTheme}`);
    console.log(`Starting experience with theme: ${selectedTheme}`);
    closeModal();
    // Additional logic to launch the VR experience
  };

  // We don't need to find the selected theme details here anymore
  // The ThemeSelectionModal now handles fetching and displaying theme details

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
        selectedTheme={selectedTheme}
        onThemeSelection={handleThemeSelection}
        onStartExperience={startExperience}
      />
    </section>
  );
}
