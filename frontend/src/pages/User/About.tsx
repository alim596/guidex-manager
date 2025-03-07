import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-center mb-8 text-blue-700">Welcome to Bilkent University</h1>
      <p className="text-xl text-gray-700 text-center mb-12">
        Discover the perfect place to achieve academic excellence, make lifelong friends, and prepare for a successful career.
        Bilkent University is more than an institution—it's a gateway to a brighter future.
      </p>

      {/* About Bilkent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
          <p className="text-lg text-gray-700 mb-6">
            Founded in 1984 by Prof. İhsan Doğramacı, Bilkent University is Turkey's first private, nonprofit university.
            The name “Bilkent” combines the Turkish words "bilim" (science) and "kent" (city), reflecting our mission as a
            vibrant hub of knowledge, culture, and innovation.
          </p>
          <p className="text-lg text-gray-700">
            With a focus on fostering creativity, research, and community, Bilkent University offers a global education
            experience right in the heart of Turkey.
          </p>
        </div>

        {/* Key Highlights */}
        <div>
          <h2 className="text-3xl font-semibold mb-4">Why Choose Bilkent?</h2>
          <ul className="list-disc pl-6 text-lg text-gray-700 space-y-3">
            <li>Ranked among the top 500 universities globally in the QS World Rankings.</li>
            <li>World-class faculty from 40+ countries, fostering an international academic environment.</li>
            <li>Over 100 student clubs and organizations for a vibrant campus life.</li>
            <li>State-of-the-art facilities, including libraries housing 500,000+ books.</li>
            <li>Collaborations with 300+ partner universities worldwide for exchange programs.</li>
          </ul>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold text-blue-600">1st</h3>
            <p className="text-lg text-gray-700">Ranked as Turkey’s leading university by QS Rankings.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold text-blue-600">500+</h3>
            <p className="text-lg text-gray-700">Academic publications annually from top researchers.</p>
          </div>
          <div className="p-6 border rounded-lg shadow-lg">
            <h3 className="text-4xl font-bold text-blue-600">300+</h3>
            <p className="text-lg text-gray-700">Global partnerships enabling international opportunities.</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Our Mission</h2>
        <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
          At Bilkent University, we are committed to excellence in teaching, learning, and research. Our goal is to expand
          the boundaries of human knowledge, nurture well-rounded individuals, and contribute to the advancement of
          society in Turkey and worldwide.
        </p>
      </div>

      {/* Testimonials Section */}
      <div className="mt-12 bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700 dark:text-blue-400">
          What Our Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <p className="italic text-gray-700 dark:text-gray-300">
              "Bilkent is an institution that provides excellent academic preparation, a great social environment, and
              opportunities for a brilliant career."
            </p>
            <p className="font-bold mt-2 text-gray-800 dark:text-gray-100">– Ani Kristo, Albania</p>
          </div>
          <div className="p-4 border rounded shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <p className="italic text-gray-700 dark:text-gray-300">
              "I would recommend Bilkent for several reasons. The standard of education is high, and the university is
              gaining increasing international recognition."
            </p>
            <p className="font-bold mt-2 text-gray-800 dark:text-gray-100">– Lazifa Karimli, Azerbaijan</p>
          </div>
        </div>
      </div>


      {/* Useful Links Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Useful Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a
            href="https://w3.bilkent.edu.tr/bilkent/international-students/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border rounded-lg shadow hover:shadow-lg hover:bg-blue-50"
          >
            <h3 className="text-xl font-bold text-blue-600">International Students</h3>
            <p className="text-gray-700">Learn more about admissions and support for international students.</p>
          </a>
          <a
            href="https://stars.bilkent.edu.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border rounded-lg shadow hover:shadow-lg hover:bg-blue-50"
          >
            <h3 className="text-xl font-bold text-blue-600">Bilkent Stars</h3>
            <p className="text-gray-700">Access the student registration and information system.</p>
          </a>
          <a
            href="https://library.bilkent.edu.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border rounded-lg shadow hover:shadow-lg hover:bg-blue-50"
          >
            <h3 className="text-xl font-bold text-blue-600">University Library</h3>
            <p className="text-gray-700">Explore the extensive resources available at Bilkent Library.</p>
          </a>
          <a
            href="https://www.bilkent.edu.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border rounded-lg shadow hover:shadow-lg hover:bg-blue-50"
          >
            <h3 className="text-xl font-bold text-blue-600">Official Website</h3>
            <p className="text-gray-700">Visit the Bilkent University homepage for the latest news and updates.</p>
          </a>
          <a
            href="https://w3.bilkent.edu.tr/bilkent/calendar/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 border rounded-lg shadow hover:shadow-lg hover:bg-blue-50"
          >
            <h3 className="text-xl font-bold text-blue-600">Academic Calendar</h3>
            <p className="text-gray-700">Stay updated with the academic schedule and key dates.</p>
          </a>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Start Your Journey at Bilkent</h2>
        <p className="text-lg text-gray-700 mb-6">
          Visit our campus, explore our programs, and experience the vibrant community that makes Bilkent University
          unique.
        </p>
        <a
          href="/appointment"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded text-lg font-semibold"
        >
          Schedule a Campus Visit
        </a>
      </div>
    </div>
  );
};

export default About;
