'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter, Button } from '@heroui/react';

// Import the model themes data or pass it as props
interface ExperienceProps {
  experiences: Array<{
    id: string;
    name: string;
    path: string;
    image: string;
    description: string;
    rating: number;
  }>;
  onSelectExperience?: (experience: any) => void;
}

export default function ExperiencesSection({ experiences, onSelectExperience }: ExperienceProps) {
  // Star rating component
  function StarRating({ rating }: { rating: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
          </svg>
        );
      }
    }
    return <div className="flex space-x-1">{stars}</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Our VR Environments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover immersive virtual reality experiences that transport you to new worlds.
            Interact with detailed environments and enhance your learning through exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.slice(0, 3).map((experience) => (
            <Card key={experience.id} className="border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <CardBody className="p-0 overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image 
                    src={experience.image} 
                    alt={experience.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{experience.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{experience.description}</p>
                  <StarRating rating={experience.rating} />
                </div>
              </CardBody>
              <CardFooter className="flex justify-end gap-2 bg-gray-50">
                <Button 
                  color="primary" 
                  variant="flat" 
                  size="sm"
                  onClick={() => onSelectExperience && onSelectExperience(experience)}
                >
                  Experience in VR
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button color="primary" variant="ghost" as="a" href="/experiences">
            View All Experiences
          </Button>
        </div>
      </div>
    </section>
  );
}
