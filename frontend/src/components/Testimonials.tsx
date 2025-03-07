import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

const testimonials = [
  { name: "Mehmet Efe Sak", quote: "I came to this university only to meet the GOAT Abdulaleem!" },
  { name: "Maksat Abrayev", quote: "Abdulaleem is the best person I have ever came accros." }, 
  { name: "Ahmad Haikal", quote: "I Love my friend Abdulaleem so much." },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700 dark:text-blue-400">
        What Students Say
      </h2>
      <Swiper spaceBetween={20} slidesPerView={1} autoplay={{ delay: 6000 }} className="max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center text-center">
            <blockquote className="text-gray-600 italic dark:text-gray-300">
              {testimonial.quote}
            </blockquote>
            <p className="mt-4 font-bold text-gray-900 dark:text-white">
              {testimonial.name}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );  
};

export default Testimonials;
