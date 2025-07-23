import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type Provider = {
  id?: number;
  name: string;
  email: string;
  plan: string[];
  status: string;
  since: string;
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL||'http://127.0.0.1:8000';

const InsuranceProviders = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [providers, setProviders] = useState<Provider[]>([]);

  const [editData, setEditData] = useState<Provider>({
    name: '',
    email: '',
    plan: [],
    status: 'Active',
    since: '',
  });

  const ACCESS_TOKEN = localStorage.getItem('access');
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/users/insurance-providers/`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
        const data = await response.json();

        if (Array.isArray(data)) {
          setProviders(data);
        } else {
          setProviders([]); // Set to an empty array if not valid
        }
      } catch (error) {
        setProviders([]); // Handle error case
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

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
        handleCloseModal();
      }
    };
    if (isModalOpen || selectedProvider) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedProvider]);

  const filteredProviders = providers.filter((p) =>
    `${p.name} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (provider: Provider) => {
    setIsEditMode(true);
    setEditData(provider);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      name: '',
      email: '',
      plan: [],
      status: 'Active',
      since: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'plan' && e.target instanceof HTMLSelectElement) {
      const plans = Array.from(e.target.selectedOptions, (option) => option.value);
      setEditData({ ...editData, plan: plans });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditMode
        ? `${BASE_URL}/api/users/insurance-providers/${editData.id}/`
        : `${BASE_URL}/api/users/insurance-providers/`;
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(editData),
      });

      const result = await response.json();

      if (isEditMode) {
        setProviders((prev) => prev.map((p) => (p.id === result.id ? result : p)));
      } else {
        setProviders((prev) => [...prev, result]);
      }

      handleCloseModal();
    } catch (error) {
      // Handle error case
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Insurance </h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Provider
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading providers...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Provider</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Plan</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Since</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="font-medium text-gray-800">{provider.name}</div>
                          <div className="text-sm text-gray-500">{provider.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{provider.plan.join(', ')}</td>
                    <td className={`py-4 px-4 ${provider.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                      {provider.status}
                    </td>
                    <td className="py-4 px-4">{provider.since}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEditClick(provider)}
                        className="text-blue-500 hover:text-blue-700 transform transition-transform duration-200 hover:scale-110"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Mobile List View */}
      {isSmallScreen && (
        <div className="w-full px-2 mt-4 space-y-4 max-w-md mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading providers...</span>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-start gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">{provider.name}</h2>
                      <p className="text-sm text-gray-500">{provider.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(provider)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-800">Plan:</span> {provider.plan.join(', ')}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Status:</span>{' '}
                    <span className={provider.status === 'Active' ? 'text-green-600' : 'text-red-500'}>
                      {provider.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Since:</span> {provider.since}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {(isModalOpen || selectedProvider) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Provider Info' : selectedProvider ? 'Provider Details' : 'Add Provider'}
            </h2>
            {selectedProvider ? (
              <div className="space-y-2 text-center">
                <div className="font-medium text-gray-800 text-lg">{selectedProvider.name}</div>
                <div className="text-sm text-gray-500">{selectedProvider.email}</div>
                <p><strong>Plan:</strong> {selectedProvider.plan.join(', ')}</p>
                <p>
                  <strong>Status:</strong> <span className={selectedProvider.status === 'Active' ? 'text-green-600' : 'text-red-500'}>{selectedProvider.status}</span>
                </p>
                <p><strong>Since:</strong> {selectedProvider.since}</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" required />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" required />
                <select
                  name="plan"
                  multiple
                  value={editData.plan}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
                <select name="status" value={editData.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="text" name="since" value={editData.since} onChange={handleChange} placeholder="Since" className="w-full border rounded-md px-3 py-2" required />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2" disabled={loading}>
                    {loading && <span className="loader border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full w-4 h-4 mr-2 animate-spin"></span>}
                    {isEditMode ? 'Save Changes' : 'Add Provider'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <style>{`
        .loader {
          border-top-color: #2563eb;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InsuranceProviders;