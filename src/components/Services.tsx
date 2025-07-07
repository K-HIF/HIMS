// src/components/Services.tsx
import React from 'react';
import { Hospital, BarChart3, ShieldCheck } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Patient Management',
      description:
        'Manage patient records, appointments, and history in one secure and intuitive platform.',
      icon: <Hospital className="w-10 h-10 text-[#1D4ED8]" />,
    },
    {
      title: 'Analytics & Reports',
      description:
        'Generate insightful reports and dashboards to enhance decision-making.',
      icon: <BarChart3 className="w-10 h-10 text-[#1D4ED8]" />,
    },
    {
      title: 'Secure Data Storage',
      description:
        'Cloud-based solutions to safely store and retrieve sensitive patient data.',
      icon: <ShieldCheck className="w-10 h-10 text-[#1D4ED8]" />,
    },
  ];

  return (
    <section className="py-24 bg-white text-gray-900" id="services">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#1D4ED8] mb-4">
          Our Services
        </h2>
        <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Discover how MedicApp helps improve healthcare delivery through
          powerful digital tools.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 bg-[#F9FAFB] border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition duration-300 text-left"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
