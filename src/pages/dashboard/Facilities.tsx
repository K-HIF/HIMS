import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  searchTerm: string;
};

type Doctor = {
  name: string;
  email: string;
  dept: string;
  status: string;
  employed: string;
  avatar: string;
};

const Facilities = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
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
        setSelectedDoctor(null);
      }
    };
    if (isModalOpen || selectedDoctor) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedDoctor]);

  const [editData, setEditData] = useState<Doctor>({
    name: '',
    email: '',
    dept: '',
    status: 'Active',
    employed: '',
    avatar: 'https://via.placeholder.com/100',
  });

  const doctors: Doctor[] = [
    {
      name: 'Dr. John Doe',
      email: 'john.doe@email.com',
      dept: 'Cardiology',
      status: 'Active',
      employed: '2015',
      avatar: 'https://via.placeholder.com/100',
    },
    {
      name: 'Dr. Jane Smith',
      email: 'jane.smith@email.com',
      dept: 'Neurology',
      status: 'Inactive',
      employed: '2018',
      avatar: 'https://via.placeholder.com/100',
    },
  ];

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.name} ${doc.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (doctor: Doctor) => {
    setIsEditMode(true);
    setEditData(doctor);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      name: '',
      email: '',
      dept: '',
      status: 'Active',
      employed: '',
      avatar: 'https://via.placeholder.com/100',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Facilities</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Doctor</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Dept</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Status</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Employed</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-gray-800">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{doc.dept}</td>
                  <td className={`py-4 px-4 ${doc.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{doc.status}</td>
                  <td className="py-4 px-4">{doc.employed}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEditClick(doc)}
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

      {/* Mobile List View */}
      {isSmallScreen && (
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-12 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Doctors List</h2>
          <ul className="space-y-2">
            {filteredDoctors.map((doc, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="w-full text-left text-blue-600 hover:underline"
                >
                  {doc.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {(isModalOpen || selectedDoctor) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Doctor Info' : selectedDoctor ? 'Doctor Details' : 'Add Doctor'}
            </h2>
            {selectedDoctor ? (
              <div className="space-y-2 text-center">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <div className="font-medium text-gray-800 text-lg">{selectedDoctor.name}</div>
                <div className="text-sm text-gray-500">{selectedDoctor.email}</div>
                <p><strong>Department:</strong> {selectedDoctor.dept}</p>
                <p>
                  <strong>Status:</strong> <span className={selectedDoctor.status === 'Active' ? 'text-green-600' : 'text-red-500'}>{selectedDoctor.status}</span>
                </p>
                <p><strong>Employed:</strong> {selectedDoctor.employed}</p>
              </div>
            ) : (
              <form className="space-y-4">
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
                <input type="text" name="dept" value={editData.dept} onChange={handleChange} placeholder="Department" className="w-full border rounded-md px-3 py-2" />
                <select name="status" value={editData.status} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="text" name="employed" value={editData.employed} onChange={handleChange} placeholder="Employed Year" className="w-full border rounded-md px-3 py-2" />
                <div className="flex justify-end pt-4">
                  <button type="button" onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    {isEditMode ? 'Save Changes' : 'Add Doctor'}
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

export default Facilities;
