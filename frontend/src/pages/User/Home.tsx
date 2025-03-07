import React from 'react';
import HeroSection from '../../components/HeroSection';
import WhyVisitSection from '../../components/WhyVisitSection';
import Testimonials from '../../components/Testimonials';
import HowItWorks from '../../components/HowItWorks';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <WhyVisitSection />
      <Testimonials />
      <HowItWorks />
    </>
  );
};

export default Home;
