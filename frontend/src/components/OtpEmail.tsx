import React, { useState } from 'react';

interface EmailComponentProps {
  onSubmit: (email: string) => void; // Type for the onSubmit prop
}

const OtpEmail: React.FC<EmailComponentProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>(''); // State type explicitly defined

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onSubmit(email);
    } else {
      alert('Please enter a valid email address.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Recover Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default OtpEmail;
