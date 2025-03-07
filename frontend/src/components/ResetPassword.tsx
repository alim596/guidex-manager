import React, { useState } from 'react';

interface ResetPasswordProps {
  onResetSubmit: (newPassword: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onResetSubmit }) => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    onResetSubmit(newPassword);
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter new password"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm new password"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
