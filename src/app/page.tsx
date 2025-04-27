"use client";

import CountdownTimer from "@/components/CountdownTimer";
import SignupForm from "@/components/SignupForm";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setHasMounted(true);
    
    // Check if screen is mobile
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
      }
    };

    // Initial check
    checkMobile();

    // Add resize event listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]); // Add isMobile as dependency to react to its changes

  // Handle video playback in a separate effect
  useEffect(() => {
    if (!hasMounted) return;

    // Pause both videos first
    if (mobileVideoRef.current) {
      mobileVideoRef.current.pause();
    }
    if (desktopVideoRef.current) {
      desktopVideoRef.current.pause();
    }

    // Play the appropriate video based on screen size
    if (isMobile && mobileVideoRef.current) {
      // Reset the mobile video and play
      mobileVideoRef.current.currentTime = 0;
      mobileVideoRef.current.play().catch(error => {
        console.error("Mobile video autoplay failed:", error);
      });
    } else if (!isMobile && desktopVideoRef.current) {
      // Reset the desktop video and play
      desktopVideoRef.current.currentTime = 0;
      desktopVideoRef.current.play().catch(error => {
        console.error("Desktop video autoplay failed:", error);
      });
    }
  }, [isMobile, hasMounted]);

  // Render both videos but control visibility with CSS
  // This avoids remounting videos which causes playback issues
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Both videos are always in DOM, but only one is visible */}
      <video
        ref={mobileVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          isMobile ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <source src="/mobile.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video
        ref={desktopVideoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          !isMobile ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <source src="/desktop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay to ensure content is readable */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      <div className="w-full max-w-md md:max-w-xl relative z-10 backdrop-blur-sm bg-white/30 p-6 md:p-8 rounded-2xl shadow-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/pita-con.nudo.png" 
            alt="PITA CON NUDO - MATERNITY LIFESTYLE" 
            width={250} 
            height={100}
            className="h-auto"
            priority
          />
        </div>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Form */}
        <SignupForm />
      </div>
    </div>
  );
}
