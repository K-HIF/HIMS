import { Building, Pencil, PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
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

  const [editData, setEditData] = useState<Department>({
    name: '',
    email: '',
    head: '',
    staffCount: '',
    dateFormed: '',
  });

  const [departments] = useState<Department[]>([
    {
      name: 'Cardiology',
      email: 'cardio@hospital.com',
      head: 'Dr. Adams',
      staffCount: '25',
      dateFormed: '2015-09-01',
    },
  ]);


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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Filtered list
  const filteredDepartments = departments.filter((dept) =>
    [dept.name, dept.email, dept.head].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-1 relative flex flex-col items-center">
      {/* Title Block */}
      <div className="w-[103%] bg-gradient-to-r from-black to-gray-700 shadow-lg px-10 py-6 rounded-md z-20 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">The Departments</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 text-green-400 hover:text-green-200 font-medium"
          >
            <PlusCircle size={20} />
            Add Department
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-[-40px] w-[108%] bg-white shadow-md rounded-md px-6 py-8 z-10 relative">
        <table className="w-full text-left border-collapse">
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
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b">
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
              ))
            )}
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
              {isEditMode ? 'Edit Department' : 'Add Department'}
            </h2>
            <form className="space-y-4">
              {['name', 'email', 'head', 'staffCount', 'dateFormed'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field === 'staffCount' ? 'No. of Staff' : field === 'dateFormed' ? 'Date Formed' : field}
                  </label>
                  <input
                    type={field === 'dateFormed' ? 'date' : field === 'staffCount' ? 'number' : 'text'}
                    name={field}
                    value={editData[field as keyof Department]}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md p-2 text-sm"
                  />
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  {isEditMode ? 'Save Changes' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
