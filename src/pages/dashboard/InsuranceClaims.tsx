import { Upload, PlusCircle, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

const InsuranceClaims = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [newClaim, setNewClaim] = useState<InsuranceClaim>({
    insurance: '',
    email: '',
    id: '',
    name: '',
    bill: '',
    icon: 'https://via.placeholder.com/40?text=➕',
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handleResize = () => setIsSmallScreen(mq.matches);
    handleResize();
    mq.addEventListener('change', handleResize);
    return () => mq.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedClaim(null);
        setIsModalOpen(false);
        setIsAddMode(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

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
    `${claim.insurance} ${claim.name} ${claim.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (claim: InsuranceClaim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedClaim(null);
    setIsModalOpen(false);
    setIsAddMode(false);
  };

  const handleNewClaimClick = () => {
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const handleNewClaimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClaim({ ...newClaim, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Insurance Claims</h1>
          <button onClick={handleNewClaimClick} className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium">
            <PlusCircle size={20} />
            New Claim
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
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
                        <img src={claim.icon} alt="Insurance Icon" className="w-10 h-10 rounded-full object-cover" />
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
      )}

      {/* Small screen view */}
      {isSmallScreen && (
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-12 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Claims List</h2>
          <ul className="space-y-2">
            {filteredClaims.map((c, idx) => (
              <li key={idx}>
                <button onClick={() => handleOpenModal(c)} className="w-full text-left text-blue-600 hover:underline">
                  {c.name} - {c.insurance}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>

            {isAddMode ? (
              <div>
                <h3 className="text-xl font-semibold mb-4">New Insurance Claim</h3>
                <form className="space-y-4">
                  <input type="text" name="insurance" value={newClaim.insurance} onChange={handleNewClaimChange} placeholder="Insurance Company" className="w-full border rounded-md px-3 py-2" />
                  <input type="text" name="id" value={newClaim.id} onChange={handleNewClaimChange} placeholder="Claim ID" className="w-full border rounded-md px-3 py-2" />
                  <input type="text" name="name" value={newClaim.name} onChange={handleNewClaimChange} placeholder="Claimant Name" className="w-full border rounded-md px-3 py-2" />
                  <input type="text" name="bill" value={newClaim.bill} onChange={handleNewClaimChange} placeholder="Bill Amount" className="w-full border rounded-md px-3 py-2" />
                  <input type="email" name="email" value={newClaim.email} onChange={handleNewClaimChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
                  <button type="button" onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm float-right">Submit</button>
                </form>
              </div>
            ) : selectedClaim && (
              <div className="text-center space-y-2">
                <img src={selectedClaim.icon} alt={selectedClaim.insurance} className="w-24 h-24 rounded-full object-cover mx-auto" />
                <h3 className="text-xl font-semibold">{selectedClaim.name}</h3>
                <p className="text-sm text-gray-500">{selectedClaim.email}</p>
                <p><strong>Insurance:</strong> {selectedClaim.insurance}</p>
                <p><strong>ID:</strong> {selectedClaim.id}</p>
                <p><strong>Bill:</strong> {selectedClaim.bill}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceClaims;