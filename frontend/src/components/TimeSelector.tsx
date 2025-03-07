import React, { useState, useEffect } from "react";
import { fetchAvailableTimes } from "../utils/api";

interface TimeSelectorProps {
  date: string;
  onSelectTime: (time: string) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ date, onSelectTime }) => {
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Helper function to format time to HH:mm:ss
  const formatTime = (time: string): string => {
    const [hours, minutesPart] = time.split(':');
    const [minutes, period] = minutesPart.split(' ');
    let formattedHours = parseInt(hours, 10);

    if (period === 'PM' && formattedHours !== 12) {
      formattedHours += 12;
    } else if (period === 'AM' && formattedHours === 12) {
      formattedHours = 0;
    }

    return `${String(formattedHours).padStart(2, '0')}:${minutes}:00`;
  };
  
  useEffect(() => {
    const loadAvailableTimes = async () => {
      try {
        const times = await fetchAvailableTimes(date); // Fetch available times from backend
        // Convert backend times to match the frontend format
        const formattedTimes = times.map((time) => time);
        setAvailableTimes(formattedTimes);
      } catch (error) {
        console.error("Error fetching available times:", error);
      }
    };

    loadAvailableTimes();
  }, [date]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onSelectTime(formatTime(time));
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Select a Time for {new Date(date).toLocaleDateString()}
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {["10:00 AM", "1:00 PM", "3:00 PM"].map((time) => {
          const formattedTime = formatTime(time);
          return (
            <button
              key={time}
              className={`py-2 px-4 rounded ${
                selectedTime === time
                  ? "shadow-lg border bg-blue-800 text-white dark:bg-blue-700 dark:border-blue-600"
                  : availableTimes.includes(formattedTime)
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white transition-all duration-200"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
              }`}
              onClick={() => handleTimeSelect(time)}
              disabled={!availableTimes.includes(formattedTime)} // Disable if time is not available
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );  
};

export default TimeSelector;
