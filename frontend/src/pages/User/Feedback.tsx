import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitFeedback } from "../../utils/api";

interface FeedbackData {
  rating: number;
  comments: string;
  serviceQuality: string;
  guideCommunication: string;
}

const Feedback: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comments: "",
    serviceQuality: "",
    guideCommunication: "",
  });
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!appointmentId) {
        throw new Error("Appointment ID is missing.");
      }

      // Call the submitFeedback function
      await submitFeedback({
        appointment_id: parseInt(appointmentId, 10),
        rating: feedback.rating,
        comment: feedback.comments,
        //service_quality: feedback.serviceQuality,
        //guide_communication: feedback.guideCommunication,
      });

      setSubmittedFeedback(feedback); // Update UI to show success
      console.log("Feedback submitted successfully.");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleRatingChange = (rating: number) => {
    setFeedback({ ...feedback, rating });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">Appointment Feedback</h1>
              <p className="mt-2 text-gray-600 text-center">Appointment ID: {appointmentId}</p>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {submittedFeedback ? (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">
                      Thank you for your feedback!
                    </h2>
                    <p>Rating: {submittedFeedback.rating}/5</p>
                    <p>Comments: {submittedFeedback.comments}</p>
                    <p>Service Quality: {submittedFeedback.serviceQuality}</p>
                    <p>Guide Communication: {submittedFeedback.guideCommunication}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <RatingInput
                      rating={feedback.rating}
                      onRatingChange={handleRatingChange}
                    />
                    <TextInput
                      label="Comments"
                      name="comments"
                      value={feedback.comments}
                      onChange={(e) =>
                        setFeedback({ ...feedback, comments: e.target.value })
                      }
                    />
                    <TextInput
                      label="How would you rate the service quality?"
                      name="serviceQuality"
                      value={feedback.serviceQuality}
                      onChange={(e) =>
                        setFeedback({
                          ...feedback,
                          serviceQuality: e.target.value,
                        })
                      }
                    />
                    <TextInput
                      label="How would you rate the guide's communication?"
                      name="guideCommunication"
                      value={feedback.guideCommunication}
                      onChange={(e) =>
                        setFeedback({
                          ...feedback,
                          guideCommunication: e.target.value,
                        })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit Feedback
                    </button>
                  </form>
                )}
                <button
                  onClick={() => navigate("/visitor/home")}
                  className="w-full mt-4 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RatingInput: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
}> = ({ rating, onRatingChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-bold mb-2">Rating:</label>
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`px-2 py-1 rounded mr-1 ${
            rating >= value ? "bg-yellow-400" : "bg-gray-300"
          } hover:bg-yellow-300`}
          onClick={() => onRatingChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  </div>
);

const TextInput: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-gray-700 font-bold mb-2"
    >
      {label}:
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

export default Feedback;
