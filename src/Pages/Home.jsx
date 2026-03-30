import React from 'react';
import HeroSection from '../components/home/HeroSection';
import BenefitsSection from '../components/home/BenefitsSection';
import BacMentorBanner from '../components/home/BacMentorBanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <BenefitsSection />
      <BacMentorBanner />
    </div>
  );
}