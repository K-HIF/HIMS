import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/users/';

type ContextType = {
  searchTerm: string;
};

type StaffMember = {
  user_full_name: string;
  user_email: string;
  staff_id: string;
  department_id: number | null;
  department: string; // Added department name
  status: boolean;
  verification: boolean;
  date_employed: string;
};

const Staff = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [editData, setEditData] = useState<StaffMember>({
    user_full_name: '',
    user_email: '',
    staff_id: '',
    department_id: null,
    department: '', // Reset to empty string
    status: true,
    verification: false,
    date_employed: '',
  });
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set authorization header
  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const handleResize = () => {
      setIsSmallScreen(mq.matches);
    };
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
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const [doctors, nurses, pharmacies, labs, receptions, checkouts] = await Promise.all([
        axios.get(`${BASE_URL}doctor/`),
        axios.get(`${BASE_URL}nurse/`),
        axios.get(`${BASE_URL}pharmacy/`),
        axios.get(`${BASE_URL}lab/`),
        axios.get(`${BASE_URL}reception/`),
        axios.get(`${BASE_URL}finance/`),
      ]);

      const allStaff = [
        ...doctors.data.map((doc) => ({
          ...doc,
          department: 'Doctor',
        })),
        ...nurses.data.map((nurse) => ({
          ...nurse,
          department: 'Nurse',
        })),
        ...pharmacies.data.map((pharmacy) => ({
          ...pharmacy,
          department: 'Pharmacy',
        })),
        ...labs.data.map((lab) => ({
          ...lab,
          department: 'Lab',
        })),
        ...receptions.data.map((reception) => ({
          ...reception,
          department: 'Reception',
        })),
        ...checkouts.data.map((checkout) => ({
          ...checkout,
          department: 'Checkout',
        })),
      ];

      setStaff(allStaff);
    } catch (err) {
      // Handle error silently, or consider adding user notification
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}departments/`);
      setDepartments(response.data);
    } catch (err) {
      // Handle error silently, or consider adding user notification
    }
  };

  const filteredStaff = staff.filter((member) =>
    `${member.user_full_name} ${member.user_email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (member: StaffMember) => {
    setIsEditMode(true);
    setEditData(member);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      user_full_name: '',
      user_email: '',
      staff_id: '',
      department_id: null,
      department: '', // Reset to empty string
      status: true,
      verification: false,
      date_employed: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData({
      user_full_name: '',
      user_email: '',
      staff_id: '',
      department_id: null,
      department: '', // Reset to empty string
      status: true,
      verification: false,
      date_employed: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editData.department_id === null) {
      alert('Please select a department.');
      return;
    }
    setLoading(true);
    try {
      const selectedDepartment = departments.find(dept => dept.id === editData.department_id);
      const departmentName = selectedDepartment ? selectedDepartment.name : '';

      if (isEditMode) {
        await axios.put(`${BASE_URL}doctors/${editData.staff_id}/`, {
          full_name: editData.user_full_name,
          email: editData.user_email,
          department_id: editData.department_id,
          department: departmentName,
          status: editData.status,
          verification: editData.verification,
          date_employed: editData.date_employed,
        });
      } else {
        await axios.post(`${BASE_URL}admin/register/`, {
          full_name: editData.user_full_name,
          email: editData.user_email,
          department_id: editData.department_id,
          department: departmentName,
          status: editData.status,
          verification: editData.verification,
          staff_id: editData.staff_id || Math.random().toString(36).substring(2, 10),
          date_employed: editData.date_employed,
        });
      }
      setIsModalOpen(false);
      fetchStaff(); // Refresh staff list
    } catch (err) {
      // Handle error silently, or consider adding user notification
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Staff Members</h1>
          <button onClick={handleAddClick} className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium">
            <PlusCircle size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Table View */}
      {!isSmallScreen && (
        <div className="relative z-10 -mt-14 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-6 py-8 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-4 text-gray-600">Loading staff...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Member</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Dept</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Verification</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Date Employed</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Staff ID</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.staff_id} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{member.user_full_name}</div>
                      <div className="text-sm text-gray-500">{member.user_email}</div>
                    </td>
                    <td className="py-4 px-4">{member.department || 'N/A'}</td>
                    <td className={`py-4 px-4 ${member.status ? 'text-green-600' : 'text-red-500'}`}>{member.status ? 'Active' : 'Inactive'}</td>
                    <td className={`py-4 px-4 ${member.verification ? 'text-green-600' : 'text-red-500'}`}>{member.verification ? 'Verified' : 'Unverified'}</td>
                    <td className="py-4 px-4">{member.date_employed.split("T")[0]}</td>
                    <td className="py-4 px-4">{member.staff_id}</td>
                    <td className="py-4 px-4">
                      <button onClick={() => handleEditClick(member)} className="text-blue-500 hover:text-blue-700 transform transition-transform duration-200 hover:scale-110">
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
              <span className="ml-4 text-gray-600">Loading staff...</span>
            </div>
          ) : (
            filteredStaff.map((member) => (
              <div key={member.staff_id} className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{member.user_full_name}</h2>
                    <p className="text-sm text-gray-500">{member.user_email}</p>
                  </div>
                  <button onClick={() => handleEditClick(member)} className="text-blue-600 hover:text-blue-800">
                    <Pencil size={18} />
                  </button>
                </div>
                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-800">Department:</span> {member.department || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Status:</span>
                    <span className={member.status ? 'text-green-600' : 'text-red-500'}>
                      {member.status ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Verification:</span>
                    <span className={member.verification ? 'text-green-600' : 'text-red-500'}>
                      {member.verification ? 'Verified' : 'Unverified'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Employed:</span> {member.date_employed.split("T")[0]}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Staff ID:</span> {member.staff_id}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? 'Edit Staff Info' : 'Add Staff'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="text" name="user_full_name" value={editData.user_full_name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" required />
              <input type="email" name="user_email" value={editData.user_email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" required />

              <select
                name="department_id"
                value={editData.department_id || ''}
                onChange={e => {
                  const selectedId = Number(e.target.value);
                  setEditData({ ...editData, department_id: selectedId });
                }}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option key="placeholder" value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>

              <select name="status" value={editData.status ? 'Active' : 'Inactive'} onChange={e => {
                setEditData({ ...editData, status: e.target.value === 'Active' });
              }} className="w-full border rounded-md px-3 py-2">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select name="verification" value={editData.verification ? 'Verified' : 'Unverified'} onChange={e => {
                setEditData({ ...editData, verification: e.target.value === 'Verified' });
              }} className="w-full border rounded-md px-3 py-2">
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>

              <input type="date" name="date_employed" value={editData.date_employed?.slice(0, 10) || ''} onChange={handleChange} className="w-full border rounded-md px-3 py-2" required />
              <input type="text" name="staff_id" value={editData.staff_id || ''} onChange={handleChange} placeholder="Staff ID" className="w-full border rounded-md px-3 py-2" required />
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2" disabled={loading}>
                  {loading && <span className="loader border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full w-4 h-4 mr-2 animate-spin"></span>}
                  {isEditMode ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
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

export default Staff;