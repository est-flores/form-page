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
  const [videoStates, setVideoStates] = useState({
    mobile: { loading: true, error: false },
    desktop: { loading: true, error: false }
  });

  // Preload poster images
  useEffect(() => {
    // Preload poster images for immediate display
    const preloadImages = () => {
      const mobilePoster = new window.Image();
      mobilePoster.src = '/mobile-poster.jpg';
      
      const desktopPoster = new window.Image();
      desktopPoster.src = '/desktop-poster.jpg';
    };
    
    preloadImages();
  }, []);

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

    // Set initial loading to false immediately to show poster images right away
    setIsInitialLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]); // Add isMobile as dependency to react to its changes

  // Preload the appropriate video based on screen size
  useEffect(() => {
    if (!hasMounted) return;

    // Function to load the appropriate video
    const loadVideo = async () => {
      // Update loading states - but maintain visibility of poster/last frame
      if (isMobile) {
        setVideoStates(prev => ({ 
          ...prev, 
          mobile: { ...prev.mobile, loading: true } 
        }));
      } else {
        setVideoStates(prev => ({ 
          ...prev, 
          desktop: { ...prev.desktop, loading: true } 
        }));
      }

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
          
          // Ensure poster is visible
          mobileVideo.poster = "/mobile-poster.jpg";
          
          // Start with optimized version
          mobileVideo.src = "/optimized/mobile.mp4";
          mobileVideo.preload = "auto";
          
          try {
            // Start loading and playing
            mobileVideo.load();
            
            // Use a canplay event for smoother transition
            const canPlayPromise = new Promise<void>((resolve) => {
              mobileVideo.addEventListener('canplaythrough', () => resolve(), { once: true });
              
              // Add timeout fallback in case the event doesn't fire
              setTimeout(() => resolve(), 3000);
            });
            
            // Wait until video can play
            await canPlayPromise;
            
            // Now play and update state
            await mobileVideo.play();
            setVideosLoaded(prev => ({ ...prev, mobile: true }));
            setVideoStates(prev => ({ 
              ...prev, 
              mobile: { loading: false, error: false } 
            }));
            
            // Ensure loop is properly set
            mobileVideo.loop = true;
            
            // Add event listener to handle end of video
            mobileVideo.addEventListener('ended', () => {
              if (mobileVideoRef.current) {
                mobileVideoRef.current.currentTime = 0;
                mobileVideoRef.current.play().catch(error => {
                  console.error("Mobile video replay failed:", error);
                  setVideoStates(prev => ({ 
                    ...prev, 
                    mobile: { loading: false, error: true } 
                  }));
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
                  // Update loading state before switching
                  setVideoStates(prev => ({ 
                    ...prev, 
                    mobile: { ...prev.mobile, loading: true } 
                  }));
                  
                  // Store current time and ensure poster is set for fallback
                  const currentTime = mobileVideoRef.current.currentTime;
                  mobileVideoRef.current.poster = "/mobile-poster.jpg";
                  
                  // Switch to high-quality
                  mobileVideoRef.current.src = '/mobile.mp4';
                  mobileVideoRef.current.currentTime = currentTime;
                  mobileVideoRef.current.loop = true; // Ensure loop is set after src change
                  
                  // Listen for when the new source is ready to play
                  mobileVideoRef.current.addEventListener('canplaythrough', () => {
                    if (mobileVideoRef.current) {
                      mobileVideoRef.current.play().catch(error => {
                        console.error("Mobile video high quality playback failed:", error);
                        setVideoStates(prev => ({ 
                          ...prev, 
                          mobile: { loading: false, error: true } 
                        }));
                      });
                      
                      // Update state to show we're not loading anymore
                      setVideoStates(prev => ({ 
                        ...prev, 
                        mobile: { loading: false, error: false } 
                      }));
                    }
                  }, { once: true });
                }
              }, { once: true });
              
              // Load but don't play
              highQualityLoader.load();
            }, 3000); // Wait 3 seconds before loading high quality
          } catch (error) {
            console.error("Mobile video autoplay failed:", error);
            setVideoStates(prev => ({ 
              ...prev, 
              mobile: { loading: false, error: true } 
            }));
          }
        } else if (mobileVideoRef.current && videosLoaded.mobile) {
          // If already loaded, just play
          mobileVideoRef.current.currentTime = 0;
          mobileVideoRef.current.loop = true; // Ensure loop is set
          mobileVideoRef.current.play().catch(error => {
            console.error("Mobile video playback failed:", error);
            setVideoStates(prev => ({ 
              ...prev, 
              mobile: { loading: false, error: true } 
            }));
          });
          setVideoStates(prev => ({ 
            ...prev, 
            mobile: { loading: false, error: false } 
          }));
        }
      } else {
        // Handle desktop video
        if (desktopVideoRef.current && !videosLoaded.desktop) {
          const desktopVideo = desktopVideoRef.current;
          
          // Ensure poster is visible
          desktopVideo.poster = "/desktop-poster.jpg";
          
          // Start with optimized version
          desktopVideo.src = "/optimized/desktop.mp4";
          desktopVideo.preload = "auto";
          
          try {
            // Start loading and playing
            desktopVideo.load();
            
            // Use a canplay event for smoother transition
            const canPlayPromise = new Promise<void>((resolve) => {
              desktopVideo.addEventListener('canplaythrough', () => resolve(), { once: true });
              
              // Add timeout fallback in case the event doesn't fire
              setTimeout(() => resolve(), 3000);
            });
            
            // Wait until video can play
            await canPlayPromise;
            
            // Now play and update state
            await desktopVideo.play();
            setVideosLoaded(prev => ({ ...prev, desktop: true }));
            setVideoStates(prev => ({ 
              ...prev, 
              desktop: { loading: false, error: false } 
            }));
            
            // Ensure loop is properly set
            desktopVideo.loop = true;
            
            // Add event listener to handle end of video
            desktopVideo.addEventListener('ended', () => {
              if (desktopVideoRef.current) {
                desktopVideoRef.current.currentTime = 0;
                desktopVideoRef.current.play().catch(error => {
                  console.error("Desktop video replay failed:", error);
                  setVideoStates(prev => ({ 
                    ...prev, 
                    desktop: { loading: false, error: true } 
                  }));
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
                  // Update loading state before switching
                  setVideoStates(prev => ({ 
                    ...prev, 
                    desktop: { ...prev.desktop, loading: true } 
                  }));
                  
                  // Store current time and ensure poster is set for fallback
                  const currentTime = desktopVideoRef.current.currentTime;
                  desktopVideoRef.current.poster = "/desktop-poster.jpg";
                  
                  // Switch to high-quality
                  desktopVideoRef.current.src = '/desktop.mp4';
                  desktopVideoRef.current.currentTime = currentTime;
                  desktopVideoRef.current.loop = true; // Ensure loop is set after src change
                  
                  // Listen for when the new source is ready to play
                  desktopVideoRef.current.addEventListener('canplaythrough', () => {
                    if (desktopVideoRef.current) {
                      desktopVideoRef.current.play().catch(error => {
                        console.error("Desktop video high quality playback failed:", error);
                        setVideoStates(prev => ({ 
                          ...prev, 
                          desktop: { loading: false, error: true } 
                        }));
                      });
                      
                      // Update state to show we're not loading anymore
                      setVideoStates(prev => ({ 
                        ...prev, 
                        desktop: { loading: false, error: false } 
                      }));
                    }
                  }, { once: true });
                }
              }, { once: true });
              
              // Load but don't play
              highQualityLoader.load();
            }, 3000); // Wait 3 seconds before loading high quality
          } catch (error) {
            console.error("Desktop video autoplay failed:", error);
            setVideoStates(prev => ({ 
              ...prev, 
              desktop: { loading: false, error: true } 
            }));
          }
        } else if (desktopVideoRef.current && videosLoaded.desktop) {
          // If already loaded, just play
          desktopVideoRef.current.currentTime = 0;
          desktopVideoRef.current.loop = true; // Ensure loop is set
          desktopVideoRef.current.play().catch(error => {
            console.error("Desktop video playback failed:", error);
            setVideoStates(prev => ({ 
              ...prev, 
              desktop: { loading: false, error: true } 
            }));
          });
          setVideoStates(prev => ({ 
            ...prev, 
            desktop: { loading: false, error: false } 
          }));
        }
      }
    };

    // Load the video with a slight delay to prioritize other content first
    const timeout = setTimeout(loadVideo, 100); // Reduced delay for faster video loading
    return () => clearTimeout(timeout);
  }, [isMobile, hasMounted, videosLoaded, isInitialLoading]);

  // Style for consistent poster image size/position
  const posterStyle = {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  } as const;

  // Render both videos but control visibility with CSS
  // This avoids remounting videos which causes playback issues
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background images to show immediately */}
      <div className={`absolute inset-0 z-0 ${isMobile ? 'block' : 'hidden'}`}>
        <img 
          src="/mobile-poster.jpg" 
          alt="" 
          className="w-full h-full object-cover" 
          style={posterStyle}
        />
      </div>
      
      <div className={`absolute inset-0 z-0 ${!isMobile ? 'block' : 'hidden'}`}>
        <img 
          src="/desktop-poster.jpg" 
          alt="" 
          className="w-full h-full object-cover"
          style={posterStyle}
        />
      </div>
      
      {/* Mobile Video */}
      <div className={`absolute inset-0 z-1 ${isMobile ? 'block' : 'hidden'}`}>
        <video
          ref={mobileVideoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/mobile-poster.jpg"
          className="w-full h-full object-cover"
          style={posterStyle}
        >
          <source src="/optimized/mobile.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading indicator for mobile */}
        {videoStates.mobile.loading && isMobile && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Desktop Video */}
      <div className={`absolute inset-0 z-1 ${!isMobile ? 'block' : 'hidden'}`}>
        <video
          ref={desktopVideoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster="/desktop-poster.jpg"
          className="w-full h-full object-cover"
          style={posterStyle}
        >
          <source src="/optimized/desktop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading indicator for desktop */}
        {videoStates.desktop.loading && !isMobile && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Dark overlay to ensure content is readable */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      
      <div className="w-full max-w-md md:max-w-xl relative z-20 backdrop-blur-sm bg-white/5 p-6 md:p-8 rounded-2xl shadow-sm">
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
