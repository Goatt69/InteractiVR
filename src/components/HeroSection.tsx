'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';

export default function HeroSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Immersive <span className="text-blue-600">VR Experiences</span> for Learning
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore interactive 3D environments designed to make learning engaging and effective. 
              Discover a new way to interact with digital content through virtual reality.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                as={Link}
                href="/experiences"
                color="primary" 
                size="lg" 
                className="font-medium"
              >
                Browse Experiences
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
          <div className="lg:w-1/2">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border border-gray-200">
              <Image
                src="/hero-image.jpg"
                alt="VR Experience"
                fill
                priority
                style={{ objectFit: 'cover' }}
                className="rounded-xl"
              />
              {/* Fallback placeholder in case the image doesn't exist */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <p className="text-white text-2xl font-bold">InteractiVR Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
