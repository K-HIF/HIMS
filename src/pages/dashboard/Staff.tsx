import { Pencil, PlusCircle, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';

 //const BASE_URL = 'https://healthmgmt-7ztg.onrender.com';
  const BASE_URL = 'http://127.0.0.1:8000/';
  
type ContextType = {
  searchTerm: string;
};

type StaffMember = {
  id: number;
  name: string;
  email: string;
  staff_id: string;
  department: { id: number; name: string } | null;
  status: boolean;
  employed_date: string;
};

const Staff = () => {
  const { searchTerm } = useOutletContext<ContextType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
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
        setSelectedStaff(null);
      }
    };
    if (isModalOpen || selectedStaff) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, selectedStaff]);

  const [editData, setEditData] = useState<StaffMember | any>({
    name: '',
    email: '',
    staff_id: '',
    department: null,
    status: true,
    employed_date: '',
  });

  // Fetch all staff types from backend and merge
  const [staff, setStaff] = useState<StaffMember[]>([]);
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${BASE_URL}/api/users/doctors/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/nurses/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/labtechnicians/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/pharmacists/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/receptionists/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/financestaff/`).then(res => res.data),
      axios.get(`${BASE_URL}/api/users/departments/`).then(res => setDepartments(res.data)),
    ])
      .then(([doctors, nurses, labtechs, pharmacists, receptionists, financestaff]) => {
        setStaff([...doctors, ...nurses, ...labtechs, ...pharmacists, ...receptionists, ...financestaff]);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredStaff = staff.filter((member) =>
    `${member.name} ${member.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (member: StaffMember) => {
    setIsEditMode(true);
    setEditData(member);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditData({
      name: '',
      email: '',
      staff_id: '',
      department: null,
      status: true,
      employed_date: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData.department) {
      alert('Please select a department.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Determine endpoint based on department or name pattern
      let endpoint = '';
      if (editData.department && editData.department.name) {
        const deptName = editData.department.name.toLowerCase();
        if (deptName.includes('nurse')) endpoint = 'nurses';
        else if (deptName.includes('lab')) endpoint = 'labtechnicians';
        else if (deptName.includes('pharm')) endpoint = 'pharmacists';
        else if (deptName.includes('recept')) endpoint = 'receptionists';
        else if (deptName.includes('finance')) endpoint = 'financestaff';
        else endpoint = 'doctors';
      } else {
        endpoint = 'doctors';
      }
      await axios.post(`${BASE_URL}/api/users/${endpoint}/`, {
        name: editData.name,
        email: editData.email,
        department_id: editData.department ? editData.department.id : null,
        status: editData.status,
        employed_date: editData.employed_date,
        staff_id: editData.staff_id || Math.random().toString(36).substring(2, 10),
      });
      setIsModalOpen(false);
      setEditData({ name: '', email: '', staff_id: '', department: null, status: true, employed_date: '' });
      // Refresh staff list
      Promise.all([
        axios.get(`${BASE_URL}/api/users/doctors/`).then(res => res.data),
        axios.get(`${BASE_URL}/api/users/nurses/`).then(res => res.data),
        axios.get(`${BASE_URL}/api/users/labtechnicians/`).then(res => res.data),
        axios.get(`${BASE_URL}/api/users/pharmacists/`).then(res => res.data),
        axios.get(`${BASE_URL}/api/users/receptionists/`).then(res => res.data),
        axios.get(`${BASE_URL}/api/users/financestaff/`).then(res => res.data),
      ])
        .then(([doctors, nurses, labtechs, pharmacists, receptionists, financestaff]) => {
          setStaff([...doctors, ...nurses, ...labtechs, ...pharmacists, ...receptionists, ...financestaff]);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 flex flex-col items-center w-full">
      {/* Header */}
      <div className="w-full max-w-[92rem] bg-gradient-to-r from-black to-gray-700 shadow-lg px-4 sm:px-10 py-6 rounded-md mt-4 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Staff members</h1>
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
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Date Employed</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium">Staff ID</th>
                  <th className="pt-6 pb-3 px-4 text-gray-700 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </td>
                    <td className="py-4 px-4">{member.department ? member.department.name : ''}</td>
                    <td className={`py-4 px-4 ${member.status ? 'text-green-600' : 'text-red-500'}`}>{member.status ? 'Active' : 'Inactive'}</td>
                    <td className="py-4 px-4">{member.employed_date}</td>
                    <td className="py-4 px-4">{member.staff_id}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleEditClick(member)}
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
        <div className="-mt-10 z-10 w-[108%] max-w-[108%] bg-white shadow-md rounded-md px-4 py-12 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-3">Members List</h2>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <span className="loader border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full w-8 h-8 animate-spin"></span>
              <span className="ml-3 text-gray-600">Loading staff...</span>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredStaff.map((member) => (
                <li key={member.id}>
                  <button
                    onClick={() => setSelectedStaff(member)}
                    className="w-full text-left text-blue-600 hover:underline"
                  >
                    {member.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Modal */}
      {(isModalOpen || selectedStaff) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div ref={modalRef} className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Staff Info' : selectedStaff ? 'Staff Details' : 'Add Staff'}
            </h2>
            {selectedStaff ? (
              <div className="space-y-2 text-center">
                <div className="font-medium text-gray-800 text-lg">{selectedStaff.name}</div>
                <div className="text-sm text-gray-500">{selectedStaff.email}</div>
                <p><strong>Department:</strong> {selectedStaff.department ? selectedStaff.department.name : ''}</p>
                <p>
                  <strong>Status:</strong> <span className={selectedStaff.status ? 'text-green-600' : 'text-red-500'}>{selectedStaff.status ? 'Active' : 'Inactive'}</span>
                </p>
                <p><strong>Date Employed:</strong> {selectedStaff.employed_date}</p>
                <p><strong>Staff ID:</strong> {selectedStaff.staff_id}</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input type="text" name="name" value={editData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded-md px-3 py-2" required />
                <input type="email" name="email" value={editData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded-md px-3 py-2" required />
                <select name="department" value={editData.department ? editData.department.id : ''} onChange={e => setEditData({ ...editData, department: departments.find(d => d.id === Number(e.target.value)) })} className="w-full border rounded-md px-3 py-2" required>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                <select name="status" value={editData.status ? 'Active' : 'Inactive'} onChange={handleChange} className="w-full border rounded-md px-3 py-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <input type="date" name="employed_date" value={editData.employed_date} onChange={handleChange} placeholder="Employed Date" className="w-full border rounded-md px-3 py-2" required />
                <input type="text" name="staff_id" value={editData.staff_id || ''} onChange={handleChange} placeholder="Staff ID" className="w-full border rounded-md px-3 py-2" required />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center gap-2" disabled={loading}>
                    {loading && <span className="loader border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full w-4 h-4 mr-2 animate-spin"></span>}
                    {isEditMode ? 'Save Changes' : 'Add Staff'}
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

export default Staff;
