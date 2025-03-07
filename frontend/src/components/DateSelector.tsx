import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DateSelector: React.FC<{ onSelectDate: (date: string) => void }> = ({ onSelectDate }) => {
  const [defaultDate, setDefaultDate] = useState("");

  // additional: 
  const isWeekend = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

  // Function to calculate the next available weekday
  const getNextWeekday = (): string => {
    const today = new Date();
    let nextDay = new Date(today);
    let counter = 0;
    // Increment the day until it's a weekday (Monday to Friday)
    /*do {
      nextDay.setDate(nextDay.getDate() + 1);
    } while (nextDay.getDay() === 0 || nextDay.getDay() === 6); // Skip Sundays (0) and Saturdays (6)*/

    while (isWeekend(nextDay) && counter < 120) {
      counter = counter +1;
      nextDay.setDate(nextDay.getDate() + 1);
    }

    // Format the date to YYYY-MM-DD
    return nextDay.toISOString().split("T")[0];
  };

  // Function to validate and correct the selected date
  const handleDateChange = (date: string) => {
    const selectedDate = new Date(date);
    if (isWeekend(selectedDate)) {
      // If weekend, reset to the default date
      const nextWeekday = getNextWeekday();
      setDefaultDate(nextWeekday);
      onSelectDate(nextWeekday);
      toast.warn("Weekends are not available. Please choose a weekday.", {
        autoClose: 3000,
      });
    } else {
      // If valid weekday, set the date
      setDefaultDate(date);
      onSelectDate(date);
    }
  };

  useEffect(() => {
    if (!defaultDate) {
      const nextDate = getNextWeekday();
      setDefaultDate(nextDate);
      onSelectDate(nextDate); // Notify parent of the default date
    }
  }, [defaultDate, onSelectDate]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Select a Date</h2>
      <input
        type="date"
        className="border rounded p-2 w-60 bg-white text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
        aria-label="Select a date"  
        min={defaultDate}
        value={defaultDate}
        onChange={(e) => handleDateChange(e.target.value)}
      />
    </div>
  );
  
};

export default DateSelector;
