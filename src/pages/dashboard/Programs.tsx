import { Pencil, PlusCircle, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type Program = {
  name: string;
  email: string;
  program: string;
  status: string;
  startYear: string;
  avatar: string;
};

const Programs = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
        setIsModalOpen(false);
        setSelectedProgram(null);
      }
    };
    if (isModalOpen || selectedProgram) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedProgram]);

  const [editData, setEditData] = useState<Program>({
    name: '',
    email: '',
    program: '',
    status: 'Active',
    startYear: '',
    avatar: 'https://via.placeholder.com/40?text=🏥',
  });

  const programs: Program[] = [
    {
      name: 'Medicare Advantage',
      email: 'contact@medicare.com',
      program: 'Senior Care',
      status: 'Active',
      startYear: '2010',
      avatar: 'https://via.placeholder.com/100',
    },
    {
      name: 'HealthyLife Plan',
      email: 'info@healthylife.com',
      program: 'Wellness',
      status: 'Inactive',
      startYear: '2017',
      avatar: 'https://via.placeholder.com/100',
    },
  ];

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
      program: '',
      status: 'Active',
      startYear: '',
      avatar: 'https://via.placeholder.com/40?text=🏥',
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

      {/* Table View (Large screens only) */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Program</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Type</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Status</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Start Year</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{p.program}</td>
                  <td className={`py-4 px-4 ${p.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{p.status}</td>
                  <td className="py-4 px-4">{p.startYear}</td>
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
        </div>
      )}

      {/* Mobile List View (small screen) */}
      {isSmallScreen && (
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Programs List</h2>
          <ul className="space-y-2">
            {filteredPrograms.map((p, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedProgram(p)}
                  className="w-full text-left text-blue-600 hover:underline"
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
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
                <img
                  src={selectedProgram.avatar}
                  alt={selectedProgram.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <div className="font-medium text-gray-800 text-lg">{selectedProgram.name}</div>
                <div className="text-sm text-gray-500">{selectedProgram.email}</div>
                <p><strong>Type:</strong> {selectedProgram.program}</p>
                <p>
                  <strong>Status:</strong> <span className={selectedProgram.status === 'Active' ? 'text-green-600' : 'text-red-500'}>{selectedProgram.status}</span>
                </p>
                <p><strong>Start Year:</strong> {selectedProgram.startYear}</p>
              </div>
            ) : (
              <form className="space-y-4">
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Program Name" className="w-full border rounded-md px-3 py-2" />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
                <input type="text" name="program" value={editData.program} onChange={handleChange} placeholder="Type" className="w-full border rounded-md px-3 py-2" />
                <select name="status" value={editData.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="text" name="startYear" value={editData.startYear} onChange={handleChange} placeholder="Start Year" className="w-full border rounded-md px-3 py-2" />
                <div className="flex justify-end pt-4">
                  <button type="button" onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    {isEditMode ? 'Save Changes' : 'Add Program'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
