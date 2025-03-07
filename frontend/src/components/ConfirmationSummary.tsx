import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAppointment } from '../utils/api';

interface ConfirmationSummaryProps {
  data: { date: string; time: string; visitors_number: number; note: string };
  onEdit: () => void;
}

const ConfirmationSummary: React.FC<ConfirmationSummaryProps> = ({ data, onEdit }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirm = async () => {
    setLoading(true); // Disable the button
    try {
      // Prepare the payload
      const payload = {
        date: data.date, // Assume already in YYYY-MM-DD format
        time: data.time, // Format time to HH:MM:SS
        visitors_number: data.visitors_number,
        note: data.note,
      };

      console.log('Sending Appointment Payload:', payload);

      // API call
      const response = await createAppointment(payload);

      if (response) {
        toast.success('Appointment successfully created!');
        console.log('Created Appointment:', response);
        navigate('/visitor/home');
      } else {
        toast.error('Failed to create appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('An error occurred while creating the appointment.');
    } finally {
      setLoading(false); // Re-enable the button
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-white">
        Confirm Your Appointment
      </h2>
      <ul className="mb-4 text-gray-600 dark:text-gray-300">
        <li>
          <strong>Date:</strong> {data.date}
        </li>
        <li>
          <strong>Time:</strong> {data.time}
        </li>
        <li>
          <strong>Visitors:</strong> {data.visitors_number}
        </li>
        <li>
          <strong>Note:</strong> {data.note || 'None'}
        </li>
      </ul>
      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all dark:bg-yellow-600 dark:hover:bg-yellow-500"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all dark:bg-green-600 dark:hover:bg-green-500"
          onClick={handleConfirm}
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Processing...' : 'Confirm'} {/* Show feedback during loading */}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationSummary;
