import React, { useState, useEffect } from 'react';

interface OtpComponentProps {
  email: string; // Define the expected prop type
  onVerifySubmit: (email : string, otp : string) => void;
}


const OtpVerify: React.FC<OtpComponentProps> = ({ email, onVerifySubmit }) => {
  const [otp, setOtp] = useState<string>(''); // State to store the OTP
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // Button disabled state
  const [timeLeft, setTimeLeft] = useState<number>(300); // Timer (5 minutes)

  // Timer effect to handle countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Clear timer on unmount
    } else {
      setIsDisabled(true); // Disable button after timer ends
    }
  }, [timeLeft]);

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value); // Update OTP if valid
    }
  };

  // Submit OTP handler
  const handleSubmit = () => {
    if (otp.length === 6) {
      onVerifySubmit(email, otp);
    } else {
      alert('Please enter a 6-digit OTP.');
    }
  };

  // Format timer display
  const formatTime = (): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Enter OTP</h1>
      <p className="text-center text-gray-600 mb-4">
        OTP sent to: <span className="font-semibold">{email}</span>
      </p>
      <input
        type="text"
        value={otp}
        onChange={handleOtpChange}
        className="w-full text-4xl text-center border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 mb-4"
        maxLength={6}
        placeholder="------"
      />
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`w-full py-2 text-lg rounded ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Submit
      </button>
      <div className="mt-4 text-center text-gray-500">
        {isDisabled ? 'Time expired!' : `Time left: ${formatTime()}`}
      </div>
    </div>
  );
};

export default OtpVerify;
