'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import GridMotion from './ui/GridMotion/GridMotion';

export default function GallerySection({
  title = "VR Gallery",
  subtitle = "Browse through our collection of stunning VR environments and experiences."
}: {
  title?: string;
  subtitle?: string;
}) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    // In a real implementation, you would fetch the images from the server
    // For now, we're hardcoding the image from the public/gallery folder
    // This would be replaced with a proper API call in production

    // Using window.location.origin to get the base URL of the site
    // This ensures the image URLs start with http/https which is required by GridMotion
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setGalleryImages([
      `${baseUrl}/gallery/Show1.jpg`,
      `${baseUrl}/gallery/Show2.png`,
      `${baseUrl}/gallery/Show3.png`,
      `${baseUrl}/gallery/Show4.png`,
    ]);
  }, []);


  // Prepare items for GridMotion following the required pattern: label, JSX content, image URL
  const gridItems: (string | React.ReactNode)[] = [];

  // Process gallery images for GridMotion
  galleryImages.forEach((imagePath, index) => {
    // Add image name as a label
    const imageName = imagePath.split('/').pop()?.split('.')[0] || `Image ${index + 1}`;
    gridItems.push(imageName);

    // Add the image URL
    gridItems.push(imagePath);
  });

  // Ensure we have enough items for GridMotion (maintaining the pattern)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  while (gridItems.length < 27) {
    const itemIndex = Math.floor(gridItems.length / 3);

    // Add a label
    gridItems.push(`Show ${itemIndex + 1}`);

    // Add image URL
    gridItems.push(`${baseUrl}/gallery/Show${itemIndex + 1}.png`);
  }


  if (galleryImages.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No gallery images to display.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16 relative">
      <div className="container mx-auto px-0 max-w-full">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-md md:text-lg">{subtitle}</p>
        </div>

        {/* GridMotion Component */}
        <div className="h-[70vh] w-full">
          <GridMotion
            items={gridItems}
            gradientColor="rgba(0, 0, 100, 0.3)"
          />
        </div>
      </div>

      {/* Global styles for hiding scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
}
