'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter, Button } from '@heroui/react';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiences: Array<{
    id: string;
    name: string;
    path: string;
    image: string;
    description: string;
    rating: number;
  }>;
  selectedExperience: any;
  onSelectExperience: (experience: any) => void;
  onStartExperience: () => void;
}

export default function ExperienceModal({ 
  isOpen, 
  onClose, 
  experiences, 
  selectedExperience, 
  onSelectExperience,
  onStartExperience 
}: ExperienceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle focus trap in modal
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (!firstElement || !lastElement) return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      id="experience-selection-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card
        ref={modalRef}
        className="max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Choose Your VR Experience</h3>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          
          <div className="space-y-4 mb-6">
            {experiences.map((experience) => (
              <div
                key={experience.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedExperience?.id === experience.id 
                    ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => onSelectExperience(experience)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden relative flex-shrink-0">
                    <Image
                      src={experience.image}
                      alt={experience.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold mb-1">{experience.name}</h4>
                    <div className="flex items-center">
                      <StarRating rating={experience.rating} />
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center">
                      {selectedExperience?.id === experience.id && <div className="h-3 w-3 rounded-full bg-blue-600"></div>}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{experience.description}</p>
              </div>
            ))}
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-3 border-t bg-gray-50">
          <Button
            variant="flat"
            color="default"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={onStartExperience}
            isDisabled={!selectedExperience}
          >
            Start Experience
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
