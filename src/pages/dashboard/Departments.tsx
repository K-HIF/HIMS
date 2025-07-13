import { Building, Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type Department = {
  name: string;
  email: string;
  head: string;
  staffCount: string;
  dateFormed: string;
};

const Departments = () => {
  const { searchTerm }: { searchTerm: string } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [editData, setEditData] = useState<Department>({
    name: '',
    email: '',
    head: '',
    staffCount: '',
    dateFormed: '',
  });

  const departments: Department[] = [
    {
      name: 'Cardiology',
      email: 'cardio@hospital.com',
      head: 'Dr. Adams',
      staffCount: '25',
      dateFormed: '2015-09-01',
    },
  ];

  const filteredDepartments = departments.filter((dept) =>
    `${dept.name} ${dept.email} ${dept.head}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        setSelectedDept(null);
      }
    };
    if (isModalOpen || selectedDept) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedDept]);

  const handleEditClick = (dept: Department) => {
    setIsEditMode(true);
    setEditData(dept);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({ name: '', email: '', head: '', staffCount: '', dateFormed: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDept(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Departments</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Department
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Department</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Head</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">No. of Staff</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Date Formed</th>
                <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <Building className="text-gray-700 mt-1" size={24} />
                      <div>
                        <div className="font-medium text-gray-800">{dept.name}</div>
                        <div className="text-sm text-gray-500">{dept.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{dept.head}</td>
                  <td className="py-4 px-4">{dept.staffCount}</td>
                  <td className="py-4 px-4">{dept.dateFormed}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEditClick(dept)}
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
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Departments List</h2>
          <ul className="space-y-2">
            {filteredDepartments.map((dept, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedDept(dept)}
                  className="w-full text-left text-blue-600 hover:underline"
                >
                  {dept.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shared Modal */}
      {(isModalOpen || selectedDept) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Department' : selectedDept ? 'Department Details' : 'Add Department'}
            </h2>
            {selectedDept ? (
              <div className="space-y-2 text-center">
                <Building className="text-gray-700 mb-2 mx-auto" size={40} />
                <div className="font-medium text-gray-800 text-lg">{selectedDept.name}</div>
                <div className="text-sm text-gray-500">{selectedDept.email}</div>
                <p><strong>Head:</strong> {selectedDept.head}</p>
                <p><strong>No. of Staff:</strong> {selectedDept.staffCount}</p>
                <p><strong>Date Formed:</strong> {selectedDept.dateFormed}</p>
              </div>
            ) : (
              <form className="space-y-4">
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" />
                <input type="text" name="head" value={editData.head} onChange={handleChange} placeholder="Head of Department" className="w-full border rounded-md px-3 py-2" />
                <input type="number" name="staffCount" value={editData.staffCount} onChange={handleChange} placeholder="Staff Count" className="w-full border rounded-md px-3 py-2" />
                <input type="date" name="dateFormed" value={editData.dateFormed} onChange={handleChange} className="w-full border rounded-md px-3 py-2" />
                <div className="flex justify-end pt-4">
                  <button type="button" onClick={handleCloseModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    {isEditMode ? 'Save Changes' : 'Add Department'}
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

export default Departments;
