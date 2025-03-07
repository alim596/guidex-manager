import React, { useState } from 'react';
import DateSelector from '../../components/DateSelector';
import TimeSelector from '../../components/TimeSelector';
import TextInput from '../../components/TextInput';
import NumberInput from '../../components/NumberInput';
import ConfirmationSummary from '../../components/ConfirmationSummary';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Appointment: React.FC = () => {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    visitors_number: 0,
    note: '',
  });

  const updateData = (field: string, value: string | number) => {
    setAppointmentData({ ...appointmentData, [field]: value });
  };

  const validateStep = () => {
    if (step === 1 && !appointmentData.date) {
      toast.error('Please select a date before proceeding.');
      return false;
    }
    if (step === 2 && !appointmentData.time) {
      toast.error('Please select a time before proceeding.');
      return false;
    }
    if (step === 3) {
      if (appointmentData.visitors_number <= 0) {
        toast.error('Number of visitors must be greater than zero.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Book a Campus Tour</h1>
      <p className="text-center text-gray-600 mb-8">
        Plan your group visit to experience Bilkent!
      </p>

      {step === 1 && (
        <DateSelector
          onSelectDate={(date) => {
            updateData('date', date);
          }}
        />
      )}

      {step === 2 && (
        <TimeSelector
          date={appointmentData.date}
          onSelectTime={(time) => {
            updateData('time', time);
          }}
        />
      )}

      {step === 3 && (
        <div>
          <NumberInput
            label="Number of Visitors"
            value={appointmentData.visitors_number}
            placeholder="Enter the number of visitors"
            onChange={(value) => updateData('visitors_number', value)}
          />
          <TextInput
            label="Note (Optional)"
            value={appointmentData.note}
            placeholder="Any special requests or notes"
            onChange={(value) => updateData('note', value)}
          />
        </div>
      )}

      {step === 4 && (
        <ConfirmationSummary
          data={appointmentData}
          onEdit={() => setStep(1)}
        />
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded"
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        )}
        {step < 4 && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Appointment;
