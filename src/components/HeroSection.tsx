'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, CircularProgress } from '@heroui/react';

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
      imageUrl: '/solar-system.jpg'
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
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        size="lg"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Choose Your VR Theme</h2>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Select Theme"
                    placeholder="Select a VR theme"
                    selectedKeys={selectedTheme ? [selectedTheme] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]?.toString() || '';
                      handleThemeSelection(selectedKey);
                    }}
                    className="w-full"
                  >
                    {themes.map((theme) => (
                      <SelectItem key={theme.id} textValue={theme.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{theme.name}</span>
                          <CircularProgress
                            classNames={{
                              svg: "w-6 h-6",
                              indicator: "stroke-blue-500",
                              track: "stroke-blue-100",
                            }}
                            value={theme.progress}
                            size="sm"
                            aria-label={`${theme.progress}% completed`}
                            showValueLabel={false}
                          />
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  {selectedThemeDetails && (
                    <div className="mt-4 p-4 border rounded-lg">
                      <div className="mb-3 relative aspect-video rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-500 flex items-center justify-center">
                          <p className="text-white font-medium">{selectedThemeDetails.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{selectedThemeDetails.name}</h3>
                        <div className="flex items-center">
                          <CircularProgress
                            classNames={{
                              svg: "w-10 h-10",
                              indicator: "stroke-blue-500",
                              track: "stroke-blue-100",
                              value: "text-sm font-semibold text-blue-500",
                            }}
                            value={selectedThemeDetails.progress}
                            strokeWidth={4}
                            showValueLabel={true}
                            valueLabel={`${selectedThemeDetails.progress}%`}
                            aria-label={`${selectedThemeDetails.progress}% completed`}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{selectedThemeDetails.description}</p>
                      <div className="text-sm text-gray-500">
                        Progress: {selectedThemeDetails.completedItems}/{selectedThemeDetails.totalItems} items completed
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onClick={startExperience} isDisabled={!selectedTheme}>
                  Start Experience
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
