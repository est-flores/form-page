"use client";

import CountdownTimer from "@/components/CountdownTimer";
import SignupForm from "@/components/SignupForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-100 p-4 md:p-8 relative">
      {/* Optional: Add a background overlay for images */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center z-0"></div>
      
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
