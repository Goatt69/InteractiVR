'use client';
import Link from "next/link";
import Image from "next/image";
import Scene3D from "../components/Scene3D";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full flex justify-between items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={120}
          height={25}
          priority
        />
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">InteractiVR</h1>
          <Link
            href="/account/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Image
              src="/window.svg"
              alt="Login"
              width={20}
              height={20}
              className="invert"
            />
            Login
          </Link>
        </div>
      </header>
      
      <main className="flex flex-col gap-8 w-full max-w-6xl">
        <h2 className="text-xl font-semibold text-center">Interactive 3D Experience</h2>
        
        {/* Three.js Scene */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg bg-black/5 dark:bg-white/5 p-4">
          <Scene3D />
        </div>
        <div className="flex justify-center mt-4">
          <Link 
            href="/vr-experience" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try VR Experience
          </Link>
          <Link 
            href="/model-viewer" 
            className="px-4 py-2 ml-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            View 3D Models
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
            <h3 className="font-bold mb-2">About This Project</h3>
            <p>
              This is an interactive 3D experience built with Three.js, Next.js, and Tailwind CSS.
              You can rotate, zoom, and interact with the 3D objects using your mouse.
            </p>
          </div>
          
          <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg">
            <h3 className="font-bold mb-2">Getting Started</h3>
            <ol className="list-inside list-decimal text-sm/6 font-[family-name:var(--font-geist-mono)]">
              <li className="mb-2 tracking-[-.01em]">
                Explore the 3D scene by dragging to rotate
              </li>
              <li className="mb-2 tracking-[-.01em]">
                Scroll to zoom in and out
              </li>
              <li className="tracking-[-.01em]">
                Edit <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">src/components/Scene3D.tsx</code> to customize
              </li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-auto">
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
    </div>
  );
}
