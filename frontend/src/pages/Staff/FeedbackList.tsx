import React, { useState, useEffect } from "react";
import { fetchAllFeedback, fetchSchoolNameForAppointment, Feedback } from "../../utils/api";

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [schoolNames, setSchoolNames] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(false);

        // Fetch all feedbacks
        const feedbackData = await fetchAllFeedback();
        setFeedbacks(feedbackData);

        // Fetch school names for feedbacks with appointment IDs
        const schoolNamesMap: Record<number, string> = {};
        await Promise.all(
          feedbackData.map(async (feedback) => {
            if (feedback.appointment_id) {
              try {
                const schoolName = await fetchSchoolNameForAppointment(feedback.appointment_id);
                schoolNamesMap[feedback.appointment_id] = schoolName;
              } catch (err) {
                console.error(`Error fetching school name for appointment ${feedback.appointment_id}:`, err);
                schoolNamesMap[feedback.appointment_id] = "Unknown School";
              }
            }
          })
        );
        setSchoolNames(schoolNamesMap);
      } catch (err) {
        console.error("Error loading feedbacks:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  if (isLoading) {
    return <div>Loading feedback...</div>;
  }

  if (error) {
    return <div>Failed to load feedback. Please try again later.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-blue-700 dark:text-blue-400">
        Feedbacks
      </h1>
      {feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <ul className="space-y-6">
          {feedbacks.map((feedback) => (
            <li
              key={feedback.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500 dark:bg-gray-800"
            >
              <div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">
                  {feedback.appointment_id
                    ? schoolNames[feedback.appointment_id] || "Loading..."
                    : "No Appointment"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Rating:</span> {feedback.rating}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Comment:</span> {feedback.comment || "No comment"}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(feedback.created_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
