import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
import { useNavigate } from 'react-router-dom';
import 'swiper/swiper-bundle.min.css'; 


const images = [
  '/assets/Campus_image3.jpg',
  '/assets/Campus_image4.jpg'
];

const HeroSection: React.FC = () => {
  SwiperCore.use([Autoplay]);
  const navigate = useNavigate();
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full absolute inset-0"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Your Future at Bilkent</h1>
        <p className="text-lg md:text-2xl mb-6">Join us for a tour to experience our campus and programs in action!</p>
        <div className="space-x-4">
          <button onClick={() => {navigate('/visitor/appointment')}} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded">Schedule a Tour</button>
          <button onClick={() => {navigate('/visitor/about')}}className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-6 rounded">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
