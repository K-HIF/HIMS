import { Pencil, PlusCircle, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

type ContextType = {
  searchTerm: string;
};

type Program = {
  id?: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  startYear: string;
  endYear?: string;
};

//const BASE_URL = 'https://healthmgmt-7ztg.onrender.com';
const BASE_URL = 'http://localhost:8000';

const ACCESS_TOKEN = localStorage.getItem('access');


const Programs = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState<Program>({
    name: '',
    email: '',
    status: 'Active',
    startYear: '',
    endYear: '',
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/users/programs/`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
        setPrograms(res.data);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      } finally {
        setLoading(false);
      }
    };
     if (ACCESS_TOKEN) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
        fetchPrograms();
      }
   
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
    if (isModalOpen || selectedProgram) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen, selectedProgram]);

  const filteredPrograms = programs.filter((p) =>
    `${p.name} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (program: Program) => {
    setIsEditMode(true);
    setEditData(program);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      name: '',
      email: '',
      status: 'Active',
      startYear: '',
      endYear: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && editData.id) {
        await axios.put(`${BASE_URL}/api/users/programs/${editData.id}/`, editData, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
      } else {
        await axios.post(`${BASE_URL}/api/users/programs/`, editData, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });
      }
      const res = await axios.get(`${BASE_URL}/api/users/programs/`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      setPrograms(res.data);
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save program:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Programs</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Program
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading programs...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Program</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Email</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Start Year</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">End Year</th>
                  <th className="pt-6 pb-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4 font-medium text-gray-800">{p.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{p.email}</td>
                    <td className={`py-4 px-4 ${p.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                      {p.status}
                    </td>
                    <td className="py-4 px-4">{p.startYear}</td>
                    <td className="py-4 px-4">{p.endYear || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEditClick(p)}
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
          {filteredPrograms.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-500">{p.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(p)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-medium text-gray-800">Status:</span>
                  <span className={p.status === 'Active' ? 'text-green-600' : 'text-red-500'}>
                    {p.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-800">Start Year:</span> {p.startYear}
                </p>
                <p>
                  <span className="font-medium text-gray-800">End Year:</span> {p.endYear || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {(isModalOpen || selectedProgram) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Program Info' : selectedProgram ? 'Program Details' : 'Add Program'}
            </h2>
            {selectedProgram ? (
              <div className="space-y-2 text-center">
                <div className="font-medium text-gray-800 text-lg">{selectedProgram.name}</div>
                <div className="text-sm text-gray-500">{selectedProgram.email}</div>
                <p><strong>Status:</strong> <span className={selectedProgram.status === 'Active' ? 'text-green-600' : 'text-red-500'}>{selectedProgram.status}</span></p>
                <p><strong>Start Year:</strong> {selectedProgram.startYear}</p>
                <p><strong>End Year:</strong> {selectedProgram.endYear || 'N/A'}</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Program Name" className="w-full border rounded-md px-3 py-2" required />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" required />
                <select name="status" value={editData.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="date" name="startYear" value={editData.startYear} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                <input type="date" name="endYear" value={editData.endYear} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2" disabled={loading}>
                    {loading && <span className="loader border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full w-4 h-4 mr-2 animate-spin"></span>}
                    {isEditMode ? 'Update Program' : 'Add Program'}
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

export default Programs;