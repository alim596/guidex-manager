import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchAvailableAppointmentsForGuides,
  fetchAdminsAppointments,
  Appointment,
  rejectAppointment,
  assignGuideToAppointment,
  unassignGuideFromAppointment,
  approveAppointment,
} from '../../utils/api';

interface PendingApprovalsProps {
  onApprovalStatusChange?: (pendingCount: number, unassignedCount: number) => void;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  onApprovalStatusChange = () => {},
}) => {
  const [approvals, setApprovals] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<{ [id: number]: boolean }>({});
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const role = sessionStorage.getItem('role');
        if (!role) {
          return <Navigate to="/auth" replace />;
        }
        setUserRole(role);

        let appointments: Appointment[] = [];
        if (role === 'admin') {
          appointments = await fetchAdminsAppointments();
        } else if (role === 'guide') {
          appointments = await fetchAvailableAppointmentsForGuides();
        }
        setApprovals(appointments);

        const pendingCount = appointments.filter((app) => app.status === 'created').length;
        const unassignedCount = appointments.filter((app) => app.status === 'approved').length;

        onApprovalStatusChange(pendingCount, unassignedCount);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const updateProcessingState = (id: number, isProcessing: boolean) => {
    setProcessing((prev) => ({ ...prev, [id]: isProcessing }));
  };

  const handleApproval = async (id: number) => {
    updateProcessingState(id, true);
    try {
      await approveAppointment(id);
      setApprovals((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'approved' } : appointment
        )
      );
      toast.success('Appointment approved!');
    } catch (error) {
      console.error('Failed to approve appointment:', error);
      toast.error('Failed to approve appointment. Please try again.');
    } finally {
      updateProcessingState(id, false);
    }
  };

  const handleAcceptance = async (id: number) => {
    updateProcessingState(id, true);
    try {
      await assignGuideToAppointment(id);
      setApprovals((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'accepted' } : appointment
        )
      );
      toast.success('Appointment accepted!');
    } catch (error) {
      console.error('Failed to assign guide:', error);
      toast.error('Failed to assign guide. Please try again.');
    } finally {
      updateProcessingState(id, false);
    }
  };

  const handleRejection = async (id: number) => {
    updateProcessingState(id, true);
    try {
      await rejectAppointment(id);
      setApprovals((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'rejected' } : appointment
        )
      );
      toast.success(
        userRole === 'admin' ? 'Appointment rejected!' : 'Appointment declined!'
      );
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      toast.error('Failed to reject appointment. Please try again.');
    } finally {
      updateProcessingState(id, false);
    }
  };

  const resetStatus = async (id: number, newStatus: string) => {
    updateProcessingState(id, true);
    try {
      await unassignGuideFromAppointment(id, { status: newStatus });
      setApprovals((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: newStatus } : appointment
        )
      );
      toast.info('Appointment status reset successfully.');
    } catch (error) {
      console.error('Failed to reset appointment:', error);
      toast.error('Failed to reset appointment. Please try again.');
    } finally {
      updateProcessingState(id, false);
    }
  };

  if (userRole !== 'admin' && userRole !== 'guide') {
    return (
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        You are not allowed here, brother/sister {'😔'}
      </h1>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-400">
        {userRole === 'admin'
          ? 'Admin Pending Approvals'
          : userRole === 'guide'
          ? 'Guide Pending Approvals'
          : 'Why are you here?'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {approvals.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">No pending approvals.</p>
        ) : (
          <ul className="space-y-4">
            {approvals.map((approval) => (
              <li
                key={approval.id}
                className={`p-4 border rounded flex justify-between items-center ${
                  approval.status === 'approved'
                    ? 'bg-green-100 dark:bg-green-700'
                    : approval.status === 'rejected'
                    ? 'bg-red-100 dark:bg-red-700'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    {approval.school_name || 'Unknown School'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Guide Status: {approval.guide_id ? 'Assigned' : 'Not Assigned'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Date: {new Date(approval.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Time: {new Date(`1970-01-01T${approval.time}Z`).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex space-x-2">
                  {userRole === 'admin' && approval.status === 'created' && (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => handleApproval(approval.id)}
                        disabled={processing[approval.id]}
                      >
                        {processing[approval.id] ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => handleRejection(approval.id)}
                        disabled={processing[approval.id]}
                      >
                        {processing[approval.id] ? 'Processing...' : 'Deny'}
                      </button>
                    </>
                  )}
                  {userRole === 'guide' && approval.status === 'approved' && (
                    <>
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => handleAcceptance(approval.id)}
                        disabled={processing[approval.id]}
                      >
                        {processing[approval.id] ? 'Processing...' : 'Accept'}
                      </button>
                    </>
                  )}
                  {userRole === 'admin' && approval.status !== 'created' && (
                    <button
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      onClick={() => resetStatus(approval.id, 'created')}
                      disabled={processing[approval.id]}
                    >
                      {processing[approval.id] ? 'Processing...' : 'Edit'}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals;
