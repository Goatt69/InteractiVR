'use client';
import Link from "next/link";
import Image from "next/image";
import Scene3D from "../components/Scene3D";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Login from "./login/page";

const modelThemes = [
  { id: "space", name: 'Space', path: "/models/Space.glb" },
  { id: 'dacongvien', name: 'DACongVien', path: "/models/DACongVien.glb" },
  { id: 'barbershop', name: 'Barbershop Interior', path: "/models/barbershop_interior.glb" },
  { id: 'classroom', name: 'Classroom', path: "/models/classroom.glb" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(modelThemes[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // Close modal on Escape key press for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  // Trap focus inside modal when open for accessibility
  useEffect(() => {
    if (!showModal) return;

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
  }, [showModal]);

  const startVRExperience = () => {
    closeModal();
    router.push(`/vr-experience?model=${encodeURIComponent(selectedTheme.path)}`);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-12 sm:p-24 gap-12 font-[family-name:var(--font-geist-sans)] bg-white text-gray-900">
      <header className="w-full flex justify-between items-center px-4">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={140}
          height={30}
          priority
        />
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">InteractiVR</h1>
      </header>
      
      <main className="flex flex-col gap-12 w-full max-w-7xl px-6">
        <h2 className="text-3xl font-semibold text-center drop-shadow-md">Interactive 3D Experience</h2>
        
        {/* Three.js Scene */}
        <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-white p-6 border border-gray-300 backdrop-blur-md">
          <Scene3D />
        </div>
        <div className="w-full flex justify-center mt-6 relative space-x-6">
          <button
            onClick={openModal}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-haspopup="dialog"
            aria-expanded={showModal}
            aria-controls="design-selection-modal"
          >
            Try VR Experience
          </button>
          <Link
            href="/model-viewer"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-green-500 transition-transform transform hover:scale-105"
          >
            View 3D Models
          </Link>
          {!isLoggedIn && <Login onLoginSuccess={handleLoginSuccess} />}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          <div className="bg-white p-8 rounded-xl border border-gray-300 shadow-lg">
            <h3 className="font-extrabold mb-4 text-lg text-gray-900">About This Project</h3>
            <p className="text-gray-700 leading-relaxed">
              This is an interactive 3D experience built with Three.js, Next.js, and Tailwind CSS.
              You can rotate, zoom, and interact with the 3D objects using your mouse.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl border border-gray-300 shadow-lg">
            <h3 className="font-extrabold mb-4 text-lg text-gray-900">Getting Started</h3>
            <ol className="list-inside list-decimal text-sm font-mono text-gray-700 leading-relaxed">
              <li className="mb-3 tracking-[-.01em]">
                Explore the 3D scene by dragging to rotate
              </li>
              <li className="mb-3 tracking-[-.01em]">
                Scroll to zoom in and out
              </li>
              <li className="tracking-[-.01em]">
                Edit <code className="bg-gray-200 px-1 py-0.5 rounded font-semibold">src/components/Scene3D.tsx</code> to customize
              </li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="flex gap-8 flex-wrap items-center justify-center mt-auto px-4 py-6 bg-gray-100 border-t border-gray-300 text-gray-700 text-sm select-none">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://threejs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Three.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind CSS
        </a>
      </footer>

      {/* Modal for design selection */}
      {showModal && (
        <div
          id="design-selection-modal"
          ref={modalRef}
          className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-xl p-8 max-w-5xl w-full shadow-2xl border border-gray-300">
            <h3 id="modal-title" className="text-2xl font-extrabold mb-6 text-center text-gray-900">Select a Design to Experience in VR</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {modelThemes.map(theme => (
                <div
                  key={theme.id}
                  className={`cursor-pointer rounded-xl border-4 flex items-center justify-center h-36 text-lg font-semibold transition-colors duration-300 ease-in-out ${
                    selectedTheme.id === theme.id ? 'border-blue-700 bg-blue-100' : 'border-transparent bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTheme(theme);
                    }
                  }}
                  role="button"
                  aria-pressed={selectedTheme.id === theme.id}
                >
                  {theme.name}
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end space-x-6">
              <button
                onClick={closeModal}
                className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startVRExperience}
                className="px-6 py-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                Start VR Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
