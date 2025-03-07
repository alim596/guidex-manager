const steps = [
    { step: "1", title: "Create an Account", description: "Sign up to get started." },
    { step: "2", title: "Select a Date", description: "Choose your preferred tour slot." },
    { step: "3", title: "Experience the Campus", description: "Enjoy your visit!" },
  ];
  
  const HowItWorks: React.FC = () => {
    return (
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
  <h2 className="text-3xl font-bold text-center mb-8 text-blue-700 dark:text-blue-400">
    How It Works
  </h2>
  <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto px-4">
    {steps.map((item, index) => (
      <div
        key={index}
        className="bg-white shadow-md rounded-lg p-6 text-center dark:bg-gray-700 dark:text-gray-200"
      >
        <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {item.step}
        </span>
        <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
          {item.title}
        </h3>
        <p className="text-gray-600 mt-2 dark:text-gray-300">
          {item.description}
        </p>
      </div>
    ))}
  </div>
</section>

    );
  };
  
  export default HowItWorks;
  