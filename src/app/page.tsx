"use client";

import CountdownTimer from "@/components/CountdownTimer";
import SignupForm from "@/components/SignupForm";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-100 p-4 md:p-8 relative">
      {/* Optional: Add a background overlay for images */}
      <div className="absolute inset-0 opacity-10 bg-cover bg-center z-0"></div>
      
      <div className="w-full max-w-md md:max-w-xl relative z-10 backdrop-blur-sm bg-white/30 p-6 md:p-8 rounded-2xl shadow-sm">
        {/* Brand Name */}
        <h1 className="text-center text-3xl md:text-4xl font-light text-neutral-800 tracking-widest mb-1">
          PITA GOV NUDO
        </h1>
        <p className="text-center text-sm md:text-base text-neutral-600 tracking-wide mb-6">
          MATERNITY LIFESTYLE
        </p>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Form */}
        <SignupForm />
      </div>
    </div>
  );
}
