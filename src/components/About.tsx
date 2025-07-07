// src/components/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-white text-gray-800" id="about">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#1D4ED8] relative inline-block mb-6 border-title">
          About Us
        </h2>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          We are committed to delivering cutting-edge solutions in healthcare management systems.
          Our goal is to streamline workflows, enhance patient care, and improve operational efficiency
          through intuitive technology.
        </p>
      </div>
    </section>
  );
};

export default About;
