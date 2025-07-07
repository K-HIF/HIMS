import React from 'react';
import metricsBg from '../assets/metrics-bg.jpeg'; 

const Metrics: React.FC = () => {
  const stats = [
    { title: 'Clients', value: '120+' },
    { title: 'Patients', value: '5,000+' },
    { title: 'Doctors', value: '80+' },
  ];

  return (
    <section
      className="w-full py-16 px-4 text-white bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: `url(${metricsBg})` }} 
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="backdrop-blur-sm bg-white/10 rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-4xl font-bold">{stat.value}</h3>
            <p className="mt-2 text-lg">{stat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Metrics;
