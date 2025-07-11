import { Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
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

const Doctors = () => {
  const { searchTerm } = useOutletContext<ContextType>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editData, setEditData] = useState<Doctor>({
    name: '',
    email: '',
    dept: '',
    status: 'Active',
    employed: '',
    avatar: '',
  });

  const doctors: Doctor[] = [
    {
      name: 'Dr. John Doe',
      email: 'john.doe@email.com',
      dept: 'Cardiology',
      status: 'Active',
      employed: '2015',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      name: 'Dr. Jane Smith',
      email: 'jane.smith@email.com',
      dept: 'Neurology',
      status: 'Inactive',
      employed: '2018',
      avatar: 'https://via.placeholder.com/40',
    },
  ];

  const filteredDoctors = doctors.filter((doc) =>
    `${doc.name} ${doc.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (doctor: Doctor) => {
    setIsEditMode(true);
    setEditData({ ...doctor });
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
      avatar: '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 relative flex flex-col items-center">
      {/* Title Block */}
      <div className="w-[103%] bg-gradient-to-r from-black to-gray-700 shadow-lg px-10 py-6 rounded-md z-20 relative mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">The Doctors</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="mt-[-40px] w-[108%] bg-white shadow-md rounded-md px-6 py-8 z-10 relative">
        <table className="w-full text-left border-collapse">
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
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{doc.name}</div>
                      <div className="text-sm text-gray-500">{doc.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">{doc.dept}</td>
                <td className="py-4 px-4 text-green-600">{doc.status}</td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? 'Edit Doctor Info' : 'Add Doctor'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="dept"
                  value={editData.dept}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employed Year
                </label>
                <input
                  type="text"
                  name="employed"
                  value={editData.employed}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md p-2 text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  {isEditMode ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
