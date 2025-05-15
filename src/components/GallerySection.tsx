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
      `${baseUrl}/gallery/Space.png`
    ]);
  }, []);

  const handleItemClick = (imagePath: string) => {
    console.log('Image clicked:', imagePath);
  };

  // Prepare items for GridMotion following the example format
  const gridItems: (string | React.ReactNode)[] = [];

  // Process gallery images for GridMotion
  galleryImages.forEach((imagePath, index) => {
    // Add image name as text item
    const imageName = imagePath.split('/').pop()?.split('.')[0] || `Image ${index + 1}`;
    gridItems.push(imageName);

    // Add a JSX element with image details
    gridItems.push(
      <div
        key={`jsx-item-${index}`}
        className="p-2 flex flex-col items-center justify-center h-full w-full cursor-pointer"
        onClick={() => handleItemClick(imagePath)}
      >
        <h3 className="text-lg font-semibold text-white mb-1">{imageName}</h3>
        <p className="text-sm text-white/80 text-center line-clamp-2">Click to view full image</p>
      </div>
    );

    // Add the complete image URL - this is what GridMotion expects
    gridItems.push(imagePath);
  });

  // Ensure we have at least 28 items (required by GridMotion)
  while (gridItems.length < 28) {
    const itemIndex = Math.floor(gridItems.length / 3);

    // Add placeholder items in the same pattern: text, JSX, image URL
    gridItems.push(`Placeholder ${itemIndex + 1}`);

    gridItems.push(
      <div
        key={`placeholder-${itemIndex}`}
        className="p-2 flex flex-col items-center justify-center h-full w-full"
      >
        <h3 className="text-lg font-semibold text-white mb-1">Placeholder</h3>
        <p className="text-sm text-white/80 text-center line-clamp-2">Gallery item placeholder</p>
      </div>
    );

    // Add a placeholder image URL - ensure it's a valid URL that GridMotion can display
    // Using the same image for placeholders to ensure they display properly
    // Must start with http/https for GridMotion to recognize it as an image
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    gridItems.push(`${baseUrl}/gallery/Space.png`);
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
