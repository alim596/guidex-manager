const highlights = [
  {
    title: "World-Class Facilities",
    description: "Explore our modern labs, libraries, and classrooms.",
  },
  {
    title: "Vibrant Student Life",
    description: "Discover clubs, activities, and a diverse community.",
  },
  {
    title: "Personalized Guidance",
    description: "Meet with staff who will support your journey.",
  },
];

const WhyVisitSection: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
  <h2 className="text-3xl font-bold text-center mb-8 text-blue-700 dark:text-blue-400">
    Why Visit Us?
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
    {highlights.map((highlight, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {highlight.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {highlight.description}
        </p>
      </div>
    ))}
  </div>
</section>
  );
};

export default WhyVisitSection;
