'use client';
import Link from "next/link";
import Image from "next/image";
import Scene3D from "../components/Scene3D";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Login from "./login/page";

const modelThemes = [
  {
    id: "space",
    name: 'Space',
    path: "/models/Space.glb",
    image: "/textures/space.jpg",
    description: "The solar system is a vast expanse of space dominated by the Sun, around which eight planets and countless smaller bodies revolve in a delicate cosmic dance.",
    rating: 2,
  },
  {
    id: 'dacongvien',
    name: 'DACongVien',
    path: "/models/DACongVien.glb",
    image: "/models/DACongVienPreview.jpg",
    description: "A detailed model of DACongVien showcasing architectural and interior design elements.",
    rating: 4,
  },
  {
    id: 'barbershop',
    name: 'Barbershop Interior',
    path: "/models/barbershop_interior.glb",
    image: "/models/BarbershopPreview.jpg",
    description: "An immersive barbershop interior model with realistic textures and lighting.",
    rating: 3,
  },
  {
    id: 'classroom',
    name: 'Classroom',
    path: "/models/classroom.glb",
    image: "/models/ClassroomPreview.jpg",
    description: "A modern classroom environment designed for interactive learning experiences.",
    rating: 5,
  },
  {
    id: 'interiortest',
    name: 'InteriorTest',
    path: "/models/InteriorTest.glb",
    image: "/models/InteriorTestPreview.jpg",
    description: "A test model for interior design concepts and lighting experiments.",
    rating: 1,
  },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(modelThemes[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

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

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

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

      {showModal && (
        <div
          id="design-selection-modal"
          ref={modalRef}
          className="fixed inset-0 bg-gray-200 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm rounded-3xl p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-gray-100 rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-gray-300 flex flex-col gap-4">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-between w-full bg-blue-400 rounded-t-3xl px-6 py-3 select-none text-white font-semibold text-lg"
                aria-haspopup="listbox"
                aria-expanded={showDropdown}
                aria-labelledby="theme-select"
              >
                <span id="theme-select">{selectedTheme.name}</span>
                <div className="flex items-center space-x-2">
                  <StarRating rating={selectedTheme.rating || 0} />
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>
              {showDropdown && (
                <ul
                  className="absolute z-10 mt-1 w-full bg-white rounded-b-3xl shadow-lg max-h-60 overflow-auto focus:outline-none"
                  role="listbox"
                  aria-labelledby="theme-select"
                  tabIndex={-1}
                >
                  {modelThemes.map((theme) => (
                    <li
                      key={theme.id}
                      role="option"
                      aria-selected={selectedTheme.id === theme.id}
                      className={`cursor-pointer select-none relative py-2 pl-6 pr-4 ${
                        selectedTheme.id === theme.id ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-gray-900'
                      } hover:bg-blue-200`}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setShowDropdown(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedTheme(theme);
                          setShowDropdown(false);
                        }
                      }}
                      tabIndex={0}
                    >
                      {theme.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-b-3xl">
              <div className="flex-shrink-0 rounded-xl overflow-hidden w-full md:w-72 h-72 bg-gray-100">
                <Image
                  src={selectedTheme.image || "/models/SpacePreview.jpg"}
                  alt={`${selectedTheme.name} preview`}
                  width={288}
                  height={288}
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            <div className="flex flex-col flex-grow ml-0 md:ml-6 mt-7 md:mt-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <hr className="border-gray-400 mb-4" />
              <p className="text-gray-900">{selectedTheme.description || "No description available."}</p>
              <div className="mt-20 flex justify-end space-x-4">
                <button
                  onClick={() => startVRExperience()}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Select this theme
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}