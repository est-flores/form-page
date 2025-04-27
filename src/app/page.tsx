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
  const [videosLoaded, setVideosLoaded] = useState({ mobile: false, desktop: false });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

    // Set initial loading to false after a delay to ensure UI is rendered first
    const initialLoadingTimeout = setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(initialLoadingTimeout);
    };
  }, [isMobile]); // Add isMobile as dependency to react to its changes

  // Preload the appropriate video based on screen size
  useEffect(() => {
    if (!hasMounted || isInitialLoading) return;

    // Function to load the appropriate video
    const loadVideo = async () => {
      // Initially pause both videos
      if (mobileVideoRef.current) {
        mobileVideoRef.current.pause();
      }
      if (desktopVideoRef.current) {
        desktopVideoRef.current.pause();
      }

      // Determine which video to load based on screen size
      if (isMobile) {
        // Handle mobile video
        if (mobileVideoRef.current && !videosLoaded.mobile) {
          const mobileVideo = mobileVideoRef.current;
          
          // Start with optimized version
          mobileVideo.src = "/optimized/mobile.mp4";
          mobileVideo.preload = "auto";
          
          try {
            // Start loading and playing
            mobileVideo.load();
            await mobileVideo.play();
            setVideosLoaded(prev => ({ ...prev, mobile: true }));
            
            // Ensure loop is properly set
            mobileVideo.loop = true;
            
            // Add event listener to handle end of video
            mobileVideo.addEventListener('ended', () => {
              if (mobileVideoRef.current) {
                mobileVideoRef.current.currentTime = 0;
                mobileVideoRef.current.play().catch(error => {
                  console.error("Mobile video replay failed:", error);
                });
              }
            });
            
            // After initial play, preload the higher quality version for later
            setTimeout(() => {
              if (!mobileVideoRef.current) return;
              
              // Create a new video element to preload the high-quality version
              const highQualityLoader = document.createElement('video');
              highQualityLoader.preload = 'auto';
              highQualityLoader.src = '/mobile.mp4';
              highQualityLoader.muted = true;
              
              // When it's loaded enough, switch the source
              highQualityLoader.addEventListener('canplay', () => {
                if (mobileVideoRef.current) {
                  const currentTime = mobileVideoRef.current.currentTime;
                  mobileVideoRef.current.src = '/mobile.mp4';
                  mobileVideoRef.current.currentTime = currentTime;
                  mobileVideoRef.current.loop = true; // Ensure loop is set after src change
                  mobileVideoRef.current.play().catch(error => {
                    console.error("Mobile video high quality playback failed:", error);
                  });
                }
              }, { once: true });
              
              // Load but don't play
              highQualityLoader.load();
            }, 3000); // Wait 3 seconds before loading high quality
          } catch (error) {
            console.error("Mobile video autoplay failed:", error);
          }
        } else if (mobileVideoRef.current && videosLoaded.mobile) {
          // If already loaded, just play
          mobileVideoRef.current.currentTime = 0;
          mobileVideoRef.current.loop = true; // Ensure loop is set
          mobileVideoRef.current.play().catch(error => {
            console.error("Mobile video playback failed:", error);
          });
        }
      } else {
        // Handle desktop video
        if (desktopVideoRef.current && !videosLoaded.desktop) {
          const desktopVideo = desktopVideoRef.current;
          
          // Start with optimized version
          desktopVideo.src = "/optimized/desktop.mp4";
          desktopVideo.preload = "auto";
          
          try {
            // Start loading and playing
            desktopVideo.load();
            await desktopVideo.play();
            setVideosLoaded(prev => ({ ...prev, desktop: true }));
            
            // Ensure loop is properly set
            desktopVideo.loop = true;
            
            // Add event listener to handle end of video
            desktopVideo.addEventListener('ended', () => {
              if (desktopVideoRef.current) {
                desktopVideoRef.current.currentTime = 0;
                desktopVideoRef.current.play().catch(error => {
                  console.error("Desktop video replay failed:", error);
                });
              }
            });
            
            // After initial play, preload the higher quality version for later
            setTimeout(() => {
              if (!desktopVideoRef.current) return;
              
              // Create a new video element to preload the high-quality version
              const highQualityLoader = document.createElement('video');
              highQualityLoader.preload = 'auto';
              highQualityLoader.src = '/desktop.mp4';
              highQualityLoader.muted = true;
              
              // When it's loaded enough, switch the source
              highQualityLoader.addEventListener('canplay', () => {
                if (desktopVideoRef.current) {
                  const currentTime = desktopVideoRef.current.currentTime;
                  desktopVideoRef.current.src = '/desktop.mp4';
                  desktopVideoRef.current.currentTime = currentTime;
                  desktopVideoRef.current.loop = true; // Ensure loop is set after src change
                  desktopVideoRef.current.play().catch(error => {
                    console.error("Desktop video high quality playback failed:", error);
                  });
                }
              }, { once: true });
              
              // Load but don't play
              highQualityLoader.load();
            }, 3000); // Wait 3 seconds before loading high quality
          } catch (error) {
            console.error("Desktop video autoplay failed:", error);
          }
        } else if (desktopVideoRef.current && videosLoaded.desktop) {
          // If already loaded, just play
          desktopVideoRef.current.currentTime = 0;
          desktopVideoRef.current.loop = true; // Ensure loop is set
          desktopVideoRef.current.play().catch(error => {
            console.error("Desktop video playback failed:", error);
          });
        }
      }
    };

    // Load the video with a slight delay to prioritize other content first
    const timeout = setTimeout(loadVideo, 300);
    return () => clearTimeout(timeout);
  }, [isMobile, hasMounted, videosLoaded, isInitialLoading]);

  // Render both videos but control visibility with CSS
  // This avoids remounting videos which causes playback issues
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-stone-900">
      {/* Both videos are always in DOM, but only one is visible */}
      <video
        ref={mobileVideoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/mobile-poster.jpg"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          isMobile ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <source src="/optimized/mobile.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <video
        ref={desktopVideoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/desktop-poster.jpg"
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          !isMobile ? 'opacity-100' : 'opacity-0 invisible'
        }`}
      >
        <source src="/optimized/desktop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay to ensure content is readable */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      <div className="w-full max-w-md md:max-w-xl relative z-10 backdrop-blur-sm bg-white/5 p-6 md:p-8 rounded-2xl shadow-sm">
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
