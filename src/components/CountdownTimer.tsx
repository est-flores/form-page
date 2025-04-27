import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  // Set initial state for countdown 
  const [timeLeft, setTimeLeft] = useState({
    days: '11',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // Start date and end date for the countdown
  const START_DATE = '2025-04-27T00:00:00';
  const END_DATE = '2025-05-08T00:00:00';
  
  const updateTimer = () => {
    const now = new Date();
    const startDate = new Date(START_DATE);
    const endDate = new Date(END_DATE);
    
    // If current time is before the start date, show the full period
    if (now < startDate) {
      const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setTimeLeft({
        days: totalDays.toString().padStart(2, '0'),
        hours: '00',
        minutes: '00',
        seconds: '00'
      });
      return;
    }
    
    // If current time is after the end date, show zeros
    if (now >= endDate) {
      setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      return;
    }
    
    // Calculate time left from now until end date
    const difference = endDate.getTime() - now.getTime();
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    setTimeLeft({
      days: days.toString().padStart(2, '0'),
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    });
  };

  useEffect(() => {
    // Update immediately and then every second
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Helper to split a two-digit number into separate digits
  const splitDigits = (value: string) => {
    return [value.charAt(0), value.charAt(1)];
  };

  const daysDigits = splitDigits(timeLeft.days);
  const hoursDigits = splitDigits(timeLeft.hours);
  const minutesDigits = splitDigits(timeLeft.minutes);

  return (
    <div className="bg-[#FFF1E6] rounded-2xl p-4 mb-8">
      <p className="text-center text-[#A67E6B] font-bold mb-3">¡PRONTO!</p>
      <div className="flex justify-center items-center gap-2">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {daysDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {daysDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-s mt-1">Días</span>
        </div>
        <div className="text-[#A67E6B] text-2xl font-bold">:</div>
        
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {hoursDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {hoursDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-s mt-1">Horas</span>
        </div>
        <div className="text-[#A67E6B] text-2xl font-bold">:</div>
        
        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1">
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {minutesDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-10 h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-xl md:text-2xl">
              {minutesDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-s mt-1">Minutos</span>
        </div>
        
      </div>
     
    </div>
  );
};

export default CountdownTimer; 