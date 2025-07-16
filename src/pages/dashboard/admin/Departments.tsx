import { Building, Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

interface Department {
  id: number;
  name: string;
  email: string;
  hod_name: string;
  staff_count: number;
  date_formed: string;
}

type Staff = {
  id: number;
  name: string;
  email: string;
  staff_type: string;
};

const BASE_URL = 'http://127.0.0.1:8000';

const Departments = () => {
  const { searchTerm }: { searchTerm: string } = useOutletContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [editData, setEditData] = useState<Department | any>({
    name: '',
    email: '',
    hod_name: '',
    date_formed: '',
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hodCandidates, setHodCandidates] = useState<Staff[]>([]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/users/departments/`);
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) =>
    `${dept.name} ${dept.email} ${dept.hod_name}`.toLowerCase().includes(searchTerm.toLowerCase())
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
    setEditData({ name: '', email: '', hod_name: '', date_formed: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/api/users/departments/${editData.id}/`, editData);
      } else {
        await axios.post(`${BASE_URL}/api/users/departments/`, editData);
      }
      handleCloseModal();
      await fetchDepartments(); // Fetch updated departments after submission
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDept(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isModalOpen && isEditMode && editData.id) {
      Promise.all([
        axios.get(`${BASE_URL}/api/users/doctors/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Doctor' }))),
        axios.get(`${BASE_URL}/api/users/nurses/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Nurse' }))),
        axios.get(`${BASE_URL}/api/users/labtechnicians/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Lab Technician' }))),
        axios.get(`${BASE_URL}/api/users/pharmacists/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Pharmacist' }))),
        axios.get(`${BASE_URL}/api/users/receptionists/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Receptionist' }))),
        axios.get(`${BASE_URL}/api/users/financestaff/?department=${editData.id}`).then(res => res.data.map((s: any) => ({ ...s, staff_type: 'Finance Staff' }))),
      ])
        .then(([doctors, nurses, labtechs, pharmacists, receptionists, financestaff]) => {
          setHodCandidates([
            ...doctors,
            ...nurses,
            ...labtechs,
            ...pharmacists,
            ...receptionists,
            ...financestaff,
          ]);
        })
        .catch(() => setHodCandidates([]));
    } else {
      setHodCandidates([]);
    }
  }, [isModalOpen, isEditMode, editData.id]);

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
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-12 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading departments...</span>
            </div>
          ) : (
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
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <Building className="text-gray-700 mt-1" size={24} />
                        <div>
                          <div className="font-medium text-gray-800">{dept.name}</div>
                          <div className="text-sm text-gray-500">{dept.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">{dept.hod_name}</td>
                    <td className="py-4 px-4">{dept.staff_count}</td>
                    <td className="py-4 px-4">{dept.date_formed}</td>
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
          )}
        </div>
      )}

      {/* Mobile List View */}
      {isSmallScreen && (
        <div className="w-full px-2 mt-4 space-y-4 max-w-md mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading departments...</span>
            </div>
          ) : (
            filteredDepartments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-start gap-3">
                    <Building className="text-gray-700" size={24} />
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">{dept.name}</h2>
                      <p className="text-sm text-gray-500">{dept.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(dept)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-800">Head:</span> {dept.hod_name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">No. of Staff:</span> {dept.staff_count}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Date Formed:</span> {dept.date_formed}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
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
                <p><strong>Head:</strong> {selectedDept.hod_name}</p>
                <p><strong>No. of Staff:</strong> {selectedDept.staff_count}</p>
                <p><strong>Date Formed:</strong> {selectedDept.date_formed}</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" required />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" required />
                <select
                  name="hod_name"
                  value={editData.hod_name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select Head of Department</option>
                  {hodCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.name}>{candidate.name} ({candidate.email})</option>
                  ))}
                </select>
                <input type="date" name="date_formed" value={editData.date_formed} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2" disabled={loading}>
                    {loading && <span className="loader border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full w-4 h-4 mr-2 animate-spin"></span>}
                    {isEditMode ? 'Save Changes' : 'Add Department'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Add loader CSS */}
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

export default Departments;