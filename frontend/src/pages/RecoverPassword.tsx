import React, { useState } from 'react';
import OtpVerify from '../components/OtpVerify';
import OtpEmail from '../components/OtpEmail';
import ResetPassword from '../components/ResetPassword';
import { sendOTP, verifyOTP, resetPassword } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

const RecoverPassword: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (enteredEmail: string) => {
    setEmail(enteredEmail);
    try {
      setLoading(true);
      const status = await sendOTP(enteredEmail);
      if (status === 200) {
        setIsOtpSent(true);
      } else if (status === 404) {
        toast.error(`User with email ${enteredEmail} is not registered`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error(`Error occurred: ${error.message || "Unknown error"}`);
    } finally{
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (email: string, otp: string) => {
    try {
      setLoading(true);
      const status = await verifyOTP(email, otp);
      if (status === 200) {
        toast.success("OTP verified. Please reset your password.");
        setIsOtpVerified(true);
      } else if (status === 400) {
        toast.error("OTP is expired or invalid");
      } else if (status === 404) {
        toast.error("OTP not found");
      }
    } catch (error: any) {
      toast.error(`Error occurred: ${error.message || "Unknown error"}`);
    }
    finally{
      setLoading(false);
    }
  };

  const handleResetSubmit = async (newPassword: string) => {
    try {
      setLoading(true);
      const status = await resetPassword(email, newPassword);
      if (status === 202) {
        toast.success("Password reset successful. Redirecting to login...");
        navigate('/login');
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error(`Error occurred: ${error.message || "Unknown error"}`);
    } finally{
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {isLoading ? (<Spinner/>) : !isOtpSent ? (
        <OtpEmail onSubmit={handleEmailSubmit} />
      ) : !isOtpVerified ? (
        <OtpVerify email={email} onVerifySubmit={handleOtpSubmit} />
      ) : (
        <ResetPassword onResetSubmit={handleResetSubmit} />
      )}
    </div>
  );
};

export default RecoverPassword;
