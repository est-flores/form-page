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
  const [isLoading, setIsLoading] = useState(true);

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
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]); // Add isMobile as dependency to react to its changes

  // Handle video playback
  useEffect(() => {
    if (!hasMounted) return;

    const handleVideoPlayback = async () => {
      // Initially pause both videos
      if (mobileVideoRef.current) {
        mobileVideoRef.current.pause();
      }
      if (desktopVideoRef.current) {
        desktopVideoRef.current.pause();
      }

      try {
        // Play the appropriate video based on screen size
        if (isMobile && mobileVideoRef.current) {
          await mobileVideoRef.current.play();
        } else if (!isMobile && desktopVideoRef.current) {
          await desktopVideoRef.current.play();
        }
        
        // Mark loading as complete
        setIsLoading(false);
      } catch (error) {
        console.error("Video playback failed:", error);
        setIsLoading(false);
      }
    };

    // Start video playback
    handleVideoPlayback();
  }, [isMobile, hasMounted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Mobile Video */}
      <div className={`absolute inset-0 z-0 ${isMobile ? 'block' : 'hidden'}`}>
        <video
          ref={mobileVideoRef}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/5853838/5853838-uhd_1440_2732_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading indicator for mobile */}
        {isLoading && isMobile && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Desktop Video */}
      <div className={`absolute inset-0 z-0 ${!isMobile ? 'block' : 'hidden'}`}>
        <video
          ref={desktopVideoRef}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/5853678/5853678-uhd_2732_1440_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading indicator for desktop */}
        {isLoading && !isMobile && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Dark overlay to ensure content is readable */}
      {/* <div className="absolute inset-0 bg-black/20 z-10"></div> */}
      
      <div className="w-full max-w-md md:max-w-xl relative z-20 bg-white/0 p-6 md:p-8 rounded-2xl">
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
