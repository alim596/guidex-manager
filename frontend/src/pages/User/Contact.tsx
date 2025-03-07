import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendContactEmail } from "../../utils/api";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sender_name || !formData.sender_email || !formData.message) {
      toast.error("All fields are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactEmail(formData);
      toast.success("Message sent. Thanks for your question!");
      navigate("/");
    } catch (error: any) {
      console.error("Error sending email:", error.message);
      toast.error("Failed to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-8">
        If you have any questions or need more information, please feel free to reach out to us. We’d love to hear from you!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Address</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bilkent University
            06800 Bilkent, Ankara, Türkiye
          </p>
          <h2 className="text-2xl font-semibold mb-4">Phone</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">+90 312 290 4000</p>
          <h2 className="text-2xl font-semibold mb-4">Email</h2>
          <p className="text-gray-700 dark:text-gray-300">bilinfo@bilkent.edu.tr</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="sender_name"
              value={formData.sender_name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-2 border rounded bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              required
            />
            <input
              type="email"
              name="sender_email"
              value={formData.sender_email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-2 border rounded bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full p-2 border rounded bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary"
              rows={5}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
