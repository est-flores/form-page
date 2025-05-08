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
  const END_DATE = '2025-05-09T00:00:00';
  
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
    <div className="bg-[#FFF1E6] rounded-2xl p-4 px-2 sm:px-4 mb-8">
      <p className="text-center text-[#A67E6B] font-bold mb-3">¡PRONTO!</p>
      <div className="flex flex-wrap justify-center items-center gap-0.5 sm:gap-2">
        {/* Days */}
        <div className="flex flex-col items-center min-w-0">
          <div className="flex gap-0.5 sm:gap-1">
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {daysDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {daysDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-xs sm:text-s mt-1">Días</span>
        </div>
        <div className="text-[#A67E6B] text-xl sm:text-2xl font-bold">:</div>
        {/* Hours */}
        <div className="flex flex-col items-center min-w-0">
          <div className="flex gap-0.5 sm:gap-1">
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {hoursDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {hoursDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-xs sm:text-s mt-1">Horas</span>
        </div>
        <div className="text-[#A67E6B] text-xl sm:text-2xl font-bold">:</div>
        {/* Minutes */}
        <div className="flex flex-col items-center min-w-0">
          <div className="flex gap-0.5 sm:gap-1">
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {minutesDigits[0]}
            </div>
            <div className="bg-[#A67E6B] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded flex items-center justify-center text-white font-bold text-base sm:text-xl md:text-2xl min-w-0 flex-shrink">
              {minutesDigits[1]}
            </div>
          </div>
          <span className="text-[#A67E6B] text-xs sm:text-s mt-1">Minutos</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 