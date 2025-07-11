import React from 'react';
import { Upload, PlusCircle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type InsuranceClaim = {
  insurance: string;
  email: string;
  id: string;
  name: string;
  bill: string;
  icon: string;
};

const InsuranceClaims: React.FC = () => {
  const { searchTerm } = useOutletContext<ContextType>();

  const claims: InsuranceClaim[] = [
    {
      insurance: 'CarePlus',
      email: 'claims@careplus.org',
      id: 'CLM-394',
      name: 'James Karanja',
      bill: '$1,200',
      icon: 'https://via.placeholder.com/40?text=🏥',
    },
    {
      insurance: 'HealthSecure',
      email: 'support@healthsecure.com',
      id: 'CLM-215',
      name: 'Sarah Johnson',
      bill: '$3,800',
      icon: 'https://via.placeholder.com/40?text=🛡️',
    },
  ];

  const filteredClaims = claims.filter((claim) =>
    `${claim.insurance} ${claim.name} ${claim.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 relative flex flex-col items-center">
      {/* Header */}
      <div className="w-[103%] bg-gradient-to-r from-black to-gray-700 shadow-lg px-10 py-6 rounded-md z-20 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Insurance Claims</h1>
          <button className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium">
            <PlusCircle size={20} />
            New Claim
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-[-40px] w-[108%] bg-white shadow-md rounded-md px-6 py-8 z-10 relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Insurance</th>
              <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">ID</th>
              <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Name</th>
              <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Bill</th>
              <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Upload</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={claim.icon}
                        alt="Insurance Icon"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{claim.insurance}</div>
                        <div className="text-sm text-gray-500">{claim.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{claim.id}</td>
                  <td className="py-4 px-4">{claim.name}</td>
                  <td className="py-4 px-4">{claim.bill}</td>
                  <td className="py-4 px-4">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:scale-105 transition-transform">
                      <Upload size={18} />
                      <span className="text-sm">Upload</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No claims found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsuranceClaims;
